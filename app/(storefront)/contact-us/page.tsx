import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Contact Us — Robo Crackers Sivakasi Office & Wholesale Booking',
  description: 'Reach Robo Fireworks in Sivakasi. Direct call +91 96296 59379, WhatsApp +91 96296 59379. Enquire about festival fireworks wholesale orders.',
};

export default function ContactUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Robo Crackers
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Need assistance with your quote or bulk festival booking? Our Sivakasi team is available to help offline.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Channel */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">WhatsApp Order Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fastest response for quotation estimates, item availability, and delivery dispatch updates.
            </p>
            <span className="font-mono text-base font-bold text-emerald-800 block">
              +91 96296 59379
            </span>
          </div>

          <a
            href="https://wa.me/919629659379"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Direct Call Channel */}
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Phone Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Speak directly with our Sivakasi booking desk for wholesale enquiries and large festive shipments.
            </p>
            <span className="font-mono text-base font-bold text-red-800 block">
              +91 96296 59379
            </span>
          </div>

          <a
            href="tel:+916369401248"
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        </div>
      </div>

      {/* Office & Timing details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Office Location & Hours</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-0.5">Sivakasi Operating Hub:</strong>
                <p className="leading-relaxed">
                  ROBO Fireworks / ROBO Agencies<br />
                  Virudhunagar District, Sivakasi<br />
                  Tamil Nadu — 626123, India
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-0.5">Booking Hours:</strong>
                <p className="leading-relaxed">
                  Monday to Saturday: 9:00 AM – 8:30 PM<br />
                  Sunday: 10:00 AM – 4:00 PM<br />
                  (Diwali Season: 24/7 WhatsApp Support)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Compliance Reminder:</strong> Firecracker purchases cannot be executed through direct credit/debit card checkouts online. Please use our Enquiry Quote cart or connect via WhatsApp to finalize orders legally.
          </p>
        </div>
      </div>
    </div>
  );
}
