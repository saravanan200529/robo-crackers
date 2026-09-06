import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About Us — Robo Crackers Sivakasi (Since 1985)',
  description: 'Learn about Robo Fireworks (ROBO Agencies), manufacturing and retailing authentic Sivakasi green crackers since 1985.',
};

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sivakasi Fireworks Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About Robo Crackers (ROBO Agencies)
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Serving festive celebrations across Tamil Nadu and South India with genuine quality, safety, and direct wholesale pricing since 1985.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-red-600" />
          <span>Our 38+ Years Heritage</span>
        </h2>
        <p>
          Founded in 1985 in the fireworks capital of India — Sivakasi, ROBO Agencies has built an enduring reputation for excellence, dependability, and uncompromising manufacturing standards. What started as a dedicated local agency has grown into a premier supplier of quality festival fireworks, novelties, and festive gift boxes.
        </p>
        <p>
          Unlike retail vendors who add steep intermediary markups, Robo Crackers operates with direct manufacturer relationships, allowing us to pass on true wholesale savings of up to <strong>80% off standard MRP</strong> directly to families, communities, and festival organizers.
        </p>
      </div>

      {/* Eco-Friendly Standards */}
      <div className="bg-emerald-900 text-emerald-50 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" />
          <span>Environmental Responsibility</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          100% Certified CSIR-NEERI Green Crackers
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          We strictly follow environmental guidelines prescribed by the Supreme Court of India and CSIR-NEERI. All products are formulated with approved green compositions:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-200">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>30% lower particulate matter emission</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>No prohibited chemicals (barium-free formulas)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Official QR code verification on packaging</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Reduced sound decibels within safe limits</span>
          </li>
        </ul>
      </div>

      {/* Statutory Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-xs text-slate-600">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Official Business Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-bold block text-slate-800">Trade Name:</span>
            <span>ROBO Fireworks / ROBO Agencies</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-bold block text-slate-800">Operating Location:</span>
            <span>Sivakasi, Tamil Nadu, India</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-bold block text-slate-800">GSTIN:</span>
            <span className="font-mono">33ABKFR4114P1ZW</span>{' '}
            <span className="text-[9px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded ml-1 font-semibold">
              Pending Verification
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-bold block text-slate-800">Explosives License:</span>
            <span className="font-mono">LE-5/54/2024</span>{' '}
            <span className="text-[9px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded ml-1 font-semibold">
              Pending Verification
            </span>
          </div>
        </div>
      </div>

      {/* Direct Contact CTA */}
      <div className="text-center pt-2">
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
        >
          <span>Connect with Sivakasi Office</span>
        </Link>
      </div>
    </div>
  );
}
