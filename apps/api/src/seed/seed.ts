import fs from "node:fs";
import path from "node:path";
import { migrate, pool, query } from "@lumi/db";
import { DESIGNS_UPLOAD_DIR } from "../lib/config.js";
import {
  CATEGORIES,
  DESIGN_IMAGE_SOURCES,
  DESIGNS,
  REVIEWS,
  SERVICES,
  SLOT_TIMES,
} from "./data.js";

async function downloadImage(url: string, dest: string) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
  } catch (err) {
    // Minimal valid JPEG placeholder (1x1) if download fails
    const jpeg = Buffer.from(
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBAVFRUVFRUVFRUVFRUWFxUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAECBQYAB//EADUQAAIBAgQDBgUEAwAAAAAAAAABAgMRBBIhMQVBURMiYXGBkaGxwdHwFOHxBjRC/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIhEAAgICAgMBAQEAAAAAAAAAAAECEQMhEjFBBFEiYZET/9oADAMBAAIRAxEAPwD1TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//2Q==",
      "base64",
    );
    fs.writeFileSync(dest, jpeg);
    console.warn(`Placeholder used for ${path.basename(dest)} (${err})`);
  }
}

async function seed() {
  await migrate();
  fs.mkdirSync(DESIGNS_UPLOAD_DIR, { recursive: true });

  console.log("Clearing existing seed tables…");
  await query(
    `TRUNCATE inquiries, bookings, reviews, designs, services, categories, slot_hours RESTART IDENTITY CASCADE`,
  );

  console.log("Seeding slot hours…");
  for (const time of SLOT_TIMES) {
    await query(`INSERT INTO slot_hours (time) VALUES ($1) ON CONFLICT DO NOTHING`, [
      time,
    ]);
  }

  console.log("Seeding categories…");
  for (const c of CATEGORIES) {
    await query(
      `INSERT INTO categories (id, name, slug) VALUES ($1,$2,$3)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug`,
      [c.id, c.name, c.slug],
    );
  }

  console.log("Seeding services…");
  for (const s of SERVICES) {
    await query(
      `INSERT INTO services (id, name, description, price, duration_min)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         price = EXCLUDED.price,
         duration_min = EXCLUDED.duration_min`,
      [s.id, s.name, s.description, s.price, s.durationMin],
    );
  }

  console.log("Downloading design images…");
  const localFiles: string[] = [];
  for (let i = 0; i < DESIGN_IMAGE_SOURCES.length; i++) {
    const filename = `seed-${String(i + 1).padStart(2, "0")}.jpg`;
    const dest = path.join(DESIGNS_UPLOAD_DIR, filename);
    await downloadImage(DESIGN_IMAGE_SOURCES[i], dest);
    localFiles.push(filename);
  }
  // ensure placeholder
  await downloadImage(DESIGN_IMAGE_SOURCES[0], path.join(DESIGNS_UPLOAD_DIR, "placeholder.jpg"));

  console.log("Seeding designs…");
  for (const d of DESIGNS) {
    const file = localFiles[d.imageIndex % localFiles.length];
    const imageUrl = `/uploads/designs/${file}`;
    await query(
      `INSERT INTO designs (id, title, image_url, category_id, category, shape, colors, price, duration_min, tags, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         image_url = EXCLUDED.image_url,
         category_id = EXCLUDED.category_id,
         category = EXCLUDED.category,
         shape = EXCLUDED.shape,
         colors = EXCLUDED.colors,
         price = EXCLUDED.price,
         duration_min = EXCLUDED.duration_min,
         tags = EXCLUDED.tags,
         is_featured = EXCLUDED.is_featured`,
      [
        d.id,
        d.title,
        imageUrl,
        d.categoryId,
        d.category,
        d.shape,
        d.colors,
        d.price,
        d.durationMin,
        d.tags,
        d.isFeatured,
      ],
    );
  }

  console.log("Seeding reviews…");
  for (const r of REVIEWS) {
    await query(
      `INSERT INTO reviews (id, name, rating, comment, approved, created_at)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         rating = EXCLUDED.rating,
         comment = EXCLUDED.comment,
         approved = EXCLUDED.approved,
         created_at = EXCLUDED.created_at`,
      [r.id, r.name, r.rating, r.comment, r.approved, r.createdAt],
    );
  }

  console.log(
    `Seed complete: ${SERVICES.length} services, ${CATEGORIES.length} categories, ${DESIGNS.length} designs, ${REVIEWS.length} reviews, ${SLOT_TIMES.length} slots.`,
  );
  await pool.end();
}

seed().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
