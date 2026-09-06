import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, ShieldAlert } from 'lucide-react';

export function StorefrontFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎆</span>
              <span className="text-xl font-black text-white tracking-tight">
                ROBO <span className="text-red-500">CRACKERS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wholesale & retail fireworks directly from Sivakasi, Tamil Nadu. Operating with pride since 1985 under ROBO Agencies. Offering 100% eco-friendly green crackers at genuine manufacturer pricing.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                🌱 Certified Green Crackers
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Popular Categories</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/category/day-crackers" className="hover:text-red-400 transition">
                  Day Sound Crackers & Bombs
                </Link>
              </li>
              <li>
                <Link href="/category/night-crackers" className="hover:text-red-400 transition">
                  Night Crackers & Ground Chakkars
                </Link>
              </li>
              <li>
                <Link href="/category/hand-held" className="hover:text-red-400 transition">
                  Sparklers & Twinkling Stars
                </Link>
              </li>
              <li>
                <Link href="/category/gift-box" className="hover:text-red-400 transition">
                  Robo’s Premium Gift Boxes
                </Link>
              </li>
              <li>
                <Link href="/category/night-shots-cakes" className="hover:text-red-400 transition">
                  Aerial Repeating Shots & Cakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Regulatory Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Statutory Compliance</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              As per the 2018 Supreme Court directive, online fireworks transactions are strictly restricted. This platform operates purely as an enquiry quote catalog. All orders are closed offline.
            </p>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div>
                GSTIN: <span className="font-mono text-slate-200">33ABKFR4114P1ZW</span>{' '}
                <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-800">
                  Pending Verification
                </span>
              </div>
              <div>
                License: <span className="font-mono text-slate-200">LE-5/54/2024</span>{' '}
                <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-800">
                  Pending Verification
                </span>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-base">Direct Contact</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Sivakasi, Virudhunagar District, Tamil Nadu — 626123, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a href="tel:+916369401248" className="hover:text-white transition">
                  +91 96296 59379 (Direct Call)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/919342764302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-emerald-400 transition"
                >
                  +91 93427 64302 (WhatsApp Support)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 1985–{new Date().getFullYear()} Robo Crackers (ROBO Agencies). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms-and-conditions" className="hover:text-slate-300 transition">
              Terms & Safety Guidelines
            </Link>
            <Link href="/about-us" className="hover:text-slate-300 transition">
              About Sivakasi Factory
            </Link>
            <Link href="/admin/login" className="hover:text-slate-300 transition">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
