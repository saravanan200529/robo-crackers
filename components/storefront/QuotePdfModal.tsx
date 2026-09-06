'use client';

import React, { useRef } from 'react';
import { Printer, Download, X, Sparkles, CheckCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

interface QuotePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteData: {
    quoteRef: string;
    customerName: string;
    phone: string;
    city?: string;
    state?: string;
    address?: string;
    items: {
      productId?: string;
      productName: string;
      quantity: number;
      price: number;
      mrp?: number;
      discountPct?: number;
      lineTotal: number;
    }[];
    totalEstimate: number;
    totalMrp?: number;
    totalSavings?: number;
    createdAt?: string;
  };
}

export function QuotePdfModal({ isOpen, onClose, quoteData }: QuotePdfModalProps) {
  const { t } = useI18n();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = quoteData.createdAt || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">
              Official Wholesale Proforma Quotation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 text-slate-800 bg-white">
          {/* Header & Brand Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-red-600 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                ROBO CRACKERS
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                ROBO AGENCIES
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                42/1 Main Road, Sivakasi, Tamil Nadu – 626123 • Since 1985
              </p>
              <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                Phone: +91 96296 59379 • WhatsApp: +91 93427 64302
              </p>
            </div>

            <div className="sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Quote Reference ID
              </span>
              <span className="text-xl font-mono font-black text-red-600 block">
                #{quoteData.quoteRef}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Date: {currentDate}
              </span>
            </div>
          </div>

          {/* Customer & Location Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Customer Information
              </span>
              <div className="font-bold text-slate-900 text-sm">{quoteData.customerName}</div>
              <div className="text-slate-600 font-mono mt-0.5">Phone / WhatsApp: {quoteData.phone}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Delivery Location / Transport Hub
              </span>
              <div className="font-bold text-slate-800">
                {quoteData.city || 'Tamil Nadu'}, {quoteData.state || 'India'}
              </div>
              {quoteData.address && (
                <div className="text-slate-500 mt-0.5 text-[11px]">{quoteData.address}</div>
              )}
            </div>
          </div>

          {/* Itemized Crackers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">MRP Rate</th>
                  <th className="py-2.5 px-3 text-right">Wholesale Rate (80%)</th>
                  <th className="py-2.5 px-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {quoteData.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.productName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400 line-through">
                      ₹{(item.mrp || item.price * 5).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-700">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      ₹{(item.lineTotal || item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals & Wholesale Savings */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-50/70 p-5 rounded-2xl border border-red-200">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>CSIR-NEERI Certified Green Crackers Formulation</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Direct wholesale quotes from Sivakasi factory. Lorry transport parcel booking confirmed upon WhatsApp verification.
              </p>
            </div>

            <div className="text-right sm:min-w-[200px] space-y-1">
              {quoteData.totalMrp && (
                <div className="text-xs text-slate-500">
                  Total MRP: <span className="line-through">₹{quoteData.totalMrp.toFixed(2)}</span>
                </div>
              )}
              {quoteData.totalSavings && (
                <div className="text-xs font-bold text-emerald-700">
                  Total Festival Savings: ₹{quoteData.totalSavings.toFixed(2)}
                </div>
              )}
              <div className="text-xl sm:text-2xl font-black text-slate-950 pt-1 border-t border-red-200">
                Quote: ₹{quoteData.totalEstimate.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Legal Compliance Footer */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-1 leading-normal">
            <p className="font-bold text-slate-700">
              ⚖️ Statutory Notice (2018 Supreme Court of India Order):
            </p>
            <p>
              Online payment or commercial transactions for firecrackers are not carried out over the internet. This document serves as a non-binding festival proforma quotation. Order confirmation, stock allocation, and dispatch via approved transport logistics are closed offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
