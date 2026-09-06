import React from 'react';
import { db } from '@/lib/db';
import { Search, MessageCircle, FileSpreadsheet } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface AdminCustomersPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  const { q } = await searchParams;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
    ];
  }

  let customers: any[] = [];
  try {
    customers = await db.customer.findMany({
      where,
      include: {
        enquiries: { select: { totalEstimate: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('DB not connected on AdminCustomersPage:', e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered customer quotes and offline contact records ({customers.length} total)
          </p>
        </div>

        <a
          href="/api/admin/export/customers"
          download
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Excel Workbook (.xlsx)</span>
        </a>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <form method="GET" action="/admin/customers" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search customer by name, mobile number, or city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:border-red-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No customer records found matching this query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Mobile (WhatsApp)</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">City / State</th>
                  <th className="py-3 px-4">Total Quotes</th>
                  <th className="py-3 px-4">Est. Lifetime Value</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customers.map((c) => {
                  const totalEst = c.enquiries.reduce(
                    (sum: number, e: any) => sum + Number(e.totalEstimate),
                    0
                  );

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {c.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {c.email || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {c.city || 'N/A'}, {c.state || 'Tamil Nadu'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.enquiries.length}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        ₹{totalEst.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {c.createdAt.toISOString().split('T')[0]}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`https://wa.me/91${c.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat</span>
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
