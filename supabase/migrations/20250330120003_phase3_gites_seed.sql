-- PHASE 3 — Seed minimal (équipements référentiels)

INSERT INTO public.amenities (slug, label) VALUES
  ('wifi', 'Wi‑Fi'),
  ('piscine', 'Piscine'),
  ('jacuzzi', 'Jacuzzi / spa'),
  ('parking', 'Parking'),
  ('climatisation', 'Climatisation'),
  ('cheminee', 'Cheminée'),
  ('lave_linge', 'Lave-linge'),
  ('lave_vaisselle', 'Lave-vaisselle'),
  ('jardin', 'Jardin'),
  ('terrasse', 'Terrasse'),
  ('barbecue', 'Barbecue'),
  ('vue_montagne', 'Vue montagne'),
  ('accessible_pmr', 'Accessible PMR'),
  ('animaux_acceptes', 'Animaux acceptés')
ON CONFLICT (slug) DO NOTHING;
