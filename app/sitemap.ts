import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sivakasirobofireworks.in';

  let categories: { slug: string; updatedAt: Date }[] = [];
  let products: { slug: string; updatedAt: Date }[] = [];

  try {
    categories = await db.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.warn('Could not query DB for sitemap during build', e);
  }

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
