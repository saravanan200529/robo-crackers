export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  discountPct: number;
  quantity: number;
  categoryName?: string;
  stockNote?: string | null;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  notes?: string;
}

export interface EnquirySubmissionResponse {
  success: boolean;
  enquiryId: string;
  quoteRef: string;
  whatsappUrl: string;
  customerName: string;
  totalEstimate: number;
}
