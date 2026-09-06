'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring service in production
    console.error('Application error:', error.digest || error.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-100 text-amber-500 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Headline */}
        <div>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Something went wrong
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Unexpected Error
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            An unexpected error occurred. Please try again. If the problem persists, contact our team on WhatsApp.
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-600 font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
