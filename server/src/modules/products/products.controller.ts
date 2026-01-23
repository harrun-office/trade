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
