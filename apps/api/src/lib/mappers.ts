export function designToJson(row: Record<string, any>) {
  return {
    _id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    category: row.category,
    categoryId: row.category_id || undefined,
    shape: row.shape,
    colors: row.colors || [],
    price: Number(row.price),
    durationMin: row.duration_min,
    tags: row.tags || [],
    isFeatured: Boolean(row.is_featured),
  };
}

export function serviceToJson(row: Record<string, any>) {
  return {
    _id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    durationMin: row.duration_min,
  };
}

export function categoryToJson(row: Record<string, any>) {
  return {
    _id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

export function bookingToJson(row: Record<string, any>) {
  const date =
    row.date instanceof Date
      ? row.date.toISOString().slice(0, 10)
      : String(row.date).slice(0, 10);
  return {
    _id: row.id,
    serviceId: row.service_id,
    ...(row.design_id ? { designId: row.design_id } : {}),
    date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    notes: row.notes || "",
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
  };
}

export function reviewToJson(row: Record<string, any>) {
  return {
    _id: row.id,
    name: row.name,
    rating: Number(row.rating),
    comment: row.comment,
    approved: Boolean(row.approved),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

export function inquiryToJson(row: Record<string, any>) {
  return {
    _id: row.id,
    name: row.name,
    phone: row.phone,
    message: row.message,
    isRead: Boolean(row.is_read),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
