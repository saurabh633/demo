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
import { mediaUrl } from "@/lib/media";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Start the API and set it to http://localhost:8080",
    );
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function withMedia(design: Design): Design {
  return { ...design, imageUrl: mediaUrl(design.imageUrl) };
}

export async function getDesigns(filters: DesignFilters = {}): Promise<Design[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  const data = await request<Design[]>(`/designs${query ? `?${query}` : ""}`);
  return data.map(withMedia);
}

export async function getDesignById(id: string): Promise<Design | null> {
  try {
    const design = await request<Design>(`/designs/${id}`);
    return withMedia(design);
  } catch (err: any) {
    if (String(err?.message || "").toLowerCase().includes("not found")) {
      return null;
    }
    throw err;
  }
}

export async function getCategories(): Promise<string[]> {
  return request<string[]>("/categories");
}

export async function getServices(): Promise<Service[]> {
  return request<Service[]>("/services");
}

export async function getSlots(date: string): Promise<Slot[]> {
  return request<Slot[]>(`/slots?date=${encodeURIComponent(date)}`);
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    return await request<Booking>(`/bookings/${id}`);
  } catch (err: any) {
    if (String(err?.message || "").toLowerCase().includes("not found")) {
      return null;
    }
    throw err;
  }
}

export async function createInquiry(input: Inquiry): Promise<{ ok: true }> {
  return request<{ ok: true }>("/inquiries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getReviews(): Promise<Review[]> {
  return request<Review[]>("/reviews");
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  return request<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Admin API helpers */
export const adminApi = {
  login(email: string, password: string) {
    return request<{ ok: true; email: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout() {
    return request<{ ok: true }>("/admin/logout", { method: "POST" });
  },
  me() {
    return request<{ email: string; role: string }>("/admin/me");
  },
  dashboard() {
    return request<{
      today: Booking[];
      pendingCount: number;
      unreadInquiries: number;
      designsCount: number;
    }>("/admin/dashboard");
  },
  bookings(params: Record<string, string | number | undefined> = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") q.set(k, String(v));
    });
    const qs = q.toString();
    return request<{
      items: Booking[];
      page: number;
      limit: number;
      total: number;
    }>(`/admin/bookings${qs ? `?${qs}` : ""}`);
  },
  createBooking(input: CreateBookingInput & { status?: string }) {
    return request<Booking>("/admin/bookings", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updateBookingStatus(id: string, status: string) {
    return request<Booking>(`/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  designs(page = 1) {
    return request<{
      items: Design[];
      page: number;
      total: number;
    }>(`/admin/designs?page=${page}`);
  },
  async createDesign(form: FormData) {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
    const res = await fetch(`${API_URL}/admin/designs`, {
      method: "POST",
      body: form,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return withMedia(await res.json());
  },
  async updateDesign(id: string, form: FormData) {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
    const res = await fetch(`${API_URL}/admin/designs/${id}`, {
      method: "PUT",
      body: form,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return withMedia(await res.json());
  },
  deleteDesign(id: string) {
    return request<void>(`/admin/designs/${id}`, { method: "DELETE" });
  },
  services() {
    return request<Service[]>("/admin/services");
  },
  createService(input: Omit<Service, "_id">) {
    return request<Service>("/admin/services", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updateService(id: string, input: Omit<Service, "_id">) {
    return request<Service>(`/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  deleteService(id: string) {
    return request<void>(`/admin/services/${id}`, { method: "DELETE" });
  },
  categories() {
    return request<Array<{ _id: string; name: string; slug: string }>>(
      "/admin/categories",
    );
  },
  createCategory(input: { name: string; slug?: string }) {
    return request<{ _id: string; name: string; slug: string }>(
      "/admin/categories",
      { method: "POST", body: JSON.stringify(input) },
    );
  },
  updateCategory(id: string, input: { name: string; slug?: string }) {
    return request<{ _id: string; name: string; slug: string }>(
      `/admin/categories/${id}`,
      { method: "PUT", body: JSON.stringify(input) },
    );
  },
  deleteCategory(id: string) {
    return request<void>(`/admin/categories/${id}`, { method: "DELETE" });
  },
  reviews() {
    return request<Array<Review & { approved?: boolean }>>("/admin/reviews");
  },
  approveReview(id: string) {
    return request<Review>(`/admin/reviews/${id}/approve`, { method: "PATCH" });
  },
  deleteReview(id: string) {
    return request<void>(`/admin/reviews/${id}`, { method: "DELETE" });
  },
  inquiries() {
    return request<
      Array<{
        _id: string;
        name: string;
        phone: string;
        message: string;
        isRead: boolean;
        createdAt: string;
      }>
    >("/admin/inquiries");
  },
  markInquiryRead(id: string) {
    return request(`/admin/inquiries/${id}/read`, { method: "PATCH" });
  },
};
