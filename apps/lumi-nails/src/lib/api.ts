import type {
  Booking,
  CreateBookingInput,
  CreateReviewInput,
  Design,
  DesignFilters,
  Inquiry,
  Review,
  Service,
  Slot,
} from "@/lib/types";
import { delay } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const IMAGES = {
  nude: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
  floral: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=80",
  french: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80",
  chrome: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=80",
  glitter: "https://images.unsplash.com/photo-1604650415941-f0e7b8b0b3f5?auto=format&fit=crop&w=900&q=80",
  pastel: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=900&q=80",
  dark: "https://images.unsplash.com/photo-1610992015732-24448a829d2e?auto=format&fit=crop&w=900&q=80",
  art: "https://images.unsplash.com/photo-1600428877878-1a0fd7f4e0f3?auto=format&fit=crop&w=900&q=80",
  soft: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
  classic: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
  blush: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  gold: "https://images.unsplash.com/photo-1515688594390-b6498264ad4a?auto=format&fit=crop&w=900&q=80",
} as const;

const MOCK_DESIGNS: Design[] = [
  {
    _id: "d1",
    title: "Soft Nude Almond",
    imageUrl: IMAGES.nude,
    category: "Minimal",
    shape: "almond",
    colors: ["nude", "beige"],
    price: 75,
    durationMin: 90,
    tags: ["everyday", "natural"],
    isFeatured: true,
  },
  {
    _id: "d2",
    title: "Blush Petal French",
    imageUrl: IMAGES.french,
    category: "French",
    shape: "almond",
    colors: ["blush", "white"],
    price: 85,
    durationMin: 100,
    tags: ["classic", "bridal"],
    isFeatured: true,
  },
  {
    _id: "d3",
    title: "Champagne Chrome",
    imageUrl: IMAGES.chrome,
    category: "Chrome",
    shape: "coffin",
    colors: ["gold", "champagne"],
    price: 95,
    durationMin: 110,
    tags: ["luxe", "evening"],
    isFeatured: true,
  },
  {
    _id: "d4",
    title: "Garden Floral",
    imageUrl: IMAGES.floral,
    category: "Art",
    shape: "almond",
    colors: ["pink", "green"],
    price: 110,
    durationMin: 130,
    tags: ["floral", "statement"],
    isFeatured: true,
  },
  {
    _id: "d5",
    title: "Midnight Glitter",
    imageUrl: IMAGES.glitter,
    category: "Glitter",
    shape: "stiletto",
    colors: ["black", "silver"],
    price: 105,
    durationMin: 120,
    tags: ["party", "glam"],
    isFeatured: false,
  },
  {
    _id: "d6",
    title: "Pastel Cloud",
    imageUrl: IMAGES.pastel,
    category: "Minimal",
    shape: "square",
    colors: ["lilac", "mint"],
    price: 80,
    durationMin: 95,
    tags: ["soft", "spring"],
    isFeatured: false,
  },
  {
    _id: "d7",
    title: "Mauve Velvet",
    imageUrl: IMAGES.dark,
    category: "Solid",
    shape: "coffin",
    colors: ["mauve", "burgundy"],
    price: 70,
    durationMin: 85,
    tags: ["bold", "autumn"],
    isFeatured: true,
  },
  {
    _id: "d8",
    title: "Pearl Aura",
    imageUrl: IMAGES.soft,
    category: "Aura",
    shape: "almond",
    colors: ["pearl", "pink"],
    price: 90,
    durationMin: 105,
    tags: ["aura", "soft-glam"],
    isFeatured: false,
  },
  {
    _id: "d9",
    title: "Golden Line Art",
    imageUrl: IMAGES.gold,
    category: "Art",
    shape: "square",
    colors: ["nude", "gold"],
    price: 100,
    durationMin: 115,
    tags: ["line-art", "luxe"],
    isFeatured: false,
  },
  {
    _id: "d10",
    title: "Rosé Marble",
    imageUrl: IMAGES.blush,
    category: "Marble",
    shape: "coffin",
    colors: ["rose", "white"],
    price: 98,
    durationMin: 110,
    tags: ["marble", "bridal"],
    isFeatured: true,
  },
  {
    _id: "d11",
    title: "Ivory Classic",
    imageUrl: IMAGES.classic,
    category: "Solid",
    shape: "square",
    colors: ["ivory", "cream"],
    price: 65,
    durationMin: 75,
    tags: ["classic", "clean"],
    isFeatured: false,
  },
  {
    _id: "d12",
    title: "Abstract Bloom",
    imageUrl: IMAGES.art,
    category: "Art",
    shape: "stiletto",
    colors: ["coral", "cream"],
    price: 120,
    durationMin: 140,
    tags: ["abstract", "editorial"],
    isFeatured: false,
  },
];

const MOCK_SERVICES: Service[] = [
  {
    _id: "s1",
    name: "Nail Extensions",
    description:
      "Custom length extensions shaped to your preference with a soft, natural finish.",
    price: 95,
    durationMin: 120,
  },
  {
    _id: "s2",
    name: "Gel Manicure",
    description:
      "Long-wearing gel polish with cuticle care and a glass-smooth shine.",
    price: 55,
    durationMin: 60,
  },
  {
    _id: "s3",
    name: "Acrylic Set",
    description:
      "Durable acrylic overlays or full sets with precise shaping and finish.",
    price: 85,
    durationMin: 110,
  },
  {
    _id: "s4",
    name: "Refill",
    description:
      "Grow-out refill for extensions or acrylics to restore shape and strength.",
    price: 65,
    durationMin: 90,
  },
  {
    _id: "s5",
    name: "Removal",
    description:
      "Gentle soak-off removal with nail recovery oil and light buff.",
    price: 35,
    durationMin: 45,
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    _id: "r1",
    name: "Aria Chen",
    rating: 5,
    comment:
      "The softest studio experience. My almond set lasted three weeks and still looked polished.",
    createdAt: "2026-10-12T14:00:00.000Z",
  },
  {
    _id: "r2",
    name: "Maya Patel",
    rating: 5,
    comment:
      "Hygiene is impeccable and the champagne chrome design was exactly like the gallery photo.",
    createdAt: "2026-09-28T11:20:00.000Z",
  },
  {
    _id: "r3",
    name: "Sofia Reyes",
    rating: 4,
    comment:
      "Beautiful floral art and a calm, luxurious vibe. Booking was easy and on time.",
    createdAt: "2026-09-05T16:45:00.000Z",
  },
  {
    _id: "r4",
    name: "Elena Brooks",
    rating: 5,
    comment:
      "Premium products, gentle technicians, and my gel manicure still has that glass finish.",
    createdAt: "2026-08-19T10:10:00.000Z",
  },
];

let bookingsStore: Booking[] = [];
let reviewsStore: Review[] = [...MOCK_REVIEWS];
let inquiryStore: Inquiry[] = [];

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!API_URL) {
    throw new Error("MOCK_FALLBACK");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function filterDesigns(filters: DesignFilters = {}) {
  return MOCK_DESIGNS.filter((design) => {
    if (filters.featured && !design.isFeatured) return false;
    if (filters.category && design.category !== filters.category) return false;
    if (filters.shape && design.shape !== filters.shape) return false;
    if (
      filters.color &&
      !design.colors.some(
        (c) => c.toLowerCase() === filters.color!.toLowerCase(),
      )
    ) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        design.title,
        design.category,
        design.shape,
        ...design.colors,
        ...design.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function buildSlots(date: string): Slot[] {
  const times = [
    "10:00",
    "11:00",
    "12:00",
    "13:30",
    "15:00",
    "16:30",
    "18:00",
  ];
  const daySeed = date.split("-").reduce((acc, part) => acc + Number(part), 0);
  return times.map((time, index) => ({
    time,
    available: (daySeed + index) % 4 !== 0,
  }));
}

export async function getDesigns(filters: DesignFilters = {}): Promise<Design[]> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    const query = params.toString();
    return await request<Design[]>(`/designs${query ? `?${query}` : ""}`);
  } catch {
    await delay();
    return filterDesigns(filters);
  }
}

export async function getDesignById(id: string): Promise<Design | null> {
  try {
    return await request<Design>(`/designs/${id}`);
  } catch {
    await delay();
    return MOCK_DESIGNS.find((d) => d._id === id) ?? null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    return await request<string[]>("/categories");
  } catch {
    await delay();
    return Array.from(new Set(MOCK_DESIGNS.map((d) => d.category))).sort();
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    return await request<Service[]>("/services");
  } catch {
    await delay();
    return MOCK_SERVICES;
  }
}

export async function getSlots(date: string): Promise<Slot[]> {
  try {
    return await request<Slot[]>(`/slots?date=${encodeURIComponent(date)}`);
  } catch {
    await delay();
    return buildSlots(date);
  }
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  try {
    return await request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch {
    await delay(600);
    const booking: Booking = {
      _id: `bk_${Date.now().toString(36)}`,
      serviceId: input.serviceId,
      designId: input.designId,
      date: input.date,
      time: input.time,
      name: input.name,
      phone: input.phone,
      notes: input.notes || "",
      status: "pending",
    };
    bookingsStore = [booking, ...bookingsStore];
    return booking;
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    return await request<Booking>(`/bookings/${id}`);
  } catch {
    await delay();
    return bookingsStore.find((b) => b._id === id) ?? null;
  }
}

export async function createInquiry(input: Inquiry): Promise<{ ok: true }> {
  try {
    return await request<{ ok: true }>("/inquiries", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch {
    await delay(500);
    inquiryStore = [input, ...inquiryStore];
    return { ok: true };
  }
}

export async function getReviews(): Promise<Review[]> {
  try {
    return await request<Review[]>("/reviews");
  } catch {
    await delay();
    return [...reviewsStore].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  try {
    return await request<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch {
    await delay(500);
    const review: Review = {
      _id: `rv_${Date.now().toString(36)}`,
      name: input.name,
      rating: input.rating,
      comment: input.comment,
      createdAt: new Date().toISOString(),
    };
    reviewsStore = [review, ...reviewsStore];
    return review;
  }
}
