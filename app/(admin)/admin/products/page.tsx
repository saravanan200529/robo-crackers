import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { STATIC_PRODUCTS, STATIC_CATEGORIES } from '@/lib/catalog-data';
import { Plus, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { q, category } = await searchParams;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (category) {
    where.categoryId = category;
  }

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [prods, cats] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.category.findMany({
        where: { parentId: null },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);
    products = prods;
    categories = cats;
  } catch (e) {
    console.warn('DB not connected on AdminProductsPage:', e);
  }

  if (products.length === 0) {
    products = STATIC_PRODUCTS;
    categories = STATIC_CATEGORIES;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Fireworks Products Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Sivakasi fireworks SKUs, MRP, 80% discount rates, and stock notes ({products.length} listed)
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product SKU</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <form method="GET" action="/admin/products" className="relative flex-1 w-full">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search by SKU or cracker name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:border-red-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <form method="GET" action="/admin/products" className="w-full sm:w-auto">
          <select
            name="category"
            defaultValue={category || ''}
            className="w-full sm:w-56 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:border-red-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">MRP</th>
                <th className="py-3 px-4">Quote Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Stock Note</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {prod.sku || 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {prod.category?.name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 line-through text-slate-400">
                    ₹{Number(prod.mrp).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-black text-red-600">
                    ₹{Number(prod.price).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {prod.discountPct ?? 80}% OFF
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-amber-700">
                    {prod.stockNote || 'Standard Stock'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
