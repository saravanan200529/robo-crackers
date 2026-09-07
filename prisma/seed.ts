import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to create clean URL slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🌱 Starting database seed for Robo Crackers...');

  // 1. Initial Site Settings with explicit verification warnings
  console.log('⚙️ Seeding site settings...');
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Robo Crackers (ROBO Agencies)',
      operatingSince: '1985',
      phone: '+91 96296 59379',
      whatsappNumber: '919629659379',
      gstin: '33ABKFR4114P1ZW',
      isGstinVerified: false, // [UNVERIFIED — CONFIRM BEFORE GO-LIVE]
      licenseNo: 'LE-5/54/2024',
      isLicenseVerified: false, // [UNVERIFIED — CONFIRM BEFORE GO-LIVE]
      legalNotice:
        'As per 2018 supreme court order, online sale of firecrackers are not permitted. Add products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.',
    },
  });

  // 2. Initial Super Admin Account (Securely sourced from environment variables)
  console.log('👤 Seeding admin account...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@robocrackers.in';
  let initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  let mustChangePassword = false;

  if (!initialPassword) {
    initialPassword = `Robo_${crypto.randomBytes(6).toString('hex')}!2026`;
    mustChangePassword = true;
    console.log('\n=============================================================');
    console.log('⚠️  NO ADMIN_INITIAL_PASSWORD IN .ENV — GENERATED TEMPORARY CREDENTIALS:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${initialPassword}`);
    console.log('   Must change password on first login: YES');
    console.log('=============================================================\n');
  }

  const passwordHash = await bcrypt.hash(initialPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      mustChangePassword,
    },
  });

  // 3. Category Structure from Section 7.2 (8 Parents, 40 Subcategories)
  console.log('📁 Seeding categories & subcategories from Section 7.2...');

  const categoryTree: { name: string; subcategories: string[] }[] = [
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

  const categoryMap = new Map<string, string>(); // name -> ID

  let parentOrder = 1;
  for (const parent of categoryTree) {
    const parentSlug = slugify(parent.name);
    const parentCat = await prisma.category.upsert({
      where: { slug: parentSlug },
      update: { name: parent.name, sortOrder: parentOrder },
      create: {
        name: parent.name,
        slug: parentSlug,
        sortOrder: parentOrder,
        isActive: true,
      },
    });
    categoryMap.set(parent.name, parentCat.id);
    parentOrder++;

    let subOrder = 1;
    for (const sub of parent.subcategories) {
      const subSlug = slugify(`${parentSlug}-${sub}`);
      const subCat = await prisma.category.upsert({
        where: { slug: subSlug },
        update: { name: sub, parentId: parentCat.id, sortOrder: subOrder },
        create: {
          name: sub,
          slug: subSlug,
          parentId: parentCat.id,
          sortOrder: subOrder,
          isActive: true,
        },
      });
      categoryMap.set(sub, subCat.id);
      categoryMap.set(`${parent.name} > ${sub}`, subCat.id);
      subOrder++;
    }
  }

  // 4. Sample Products from Section 7.3 (Real observed pricing, MRP, 80% discount)
  console.log('🎆 Seeding verified sample products from Section 7.3...');

  const verifiedProducts = [
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

  for (const prod of verifiedProducts) {
    const categoryId = categoryMap.get(prod.subCategory) || categoryMap.get(prod.parentCategory);
    if (!categoryId) {
      console.warn(`Could not find category ID for ${prod.subCategory}`);
      continue;
    }

    const slug = slugify(prod.name);
    await prisma.product.upsert({
      where: { slug },
      update: {
        price: prod.price,
        mrp: prod.mrp,
        discountPct: prod.discountPct,
        categoryId,
        description: prod.description,
        isBestSeller: prod.isBestSeller,
        stockNote: prod.stockNote,
      },
      create: {
        name: prod.name,
        slug,
        sku: `SKU-${slug.toUpperCase().slice(0, 15)}`,
        price: prod.price,
        mrp: prod.mrp,
        discountPct: prod.discountPct,
        categoryId,
        description: prod.description,
        isBestSeller: prod.isBestSeller,
        stockNote: prod.stockNote,
        isActive: true,
      },
    });
  }

  // 5. Storewide Diwali Discount campaign
  console.log('🏷️ Seeding storewide Diwali discount campaign...');
  await prisma.discount.upsert({
    where: { id: 'diwali-2026-storewide' },
    update: {},
    create: {
      id: 'diwali-2026-storewide',
      name: 'Diwali 2026 Flat 80% Off Storewide',
      percentage: 80,
      startsAt: new Date('2026-08-01'),
      endsAt: new Date('2026-11-30'),
      isActive: true,
    },
  });

  console.log('✅ Seed completed successfully! All 8 parent categories, 40 subcategories, and 30 verified SKUs seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
