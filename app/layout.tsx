import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { I18nProvider } from '@/lib/i18n-context';

export const metadata: Metadata = {
  title: {
    default: 'Robo Crackers — Sivakasi Fireworks Wholesale & Retail (Since 1985)',
    template: '%s | Robo Crackers Sivakasi',
  },
  description:
    'Order authentic Sivakasi fireworks at up to 80% off MRP. Browse CSIR-NEERI green sparklers, rockets, ground chakkars, gift boxes, and flower pots. Submit your quote enquiry for direct wholesale dispatch.',
  keywords: [
    'Sivakasi crackers',
    'Robo Crackers',
    'Sivakasi fireworks wholesale',
    'Diwali crackers quote',
    'green crackers Sivakasi',
    'gift boxes crackers',
    'ROBO Agencies Sivakasi',
    'Tamil Nadu fireworks manufacturer',
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Robo Crackers — Sivakasi Fireworks Wholesale Catalog',
    description: 'Enquiry quote cart for genuine Sivakasi fireworks. Up to 80% discount on festive crackers direct from manufacturer.',
    type: 'website',
    locale: 'en_IN',
  },
  alternates: {
    canonical: 'https://sivakasirobofireworks.in',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D9232D',
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'WholesaleStore',
  name: 'Robo Crackers (ROBO Agencies)',
  legalName: 'ROBO Agencies',
  foundingDate: '1985',
  description: 'Authentic Sivakasi fireworks manufacturer and wholesale quote supplier operating since 1985.',
  telephone: '+916369401248',
  email: 'contact@sivakasirobofireworks.in',
  url: 'https://sivakasirobofireworks.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '42/1 Main Road',
    addressLocality: 'Sivakasi',
    addressRegion: 'Tamil Nadu',
    postalCode: '626123',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '9.4533',
    longitude: '77.7972',
  },
  priceRange: '₹₹',
  paymentAccepted: 'Offline confirmation per 2018 Supreme Court regulations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50">
        <I18nProvider>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

