import React from 'react';
import { AppTopBar } from '@/components/storefront/AppTopBar';
import { BottomNavBar } from '@/components/storefront/BottomNavBar';
import { LegalNoticeBanner } from '@/components/storefront/LegalNoticeBanner';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';

import { getCatalogCategories } from '@/lib/catalog-service';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCatalogCategories();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <LegalNoticeBanner />
      <AppTopBar categories={categories} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <StorefrontFooter />
      <BottomNavBar />
      <CartDrawer />
    </div>
  );
}
