'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid admin credentials. Please verify email and password.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      {error && (
        <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-300 mb-1">
          Admin Email
        </label>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@robocrackers.in"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
          />
          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-300 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
          />
          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Rate-limited login protected against brute-force attempts.</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <span>Authenticating...</span>
        ) : (
          <>
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Glow Backdrop */}
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 mx-auto flex items-center justify-center text-white text-2xl shadow-lg shadow-red-900/30">
            🎆
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Robo Crackers Admin
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to manage catalog, festive discounts & customer enquiries
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-slate-500 text-xs py-8">Loading login...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
