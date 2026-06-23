import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ── Categories ─────────────────────────────

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "chandeliers" },
      update: { name: "Chandeliers", sortOrder: 1 },
      create: {
        name: "Chandeliers",
        slug: "chandeliers",
        description:
          "Statement fixtures that anchor any room. Handcrafted brass, crystal, and wrought iron designs.",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "pendants" },
      update: { name: "Pendants", sortOrder: 2 },
      create: {
        name: "Pendants",
        slug: "pendants",
        description:
          "Suspended lighting for kitchens, islands, and intimate nooks. Glass, brass, copper, and natural materials.",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "sconces" },
      update: { name: "Sconces", sortOrder: 3 },
      create: {
        name: "Sconces",
        slug: "sconces",
        description:
          "Wall-mounted fixtures for hallways, reading corners, and bedside. Alabaster, brass, bronze, and articulated designs.",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "table-lamps" },
      update: { name: "Table Lamps", sortOrder: 4 },
      create: {
        name: "Table Lamps",
        slug: "table-lamps",
        description:
          "Desk, bedside, and accent lamps. Ceramic, stoneware, brass, and reclaimed wood in handcrafted forms.",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "floor-lamps" },
      update: { name: "Floor Lamps", sortOrder: 5 },
      create: {
        name: "Floor Lamps",
        slug: "floor-lamps",
        description:
          "Tall standing lamps that define a space. Brass, wood tripods, and spun-steel torchieres.",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "outdoor" },
      update: { name: "Outdoor", sortOrder: 6 },
      create: {
        name: "Outdoor",
        slug: "outdoor",
        description:
          "Weather-rated fixtures for patios, gardens, and entryways. Solid bronze, cast brass, and commercial-grade string lights.",
        sortOrder: 6,
      },
    }),
  ]);

  // Build a quick lookup map by slug
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    catMap[c.slug] = c.id;
  }

  // ── Products ───────────────────────────────

  const products = [
    // Chandeliers (4)
    {
      name: "Sonoma 8-Arm Chandelier",
      slug: "sonoma-8-arm-chandelier",
      description:
        "Our signature piece. Eight hand-cast brass arms radiate from a central turned column, each holding a warm LED candle. The subtle patina is applied by hand — no two are alike.",
      price: 849,
      compareAt: 1099,
      image: "/products/sonoma-8-arm-chandelier.webp",
      images: JSON.stringify([
        "/products/sonoma-8-arm-chandelier.webp",
        "/products/sonoma-8-arm-chandelier-2.webp",
        "/products/sonoma-8-arm-chandelier-3.webp",
      ]),
      features: [
        "Eight hand-cast brass arms",
        "Warm LED candles included",
        "Hand-applied patina finish",
        "Adjustable chain (6 ft included)",
        "UL-listed, dimmer compatible",
      ],
      tag: "Brass",
      categoryId: catMap["chandeliers"],
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 142,
    },
    {
      name: "Dry Creek Linear Chandelier",
      slug: "dry-creek-linear-chandelier",
      description:
        "A 48-inch linear fixture with five hand-blown glass shades suspended from a solid brass rail. Designed for dining tables and kitchen islands.",
      price: 729,
      compareAt: 949,
      image: "/products/dry-creek-linear-chandelier.webp",
      images: JSON.stringify([
        "/products/dry-creek-linear-chandelier.webp",
        "/products/dry-creek-linear-chandelier-2.webp",
      ]),
      features: [
        "48-inch solid brass rail",
        "Five hand-blown glass shades",
        "Adjustable suspension cables",
        "Warm 2700K LED compatible",
        "UL-listed, dimmer compatible",
      ],
      tag: "Bronze",
      categoryId: catMap["chandeliers"],
      rating: 4.8,
      reviewCount: 67,
    },
    {
      name: "Glen Ellen Wrought Iron",
      slug: "glen-ellen-wrought-iron",
      description:
        "Hand-forged wrought iron with a raw black finish. Six scrolling arms with hand-dipped beeswax candle covers. Rustic elegance.",
      price: 595,
      image: "/products/glen-ellen-wrought-iron.webp",
      images: JSON.stringify([
        "/products/glen-ellen-wrought-iron.webp",
        "/products/glen-ellen-wrought-iron-2.webp",
      ]),
      features: [
        "Hand-forged wrought iron",
        "Raw black finish",
        "Six scrolling arms",
        "Hand-dipped beeswax candle covers",
        "UL-listed, LED compatible",
      ],
      tag: "Iron",
      categoryId: catMap["chandeliers"],
      rating: 4.7,
      reviewCount: 53,
    },
    {
      name: "Kenwood Crystal Ring",
      slug: "kenwood-crystal-ring",
      description:
        "A showstopping 36-inch ring of hand-cut crystal pendants on a polished brass frame. Dining rooms, foyers, anywhere you want drama.",
      price: 1295,
      compareAt: 1595,
      image: "/products/kenwood-crystal-ring.webp",
      images: JSON.stringify([
        "/products/kenwood-crystal-ring.webp",
        "/products/kenwood-crystal-ring-2.webp",
        "/products/kenwood-crystal-ring-3.webp",
      ]),
      features: [
        "36-inch diameter polished brass frame",
        "Hand-cut crystal pendants",
        "Adjustable suspension",
        "Warm LED compatible",
        "UL-listed, professional install recommended",
      ],
      tag: "Crystal",
      categoryId: catMap["chandeliers"],
      isNew: true,
      rating: 5.0,
      reviewCount: 23,
    },

    // Pendants (4)
    {
      name: "Nova Glass Pendant",
      slug: "nova-glass-pendant",
      description:
        "Hand-blown opal glass in a subtle teardrop shape, suspended by a braided linen cord. Perfect above kitchen islands or as a bedside pair.",
      price: 429,
      compareAt: 549,
      image: "/products/nova-glass-pendant.webp",
      images: JSON.stringify([
        "/products/nova-glass-pendant.webp",
        "/products/nova-glass-pendant-2.webp",
        "/products/nova-glass-pendant-3.webp",
      ]),
      features: [
        "Hand-blown opal glass",
        "Braided linen cord",
        "Adjustable height",
        "Warm LED bulb included",
        "UL-listed, dimmer compatible",
      ],
      tag: "Glass",
      categoryId: catMap["pendants"],
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 98,
    },
    {
      name: "Sebastopol Cone Pendant",
      slug: "sebastopol-cone-pendant",
      description:
        "A spun brass cone with a raw interior that catches and warms the light. Adjustable cord. Ideal for kitchen islands and bar areas.",
      price: 349,
      image: "/products/sebastopol-cone-pendant.webp",
      images: JSON.stringify([
        "/products/sebastopol-cone-pendant.webp",
        "/products/sebastopol-cone-pendant-2.webp",
      ]),
      features: [
        "Spun brass cone",
        "Raw brass interior finish",
        "Adjustable cord (6 ft)",
        "E26 socket, LED compatible",
        "UL-listed",
      ],
      tag: "Brass",
      categoryId: catMap["pendants"],
      rating: 4.8,
      reviewCount: 74,
    },
    {
      name: "Occidental Mini Pendant",
      slug: "occidental-mini-pendant",
      description:
        "Hand-hammered copper mini pendant with a warm rose-gold glow. Perfect in clusters of three over a breakfast nook.",
      price: 249,
      image: "/products/occidental-mini-pendant.webp",
      images: JSON.stringify([
        "/products/occidental-mini-pendant.webp",
        "/products/occidental-mini-pendant-2.webp",
        "/products/occidental-mini-pendant-3.webp",
      ]),
      features: [
        "Hand-hammered copper",
        "Warm rose-gold interior",
        "Adjustable cord (6 ft)",
        "E26 socket, LED compatible",
        "UL-listed, dimmer compatible",
      ],
      tag: "Copper",
      categoryId: catMap["pendants"],
      isNew: true,
      rating: 4.9,
      reviewCount: 41,
    },
    {
      name: "Bodega Bay Rattan Pendant",
      slug: "bodega-bay-rattan-pendant",
      description:
        "Woven rattan globe pendant with an organic, coastal texture. Casts beautiful dappled shadows. Easy to install with adjustable cord.",
      price: 329,
      image: "/products/bodega-bay-rattan-pendant.webp",
      images: JSON.stringify([
        "/products/bodega-bay-rattan-pendant.webp",
        "/products/bodega-bay-rattan-pendant-2.webp",
      ]),
      features: [
        "Hand-woven rattan globe",
        "Organic coastal texture",
        "Dappled shadow effect",
        "Adjustable cord (6 ft)",
        "UL-listed, LED compatible",
      ],
      tag: "Natural",
      categoryId: catMap["pendants"],
      rating: 4.7,
      reviewCount: 56,
    },

    // Sconces (4)
    {
      name: "Petaluma Alabaster Sconce",
      slug: "petaluma-alabaster-sconce",
      description:
        "Natural alabaster with swirling cream and honey tones, backlit to reveal the stone's innate character. Hardwired or plug-in.",
      price: 375,
      image: "/products/petaluma-alabaster-sconce.webp",
      images: JSON.stringify([
        "/products/petaluma-alabaster-sconce.webp",
        "/products/petaluma-alabaster-sconce-2.webp",
        "/products/petaluma-alabaster-sconce-3.webp",
      ]),
      features: [
        "Natural alabaster stone",
        "Swirling cream and honey tones",
        "Hardwired or plug-in installation",
        "Warm LED compatible",
        "UL-listed, dimmer compatible",
      ],
      tag: "Alabaster",
      categoryId: catMap["sconces"],
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 47,
    },
    {
      name: "Healdsburg Brass Sconce",
      slug: "healdsburg-brass-sconce",
      description:
        "A slim brass backplate and articulated arm with a petite linen shade. Timeless and versatile — hallways, reading nooks, bedside.",
      price: 295,
      image: "/products/healdsburg-brass-sconce.webp",
      images: JSON.stringify([
        "/products/healdsburg-brass-sconce.webp",
        "/products/healdsburg-brass-sconce-2.webp",
      ]),
      features: [
        "Slim brass backplate",
        "Articulated arm",
        "Petite linen shade",
        "Hardwired installation",
        "UL-listed, dimmer compatible",
      ],
      tag: "Brass",
      categoryId: catMap["sconces"],
      rating: 4.8,
      reviewCount: 63,
    },
    {
      name: "Guerneville Wall Lantern",
      slug: "guerneville-wall-lantern",
      description:
        "Hand-riveted bronze lantern with seeded glass panels. Designed to weather beautifully indoors or out.",
      price: 345,
      image: "/products/guerneville-wall-lantern.webp",
      images: JSON.stringify([
        "/products/guerneville-wall-lantern.webp",
        "/products/guerneville-wall-lantern-2.webp",
      ]),
      features: [
        "Hand-riveted bronze construction",
        "Seeded glass panels",
        "Weather-resistant",
        "Hardwired installation",
        "UL-listed for wet locations",
      ],
      tag: "Bronze",
      categoryId: catMap["sconces"],
      rating: 4.6,
      reviewCount: 38,
    },
    {
      name: "Forestville Articulated Sconce",
      slug: "forestville-articulated-sconce",
      description:
        "Fully articulated brass sconce with a domed shade. Swing it, tilt it, point it wherever you need task light. Hardwired with dimmer compatibility.",
      price: 425,
      compareAt: 525,
      image: "/products/forestville-articulated-sconce.webp",
      images: JSON.stringify([
        "/products/forestville-articulated-sconce.webp",
        "/products/forestville-articulated-sconce-2.webp",
        "/products/forestville-articulated-sconce-3.webp",
      ]),
      features: [
        "Fully articulated arm",
        "Domed brass shade",
        "360-degree rotation",
        "Hardwired installation",
        "UL-listed, dimmer compatible",
      ],
      tag: "Brass",
      categoryId: catMap["sconces"],
      isNew: true,
      rating: 4.9,
      reviewCount: 29,
    },

    // Table Lamps (4)
    {
      name: "Mendocino Ceramic Lamp",
      slug: "mendocino-ceramic-lamp",
      description:
        "Wheel-thrown ceramic base in a sandy matte glaze, topped with a natural linen shade. Each one is thrown by our potter in Sonoma.",
      price: 298,
      image: "/products/mendocino-ceramic-lamp.webp",
      images: JSON.stringify([
        "/products/mendocino-ceramic-lamp.webp",
        "/products/mendocino-ceramic-lamp-2.webp",
        "/products/mendocino-ceramic-lamp-3.webp",
      ]),
      features: [
        "Wheel-thrown ceramic base",
        "Sandy matte glaze",
        "Natural linen shade",
        "In-line dimmer switch",
        "UL-listed, LED compatible",
      ],
      tag: "Ceramic",
      categoryId: catMap["table-lamps"],
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 89,
    },
    {
      name: "Calistoga Stoneware Lamp",
      slug: "calistoga-stoneware-lamp",
      description:
        "Speckled stoneware with a reactive glaze that pools in deep blues and greens. Paired with an off-white linen drum shade.",
      price: 265,
      image: "/products/calistoga-stoneware-lamp.webp",
      images: JSON.stringify([
        "/products/calistoga-stoneware-lamp.webp",
        "/products/calistoga-stoneware-lamp-2.webp",
      ]),
      features: [
        "Speckled stoneware base",
        "Reactive glaze in blue/green tones",
        "Off-white linen drum shade",
        "In-line dimmer switch",
        "UL-listed, LED bulb included",
      ],
      tag: "Stoneware",
      categoryId: catMap["table-lamps"],
      rating: 4.7,
      reviewCount: 45,
    },
    {
      name: "Windsor Brass Task Lamp",
      slug: "windsor-brass-task-lamp",
      description:
        "Adjustable brass task lamp with a weighted base and rotating shade. Perfect for desks, sideboards, and piano tops.",
      price: 349,
      image: "/products/windsor-brass-task-lamp.webp",
      images: JSON.stringify([
        "/products/windsor-brass-task-lamp.webp",
        "/products/windsor-brass-task-lamp-2.webp",
        "/products/windsor-brass-task-lamp-3.webp",
      ]),
      features: [
        "Polished brass finish",
        "Adjustable arm and rotating shade",
        "Weighted base for stability",
        "In-line dimmer switch",
        "UL-listed, LED bulb included",
      ],
      tag: "Brass",
      categoryId: catMap["table-lamps"],
      isNew: true,
      rating: 4.9,
      reviewCount: 34,
    },
    {
      name: "Monte Rio Wood Lamp",
      slug: "monte-rio-wood-lamp",
      description:
        "Turned reclaimed oak base with visible grain and a simple cotton shade. Quiet, warm, and grounded.",
      price: 225,
      compareAt: 285,
      image: "/products/monte-rio-wood-lamp.webp",
      images: JSON.stringify([
        "/products/monte-rio-wood-lamp.webp",
        "/products/monte-rio-wood-lamp-2.webp",
      ]),
      features: [
        "Turned reclaimed oak base",
        "Visible natural grain",
        "Simple cotton shade",
        "In-line dimmer switch",
        "UL-listed, LED bulb included",
      ],
      tag: "Wood",
      categoryId: catMap["table-lamps"],
      rating: 4.6,
      reviewCount: 51,
    },

    // Floor Lamps (3)
    {
      name: "Armstrong Floor Lamp",
      slug: "armstrong-floor-lamp",
      description:
        "A slender brass floor lamp with an arched arm and a hand-stitched linen shade. The perfect reading companion — minimal footprint, maximum presence.",
      price: 585,
      image: "/products/armstrong-floor-lamp.webp",
      images: JSON.stringify([
        "/products/armstrong-floor-lamp.webp",
        "/products/armstrong-floor-lamp-2.webp",
        "/products/armstrong-floor-lamp-3.webp",
      ]),
      features: [
        "Slender brass body",
        "Arched arm design",
        "Hand-stitched linen shade",
        "Foot-step dimmer",
        "UL-listed, LED bulb included",
      ],
      tag: "Brass",
      categoryId: catMap["floor-lamps"],
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 62,
    },
    {
      name: "Redwood Tripod Lamp",
      slug: "redwood-tripod-lamp",
      description:
        "Three reclaimed redwood legs support a large linen drum shade. Inspired by mid-century design, handcrafted in Sonoma.",
      price: 495,
      image: "/products/redwood-tripod-lamp.webp",
      images: JSON.stringify([
        "/products/redwood-tripod-lamp.webp",
        "/products/redwood-tripod-lamp-2.webp",
        "/products/redwood-tripod-lamp-3.webp",
      ]),
      features: [
        "Reclaimed redwood legs",
        "Mid-century inspired design",
        "Large linen drum shade",
        "Foot-step dimmer",
        "UL-listed, LED bulb included",
      ],
      tag: "Wood",
      categoryId: catMap["floor-lamps"],
      rating: 4.7,
      reviewCount: 43,
    },
    {
      name: "Cazadero Torchiere",
      slug: "cazadero-torchiere",
      description:
        "Hand-spun steel torchiere with a warm brass wash interior that throws soft, indirect light up the wall and across the ceiling.",
      price: 425,
      image: "/products/cazadero-torchiere.webp",
      images: JSON.stringify([
        "/products/cazadero-torchiere.webp",
        "/products/cazadero-torchiere-2.webp",
      ]),
      features: [
        "Hand-spun steel body",
        "Warm brass wash interior",
        "Soft indirect uplighting",
        "Foot-step dimmer",
        "UL-listed, LED bulb included",
      ],
      tag: "Steel",
      categoryId: catMap["floor-lamps"],
      isNew: true,
      rating: 4.9,
      reviewCount: 28,
    },

    // Outdoor (3)
    {
      name: "Bodega Outdoor Lantern",
      slug: "bodega-outdoor-lantern",
      description:
        "Solid bronze lantern with thick seeded glass and a weatherproof seal. UL-rated for wet locations. Mount at your entry, porch, or garden wall.",
      price: 395,
      image: "/products/bodega-outdoor-lantern.webp",
      images: JSON.stringify([
        "/products/bodega-outdoor-lantern.webp",
        "/products/bodega-outdoor-lantern-2.webp",
      ]),
      features: [
        "Solid bronze construction",
        "Thick seeded glass panels",
        "Weatherproof seal",
        "Hardwired installation",
        "UL-listed for wet locations",
      ],
      tag: "Bronze",
      categoryId: catMap["outdoor"],
      rating: 4.7,
      reviewCount: 39,
    },
    {
      name: "Sonoma Post Light",
      slug: "sonoma-post-light",
      description:
        "Cast brass post light with a warm honey patina. Fits standard 3-inch posts. Designed to age gracefully in the elements.",
      price: 475,
      image: "/products/sonoma-post-light.webp",
      images: JSON.stringify([
        "/products/sonoma-post-light.webp",
        "/products/sonoma-post-light-2.webp",
      ]),
      features: [
        "Cast brass construction",
        "Warm honey patina",
        "Fits standard 3-inch posts",
        "Hardwired installation",
        "UL-listed for wet locations",
      ],
      tag: "Brass",
      categoryId: catMap["outdoor"],
      rating: 4.8,
      reviewCount: 31,
    },
    {
      name: "Jenner String Lights",
      slug: "jenner-string-lights",
      description:
        "Heavy-duty 48-foot commercial string lights with 12 hand-blown glass globes. Connect up to 5 strands. For patios, pergolas, and party tents.",
      price: 185,
      image: "/products/jenner-string-lights.webp",
      images: JSON.stringify([
        "/products/jenner-string-lights.webp",
        "/products/jenner-string-lights-2.webp",
        "/products/jenner-string-lights-3.webp",
      ]),
      features: [
        "Heavy-duty commercial grade",
        "48-foot strand with 12 globes",
        "Hand-blown glass globes",
        "Connect up to 5 strands (240 ft)",
        "UL-listed, LED compatible",
      ],
      tag: "Commercial",
      categoryId: catMap["outdoor"],
      isNew: true,
      rating: 4.9,
      reviewCount: 55,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
