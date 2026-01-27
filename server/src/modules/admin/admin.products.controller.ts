import { Request, Response } from 'express';
import { prisma } from '../../libs/prisma';

/**
 * Get all pending products for admin review
 * @param req - Express request with authenticated admin user
 * @param res - Express response
 */
export async function getPendingProducts(req: Request, res: Response) {
  try {
    const pendingProducts = await prisma.product.findMany({
      where: {
        status: 'pending',
      },
      include: {
        product_images: {
          orderBy: {
            position: 'asc',
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        seller: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Most recent first
      },
    });

    // Transform to match frontend PendingItem interface
    const formattedProducts = pendingProducts.map(product => ({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      images: product.product_images
        .sort((a, b) => a.position - b.position)
        .map(img => img.image_url),
      category: product.category.name,
      seller: product.seller.username,
      submittedAt: product.created_at,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({ error: 'Failed to fetch pending products' });
  }
}

/**
 * Approve a pending product
 * Changes status from 'pending' to 'active'
 * @param req - Express request with product ID in params
 * @param res - Express response
 */
export async function approveProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is pending
    if (product.status !== 'pending') {
      return res.status(400).json({ 
        error: `Product is not pending. Current status: ${product.status}` 
      });
    }

    // Update product status to active
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        // @ts-ignore - Prisma client needs regeneration after schema update
        status: 'active',
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

    res.json({
      id: updatedProduct.id,
      status: 'active',
      message: 'Product approved successfully',
    });
  } catch (error: any) {
    console.error('Error approving product:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(500).json({ 
      error: 'Failed to approve product',
      message: error.message 
    });
  }
}

/**
 * Reject a pending product
 * Changes status from 'pending' to 'rejected'
 * @param req - Express request with product ID in params
 * @param res - Express response
 */
export async function rejectProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is pending
    if (product.status !== 'pending') {
      return res.status(400).json({ 
        error: `Product is not pending. Current status: ${product.status}` 
      });
    }

    // Update product status to rejected
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        // @ts-ignore - Prisma client needs regeneration after schema update
        status: 'rejected',
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

    res.json({
      id: updatedProduct.id,
      status: 'rejected',
      message: 'Product rejected successfully',
    });
  } catch (error: any) {
    console.error('Error rejecting product:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(500).json({ 
      error: 'Failed to reject product',
      message: error.message 
    });
  }
}
