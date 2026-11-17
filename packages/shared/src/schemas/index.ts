import { z } from "zod";

export const designShapeSchema = z.enum([
  "almond",
  "square",
  "coffin",
  "stiletto",
]);

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
]);

export const designInputSchema = z.object({
  title: z.string().min(1).max(120),
  imageUrl: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  shape: designShapeSchema,
  colors: z.array(z.string().min(1)).default([]),
  price: z.coerce.number().nonnegative(),
  durationMin: z.coerce.number().int().positive(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export const serviceInputSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  price: z.coerce.number().nonnegative(),
  durationMin: z.coerce.number().int().positive(),
});

export const categoryInputSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(80).optional(),
});

export const bookingInputSchema = z.object({
  serviceId: z.string().min(1),
  designId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(1).max(120),
  phone: z.string().min(6).max(40),
  notes: z.string().max(1000).optional().default(""),
  status: bookingStatusSchema.optional(),
});

export const bookingStatusUpdateSchema = z.object({
  status: bookingStatusSchema,
});

export const reviewInputSchema = z.object({
  name: z.string().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});

export const inquiryInputSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(6).max(40),
  message: z.string().min(1).max(2000),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type DesignInput = z.infer<typeof designInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;
export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type BookingInput = z.infer<typeof bookingInputSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type InquiryInput = z.infer<typeof inquiryInputSchema>;
