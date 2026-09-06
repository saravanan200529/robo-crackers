'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, Search, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

interface PincodeCheckerProps {
  onSelectHub?: (hubName: string) => void;
}

const MAJOR_TRANSPORT_HUBS: { [district: string]: { hub: string; prefix: string[] } } = {
  'Sivakasi / Virudhunagar': { hub: 'Sivakasi Direct Factory Dispatch / Virudhunagar Hub', prefix: ['626'] },
  'Madurai': { hub: 'Madurai Central Lorry Hub (Mattuthavani / South Gate)', prefix: ['625'] },
  'Chennai': { hub: 'Chennai Koyambedu / Madhavaram Lorry Booking Center', prefix: ['600', '601', '602', '603'] },
  'Coimbatore': { hub: 'Coimbatore Ukkadam / Ganapathy Goods Transport Hub', prefix: ['641', '642'] },
  'Tiruchirappalli': { hub: 'Trichy Palakkarai / Gandhi Market Lorry Booking Office', prefix: ['620', '621'] },
  'Salem': { hub: 'Salem Shevapet / Leigh Bazaar Lorry Booking Station', prefix: ['636'] },
  'Tirunelveli': { hub: 'Tirunelveli Junction / Palayamkottai Transport Hub', prefix: ['627'] },
  'Erode': { hub: 'Erode Nasiyanur / Karungalpalayam Goods Station', prefix: ['638'] },
  'Vellore': { hub: 'Vellore New Bus Stand / Katpadi Transport Center', prefix: ['632'] },
  'Thanjavur': { hub: 'Thanjavur Medical College Road Goods Hub', prefix: ['613', '614'] },
  'Dindigul': { hub: 'Dindigul Nagal Nagar Lorry Service Hub', prefix: ['624'] },
  'Bangalore (Bengaluru)': { hub: 'Bangalore Kalasipalya / Yeshwantpur Inter-State Hub', prefix: ['560', '561', '562'] },
  'Puducherry (Pondicherry)': { hub: 'Puducherry Maraimalai Adigal Transport Office', prefix: ['605'] },
  'Hyderabad / Secunderabad': { hub: 'Hyderabad Ranigunj / Autonagar Transport Hub', prefix: ['500'] },
  'Kochi / Ernakulam': { hub: 'Kochi Willington Island / Kalamassery Goods Hub', prefix: ['682', '683'] },
};

export function PincodeChecker({ onSelectHub }: PincodeCheckerProps) {
  const { t } = useI18n();
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    found: boolean;
    district?: string;
    hub?: string;
    searched: boolean;
  }>({ found: false, searched: false });

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length < 3) return;

    let matchedDistrict: string | undefined;
    let matchedHub: string | undefined;

    for (const [district, data] of Object.entries(MAJOR_TRANSPORT_HUBS)) {
      if (data.prefix.some((p) => cleanPin.startsWith(p))) {
        matchedDistrict = district;
        matchedHub = data.hub;
        break;
      }
    }

    if (matchedDistrict && matchedHub) {
      setResult({ found: true, district: matchedDistrict, hub: matchedHub, searched: true });
      if (onSelectHub) onSelectHub(matchedHub);
    } else {
      setResult({
        found: true,
        district: 'South India General Parcel Network',
        hub: 'All Tamil Nadu, Kerala, Karnataka & Andhra Pradesh District Transport Points',
        searched: true,
      });
      if (onSelectHub) onSelectHub('Tamil Nadu / South India Approved Transport Hub');
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
        <Truck className="w-4 h-4 text-red-600" />
        <span>{t('checkPincode')}</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder={t('pincodePlaceholder')}
          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Check</span>
        </button>
      </form>

      {result.searched && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs animate-fadeIn">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('serviceableHub')} ({result.district})</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium pl-5.5">
            Transport Hub: <span className="font-bold">{result.hub}</span>
          </p>
          <p className="text-[10px] text-slate-500 pl-5.5 pt-0.5">
            {t('finalTransportNote')}
          </p>
        </div>
      )}
    </div>
  );
}
