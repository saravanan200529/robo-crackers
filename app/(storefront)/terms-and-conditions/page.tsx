import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms & Safety Guidelines — Robo Crackers Sivakasi',
  description: 'Terms of enquiry, legal compliance with the 2018 Supreme Court fireworks ruling, and consumer safety guidelines.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Terms of Service & Fireworks Safety Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Last updated: 2026-09-06 • ROBO Agencies (Sivakasi)
        </p>
      </div>

      {/* Supreme Court Section */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
          <span>Supreme Court of India (2018) Statutory Compliance</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          As per the Hon&apos;ble Supreme Court of India order dated 23rd October 2018 (Writ Petition (Civil) No. 728/2015), online e-commerce sales of firecrackers through payment gateways are strictly prohibited.
        </p>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          In strict adherence to this mandate, <strong>Robo Crackers operates exclusively as an Enquiry & Quotation platform</strong>. Adding crackers to your cart and submitting an enquiry does NOT constitute an online financial sale. All orders, payments, and dispatches are handled strictly through offline direct communication via phone call or WhatsApp.
        </p>
      </div>

      {/* Safety Instructions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>Firecracker Safety Do&apos;s and Don&apos;ts</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <h3 className="font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Do&apos;s:</span>
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc pl-4 leading-relaxed">
              <li>Always burst crackers in an open, outdoor area away from combustible materials.</li>
              <li>Keep a bucket of water and sand nearby for emergency extinguishing.</li>
              <li>Children must always burst fireworks under active adult supervision.</li>
              <li>Light sparklers and aerial rockets from arm&apos;s length using an incense stick (agarbatti).</li>
              <li>Dispose of burned crackers safely in water before binning.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-red-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Critical Don&apos;ts:</span>
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc pl-4 leading-relaxed">
              <li>Never attempt to re-ignite crackers that failed to burst.</li>
              <li>Never hold lighted fireworks in your hand, except hand-held sparklers.</li>
              <li>Never light fireworks inside houses, corridors, or near parked vehicles.</li>
              <li>Never store crackers near kitchen stoves, gas cylinders, or open flames.</li>
              <li>Do not wear synthetic or loose-fitting clothing while lighting fireworks.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Terms */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Enquiry & Quotation Terms</h2>
        <p>
          1. <strong>Wholesale Estimates:</strong> Prices listed on this website reflect current wholesale estimations with flat 80% discount from the stated MRP. Final pricing is subject to batch confirmation upon WhatsApp contact.
        </p>
        <p>
          2. <strong>Delivery Schedule:</strong> Due to heavy festive volume preceding Diwali, customers are advised to submit enquiries at least 15 days in advance of the festival.
        </p>
        <p>
          3. <strong>Green Cracker Compliance:</strong> All fireworks supplied by Robo Agencies are certified green crackers complying with CSIR-NEERI chemical standards.
        </p>
      </div>
    </div>
  );
}
