export const SLOT_TIMES = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const SERVICES = [
  {
    id: "s1",
    name: "Nail Extensions",
    description:
      "Custom length extensions shaped to your preference with a soft, natural finish.",
    price: 95,
    durationMin: 120,
  },
  {
    id: "s2",
    name: "Gel Manicure",
    description:
      "Long-wearing gel polish with cuticle care and a glass-smooth shine.",
    price: 55,
    durationMin: 60,
  },
  {
    id: "s3",
    name: "Acrylic Set",
    description:
      "Durable acrylic overlays or full sets with precise shaping and finish.",
    price: 85,
    durationMin: 110,
  },
  {
    id: "s4",
    name: "Refill",
    description:
      "Grow-out refill for extensions or acrylics to restore shape and strength.",
    price: 65,
    durationMin: 90,
  },
  {
    id: "s5",
    name: "Removal",
    description:
      "Gentle soak-off removal with nail recovery oil and light buff.",
    price: 35,
    durationMin: 45,
  },
  {
    id: "s6",
    name: "Nail Art Add-on",
    description:
      "Hand-painted details, chrome, florals, or line art layered onto your set.",
    price: 25,
    durationMin: 30,
  },
] as const;

export const CATEGORIES = [
  { id: "cat_minimal", name: "Minimal", slug: "minimal" },
  { id: "cat_french", name: "French", slug: "french" },
  { id: "cat_chrome", name: "Chrome", slug: "chrome" },
  { id: "cat_art", name: "Art", slug: "art" },
  { id: "cat_glitter", name: "Glitter", slug: "glitter" },
  { id: "cat_solid", name: "Solid", slug: "solid" },
  { id: "cat_marble", name: "Marble", slug: "marble" },
  { id: "cat_aura", name: "Aura", slug: "aura" },
] as const;

/** Unsplash sources used once during seed to populate uploads/designs */
export const DESIGN_IMAGE_SOURCES = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1610992015732-24448a829d2e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515688594390-b6498264ad4a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
] as const;

type Shape = "almond" | "square" | "coffin" | "stiletto";

export const DESIGNS: Array<{
  id: string;
  title: string;
  categoryId: string;
  category: string;
  shape: Shape;
  colors: string[];
  price: number;
  durationMin: number;
  tags: string[];
  isFeatured: boolean;
  imageIndex: number;
}> = [
  { id: "d01", title: "Soft Nude Almond", categoryId: "cat_minimal", category: "Minimal", shape: "almond", colors: ["nude", "beige"], price: 75, durationMin: 90, tags: ["everyday", "natural"], isFeatured: true, imageIndex: 0 },
  { id: "d02", title: "Blush Petal French", categoryId: "cat_french", category: "French", shape: "almond", colors: ["blush", "white"], price: 85, durationMin: 100, tags: ["classic", "bridal"], isFeatured: true, imageIndex: 1 },
  { id: "d03", title: "Champagne Chrome", categoryId: "cat_chrome", category: "Chrome", shape: "coffin", colors: ["gold", "champagne"], price: 95, durationMin: 110, tags: ["luxe", "evening"], isFeatured: true, imageIndex: 2 },
  { id: "d04", title: "Garden Floral", categoryId: "cat_art", category: "Art", shape: "almond", colors: ["pink", "green"], price: 110, durationMin: 130, tags: ["floral", "statement"], isFeatured: true, imageIndex: 3 },
  { id: "d05", title: "Midnight Glitter", categoryId: "cat_glitter", category: "Glitter", shape: "stiletto", colors: ["black", "silver"], price: 105, durationMin: 120, tags: ["party", "glam"], isFeatured: false, imageIndex: 4 },
  { id: "d06", title: "Pastel Cloud", categoryId: "cat_minimal", category: "Minimal", shape: "square", colors: ["lilac", "mint"], price: 80, durationMin: 95, tags: ["soft", "spring"], isFeatured: false, imageIndex: 5 },
  { id: "d07", title: "Mauve Velvet", categoryId: "cat_solid", category: "Solid", shape: "coffin", colors: ["mauve", "burgundy"], price: 70, durationMin: 85, tags: ["bold", "autumn"], isFeatured: true, imageIndex: 4 },
  { id: "d08", title: "Pearl Aura", categoryId: "cat_aura", category: "Aura", shape: "almond", colors: ["pearl", "pink"], price: 90, durationMin: 105, tags: ["aura", "soft-glam"], isFeatured: false, imageIndex: 6 },
  { id: "d09", title: "Golden Line Art", categoryId: "cat_art", category: "Art", shape: "square", colors: ["nude", "gold"], price: 100, durationMin: 115, tags: ["line-art", "luxe"], isFeatured: false, imageIndex: 7 },
  { id: "d10", title: "Rosé Marble", categoryId: "cat_marble", category: "Marble", shape: "coffin", colors: ["rose", "white"], price: 98, durationMin: 110, tags: ["marble", "bridal"], isFeatured: true, imageIndex: 8 },
  { id: "d11", title: "Ivory Classic", categoryId: "cat_solid", category: "Solid", shape: "square", colors: ["ivory", "cream"], price: 65, durationMin: 75, tags: ["classic", "clean"], isFeatured: false, imageIndex: 0 },
  { id: "d12", title: "Abstract Bloom", categoryId: "cat_art", category: "Art", shape: "stiletto", colors: ["coral", "cream"], price: 120, durationMin: 140, tags: ["abstract", "editorial"], isFeatured: false, imageIndex: 3 },
  { id: "d13", title: "Milk Bath Square", categoryId: "cat_minimal", category: "Minimal", shape: "square", colors: ["milk", "sheer"], price: 68, durationMin: 80, tags: ["sheer", "clean"], isFeatured: false, imageIndex: 5 },
  { id: "d14", title: "Classic Tip Coffin", categoryId: "cat_french", category: "French", shape: "coffin", colors: ["nude", "white"], price: 88, durationMin: 105, tags: ["french", "classic"], isFeatured: false, imageIndex: 1 },
  { id: "d15", title: "Mirror Silver", categoryId: "cat_chrome", category: "Chrome", shape: "almond", colors: ["silver"], price: 99, durationMin: 115, tags: ["chrome", "party"], isFeatured: true, imageIndex: 2 },
  { id: "d16", title: "Cherry Micro Dot", categoryId: "cat_art", category: "Art", shape: "almond", colors: ["red", "cream"], price: 92, durationMin: 110, tags: ["dots", "playful"], isFeatured: false, imageIndex: 9 },
  { id: "d17", title: "Dusty Rose Solid", categoryId: "cat_solid", category: "Solid", shape: "almond", colors: ["rose"], price: 60, durationMin: 70, tags: ["solid", "soft"], isFeatured: false, imageIndex: 8 },
  { id: "d18", title: "Opal Glitter Fade", categoryId: "cat_glitter", category: "Glitter", shape: "coffin", colors: ["opal", "pink"], price: 108, durationMin: 125, tags: ["glitter", "fade"], isFeatured: false, imageIndex: 6 },
  { id: "d19", title: "Ink Swirl Marble", categoryId: "cat_marble", category: "Marble", shape: "stiletto", colors: ["black", "white"], price: 115, durationMin: 135, tags: ["marble", "editorial"], isFeatured: false, imageIndex: 4 },
  { id: "d20", title: "Sunset Aura", categoryId: "cat_aura", category: "Aura", shape: "coffin", colors: ["orange", "pink"], price: 94, durationMin: 110, tags: ["aura", "summer"], isFeatured: true, imageIndex: 5 },
  { id: "d21", title: "Sage Minimal", categoryId: "cat_minimal", category: "Minimal", shape: "almond", colors: ["sage"], price: 72, durationMin: 85, tags: ["green", "calm"], isFeatured: false, imageIndex: 0 },
  { id: "d22", title: "Berry French", categoryId: "cat_french", category: "French", shape: "square", colors: ["berry", "nude"], price: 86, durationMin: 100, tags: ["french", "berry"], isFeatured: false, imageIndex: 1 },
  { id: "d23", title: "Rose Gold Chrome", categoryId: "cat_chrome", category: "Chrome", shape: "square", colors: ["rose-gold"], price: 102, durationMin: 115, tags: ["chrome", "bridal"], isFeatured: false, imageIndex: 2 },
  { id: "d24", title: "Botanical Sketch", categoryId: "cat_art", category: "Art", shape: "almond", colors: ["green", "nude"], price: 118, durationMin: 140, tags: ["botanical", "art"], isFeatured: false, imageIndex: 3 },
  { id: "d25", title: "Crystal Dust", categoryId: "cat_glitter", category: "Glitter", shape: "almond", colors: ["clear", "crystal"], price: 112, durationMin: 130, tags: ["crystal", "bridal"], isFeatured: false, imageIndex: 7 },
  { id: "d26", title: "Espresso Solid", categoryId: "cat_solid", category: "Solid", shape: "coffin", colors: ["brown"], price: 62, durationMin: 75, tags: ["solid", "autumn"], isFeatured: false, imageIndex: 4 },
];

export const REVIEWS = [
  { id: "r1", name: "Aria Chen", rating: 5, comment: "The softest studio experience. My almond set lasted three weeks and still looked polished.", createdAt: "2026-10-12T14:00:00.000Z", approved: true },
  { id: "r2", name: "Maya Patel", rating: 5, comment: "Hygiene is impeccable and the champagne chrome design was exactly like the gallery photo.", createdAt: "2026-09-28T11:20:00.000Z", approved: true },
  { id: "r3", name: "Sofia Reyes", rating: 4, comment: "Beautiful floral art and a calm, luxurious vibe. Booking was easy and on time.", createdAt: "2026-09-05T16:45:00.000Z", approved: true },
  { id: "r4", name: "Elena Brooks", rating: 5, comment: "Premium products, gentle technicians, and my gel manicure still has that glass finish.", createdAt: "2026-08-19T10:10:00.000Z", approved: true },
  { id: "r5", name: "Nora Kim", rating: 5, comment: "Loved the sunset aura set — photos don’t do it justice in person.", createdAt: "2026-08-01T09:00:00.000Z", approved: true },
  { id: "r6", name: "Priya Shah", rating: 4, comment: "Refill was seamless and the studio smells like a quiet spa.", createdAt: "2026-07-22T15:30:00.000Z", approved: true },
  { id: "r7", name: "Hannah Lee", rating: 5, comment: "Admin booked me for a bridal trial and every detail was perfect.", createdAt: "2026-07-10T12:00:00.000Z", approved: true },
  { id: "r8", name: "Zoe Martin", rating: 5, comment: "Longest lasting acrylic I’ve had. Will only come to Lumi now.", createdAt: "2026-06-28T18:20:00.000Z", approved: true },
  { id: "r9", name: "Ivy Chen", rating: 4, comment: "Nail art add-on was worth every dollar — delicate and precise.", createdAt: "2026-06-14T11:11:00.000Z", approved: true },
  { id: "r10", name: "Lila Ortiz", rating: 5, comment: "From inquiry to appointment, everything felt polished and kind.", createdAt: "2026-05-30T13:45:00.000Z", approved: true },
] as const;
