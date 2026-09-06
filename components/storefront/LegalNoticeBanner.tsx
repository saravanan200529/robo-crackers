'use client';

import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export function LegalNoticeBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-200 animate-pulse" />
            <span>
              <strong className="underline decoration-yellow-200">Legal Compliance Notice:</strong> As per 2018 Supreme Court order, online firecracker sales are restricted. This is an <strong>Enquiry / Quote Cart</strong> platform only.
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 font-semibold text-yellow-100 hover:text-white shrink-0 bg-white/10 px-2.5 py-1 rounded-full text-xs transition"
          >
            <span>{isExpanded ? 'Hide Info' : 'How It Works'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span><strong>Step 1:</strong> Add your desired crackers to the Enquiry Cart at wholesale prices (up to 80% off MRP).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span><strong>Step 2:</strong> Submit your enquiry with contact details. No online payment is requested or collected.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span><strong>Step 3:</strong> We connect with you directly via WhatsApp / phone to confirm stock availability and close the order offline.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
