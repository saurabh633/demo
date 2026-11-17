TRUNCATE inquiries, bookings, reviews, designs, services CASCADE;

INSERT INTO services (id, name, description, price, duration_min) VALUES
  ('s1', 'Nail Extensions', 'Custom length extensions shaped to your preference with a soft, natural finish.', 95, 120),
  ('s2', 'Gel Manicure', 'Long-wearing gel polish with cuticle care and a glass-smooth shine.', 55, 60),
  ('s3', 'Acrylic Set', 'Durable acrylic overlays or full sets with precise shaping and finish.', 85, 110),
  ('s4', 'Refill', 'Grow-out refill for extensions or acrylics to restore shape and strength.', 65, 90),
  ('s5', 'Removal', 'Gentle soak-off removal with nail recovery oil and light buff.', 35, 45);

INSERT INTO designs (id, title, image_url, category, shape, colors, price, duration_min, tags, is_featured) VALUES
  ('d1', 'Soft Nude Almond', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80', 'Minimal', 'almond', ARRAY['nude','beige'], 75, 90, ARRAY['everyday','natural'], TRUE),
  ('d2', 'Blush Petal French', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80', 'French', 'almond', ARRAY['blush','white'], 85, 100, ARRAY['classic','bridal'], TRUE),
  ('d3', 'Champagne Chrome', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=80', 'Chrome', 'coffin', ARRAY['gold','champagne'], 95, 110, ARRAY['luxe','evening'], TRUE),
  ('d4', 'Garden Floral', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=80', 'Art', 'almond', ARRAY['pink','green'], 110, 130, ARRAY['floral','statement'], TRUE),
  ('d5', 'Midnight Glitter', 'https://images.unsplash.com/photo-1604650415941-f0e7b8b0b3f5?auto=format&fit=crop&w=900&q=80', 'Glitter', 'stiletto', ARRAY['black','silver'], 105, 120, ARRAY['party','glam'], FALSE),
  ('d6', 'Pastel Cloud', 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=900&q=80', 'Minimal', 'square', ARRAY['lilac','mint'], 80, 95, ARRAY['soft','spring'], FALSE),
  ('d7', 'Mauve Velvet', 'https://images.unsplash.com/photo-1610992015732-24448a829d2e?auto=format&fit=crop&w=900&q=80', 'Solid', 'coffin', ARRAY['mauve','burgundy'], 70, 85, ARRAY['bold','autumn'], TRUE),
  ('d8', 'Pearl Aura', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80', 'Aura', 'almond', ARRAY['pearl','pink'], 90, 105, ARRAY['aura','soft-glam'], FALSE),
  ('d9', 'Golden Line Art', 'https://images.unsplash.com/photo-1515688594390-b6498264ad4a?auto=format&fit=crop&w=900&q=80', 'Art', 'square', ARRAY['nude','gold'], 100, 115, ARRAY['line-art','luxe'], FALSE),
  ('d10', 'Rosé Marble', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80', 'Marble', 'coffin', ARRAY['rose','white'], 98, 110, ARRAY['marble','bridal'], TRUE),
  ('d11', 'Ivory Classic', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80', 'Solid', 'square', ARRAY['ivory','cream'], 65, 75, ARRAY['classic','clean'], FALSE),
  ('d12', 'Abstract Bloom', 'https://images.unsplash.com/photo-1600428877878-1a0fd7f4e0f3?auto=format&fit=crop&w=900&q=80', 'Art', 'stiletto', ARRAY['coral','cream'], 120, 140, ARRAY['abstract','editorial'], FALSE);

INSERT INTO reviews (id, name, rating, comment, created_at) VALUES
  ('r1', 'Aria Chen', 5, 'The softest studio experience. My almond set lasted three weeks and still looked polished.', '2026-10-12T14:00:00.000Z'),
  ('r2', 'Maya Patel', 5, 'Hygiene is impeccable and the champagne chrome design was exactly like the gallery photo.', '2026-09-28T11:20:00.000Z'),
  ('r3', 'Sofia Reyes', 4, 'Beautiful floral art and a calm, luxurious vibe. Booking was easy and on time.', '2026-09-05T16:45:00.000Z'),
  ('r4', 'Elena Brooks', 5, 'Premium products, gentle technicians, and my gel manicure still has that glass finish.', '2026-08-19T10:10:00.000Z');
