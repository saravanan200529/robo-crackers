'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Home, Grid, Search, ShoppingBag, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNavBar() {
  const pathname = usePathname();
  const { totalCount, setIsCartDrawerOpen } = useCart();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/category/day-crackers', icon: Grid },
    { label: 'Search', href: '/search', icon: Search },
    {
      label: 'Quote',
      href: '/cart',
      icon: ShoppingBag,
      badge: totalCount,
      isAction: true,
    },
    { label: 'Contact', href: '/contact-us', icon: PhoneCall },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 pb-safe shadow-lg">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-red-600 transition"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-red-600" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-bold text-red-600 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition ${
                isActive ? 'text-red-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-pill"
                  className="absolute -top-1 w-6 h-0.5 bg-red-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
