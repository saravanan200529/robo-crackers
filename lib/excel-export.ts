import ExcelJS from 'exceljs';

export interface CustomerExportRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  enquiriesCount: number;
  totalEstimatedSpend: number;
  createdAt: string;
}

export interface EnquiryExportRow {
  id: string;
  quoteRef: string;
  customerName: string;
  phone: string;
  city: string;
  state: string;
  itemsSummary: string;
  totalEstimate: number;
  status: string;
  createdAt: string;
}

/**
 * Generates an ExcelJS workbook buffer for Customers export
 */
export async function generateCustomersWorkbook(customers: CustomerExportRow[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Robo Crackers Admin';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Customers', {
    properties: { tabColor: { argb: 'D9232D' } },
  });

  worksheet.columns = [
    { header: 'Customer ID', key: 'id', width: 25 },
    { header: 'Customer Name', key: 'name', width: 24 },
    { header: 'Phone Number', key: 'phone', width: 18 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'City', key: 'city', width: 18 },
    { header: 'State', key: 'state', width: 18 },
    { header: 'Pincode', key: 'pincode', width: 12 },
    { header: 'Delivery Address', key: 'address', width: 35 },
    { header: 'Enquiries Count', key: 'enquiriesCount', width: 16 },
    { header: 'Total Est. Value (₹)', key: 'totalEstimatedSpend', width: 22 },
    { header: 'First Joined', key: 'createdAt', width: 20 },
  ];

  // Format header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9232D' }, // Robo Crackers brand red
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 28;

  customers.forEach((c) => {
    worksheet.addRow({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email || 'N/A',
      city: c.city || 'N/A',
      state: c.state || 'N/A',
      pincode: c.pincode || 'N/A',
      address: c.address || 'N/A',
      enquiriesCount: c.enquiriesCount,
      totalEstimatedSpend: c.totalEstimatedSpend,
      createdAt: c.createdAt,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Generates an ExcelJS workbook buffer for Enquiries export
 */
export async function generateEnquiriesWorkbook(enquiries: EnquiryExportRow[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Robo Crackers Admin';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Enquiries & Quotes', {
    properties: { tabColor: { argb: 'F59E0B' } },
  });

  worksheet.columns = [
    { header: 'Quote Ref', key: 'quoteRef', width: 16 },
    { header: 'Customer Name', key: 'customerName', width: 24 },
    { header: 'Customer Phone', key: 'phone', width: 18 },
    { header: 'City', key: 'city', width: 18 },
    { header: 'State', key: 'state', width: 18 },
    { header: 'Items Ordered', key: 'itemsSummary', width: 45 },
    { header: 'Quote Total (₹)', key: 'totalEstimate', width: 20 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Date Submitted', key: 'createdAt', width: 22 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'B91C1C' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 28;

  enquiries.forEach((e) => {
    worksheet.addRow({
      quoteRef: e.quoteRef,
      customerName: e.customerName,
      phone: e.phone,
      city: e.city || 'N/A',
      state: e.state || 'N/A',
      itemsSummary: e.itemsSummary,
      totalEstimate: e.totalEstimate,
      status: e.status,
      createdAt: e.createdAt,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
