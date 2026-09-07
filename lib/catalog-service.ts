import { db } from '@/lib/db';
import {
  STATIC_CATEGORIES,
  STATIC_PRODUCTS,
  MockCategory,
  MockProduct,
} from './catalog-data';

/* eslint-disable @typescript-eslint/no-explicit-any */
function serializeProduct(p: any): MockProduct {
  return {
    ...p,
    price: Number(p.price),
    mrp: Number(p.mrp),
    discountPct: p.discountPct != null ? Number(p.discountPct) : null,
  };
}

function serializeProducts(products: any[]): MockProduct[] {
  return products.map(serializeProduct);
}

export async function getCatalogCategories(): Promise<MockCategory[]> {
  try {
    const cats = await db.category.findMany({
      where: { parentId: null, isActive: true },
      include: {
        children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (cats && cats.length > 0) {
      return cats as unknown as MockCategory[];
    }
  } catch (e) {
    console.warn('PostgreSQL not accessible; serving verified static categories:', (e as Error).message);
  }

  return STATIC_CATEGORIES;
}

export async function getBestSellerProducts(): Promise<MockProduct[]> {
  try {
    const prods = await db.product.findMany({
      where: { isActive: true, isBestSeller: true },
      include: {
        category: { select: { name: true, slug: true } },
        images: { select: { url: true, altText: true }, orderBy: { sortOrder: 'asc' } },
      },
      take: 8,
    });

    if (prods && prods.length > 0) {
      return serializeProducts(prods);
    }
  } catch (e) {
    console.warn('PostgreSQL not accessible; serving verified static best sellers:', (e as Error).message);
  }

  return STATIC_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
}

export async function getAllCatalogProducts(): Promise<MockProduct[]> {
  try {
    const prods = await db.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            parent: { select: { name: true, slug: true } },
          },
        },
        images: { select: { url: true, altText: true }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { isBestSeller: 'desc' },
    });

    if (prods && prods.length > 0) {
      return serializeProducts(prods);
    }
  } catch (e) {
    console.warn('PostgreSQL not accessible; serving all static products:', (e as Error).message);
  }

  return STATIC_PRODUCTS;
}

export async function getCategoryBySlug(slug: string) {
  try {
    const cat = await db.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (cat) return cat;
  } catch (e) {
    console.warn('PostgreSQL not accessible; querying static category:', (e as Error).message);
  }

  // Fallback to static
  const foundParent = STATIC_CATEGORIES.find((c) => c.slug === slug);
  if (foundParent) {
    return {
      id: foundParent.id,
      name: foundParent.name,
      slug: foundParent.slug,
      parentId: foundParent.parentId,
      parent: null,
      children: foundParent.children,
    };
  }

  // Check subcategory
  for (const parent of STATIC_CATEGORIES) {
    const foundSub = parent.children.find((s) => s.slug === slug);
    if (foundSub) {
      return {
        id: foundSub.id,
        name: foundSub.name,
        slug: foundSub.slug,
        parentId: parent.id,
        parent: { id: parent.id, name: parent.name, slug: parent.slug },
        children: [],
      };
    }
  }

  return null;
}

export async function getCategoryProducts(categorySlug: string, subSlug?: string, sort?: string) {
  try {
    const cat = await db.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    });

    if (cat) {
      let categoryIds = [cat.id];
      if (cat.children.length > 0) {
        if (subSlug) {
          const selectedSub = cat.children.find((c) => c.slug === subSlug);
          if (selectedSub) categoryIds = [selectedSub.id];
        } else {
          categoryIds = [cat.id, ...cat.children.map((c) => c.id)];
        }
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      if (sort === 'price_desc') orderBy = { price: 'desc' };
      if (sort === 'bestseller') orderBy = { isBestSeller: 'desc' };

      const prods = await db.product.findMany({
        where: { categoryId: { in: categoryIds }, isActive: true },
        include: {
          category: { select: { name: true, slug: true } },
          images: { select: { url: true, altText: true }, orderBy: { sortOrder: 'asc' } },
        },
        orderBy,
      });

      if (prods && prods.length > 0) return prods.map(serializeProduct);
    }
  } catch (e) {
    console.warn('PostgreSQL not accessible; serving static category products:', (e as Error).message);
  }

  // Static fallback
  let filtered = STATIC_PRODUCTS.filter((p) => {
    if (subSlug) {
      return p.category.slug === subSlug;
    }
    return p.category.parent?.slug === categorySlug || p.category.slug === categorySlug;
  });

  if (sort === 'price_asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === 'bestseller') {
    filtered = [...filtered].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  return filtered;
}

export async function getProductBySlug(slug: string) {
  try {
    const prod = await db.product.findUnique({
      where: { slug },
      include: {
        category: { include: { parent: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variations: true,
      },
    });

    if (prod) {
      const related = await db.product.findMany({
        where: { categoryId: prod.categoryId, id: { not: prod.id }, isActive: true },
        include: {
          category: { select: { name: true, slug: true } },
          images: { select: { url: true, altText: true }, orderBy: { sortOrder: 'asc' } },
        },
        take: 4,
      });

      return { product: serializeProduct(prod), relatedProducts: serializeProducts(related) };
    }
  } catch (e) {
    console.warn('PostgreSQL not accessible; serving static product details:', (e as Error).message);
  }

  // Static fallback
  const product = STATIC_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  const relatedProducts = STATIC_PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.categoryId === product.categoryId || p.category.parent?.slug === product.category.parent?.slug)
  ).slice(0, 4);

  return { product, relatedProducts };
}

export async function searchCatalog(query: string) {
  try {
    const q = query.trim();
    const prods = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: { select: { url: true, altText: true }, orderBy: { sortOrder: 'asc' } },
      },
      take: 40,
    });

    if (prods && prods.length > 0) return prods.map(serializeProduct);
  } catch (e) {
    console.warn('PostgreSQL not accessible; searching static catalog:', (e as Error).message);
  }

  const qLower = query.toLowerCase().trim();
  if (!qLower) return [];

  return STATIC_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(qLower) ||
      p.description.toLowerCase().includes(qLower) ||
      p.category.name.toLowerCase().includes(qLower) ||
      (p.category.parent && p.category.parent.name.toLowerCase().includes(qLower))
  );
}

export interface SiteSettingsData {
  businessName: string;
  operatingSince: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  gstin: string;
  licenseNo: string;
  minOrderValue: number;
  legalNotice: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  businessName: 'Robo Crackers (ROBO Agencies)',
  operatingSince: '1985',
  phone: '+91 96296 59379',
  whatsappNumber: '919629659379',
  email: 'contact@sivakasirobofireworks.in',
  address: 'ROBO Agencies, 42/1 Main Road, Sivakasi, Tamil Nadu 626123',
  gstin: '33ABKFR4114P1ZW',
  licenseNo: 'LE-5/54/2024',
  minOrderValue: 3000,
  legalNotice:
    'As per 2018 supreme court order, online sale of firecrackers are not permitted. Add products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.',
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const settings = await db.siteSetting.findUnique({
      where: { id: 'default' },
    });
    if (settings) {
      return {
        businessName: settings.businessName,
        operatingSince: settings.operatingSince,
        phone: settings.phone,
        whatsappNumber: settings.whatsappNumber,
        email: settings.email,
        address: settings.address,
        gstin: settings.gstin,
        licenseNo: settings.licenseNo,
        minOrderValue: Number(settings.minOrderValue || 3000),
        legalNotice: settings.legalNotice,
      };
    }
  } catch (e) {
    console.warn('Could not read site settings from DB:', (e as Error).message);
  }
  return DEFAULT_SITE_SETTINGS;
}

export interface ResolvedServerQuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  mrp: number;
  discountPct: number;
  lineTotal: number;
  lineMrp: number;
}

export async function resolveServerQuoteItems(
  items: { productId: string; quantity: number }[]
): Promise<{
  resolvedItems: ResolvedServerQuoteItem[];
  totalEstimate: number;
  totalMrp: number;
  totalSavings: number;
}> {
  const productIds = items.map((i) => i.productId);

  let dbProducts: any[] = [];
  try {
    dbProducts = await db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });
  } catch {
    // db fallback
  }

  const resolvedItems: ResolvedServerQuoteItem[] = [];

  for (const item of items) {
    let matchedProd = dbProducts.find((p) => p.id === item.productId);

    if (!matchedProd) {
      matchedProd = STATIC_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productId);
    }

    if (matchedProd) {
      const price = Number(matchedProd.price);
      const mrp = Number(matchedProd.mrp);
      const discountPct = matchedProd.discountPct ?? Math.round(((mrp - price) / mrp) * 100);
      const qty = Math.max(1, Math.min(500, Math.floor(item.quantity)));
      const lineTotal = price * qty;
      const lineMrp = mrp * qty;

      resolvedItems.push({
        productId: matchedProd.id,
        productName: matchedProd.name,
        quantity: qty,
        price,
        mrp,
        discountPct,
        lineTotal,
        lineMrp,
      });
    }
  }

  const totalEstimate = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalMrp = resolvedItems.reduce((sum, item) => sum + item.lineMrp, 0);
  const totalSavings = Math.max(0, totalMrp - totalEstimate);

  return {
    resolvedItems,
    totalEstimate,
    totalMrp,
    totalSavings,
  };
}

