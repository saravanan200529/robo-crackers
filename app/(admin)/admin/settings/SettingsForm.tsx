'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: any;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    businessName: initialSettings.businessName || 'Robo Crackers',
    phone: initialSettings.phone || '+91 96296 59379',
    whatsappNumber: initialSettings.whatsappNumber || '919629659379',
    gstin: initialSettings.gstin || '33ABKFR4114P1ZW',
    isGstinVerified: initialSettings.isGstinVerified || false,
    licenseNo: initialSettings.licenseNo || 'LE-5/54/2024',
    isLicenseVerified: initialSettings.isLicenseVerified || false,
    legalNotice: initialSettings.legalNotice || '',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved and applied successfully!</span>
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 mb-1">
          Business Trade Name
        </label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Calling Phone Number
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            WhatsApp Number (Without +, spaces or dashes)
          </label>
          <input
            type="text"
            value={formData.whatsappNumber}
            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none font-mono"
          />
        </div>
      </div>

      {/* Statutory GSTIN & License Section with Verification Toggles */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
          Statutory Registration & Verification
        </h3>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1">
              <label className="block font-bold text-slate-700 mb-1">
                GSTIN
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl p-2 focus:border-red-500 outline-none font-mono uppercase"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2 sm:pt-0">
              <input
                type="checkbox"
                checked={formData.isGstinVerified}
                onChange={(e) =>
                  setFormData({ ...formData, isGstinVerified: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-bold text-slate-700 text-xs flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Active GSTIN
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
            <div className="flex-1">
              <label className="block font-bold text-slate-700 mb-1">
                Explosives License No.
              </label>
              <input
                type="text"
                value={formData.licenseNo}
                onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl p-2 focus:border-red-500 outline-none font-mono uppercase"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2 sm:pt-0">
              <input
                type="checkbox"
                checked={formData.isLicenseVerified}
                onChange={(e) =>
                  setFormData({ ...formData, isLicenseVerified: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-bold text-slate-700 text-xs flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Current License
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1">
          Supreme Court (2018) Compliance Notice Text
        </label>
        <textarea
          rows={3}
          value={formData.legalNotice}
          onChange={(e) => setFormData({ ...formData, legalNotice: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-red-500 outline-none resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="cursor-pointer w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? 'Saving...' : 'Save Site Settings'}</span>
      </button>
    </form>
  );
}
