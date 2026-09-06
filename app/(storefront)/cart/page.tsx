'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalEstimate,
    totalMrp,
    totalSavings,
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    quoteRef: string;
    whatsappUrl: string;
    totalEstimate: number;
    customerName: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your quote cart is empty. Please add items before submitting.');
      return;
    }

    // Basic client validation
    if (!formData.name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number for WhatsApp confirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: cleanPhone.slice(-10),
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            mrp: item.mrp,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote enquiry.');
      }

      setSubmissionResult({
        quoteRef: data.quoteRef,
        whatsappUrl: data.whatsappUrl,
        totalEstimate: data.totalEstimate,
        customerName: data.customerName,
      });

      // Clear the local cart
      clearCart();
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to submit quote enquiry. Please try again or message us directly on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Enquiry Logged Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Quote Ref: {submissionResult.quoteRef}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Thank you, <strong>{submissionResult.customerName}</strong>! Your festival quote estimate of{' '}
              <strong className="text-red-600">₹{submissionResult.totalEstimate.toFixed(2)}</strong> has been recorded.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-left space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Next Step: Confirm Order Offline via WhatsApp</span>
            </div>
            <p>
              In accordance with 2018 Supreme Court fireworks regulations, no payment was taken online. Tap the button below to send your item breakdown directly to our Sivakasi staff on WhatsApp to confirm stock and delivery.
            </p>
          </div>

          {/* WhatsApp Primary CTA */}
          <div className="pt-2 space-y-3">
            <a
              href={submissionResult.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg transition transform active:scale-98"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Open WhatsApp & Send Quote Breakdown</span>
            </a>

            <Link
              href="/"
              className="inline-block text-xs font-bold text-slate-500 hover:text-red-600 transition"
            >
              ← Return to Fireworks Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Enquiry Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Explore our Sivakasi fireworks selection with flat 80% discount. Add items to estimate your wholesale festival order.
        </p>
        <div className="pt-2">
          <Link
            href="/category/day-crackers"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition"
          >
            <span>Browse Crackers Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // NORMAL CART & SUBMISSION FORM
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Review Quote & Submit Enquiry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your Sivakasi wholesale quote ({totalCount} items). No payment is taken online.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
              <span>Selected Fireworks</span>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 cursor-pointer font-bold lowercase"
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => {
              const lineTotal = item.price * item.quantity;
              return (
                <div key={item.productId} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-bold text-slate-900 hover:text-red-600 transition truncate block"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-red-600">
                        ₹{item.price.toFixed(2)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{item.mrp.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.discountPct}% OFF
                      </span>
                    </div>

                    {/* Quantity Adjustment */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-red-600 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-red-600 transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-slate-900">
                      ₹{lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Calculation Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-2 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              Quote Calculation
            </h3>
            <div className="flex justify-between text-slate-500">
              <span>Total MRP Value:</span>
              <span className="line-through">₹{totalMrp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Diwali Wholesale Discount (80% Off):
              </span>
              <span>-₹{totalSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Estimated Quote:</span>
              <span className="text-red-600">₹{totalEstimate.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details & Submission Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5 sticky top-20">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Step 2 of 2
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                Delivery & WhatsApp Contact
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We will contact you within 24 hours to confirm stock and arrange offline delivery.
              </p>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Anand Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-3 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  We will send order confirmation to this WhatsApp number.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Madurai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Delivery Street Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Door No, Street Name, Area..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Special Notes / Preferred Delivery Date
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Needs delivery before Oct 25th"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                />
              </div>

              {/* Statutory Note */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  By clicking Submit, your enquiry quote is generated. Final confirmation and offline payment are completed via WhatsApp or direct phone call.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Quote...</span>
                ) : (
                  <>
                    <span>Submit Enquiry & Get WhatsApp Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
