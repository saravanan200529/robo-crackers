import Link from 'next/link';
import { Sparkles, ArrowRight, Home } from 'lucide-react';

export const metadata = {
  title: '404 — Page Not Found | Robo Crackers Sivakasi',
  description: 'The page you are looking for could not be found. Browse our Sivakasi fireworks catalog.',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 text-red-500 mx-auto flex items-center justify-center text-4xl">
          🎇
        </div>

        {/* Headline */}
        <div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            404 — Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            This Cracker Has<br />Already Burst!
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            The page you were looking for doesn&apos;t exist or may have been moved. Browse our Sivakasi fireworks catalog to find what you need.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
          <Link
            href="/category/day-crackers"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-600 font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Help text */}
        <p className="text-xs text-slate-400">
          Looking for a specific product? Use the search bar at the top of the page.
        </p>
      </div>
    </div>
  );
}
