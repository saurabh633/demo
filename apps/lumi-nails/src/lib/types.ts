export type DesignShape = "almond" | "square" | "coffin" | "stiletto";

export interface Design {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  shape: DesignShape;
  colors: string[];
  price: number;
  durationMin: number;
  tags: string[];
  isFeatured: boolean;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
}

export interface Slot {
  time: string;
  available: boolean;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id: string;
  serviceId: string;
  designId?: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
  status: BookingStatus;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Inquiry {
  name: string;
  phone: string;
  message: string;
}

export interface CreateBookingInput {
  serviceId: string;
  designId?: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
}

export interface CreateReviewInput {
  name: string;
  rating: number;
  comment: string;
}

export interface DesignFilters {
  category?: string;
  shape?: DesignShape | "";
  color?: string;
  search?: string;
  featured?: boolean;
}
