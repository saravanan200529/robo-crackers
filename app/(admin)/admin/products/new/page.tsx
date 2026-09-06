'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { MediaUploader, UploadedMediaItem } from '@/components/admin/MediaUploader';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<UploadedMediaItem[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sku: '',
    mrp: '',
    price: '',
    discountPct: '80',
    stockNote: 'Available',
    description: '',
    isBestSeller: false,
    isActive: true,
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const list: { id: string; name: string }[] = [];
          data.forEach((p: any) => {
            list.push({ id: p.id, name: `📁 ${p.name}` });
            if (p.children) {
              p.children.forEach((c: any) => {
                list.push({ id: c.id, name: `  ↳ ${c.name}` });
              });
            }
          });
          setCategories(list);
          if (list.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: list[0].id }));
          }
        }
      })
      .catch(console.error);
  }, []);

  // Auto-calculate quote price when MRP changes with 80% discount
  const handleMrpChange = (mrpVal: string) => {
    const mrpNum = parseFloat(mrpVal);
    if (!isNaN(mrpNum) && mrpNum > 0) {
      const discount = parseFloat(formData.discountPct) || 80;
      const calculatedPrice = (mrpNum * (1 - discount / 100)).toFixed(2);
      setFormData((prev) => ({ ...prev, mrp: mrpVal, price: calculatedPrice }));
    } else {
      setFormData((prev) => ({ ...prev, mrp: mrpVal }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        sku: formData.sku || undefined,
        mrp: parseFloat(formData.mrp),
        price: parseFloat(formData.price),
        discountPct: parseInt(formData.discountPct, 10),
        stockNote: formData.stockNote,
        description: formData.description,
        isBestSeller: formData.isBestSeller,
        isActive: formData.isActive,
        images: images.map((img, idx) => ({
          url: img.url,
          altText: img.altText || formData.name,
          sortOrder: img.isPrimary ? 0 : idx + 1,
        })),
        videoUrl: videoUrl || undefined,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Add New Cracker SKU
          </h1>
          <p className="text-xs text-slate-500">
            Create a new verified fireworks product in the catalog
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 text-xs sm:text-sm"
      >
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Cracker / Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Win Wheel Super"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Category / Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. SKU-WIN-WHEEL"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none font-mono"
            />
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-red-50/60 rounded-2xl border border-red-100">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Original MRP (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              required
              value={formData.mrp}
              onChange={(e) => handleMrpChange(e.target.value)}
              placeholder="1200.00"
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:border-red-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Discount %
            </label>
            <input
              type="number"
              value={formData.discountPct}
              onChange={(e) => {
                const d = e.target.value;
                setFormData((prev) => {
                  const mrpNum = parseFloat(prev.mrp);
                  const price = !isNaN(mrpNum)
                    ? (mrpNum * (1 - (parseFloat(d) || 0) / 100)).toFixed(2)
                    : prev.price;
                  return { ...prev, discountPct: d, price };
                });
              }}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-red-700 mb-1">
              Quote Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="240.00"
              className="w-full bg-white border border-red-300 rounded-xl p-2.5 focus:border-red-500 outline-none font-black text-red-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Stock Note</label>
          <input
            type="text"
            value={formData.stockNote}
            onChange={(e) => setFormData({ ...formData, stockNote: e.target.value })}
            placeholder="e.g. Festive High Demand / Limited Stock"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Description & Effects</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the sound, visual sparks, and packaging details..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none resize-none"
          />
        </div>

        {/* Multi-Image & Video Uploader */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <MediaUploader
            images={images}
            onChange={setImages}
            videoUrl={videoUrl}
            onVideoChange={setVideoUrl}
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="font-bold text-slate-700">Mark as Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="font-bold text-slate-700">Active in Storefront</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Cracker...' : 'Save Cracker to Catalog'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
