import React from 'react';
import { db } from '@/lib/db';
import { SettingsForm } from './SettingsForm';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  let settings: any = {
    id: 'default',
    businessName: 'Robo Crackers',
    operatingSince: '1985',
    phone: '+91 96296 59379',
    whatsappNumber: '919342764302',
    gstin: '33ABKFR4114P1ZW',
    isGstinVerified: false,
    licenseNo: 'LE-5/54/2024',
    isLicenseVerified: false,
    legalNotice:
      'As per 2018 supreme court order, online sale of firecrackers are not permitted. Add products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.',
  };

  try {
    const fetched = await db.siteSetting.findUnique({
      where: { id: 'default' },
    });
    if (fetched) {
      settings = fetched;
    }
  } catch (e) {
    console.warn('DB not connected on AdminSettingsPage, using defaults:', e);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Business & Regulatory Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure contact numbers, WhatsApp handoff targets, and statutory registration numbers
        </p>
      </div>

      {/* Critical Verification Warning Alert */}
      {(!settings.isGstinVerified || !settings.isLicenseVerified) && (
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>ATTENTION: Legal Registration Details Pending Live Confirmation</span>
          </div>
          <p className="leading-relaxed">
            Per the project specification, the GSTIN (<strong>{settings.gstin}</strong>) and Explosives License No. (<strong>{settings.licenseNo}</strong>) observed on the reference site must be formally verified by the business owner before commercial publishing. They are currently tagged as unverified across the storefront.
          </p>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
