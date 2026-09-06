import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PriceTag } from '@/components/storefront/PriceTag';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductImageGallery } from '@/components/storefront/ProductImageGallery';
import { AddToCartDetailButton } from './AddToCartDetailButton';
import { ChevronRight, MessageCircle, AlertTriangle } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

import { getProductBySlug } from '@/lib/catalog-service';

export async function generateMetadata({ params }: ProductDetailPageProps) {
  try {
    const { productSlug } = await params;
    const result = await getProductBySlug(productSlug);
    const product = result?.product;

    if (!product) return { title: 'Cracker Details — Robo Crackers' };

    return {
      title: `${product.name} — Sivakasi Fireworks Wholesale (80% Off) | Robo Crackers`,
      description: `Order ${product.name} directly from Sivakasi manufacturer at wholesale rate ₹${Number(product.price).toFixed(2)} (MRP ₹${Number(product.mrp).toFixed(2)}). Add to enquiry quote.`,
    };
  } catch {
    return { title: 'Cracker Details — Robo Crackers' };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productSlug } = await params;

  const result = await getProductBySlug(productSlug);
  if (!result || !result.product) {
    notFound();
  }

  const { product, relatedProducts } = result;


  const priceNum = Number(product.price);
  const mrpNum = Number(product.mrp);

  // WhatsApp prefilled link for this specific SKU
  const waProductLink = `https://wa.me/919342764302?text=${encodeURIComponent(
    `Hello Robo Crackers, I am enquiring about "${product.name}" (Wholesale Quote ₹${priceNum.toFixed(2)}). Is this available in stock?`
  )}`;

  // JSON-LD schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} Sivakasi Fireworks`,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Robo Crackers',
    },
    offers: {
      '@type': 'Offer',
      price: priceNum.toFixed(2),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-red-600 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {product.category.parent && (
          <>
            <Link
              href={`/category/${product.category.parent.slug}`}
              className="hover:text-red-600 transition"
            >
              {product.category.parent.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <Link
          href={`/category/${product.category.slug}`}
          className="hover:text-red-600 transition"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-bold text-slate-800">{product.name}</span>
      </nav>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Left: Product Imagery & Video Gallery */}
        <ProductImageGallery
          images={product.images || []}
          productName={product.name}
          categoryName={product.category.name}
          videoUrl={(product as any).videoUrl || null}
        />

        {/* Right: Pricing, Specs, and Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                {product.category.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {product.name}
              </h1>
              {product.sku && (
                <span className="text-xs font-mono text-slate-400 mt-0.5 block">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 bg-red-50/70 rounded-2xl border border-red-100 flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-medium">Wholesale Festival Quote Price:</span>
              <PriceTag
                price={priceNum}
                mrp={mrpNum}
                discountPct={product.discountPct}
                size="lg"
                showSavings={true}
              />
            </div>

            {/* Stock Note */}
            {product.stockNote && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Status: {product.stockNote}</span>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Description & Effects
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description ||
                  'High quality Sivakasi fireworks manufactured using certified green cracker formulations. Ensures brilliant visual performance and safety compliance.'}
              </p>
            </div>

            {/* Statutory Advisory */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">
                ⚖️ 2018 Supreme Court Compliance Notice:
              </span>
              <p>
                Fireworks are not sold through direct online payment. Adding to cart generates an official enquiry quote. Order confirmation and offline dispatch are finalized directly via WhatsApp or phone.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {/* Interactive Add to Quote Cart Component */}
            <AddToCartDetailButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: priceNum,
                mrp: mrpNum,
                discountPct: product.discountPct ?? 80,
                categoryName: product.category.name,
                stockNote: product.stockNote,
              }}
            />

            <a
              href={waProductLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask About This Item on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              More from {product.category.name}
            </h2>
            <Link
              href={`/category/${product.category.slug}`}
              className="text-xs font-bold text-red-600 hover:text-red-700"
            >
              View Full Category
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
