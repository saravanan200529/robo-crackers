import React from 'react';
import { db } from '@/lib/db';
import { Download, MessageCircle } from 'lucide-react';
import { EnquiryStatusSelector } from './EnquiryStatusSelector';

export const dynamic = 'force-dynamic';

interface AdminEnquiriesPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminEnquiriesPage({ searchParams }: AdminEnquiriesPageProps) {
  const { status } = await searchParams;

  const where: any = {};
  if (status && ['PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED'].includes(status)) {
    where.status = status;
  }

  let enquiries: any[] = [];
  try {
    enquiries = await db.enquiry.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: { select: { name: true, sku: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('DB not connected on AdminEnquiriesPage:', e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Enquiries & Quote Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage offline follow-up for Sivakasi festival quote requests ({enquiries.length} shown)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export/enquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 text-xs font-bold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Enquiries (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { label: 'All Enquiries', value: '' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Contacted', value: 'CONTACTED' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ].map((tab) => (
          <a
            key={tab.label}
            href={`/admin/enquiries${tab.value ? `?status=${tab.value}` : ''}`}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              (status || '') === tab.value
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No enquiries found matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Quote Ref</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Delivery Location</th>
                  <th className="py-3 px-4">Items Breakdown</th>
                  <th className="py-3 px-4">Total Quote</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Offline Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {enquiries.map((enq) => {
                  const quoteRef = `ROBO-${enq.id.slice(-6).toUpperCase()}`;
                  const itemsList = enq.items.map(
                    (i: any) => `${i.product.name} (x${i.quantity})`
                  );

                  return (
                    <tr key={enq.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 align-top">
                        {quoteRef}
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          {enq.createdAt.toISOString().split('T')[0]}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-slate-900">{enq.customer.name}</div>
                        <div className="font-mono text-slate-600">{enq.customer.phone}</div>
                        {enq.customer.email && (
                          <div className="text-[11px] text-slate-400">{enq.customer.email}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top max-w-xs">
                        <div className="font-bold text-slate-800">
                          {enq.customer.city || 'Tamil Nadu'}, {enq.customer.state || 'India'}
                        </div>
                        {enq.customer.address && (
                          <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {enq.customer.address}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top max-w-xs">
                        <div className="space-y-0.5">
                          {itemsList.slice(0, 3).map((itemStr: string, idx: number) => (
                            <div key={idx} className="truncate text-slate-700">
                              • {itemStr}
                            </div>
                          ))}
                          {itemsList.length > 3 && (
                            <div className="text-[10px] text-red-600 font-bold">
                              +{itemsList.length - 3} more items...
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{Number(enq.totalEstimate).toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <EnquiryStatusSelector enquiryId={enq.id} currentStatus={enq.status} />
                      </td>

                      <td className="py-3 px-4 text-right align-top">
                        <a
                          href={`https://wa.me/91${enq.customer.phone}?text=Hello%20${encodeURIComponent(
                            enq.customer.name
                          )},%20we%20have%20reviewed%20your%20Robo%20Crackers%20Quote%20${quoteRef}%20(Total%20₹${Number(
                            enq.totalEstimate
                          ).toFixed(2)}).%20Please%20confirm%20if%20we%20can%20schedule%20offline%20dispatch.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
