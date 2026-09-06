export interface WhatsAppEnquiryItem {
  name: string;
  quantity: number;
  price: number;
  mrp?: number;
}

export interface WhatsAppEnquiryPayload {
  enquiryId: string;
  customerName: string;
  phone: string;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  items: WhatsAppEnquiryItem[];
  totalEstimate: number;
  notes?: string | null;
}

/**
 * Builds a compliant WhatsApp wa.me deep-link URL pre-filled with the order quote breakdown.
 */
export function buildWhatsAppEnquiryUrl(
  payload: WhatsAppEnquiryPayload,
  businessNumber: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919342764302'
): string {
  // Strip any leading +, spaces, or dashes
  const cleanNumber = businessNumber.replace(/[^\d]/g, '');

  const quoteRef = payload.enquiryId.slice(-6).toUpperCase();
  const location = [payload.city, payload.state].filter(Boolean).join(', ') || 'Tamil Nadu';

  const lines: string[] = [
    '🎇 *ROBO CRACKERS — ENQUIRY QUOTE REQUEST* 🎇',
    `*Quote Ref:* #ROBO-${quoteRef}`,
    `*Customer Name:* ${payload.customerName}`,
    `*Customer Phone:* ${payload.phone}`,
    `*Location:* ${location}`,
  ];

  if (payload.address) {
    lines.push(`*Delivery Address:* ${payload.address}`);
  }

  lines.push('');
  lines.push('📋 *Order Item Breakdown:*');

  payload.items.forEach((item, index) => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    lines.push(`${index + 1}. *${item.name}*`);
    lines.push(`   Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${itemTotal}`);
  });

  lines.push('');
  lines.push(`💰 *Total Estimated Quote:* ₹${payload.totalEstimate.toFixed(2)}`);

  if (payload.notes) {
    lines.push(`📝 *Customer Notes:* ${payload.notes}`);
  }

  lines.push('');
  lines.push('⚠️ _Note: As per 2018 Supreme Court regulations, this is an enquiry quote. Order confirmation and offline dispatch will be finalized directly._');

  const text = lines.join('\n');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
