-- Minimal seed for MVP RLS smoke test data
-- This seed prepares properties/documents and role links.
--
-- IMPORTANT:
-- - This script does NOT create auth users/passwords.
-- - Create users first from Supabase Auth UI (buyer/seller/agency/admin),
--   then paste their user UUIDs below.
-- - Adjust emails/passwords separately in .env for mvp_rls_smoke.ts.

BEGIN;

-- ---------------------------------------------------------------------------
-- INPUTS
-- ---------------------------------------------------------------------------
-- Replace placeholders
DO $$
DECLARE
  v_buyer uuid := '00000000-0000-0000-0000-000000000001';
  v_seller uuid := '00000000-0000-0000-0000-000000000002';
  v_agency uuid := '00000000-0000-0000-0000-000000000003';
  v_admin uuid := '00000000-0000-0000-0000-000000000004';
BEGIN
  IF v_buyer::text LIKE '00000000-%'
     OR v_seller::text LIKE '00000000-%'
     OR v_agency::text LIKE '00000000-%'
     OR v_admin::text LIKE '00000000-%' THEN
    RAISE EXCEPTION 'Replace placeholder UUIDs in INPUTS section.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Upsert role mappings (uses existing app_role enum from schema)
-- ---------------------------------------------------------------------------
WITH ids AS (
  SELECT
    '00000000-0000-0000-0000-000000000001'::uuid AS buyer_id,
    '00000000-0000-0000-0000-000000000002'::uuid AS seller_id,
    '00000000-0000-0000-0000-000000000003'::uuid AS agency_id,
    '00000000-0000-0000-0000-000000000004'::uuid AS admin_id
)
INSERT INTO public.user_roles (user_id, role)
SELECT buyer_id, 'buyer'::public.app_role FROM ids
UNION ALL
SELECT seller_id, 'seller'::public.app_role FROM ids
UNION ALL
SELECT agency_id, 'agency'::public.app_role FROM ids
UNION ALL
SELECT admin_id, 'admin'::public.app_role FROM ids
ON CONFLICT (user_id, role) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Ensure organization + agency membership for managed-property tests
-- ---------------------------------------------------------------------------
WITH ids AS (
  SELECT
    '00000000-0000-0000-0000-000000000002'::uuid AS seller_id,
    '00000000-0000-0000-0000-000000000003'::uuid AS agency_id
),
org_upsert AS (
  INSERT INTO public.organizations (slug, name, owner_id)
  SELECT 'smoke-org', 'Smoke Org', seller_id FROM ids
  ON CONFLICT (slug) DO UPDATE SET owner_id = EXCLUDED.owner_id
  RETURNING id
),
org_id AS (
  SELECT id FROM org_upsert
  UNION ALL
  SELECT o.id FROM public.organizations o WHERE o.slug = 'smoke-org' LIMIT 1
)
INSERT INTO public.organization_members (organization_id, user_id, role)
SELECT id, (SELECT agency_id FROM ids), 'admin'::public.org_member_role
FROM org_id
ON CONFLICT (organization_id, user_id) DO UPDATE SET role = EXCLUDED.role;

-- ---------------------------------------------------------------------------
-- Create/ensure 3-4 smoke properties
-- ---------------------------------------------------------------------------
WITH ids AS (
  SELECT
    '00000000-0000-0000-0000-000000000002'::uuid AS seller_id
),
props AS (
  INSERT INTO public.properties (
    slug, title, description, price, publication_status, owner_user_id, organization_id
  )
  SELECT 'smoke-published', 'Smoke Published', 'RLS smoke published', 100000, 'published', seller_id, NULL FROM ids
  ON CONFLICT (slug) DO UPDATE SET
    publication_status = 'published',
    owner_user_id = EXCLUDED.owner_user_id,
    organization_id = NULL
  RETURNING id, slug
)
SELECT 1;

WITH ids AS (
  SELECT
    '00000000-0000-0000-0000-000000000002'::uuid AS seller_id
)
INSERT INTO public.properties (
  slug, title, description, price, publication_status, owner_user_id, organization_id
)
SELECT 'smoke-draft', 'Smoke Draft', 'RLS smoke draft', 100000, 'draft', seller_id, NULL FROM ids
ON CONFLICT (slug) DO UPDATE SET
  publication_status = 'draft',
  owner_user_id = EXCLUDED.owner_user_id,
  organization_id = NULL;

WITH ids AS (
  SELECT
    '00000000-0000-0000-0000-000000000002'::uuid AS seller_id
)
INSERT INTO public.properties (
  slug, title, description, price, publication_status, owner_user_id, organization_id
)
SELECT 'smoke-archived', 'Smoke Archived', 'RLS smoke archived', 100000, 'archived', seller_id, NULL FROM ids
ON CONFLICT (slug) DO UPDATE SET
  publication_status = 'archived',
  owner_user_id = EXCLUDED.owner_user_id,
  organization_id = NULL;

-- Optional sold property (if enum contains sold)
DO $$
DECLARE
  has_sold boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'publication_status'
      AND e.enumlabel = 'sold'
  ) INTO has_sold;

  IF has_sold THEN
    INSERT INTO public.properties (
      slug, title, description, price, publication_status, owner_user_id, organization_id
    )
    VALUES (
      'smoke-sold', 'Smoke Sold', 'RLS smoke sold', 100000, 'sold',
      '00000000-0000-0000-0000-000000000002'::uuid, NULL
    )
    ON CONFLICT (slug) DO UPDATE SET
      publication_status = 'sold',
      owner_user_id = EXCLUDED.owner_user_id,
      organization_id = NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Ensure docs on published property
-- ---------------------------------------------------------------------------
WITH pub AS (
  SELECT id FROM public.properties WHERE slug = 'smoke-published' LIMIT 1
)
INSERT INTO public.property_documents (property_id, doc_type, storage_path, visibility, verified)
SELECT id, 'smoke-public', 'smoke/public.pdf', 'public', false FROM pub
ON CONFLICT DO NOTHING;

WITH pub AS (
  SELECT id FROM public.properties WHERE slug = 'smoke-published' LIMIT 1
)
INSERT INTO public.property_documents (property_id, doc_type, storage_path, visibility, verified)
SELECT id, 'smoke-request-only', 'smoke/request-only.pdf', 'request_only', false FROM pub
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Outputs for env setup
-- ---------------------------------------------------------------------------
SELECT 'TEST_PROPERTY_PUBLISHED_ID' AS key, id::text AS value
FROM public.properties WHERE slug = 'smoke-published'
UNION ALL
SELECT 'TEST_PROPERTY_NON_PUBLISHED_ID', id::text
FROM public.properties WHERE slug = 'smoke-draft'
UNION ALL
SELECT 'TEST_PROPERTY_ARCHIVED_ID', id::text
FROM public.properties WHERE slug = 'smoke-archived'
UNION ALL
SELECT 'TEST_PROPERTY_SOLD_ID', id::text
FROM public.properties WHERE slug = 'smoke-sold';

COMMIT;
