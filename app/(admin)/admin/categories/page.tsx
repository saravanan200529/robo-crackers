import React from 'react';
import { db } from '@/lib/db';
import { STATIC_CATEGORIES } from '@/lib/catalog-data';
import { FolderTree } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.warn('DB not connected on AdminCategoriesPage:', e);
  }

  if (categories.length === 0) {
    categories = STATIC_CATEGORIES;
  }

  const totalSubcategories = categories.reduce((sum, c) => sum + (c.children?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Categories & Subcategories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sivakasi fireworks hierarchy: {categories.length} Primary Departments, {totalSubcategories} Subcategories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((parent) => (
          <div
            key={parent.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{parent.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    /{parent.slug}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                {parent.children?.length || 0} sub-types
              </span>
            </div>

            {/* Subcategories */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Subcategories:
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-60 overflow-y-auto pr-1">
                {parent.children?.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between text-xs transition"
                  >
                    <span className="font-semibold text-slate-800">{sub.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {sub._count?.products || 0} products
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
