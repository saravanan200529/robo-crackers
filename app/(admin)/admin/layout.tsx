import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Users,
  Percent,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎇</span>
            <div>
              <span className="font-black text-sm text-white tracking-wide block">
                ROBO ADMIN
              </span>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                Control Panel
              </span>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-slate-400 hover:text-white p-1 text-xs flex items-center gap-1 transition"
            title="View live storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 text-xs font-semibold overflow-y-auto">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-red-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/enquiries"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Enquiries & Quotes</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Products Catalog</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>Categories (40)</span>
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Customers & Export</span>
          </Link>

          <Link
            href="/admin/discounts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <Percent className="w-4 h-4 text-rose-400" />
            <span>Discounts (80% Off)</span>
          </Link>

          <div className="pt-2 border-t border-slate-800 my-2" />

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Site Settings</span>
          </Link>
        </nav>

        {/* User Info / Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">
              A
            </div>
            <div className="truncate">
              <span className="font-bold text-white block truncate">Super Admin</span>
              <span className="text-[10px] text-slate-400">STAFF / OWNER</span>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="text-slate-400 hover:text-red-400 p-1.5 transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar for admin */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated Admin Session • Rate-Limited Access</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg"
            >
              Enquiry Inflow Active
            </Link>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
