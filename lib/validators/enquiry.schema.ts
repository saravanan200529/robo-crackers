import { z } from 'zod';

export const enquiryItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(500, 'Quantity exceeds limit per item'),
  price: z.number().positive('Price must be greater than 0'),
  mrp: z.number().optional(),
});

export const enquirySubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().trim().max(300).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required').max(100),
  state: z.string().trim().min(2, 'State is required').max(100).default('Tamil Nadu'),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Pincode must be 6 digits')
    .optional()
    .or(z.literal('')),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
  items: z.array(enquiryItemSchema).min(1, 'Enquiry cart must contain at least one product'),
});

export type EnquirySubmissionInput = z.infer<typeof enquirySubmissionSchema>;
export type EnquiryItemInput = z.infer<typeof enquiryItemSchema>;
