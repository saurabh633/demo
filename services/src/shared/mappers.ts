/** Map DB/gRPC shapes to the exact frontend JSON contract in apps/lumi-nails. */

export function designToJson(row: {
  id: string;
  title: string;
  image_url?: string;
  imageUrl?: string;
  category: string;
  shape: string;
  colors: string[];
  price: number | string;
  duration_min?: number;
  durationMin?: number;
  tags: string[];
  is_featured?: boolean;
  isFeatured?: boolean;
}) {
  return {
    _id: row.id,
    title: row.title,
    imageUrl: row.image_url ?? row.imageUrl,
    category: row.category,
    shape: row.shape,
    colors: row.colors || [],
    price: Number(row.price),
    durationMin: row.duration_min ?? row.durationMin,
    tags: row.tags || [],
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
  };
}

export function serviceToJson(row: {
  id: string;
  name: string;
  description: string;
  price: number | string;
  duration_min?: number;
  durationMin?: number;
}) {
  return {
    _id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    durationMin: row.duration_min ?? row.durationMin,
  };
}

export function slotToJson(row: { time: string; available: boolean }) {
  return {
    time: row.time,
    available: Boolean(row.available),
  };
}

const STATUS_MAP: Record<string, string> = {
  BOOKING_STATUS_PENDING: "pending",
  BOOKING_STATUS_CONFIRMED: "confirmed",
  BOOKING_STATUS_CANCELLED: "cancelled",
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
};

export function bookingToJson(row: {
  id: string;
  service_id?: string;
  serviceId?: string;
  design_id?: string | null;
  designId?: string | null;
  date: string | Date;
  time: string;
  name: string;
  phone: string;
  notes: string;
  status: string;
}) {
  const date =
    typeof row.date === "string"
      ? row.date.slice(0, 10)
      : row.date.toISOString().slice(0, 10);
  const designId = row.design_id ?? row.designId ?? undefined;
  return {
    _id: row.id,
    serviceId: row.service_id ?? row.serviceId,
    ...(designId ? { designId } : {}),
    date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    notes: row.notes || "",
    status: STATUS_MAP[row.status] || row.status || "pending",
  };
}

export function reviewToJson(row: {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at?: string | Date;
  createdAt?: string;
}) {
  const created =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : row.created_at || row.createdAt || new Date().toISOString();
  return {
    _id: row.id,
    name: row.name,
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: created,
  };
}

export function designRowToGrpc(row: Record<string, any>) {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    category: row.category,
    shape: row.shape,
    colors: row.colors || [],
    price: Number(row.price),
    durationMin: row.duration_min,
    tags: row.tags || [],
    isFeatured: row.is_featured,
  };
}

export function serviceRowToGrpc(row: Record<string, any>) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    durationMin: row.duration_min,
  };
}

export function bookingRowToGrpc(row: Record<string, any>) {
  const date =
    row.date instanceof Date
      ? row.date.toISOString().slice(0, 10)
      : String(row.date).slice(0, 10);
  return {
    id: row.id,
    serviceId: row.service_id,
    designId: row.design_id || "",
    date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    notes: row.notes || "",
    status: `BOOKING_STATUS_${String(row.status).toUpperCase()}`,
  };
}

export function reviewRowToGrpc(row: Record<string, any>) {
  const created =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at);
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: created,
  };
}
