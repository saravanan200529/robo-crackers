// Static verified Sivakasi catalog data used as robust fallback
// Ensures full storefront functionality even when local PostgreSQL is not actively connected.

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  parent?: { id: string; name: string; slug: string } | null;
  children: { id: string; name: string; slug: string; sortOrder: number; isActive: boolean }[];
  _count?: { products: number };
}

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  mrp: number;
  discountPct: number;
  categoryId: string;
  category: { name: string; slug: string; parent?: { name: string; slug: string } | null };
  description: string;
  isBestSeller: boolean;
  stockNote: string;
  isActive: boolean;
  images: { url: string; altText: string }[];
  videoUrl?: string | null;
  variations: any[];
}

const RAW_CATEGORY_TREE = [
  {
    name: "Kid's Attraction",
    subcategories: [
      'Digital Lar / Digital Shower',
      'Gun',
      'Mud Pot',
      'Multi Colour Special Shower',
      'Multi Function Novelties',
      'Musical Novelties',
      'New Arrival',
      'Party Attraction',
      'Toys',
    ],
  },
  {
    name: 'Combo',
    subcategories: ['Combo Packs'],
  },
  {
    name: 'Day Crackers',
    subcategories: ['Bijili Crackers', 'Bombs', 'Gold Bijili (Window)', 'One Sound Crackers', 'Rockets'],
  },
  {
    name: 'Night Shots Pipes',
    subcategories: [
      '2 1/2" Pipe Comet Single',
      '2" Pipe (3 Pcs Packing)',
      '2" Pipe Comet Single Pack',
      '3 1/2" Pipe (Single Pc Packing)',
      '3 1/2" Pipe Aerial Attraction Special',
      '4" Pipe Mega Aerial',
      '5" Pipe Mega Aerial',
      'Chotta Fancy 1 1/4" Pipe',
      'Sky Shot Window Pack',
    ],
  },
  {
    name: 'Gift Box',
    subcategories: ["Robo's Gift Box", 'Echo Gift Box Economy Series'],
  },
  {
    name: 'Hand Held',
    subcategories: ['Mega Candles', 'Pencils', 'Sparklers', 'Twinkling Star'],
  },
  {
    name: 'Night Crackers',
    subcategories: [
      'Peacock Series',
      'Flower Pots',
      'Flower Pots (Window Box)',
      'Ground Chakkar',
      'Wheel Series Window Pack',
    ],
  },
  {
    name: 'Night Shots Cakes',
    subcategories: [
      'Display Shots',
      'Mega Repeating Shot (Economy)',
      'Multi Colour Shots (Premium)',
      'Musical Shots Whistling',
      'Repeating Shots',
    ],
  },
];

export const STATIC_CATEGORIES: MockCategory[] = RAW_CATEGORY_TREE.map((parent, pIdx) => {
  const parentSlug = slugify(parent.name);
  const parentId = `cat-parent-${pIdx + 1}`;
  const children = parent.subcategories.map((sub, sIdx) => ({
    id: `cat-sub-${pIdx + 1}-${sIdx + 1}`,
    name: sub,
    slug: slugify(`${parentSlug}-${sub}`),
    parentId,
    sortOrder: sIdx + 1,
    isActive: true,
  }));

  return {
    id: parentId,
    name: parent.name,
    slug: parentSlug,
    parentId: null,
    sortOrder: pIdx + 1,
    isActive: true,
    children,
    _count: { products: 0 },
  };
});

const RAW_PRODUCTS = [
  {
    name: 'Win Wheel Super',
    subCategory: 'Wheel Series Window Pack',
    parentCategory: 'Night Crackers',
    price: 240.0,
    mrp: 1200.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Festive High Demand',
    description: 'Super spinning aerial wheel with brilliant golden and multi-colour glitter emission.',
  },
  {
    name: 'Win Wheel Mini',
    subCategory: 'Wheel Series Window Pack',
    parentCategory: 'Night Crackers',
    price: 150.0,
    mrp: 750.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Standard Stock',
    description: 'Fast spinning compact wheel cracker with vibrant spark trails.',
  },
  {
    name: 'Win Wheel Max',
    subCategory: 'Wheel Series Window Pack',
    parentCategory: 'Night Crackers',
    price: 180.0,
    mrp: 900.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Limited Stock',
    description: 'Maximum velocity ground spinning wheel with extended duration.',
  },
  {
    name: 'Rocket Bomb Deluxe',
    subCategory: 'Rockets',
    parentCategory: 'Day Crackers',
    price: 80.0,
    mrp: 400.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Fast Moving',
    description: 'High altitude screaming rocket ending with a loud explosive report.',
  },
  {
    name: 'Red Bijili 50 Pcs',
    subCategory: 'Bijili Crackers',
    parentCategory: 'Day Crackers',
    price: 16.0,
    mrp: 80.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Available',
    description: 'Traditional Sivakasi red bijili sound crackers. Pack of 50 pieces.',
  },
  {
    name: 'Ground Chakkar Special',
    subCategory: 'Ground Chakkar',
    parentCategory: 'Night Crackers',
    price: 92.0,
    mrp: 460.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Available',
    description: 'Smooth spinning ground chakkar with radiant sparks. Box of 10 pcs.',
  },
  {
    name: '7 Cm Electric Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 7.0,
    mrp: 35.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Safe for Kids under supervision',
    description: 'Bright white electric sparklers with crackling sparks. 10 sparklers per box.',
  },
  {
    name: '2 3/4" Kuruvi Crackers (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 9.0,
    mrp: 45.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Classic kuruvi single sound crackers (1 packet).',
  },
  {
    name: '7 Cm Colour Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 9.0,
    mrp: 45.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Multi-colour emission 7cm sparklers.',
  },
  {
    name: '7 Cm Green Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 11.0,
    mrp: 55.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Eco-friendly green dazzling sparkler stick.',
  },
  {
    name: '3 1/2" Lakshmi Crackers (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 13.0,
    mrp: 65.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Available',
    description: 'Traditional Lakshmi single sound cracker packet with crisp sound.',
  },
  {
    name: '7 Cm Red Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 13.0,
    mrp: 65.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Vivid ruby red sparkler sticks.',
  },
  {
    name: '10 Cm Electric Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 18.0,
    mrp: 90.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Available',
    description: 'Long duration 10cm electric sparklers with crackling stars.',
  },
  {
    name: '10 Cm Colour Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 20.0,
    mrp: 100.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: '10cm multi-colour sparkling sparks.',
  },
  {
    name: '4" 6 Ply - Lakshmi/Ben 10 (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 20.0,
    mrp: 100.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Heavy duty 6-ply sound cracker with sharp report.',
  },
  {
    name: 'Electric Stone',
    subCategory: 'Multi Function Novelties',
    parentCategory: "Kid's Attraction",
    price: 20.0,
    mrp: 100.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Novelty electric stones that produce flashing crackles upon impact.',
  },
  {
    name: '10 Cm Green Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 23.0,
    mrp: 115.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: '10cm emerald green sparklers with long burning time.',
  },
  {
    name: '4" 8 Ply - Lakshmi Deluxe Crackers (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 25.0,
    mrp: 125.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Available',
    description: '8-ply deluxe sound cracker for loud celebration.',
  },
  {
    name: '10 Cm Red Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 26.0,
    mrp: 130.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: '10cm bright red festive sparkler sticks.',
  },
  {
    name: '12 Cm Electric Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 27.0,
    mrp: 135.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Extra long 12cm electric sparklers with intense golden brilliance.',
  },
  {
    name: 'Kit Kat',
    subCategory: 'Toys',
    parentCategory: "Kid's Attraction",
    price: 28.0,
    mrp: 140.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Kids favourite novelty crackling strips.',
  },
  {
    name: '12 Cm Colour Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 29.0,
    mrp: 145.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: '12cm vibrant multi-colour sparklers.',
  },
  {
    name: '1 1/2" Twinkling Stars',
    subCategory: 'Twinkling Star',
    parentCategory: 'Hand Held',
    price: 30.0,
    mrp: 150.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Twinkling star sticks emitting pulses of rhythmic glittering lights.',
  },
  {
    name: '4" 10 Ply - Spider Man/Hanuman (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 30.0,
    mrp: 150.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Festive Favourite',
    description: '10-ply super heavy single sound cracker with thunderous burst.',
  },
  {
    name: '4" Gold Lakshmi (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 30.0,
    mrp: 150.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: 'Golden wrap premium Lakshmi cracker.',
  },
  {
    name: 'Snake Tablet Big',
    subCategory: 'Toys',
    parentCategory: "Kid's Attraction",
    price: 30.0,
    mrp: 150.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Safe smoke tablet',
    description: 'Popular black snake tablet that expands into towering ash coil.',
  },
  {
    name: 'Two Sound Crackers (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 30.0,
    mrp: 150.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Available',
    description: 'Consecutive two-shot explosive sound cracker.',
  },
  {
    name: '12 Cm Green Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 31.0,
    mrp: 155.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: '12cm emerald green slow-burning sparklers.',
  },
  {
    name: '12 Cm Red Sparklers',
    subCategory: 'Sparklers',
    parentCategory: 'Hand Held',
    price: 35.0,
    mrp: 175.0,
    discountPct: 80,
    isBestSeller: false,
    stockNote: 'Available',
    description: '12cm ruby red slow-burning sparklers.',
  },
  {
    name: '4" 12 Ply - Lakshmi/Hulk (1pkt)',
    subCategory: 'One Sound Crackers',
    parentCategory: 'Day Crackers',
    price: 35.0,
    mrp: 175.0,
    discountPct: 80,
    isBestSeller: true,
    stockNote: 'Top Sound Intensity',
    description: 'Extreme 12-ply sound cracker for maximum festival impact.',
  },
];

export const STATIC_PRODUCTS: MockProduct[] = RAW_PRODUCTS.map((prod, idx) => {
  const pSlug = slugify(prod.name);
  const parentCat = STATIC_CATEGORIES.find((c) => c.name === prod.parentCategory);
  const subCat = parentCat?.children.find((c) => c.name === prod.subCategory);

  return {
    id: `prod-${idx + 1}`,
    name: prod.name,
    slug: pSlug,
    sku: `SKU-${pSlug.toUpperCase().slice(0, 15)}`,
    price: prod.price,
    mrp: prod.mrp,
    discountPct: prod.discountPct,
    categoryId: subCat?.id || parentCat?.id || 'cat-parent-1',
    category: {
      name: prod.subCategory,
      slug: subCat?.slug || parentCat?.slug || 'day-crackers',
      parent: parentCat ? { name: parentCat.name, slug: parentCat.slug } : null,
    },
    description: prod.description,
    isBestSeller: prod.isBestSeller,
    stockNote: prod.stockNote,
    isActive: true,
    images: [],
    variations: [],
  };
});

// Update product count on static categories
STATIC_CATEGORIES.forEach((cat) => {
  const count = STATIC_PRODUCTS.filter(
    (p) =>
      p.category.parent?.slug === cat.slug ||
      p.category.slug === cat.slug ||
      cat.children.some((sub) => sub.slug === p.category.slug)
  ).length;
  if (cat._count) {
    cat._count.products = count;
  }
});
