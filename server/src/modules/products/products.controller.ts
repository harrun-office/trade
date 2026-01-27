import { Request, Response } from 'express';
import { prisma } from '../../libs/prisma';

/**
 * Get all products with related data
 * @param req - Express request
 * @param res - Express response
 */
export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active', // Only return active products
      },
      include: {
        product_images: {
          orderBy: {
            position: 'asc',
          },
        },
        category: true,
        charity: true,
        seller: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Most recent first
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

/**
 * Get a single product by ID with related data
 * @param req - Express request with product ID in params
 * @param res - Express response
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate that id is a string (UUID format)
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
        status: 'active', // Only return active products
      },
      include: {
        product_images: {
          orderBy: {
            position: 'asc',
          },
        },
        category: true,
        charity: true,
        seller: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

/**
 * Create a new product submission
 * @param req - Express request with authenticated user and product data
 * @param res - Express response
 */
export async function createProduct(req: Request, res: Response) {
  try {
    // Extract user from authenticated request (set by authMiddleware)
    const user = req.user as { userId: string; email: string; username: string; role: string } | undefined;
    
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Extract and validate request body
    const {
      title,
      description,
      price,
      category: categoryName,
      condition: conditionValue,
      charity: charityName,
      donationPercent,
      images
    } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (price === undefined || price === null || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Valid price is required (must be a positive number)' });
    }

    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim().length === 0) {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (!conditionValue || typeof conditionValue !== 'string') {
      return res.status(400).json({ error: 'Condition is required' });
    }

    if (!charityName || typeof charityName !== 'string' || charityName.trim().length === 0) {
      return res.status(400).json({ error: 'Charity is required' });
    }

    if (donationPercent === undefined || donationPercent === null || typeof donationPercent !== 'number') {
      return res.status(400).json({ error: 'Donation percent is required' });
    }

    if (donationPercent < 1 || donationPercent > 50) {
      return res.status(400).json({ error: 'Donation percent must be between 1 and 50' });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    if (images.length > 15) {
      return res.status(400).json({ error: 'Maximum 15 images allowed' });
    }

    // Validate all images are strings (URLs)
    for (let i = 0; i < images.length; i++) {
      if (typeof images[i] !== 'string' || images[i].trim().length === 0) {
        return res.status(400).json({ error: `Image at index ${i} must be a valid URL string` });
      }
    }

    // Map frontend condition value to Prisma enum value
    // Frontend sends: 'New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'
    // Prisma enum: 'New', 'Like_New', 'Excellent', 'Good', 'Fair', 'Poor'
    const conditionMap: Record<string, 'New' | 'Like_New' | 'Excellent' | 'Good' | 'Fair' | 'Poor'> = {
      'New': 'New',
      'Like New': 'Like_New',
      'Excellent': 'Excellent',
      'Good': 'Good',
      'Fair': 'Fair',
      'Poor': 'Poor'
    };

    const prismaCondition = conditionMap[conditionValue];
    if (!prismaCondition) {
      return res.status(400).json({ 
        error: `Invalid condition. Must be one of: ${Object.keys(conditionMap).join(', ')}` 
      });
    }

    // Look up category by name
    const category = await prisma.category.findUnique({
      where: { name: categoryName.trim() }
    });

    if (!category) {
      return res.status(400).json({ error: `Category "${categoryName}" not found` });
    }

    // Look up charity by name
    const charity = await prisma.charity.findFirst({
      where: { 
        name: charityName.trim(),
        is_active: true
      }
    });

    if (!charity) {
      return res.status(400).json({ error: `Charity "${charityName}" not found or inactive` });
    }

    // Create product with related images in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          price: price,
          // @ts-ignore - Prisma client needs regeneration after schema update
          condition: prismaCondition,
          // @ts-ignore - Prisma client needs regeneration after schema update  
          status: 'pending',
          seller_id: user.userId, // Derived from authenticated user, not client input
          category_id: category.id,
          charity_id: charity.id,
          donation_percent: donationPercent,
        },
        include: {
          category: true,
          charity: true,
          seller: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      // Create product images with positions
      const imageRecords = images.map((imageUrl: string, index: number) => ({
        product_id: newProduct.id,
        image_url: imageUrl.trim(),
        position: index, // images[0] will have position 0 (primary image)
      }));

      await tx.productImage.createMany({
        data: imageRecords,
      });

      // Fetch the created product with images
      const productWithImages = await tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          product_images: {
            orderBy: {
              position: 'asc',
            },
          },
          category: true,
          charity: true,
          seller: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return productWithImages;
    });

    // Return success response
    return res.status(201).json({
      id: product!.id,
      status: 'pending',
      message: 'Product submitted for review'
    });

  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A product with this data already exists' });
    }

    return res.status(500).json({ 
      error: 'Failed to create product',
      message: error.message 
    });
  }
}
