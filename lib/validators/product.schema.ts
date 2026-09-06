import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required').max(150),
  categoryId: z.string().min(1, 'Category is required'),
  sku: z.string().trim().optional(),
  price: z.number().positive('Price must be greater than 0'),
  mrp: z.number().positive('MRP must be greater than 0'),
  discountPct: z.number().int().min(0).max(100).optional(),
  description: z.string().trim().optional(),
  stockNote: z.string().trim().optional(),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        altText: z.string().optional(),
        sortOrder: z.number().int().default(0),
      })
    )
    .optional(),
  videoUrl: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
