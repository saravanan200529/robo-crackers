'use client';

import React, { useState } from 'react';

interface EnquiryStatusSelectorProps {
  enquiryId: string;
  currentStatus: string;
}

export function EnquiryStatusSelector({ enquiryId, currentStatus }: EnquiryStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);

    try {
      await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: enquiryId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (s: string) => {
    if (s === 'PENDING') return 'bg-amber-100 text-amber-900 border-amber-300';
    if (s === 'CONTACTED') return 'bg-blue-100 text-blue-900 border-blue-300';
    if (s === 'CONFIRMED') return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  return (
    <select
      value={status}
      disabled={updating}
      onChange={handleChange}
      className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition ${getStatusColor(
        status
      )}`}
    >
      <option value="PENDING">Pending</option>
      <option value="CONTACTED">Contacted</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
