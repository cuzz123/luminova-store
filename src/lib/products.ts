/* ------------------------------------------------------------------ */
/*  Flint & Beam — Static Product Catalog                              */
/*  22 products across 6 categories with mock reviews.                */
/* ------------------------------------------------------------------ */

const IMG = {
  chandelier: "https://platform-outputs.agnes-ai.space/images/t2i/1ce244ee5f4d4ec78bbc779a9bdeff9e.png",
  pendantGlass: "https://platform-outputs.agnes-ai.space/images/t2i/dee9109f8fb34949956a22cc32eb23f4.png",
  pendantRattan: "https://platform-outputs.agnes-ai.space/images/t2i/71677c4839ad4876a193587f52f673fe.png",
  sconce: "https://platform-outputs.agnes-ai.space/images/t2i/91c64ae16ce145d38f8270f76db9962f.png",
  tableCeramic: "https://platform-outputs.agnes-ai.space/images/t2i/36b7f8ff72134f468c5ac093e98fba63.png",
  tableConcrete: "https://platform-outputs.agnes-ai.space/images/t2i/50e95d15799b49c1bcaaa37b467a67f8.png",
  tableMarble: "https://platform-outputs.agnes-ai.space/images/t2i/b683eb9bf24c4066a7560ba579b6f732.png",
  chandelierAlt: "https://platform-outputs.agnes-ai.space/images/t2i/31d085d0f6524b6c89940b2fe07024ed.png",
};
const PLACEHOLDER = IMG.chandelier;

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug?: string;
  sku?: string;
  description: string;
  price: number;
  compareAt?: number | null;
  image: string;
  images: string[];
  features: string[];
  features_specs?: string[];
  specs?: string;
  tag?: string;
  tags?: string[];
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface Category {
  name: string;
  slug: string;
  description?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

/* ------------------------------------------------------------------ */
/*  Products                                                          */
/* ------------------------------------------------------------------ */

export const PRODUCTS: Product[] = [
  // ─── Pendant Lights ──────────────────────────────────────────────
  {
    id: "prod_001",
    name: "Aurora Glass Pendant",
    slug: "aurora-glass-pendant",
    category: "pendant-lights",
    description:
      "Hand-blown smoked glass pendant with brass fittings. The Aurora casts a warm, diffused glow perfect for kitchen islands and dining nooks. Each piece is unique due to the artisanal glass-blowing process.",
    price: 189.0,
    compareAt: 229.0,
    image: IMG.pendantGlass,
    images: [IMG.pendantGlass, IMG.pendantGlass, IMG.pendantGlass],
    features: [
      "Hand-blown smoked glass",
      "Solid brass hardware",
      'Adjustable 60" cord',
      "Compatible with dimmer switches",
      "E26 socket, 60W max",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: "prod_002",
    name: "Midtown Cone Pendant",
    slug: "midtown-cone-pendant",
    category: "pendant-lights",
    description:
      "A sleek aluminum cone pendant in matte black. Minimalist geometry meets warm light — ideal for modern kitchens, bar counters, and commercial spaces.",
    price: 149.0,
    compareAt: undefined,
    image: IMG.pendantGlass,
    images: [IMG.pendantGlass, IMG.pendantGlass, IMG.pendantGlass],
    features: [
      "Powder-coated aluminum shade",
      "Matte black finish",
      'Adjustable 72" cord',
      "Dimmable with compatible bulbs",
      "E26 socket, 40W max",
    ],
    tag: "New Arrival",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.6,
    reviewCount: 87,
  },
  {
    id: "prod_003",
    name: "Rattan Woven Pendant",
    slug: "rattan-woven-pendant",
    category: "pendant-lights",
    description:
      "Natural rattan hand-woven into a globe silhouette. Brings organic texture and coastal warmth to bedrooms, reading nooks, and boho-inspired interiors.",
    price: 119.0,
    compareAt: 145.0,
    image: IMG.pendantGlass,
    images: [IMG.pendantGlass, IMG.pendantGlass, IMG.pendantGlass],
    features: [
      "Hand-woven natural rattan",
      "Steel inner frame",
      '48" adjustable cord',
      "E26 socket, 40W max",
      "Indoor use only",
    ],
    tag: undefined,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 63,
  },
  {
    id: "prod_004",
    name: "Prism Faceted Pendant",
    slug: "prism-faceted-pendant",
    category: "pendant-lights",
    description:
      "A faceted glass shade that refracts light like cut crystal. The Prism pendant doubles as a sculptural statement piece, even when the light is off.",
    price: 219.0,
    image: IMG.pendantGlass,
    images: [IMG.pendantGlass, IMG.pendantGlass, IMG.pendantGlass],
    features: [
      "Faceted crystal-cut glass",
      "Brass canopy and stem",
      'Adjustable 60" rod',
      "Dimmable",
      "G9 socket, 25W max",
    ],
    tag: "Limited Edition",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
  },

  // ─── Table Lamps ─────────────────────────────────────────────────
  {
    id: "prod_005",
    name: "Studio Ceramic Table Lamp",
    slug: "studio-ceramic-table-lamp",
    category: "table-lamps",
    description:
      "Wheel-thrown ceramic base with a reactive glaze in sand drift. Each lamp varies slightly in pattern, making yours truly one of a kind. Topped with a natural linen drum shade.",
    price: 165.0,
    compareAt: 195.0,
    image: IMG.tableCeramic,
    images: [IMG.tableCeramic, IMG.tableCeramic, IMG.tableCeramic],
    features: [
      "Hand-thrown ceramic base",
      "Reactive sand-drift glaze",
      "Natural linen drum shade",
      "Inline dimmer switch",
      "E26 socket, 60W max",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 198,
  },
  {
    id: "prod_006",
    name: "Mesa Concrete Table Lamp",
    slug: "mesa-concrete-table-lamp",
    category: "table-lamps",
    description:
      "Raw concrete paired with warm walnut and a linen shade. The Mesa lamp is a study in material contrast — brutalist yet inviting.",
    price: 139.0,
    image: IMG.tableCeramic,
    images: [IMG.tableCeramic, IMG.tableCeramic, IMG.tableCeramic],
    features: [
      "Cast concrete base",
      "Oiled walnut accent ring",
      "Linen blend shade",
      "Rotary switch on socket",
      "E26 socket, 60W max",
    ],
    tag: undefined,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.4,
    reviewCount: 56,
  },
  {
    id: "prod_007",
    name: "Nova Marble Table Lamp",
    slug: "nova-marble-table-lamp",
    category: "table-lamps",
    description:
      "A solid Carrara marble cylinder carved from a single block. The Nova's timeless silhouette fits bedside tables, consoles, and desks alike.",
    price: 245.0,
    compareAt: 295.0,
    image: IMG.tableCeramic,
    images: [IMG.tableCeramic, IMG.tableCeramic, IMG.tableCeramic],
    features: [
      "Solid Carrara marble",
      "Each piece has unique veining",
      "Brass hardware",
      "Linen shade included",
      "E26 socket, 60W max",
    ],
    tag: "Premium",
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 42,
  },

  // ─── Floor Lamps ─────────────────────────────────────────────────
  {
    id: "prod_008",
    name: "Arc Brass Floor Lamp",
    slug: "arc-brass-floor-lamp",
    category: "floor-lamps",
    description:
      "A sweeping arched silhouette in polished brass. The Arc reaches gracefully over sofas and sectionals, delivering focused reading light with mid-century drama.",
    price: 349.0,
    compareAt: 429.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "Polished brass finish",
      "Heavy marble base (22 lbs)",
      "Adjustable shade angle",
      "Foot pedal on/off switch",
      "E26 socket, 60W max",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.6,
    reviewCount: 114,
  },
  {
    id: "prod_009",
    name: "Tripod Walnut Floor Lamp",
    slug: "tripod-walnut-floor-lamp",
    category: "floor-lamps",
    description:
      "Three sculpted walnut legs support a crisp drum shade. Architectural and warm, the Tripod anchors any living room corner with quiet confidence.",
    price: 279.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "Solid walnut legs",
      "Brass hinge details",
      "Natural linen drum shade",
      "Foot switch",
      "E26 socket, 100W max",
    ],
    tag: undefined,
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 73,
  },
  {
    id: "prod_010",
    name: "Slimline LED Task Lamp",
    slug: "slimline-led-task-lamp",
    category: "floor-lamps",
    description:
      "A minimalist LED floor lamp with an ultra-thin profile. Touch-sensitive dimming and adjustable color temperature — from warm candlelight to crisp daylight.",
    price: 199.0,
    compareAt: undefined,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "Integrated 24W LED array",
      "2700K–5000K adjustable CCT",
      "Touch dimmer with memory",
      "Aluminum + steel construction",
      '10" x 48" panel',
    ],
    tag: "Energy Efficient",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 38,
  },

  // ─── Wall Sconces ────────────────────────────────────────────────
  {
    id: "prod_011",
    name: "Alcove Plaster Sconce",
    slug: "alcove-plaster-sconce",
    category: "wall-sconces",
    description:
      "Hand-applied plaster finish in warm ivory. The Alcove washes walls with a soft upward and downward glow — perfect for hallways, bathrooms, and flanking a headboard.",
    price: 129.0,
    compareAt: 159.0,
    image: IMG.sconce,
    images: [IMG.sconce, IMG.sconce, IMG.sconce],
    features: [
      "Hand-finished plaster",
      "Dual-direction light (up + down)",
      "Hardwired installation",
      "Dimmable",
      "2x G9 sockets, 25W max each",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 161,
  },
  {
    id: "prod_012",
    name: "Flute Brass Sconce",
    slug: "flute-brass-sconce",
    category: "wall-sconces",
    description:
      "A ribbed brass cylinder that casts a focused beam downward. Ideal as bedside reading sconces or flanking a bathroom mirror for warm, flattering light.",
    price: 109.0,
    image: IMG.sconce,
    images: [IMG.sconce, IMG.sconce, IMG.sconce],
    features: [
      "Ribbed solid brass body",
      "Unlacquered — will patina over time",
      "Hardwired or plug-in option",
      "G9 socket, 25W max",
      "360° swivel head",
    ],
    tag: undefined,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.3,
    reviewCount: 49,
  },
  {
    id: "prod_013",
    name: "Cove Picture Light",
    slug: "cove-picture-light",
    category: "wall-sconces",
    description:
      "A classic library-style picture light in antique brass. The Cove directs a wide, even beam across artwork or bookshelves — art gallery quality at home.",
    price: 179.0,
    compareAt: 219.0,
    image: IMG.sconce,
    images: [IMG.sconce, IMG.sconce, IMG.sconce],
    features: [
      "Antique brass finish",
      'Adjustable arm (12"–18" extension)',
      "Integrated LED, 3000K",
      "Hardwired installation",
      "CRI 95+ for true color rendering",
    ],
    tag: "Premium",
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 27,
  },
  {
    id: "prod_014",
    name: "Dune Fiber Art Sconce",
    slug: "dune-fiber-art-sconce",
    category: "wall-sconces",
    description:
      "Woven abaca fiber stretched over a curved frame. The Dune filters light through natural fibers, casting intricate shadow patterns across the wall.",
    price: 149.0,
    image: IMG.sconce,
    images: [IMG.sconce, IMG.sconce, IMG.sconce],
    features: [
      "Hand-woven abaca fiber",
      "Rattan frame",
      "Hardwired only",
      "Dimmable",
      "E12 socket, 15W max",
    ],
    tag: "Artisan",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.6,
    reviewCount: 18,
  },

  // ─── Chandeliers ─────────────────────────────────────────────────
  {
    id: "prod_015",
    name: "Cascade Globe Chandelier",
    slug: "cascade-globe-chandelier",
    category: "chandeliers",
    image: IMG.chandelier,
    description:
      "Five opal glass globes cascade at staggered heights from a brass canopy. The Cascade is a modern centerpiece for dining rooms, grand entryways, and stairwells.",
    price: 499.0,
    compareAt: 599.0,
    images: [IMG.chandelier, IMG.chandelier, IMG.chandelier],
    features: [
      "5 opal glass globes",
      "Brass canopy and arms",
      "Adjustable drop heights",
      "Dimmable",
      "5x E12 sockets, 40W max each",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 93,
  },
  {
    id: "prod_016",
    name: "Sputnik Starburst Chandelier",
    slug: "sputnik-starburst-chandelier",
    category: "chandeliers",
    image: IMG.chandelier,
    description:
      "A mid-century starburst silhouette with 12 brass arms radiating from a central sphere. Fitted with globe bulbs for a warm, constellation-like effect.",
    price: 389.0,
    images: [IMG.chandelier, IMG.chandelier, IMG.chandelier],
    features: [
      "12-arm brass frame",
      "Matte black + brass finish options",
      "Includes 12 G16.5 globe bulbs",
      'Adjustable downrod (6"–36")',
      "Dimmable",
    ],
    tag: "Statement Piece",
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 64,
  },
  {
    id: "prod_017",
    name: "Luna Ring Chandelier",
    slug: "luna-ring-chandelier",
    category: "chandeliers",
    image: IMG.chandelier,
    description:
      "An LED ring suspended by nearly invisible cables. The Luna floats like a halo above dining tables, delivering perfectly even, glare-free illumination.",
    price: 449.0,
    compareAt: undefined,
    images: [IMG.chandelier, IMG.chandelier, IMG.chandelier],
    features: [
      "Integrated 48W LED, 3000K",
      '36" diameter ring',
      "Adjustable cable suspension",
      "Touch dimmer included",
      "CRI 90+",
    ],
    tag: "Modern Minimalist",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 41,
  },

  // ─── Outdoor Lighting ────────────────────────────────────────────
  {
    id: "prod_018",
    name: "Lantern Path Light",
    slug: "lantern-path-light",
    category: "outdoor-lighting",
    description:
      "A classic lantern-style path light in weatherproof bronze. Perfect for lining walkways, garden borders, and driveways with a warm welcome.",
    price: 89.0,
    compareAt: 109.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "Die-cast aluminum, bronze finish",
      "IP65 weatherproof rating",
      "12V low-voltage system",
      "Clear seeded glass panels",
      "GU5.3 socket, LED compatible",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.4,
    reviewCount: 205,
  },
  {
    id: "prod_019",
    name: "Dune Bollard Light",
    slug: "dune-bollard-light",
    category: "outdoor-lighting",
    description:
      "A sleek cylindrical bollard with a 360-degree light aperture. The Dune defines perimeters and driveways with a clean, architectural glow.",
    price: 119.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "304 stainless steel, brushed finish",
      "IP65 weatherproof",
      "12V low-voltage",
      "360° light output",
      "Integrated 8W LED, 3000K",
    ],
    tag: undefined,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.3,
    reviewCount: 52,
  },
  {
    id: "prod_020",
    name: "Haven Outdoor Wall Light",
    slug: "haven-outdoor-wall-light",
    category: "outdoor-lighting",
    description:
      "A sturdy wall-mounted fixture in matte black. The Haven flanks front doors and patios, projecting warm light downward while keeping the bulb hidden from view.",
    price: 99.0,
    compareAt: 129.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "Powder-coated aluminum",
      "IP54 weatherproof",
      "Downward light direction",
      "Hardwired, 120V",
      "E26 socket, 60W max",
    ],
    tag: undefined,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 78,
  },
  {
    id: "prod_021",
    name: "Ember Fire Pit Table Lamp",
    slug: "ember-fire-pit-table-lamp",
    category: "outdoor-lighting",
    description:
      "A rechargeable, portable table lamp inspired by campfire embers. IP65 rated, dimmable, and built for dinner al fresco late into the evening.",
    price: 79.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "Rechargeable, 20-hour battery life",
      "IP65 waterproof",
      "3-stage touch dimmer",
      "Aluminum body",
      "USB-C charging",
    ],
    tag: "Portable",
    isBestSeller: false,
    isNew: true,
    isActive: true,
    inStock: true,
    rating: 4.6,
    reviewCount: 34,
  },
  {
    id: "prod_022",
    name: "String Globe Festoon Set",
    slug: "string-globe-festoon-set",
    category: "outdoor-lighting",
    description:
      "A 48-foot festoon string with 15 shatterproof LED globes. Transform any backyard, patio, or event space into a warm, festive setting in minutes.",
    price: 129.0,
    compareAt: 159.0,
    image: IMG.chandelierAlt,
    images: [IMG.chandelierAlt, IMG.chandelierAlt, IMG.chandelierAlt],
    features: [
      "48 ft string, 15 sockets",
      "Shatterproof PET globes",
      "2W LED bulbs included, 2700K",
      "IP44 weather resistant",
      "End-to-end connectable",
    ],
    tag: "Bestseller",
    isBestSeller: true,
    isNew: false,
    isActive: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 276,
  },
];

/* ------------------------------------------------------------------ */
/*  Categories                                                        */
/* ------------------------------------------------------------------ */

export const CATEGORIES: Category[] = [
  {
    name: "Pendant Lights",
    slug: "pendant-lights",
    description:
      "Suspended fixtures that define a space. From hand-blown glass to woven rattan, our pendant lights bring focus and warmth to kitchens, dining areas, and entryways.",
  },
  {
    name: "Table Lamps",
    slug: "table-lamps",
    description:
      "Sculptural light for desks, nightstands, and consoles. Ceramic, concrete, marble — each lamp is a functional piece of art.",
  },
  {
    name: "Floor Lamps",
    slug: "floor-lamps",
    description:
      "Tall lighting that shapes a room's atmosphere. Arcing brass, architectural tripods, and slimline LEDs to anchor your space.",
  },
  {
    name: "Wall Sconces",
    slug: "wall-sconces",
    description:
      "Light that hugs the wall. Plaster, brass, and fiber art sconces that save surface space while adding texture and depth.",
  },
  {
    name: "Chandeliers",
    slug: "chandeliers",
    description:
      "Statement fixtures for dining rooms, grand entryways, and stairwells. Cascading globes, starbursts, and floating rings.",
  },
  {
    name: "Outdoor Lighting",
    slug: "outdoor-lighting",
    description:
      "Weatherproof fixtures that extend your living space outdoors. Path lights, bollards, wall lights, and portable lamps for patios and gardens.",
  },
];

/* ------------------------------------------------------------------ */
/*  Reviews                                                           */
/* ------------------------------------------------------------------ */

export const REVIEWS: Review[] = [
  {
    id: "rev_001",
    productId: "prod_001",
    author: "Claire M.",
    avatar: IMG.chandelierAlt,
    rating: 5,
    title: "Absolutely stunning over our island",
    body: "We hung two of these over our kitchen island and they completely transformed the space. The smoked glass is even more beautiful in person — warm light without any harsh glare. Our contractor said the brass hardware was top quality and easy to install.",
    date: "2026-05-12",
  },
  {
    id: "rev_002",
    productId: "prod_008",
    author: "David R.",
    avatar: IMG.chandelierAlt,
    rating: 5,
    title: "The perfect reading lamp",
    body: "The Arc reaches over our sectional perfectly. The marble base is seriously heavy (in a good way), so no wobbling. Took about 20 minutes to assemble. The brass is polished but not too shiny — just right.",
    date: "2026-06-02",
  },
  {
    id: "rev_003",
    productId: "prod_011",
    author: "Sarah L.",
    avatar: IMG.chandelierAlt,
    rating: 4,
    title: "Beautiful plaster finish, a bit delicate",
    body: "We installed four of these in our hallway and they look like they're original to our 1920s home. The plaster finish is gorgeous. Only giving 4 stars because one arrived with a tiny chip — customer service replaced it immediately, but worth noting they are delicate.",
    date: "2026-04-18",
  },
  {
    id: "rev_004",
    productId: "prod_015",
    author: "James K.",
    avatar: IMG.chandelierAlt,
    rating: 5,
    title: "Dining room showstopper",
    body: "We get compliments on this chandelier from everyone who comes over. The staggered globes are dramatic but not overwhelming. Paired it with a dimmer switch and it's perfect for both dinner parties and quiet weeknight meals.",
    date: "2026-06-15",
  },
  {
    id: "rev_005",
    productId: "prod_005",
    author: "Maya T.",
    avatar: IMG.chandelierAlt,
    rating: 5,
    title: "One-of-a-kind ceramic lamp",
    body: "I love that each lamp is unique because of the reactive glaze. Mine has more blue tones in the drips than my friend's, and we both prefer our own — that's the beauty of handmade. The linen shade is high quality too.",
    date: "2026-03-28",
  },
  {
    id: "rev_006",
    productId: "prod_022",
    author: "Tom & Elena G.",
    avatar: IMG.chandelierAlt,
    rating: 5,
    title: "Our patio is now our favorite room",
    body: "We strung two sets end-to-end across our whole backyard. The warm glow is exactly what we wanted — cozy but bright enough to eat by. They've survived two thunderstorms already with no issues. Best patio purchase we've made.",
    date: "2026-05-30",
  },
];

/* ------------------------------------------------------------------ */
/*  Helper functions                                                  */
/* ------------------------------------------------------------------ */

/** Get a single product by slug. */
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Get a single product by ID. */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Get all products in a category by slug. */
export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

/** Get featured / bestseller products. */
export function getBestSellers(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
}

/** Get new arrivals. */
export function getNewArrivals(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.isNew).slice(0, limit);
}

/** Get related products (same category, excluding the given product ID). */
export function getRelatedProducts(
  productId: string,
  limit = 4,
): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== productId,
  ).slice(0, limit);
}

/** Get reviews for a given product ID. */
export function getReviewsByProduct(productId: string): Review[] {
  return REVIEWS.filter((r) => r.productId === productId);
}

/** Get a category by slug. */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Search products by name or description. */
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q)),
  );
}
