-- MVP RLS Smoke Tests
-- File: supabase/tests/mvp_rls_smoke.sql
--
-- How to run:
-- 1) Open Supabase SQL editor as postgres.
-- 2) Fill the UUIDs in the INPUTS block.
-- 3) Run the whole script.
--
-- Reliability note (important):
-- - RLS is evaluated against SQL role + JWT claims.
-- - This script uses `SET LOCAL ROLE anon|authenticated` and sets
--   `request.jwt.claim.role/sub` to simulate API calls.
-- - This is much safer than only using set_config('role', ...), which does NOT
--   change SQL current_user and can lead to false positives.
-- - Still, the most reliable validation is an external client test (supabase-js),
--   because it uses real JWTs exactly like production traffic.
--
-- The script runs inside a transaction and ends with ROLLBACK.
-- No persistent test data remains.

BEGIN;

-- -----------------------------------------------------------------------------
-- INPUTS (REQUIRED)
-- -----------------------------------------------------------------------------
-- Replace all-zero UUIDs with real ids from your environment.
-- Notes:
-- - buyer/seller/agency/admin must exist in public.profiles.
-- - property_* must exist and have the expected publication_status.
-- - property_published_id should have at least one request_only document.
-- - property_published_id must be managed by BOTH seller_id and agency_id
--   (owner_user_id = seller_id, or organization membership that includes agency_id).
CREATE TEMP TABLE _ctx (
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  agency_id uuid NOT NULL,
  admin_id uuid NOT NULL,
  property_published_id uuid NOT NULL,
  property_non_published_id uuid NOT NULL,
  property_archived_id uuid NOT NULL,
  property_sold_id uuid NULL
);

INSERT INTO _ctx (
  buyer_id,
  seller_id,
  agency_id,
  admin_id,
  property_published_id,
  property_non_published_id,
  property_archived_id,
  property_sold_id
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013',
  NULL
);

DO $$
DECLARE
  c record;
BEGIN
  SELECT * INTO c FROM _ctx;
  IF c.buyer_id::text LIKE '00000000-%'
     OR c.seller_id::text LIKE '00000000-%'
     OR c.agency_id::text LIKE '00000000-%'
     OR c.admin_id::text LIKE '00000000-%'
     OR c.property_published_id::text LIKE '00000000-%'
     OR c.property_non_published_id::text LIKE '00000000-%'
     OR c.property_archived_id::text LIKE '00000000-%' THEN
    RAISE EXCEPTION 'Please replace placeholder UUIDs in _ctx before running tests';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION pg_temp.assert_true(p_name text, p_condition boolean)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT p_condition THEN
    RAISE EXCEPTION 'FAILED: %', p_name;
  ELSE
    RAISE NOTICE 'OK: %', p_name;
  END IF;
END;
$$;

-- -----------------------------------------------------------------------------
-- Local test fixtures (created as service role, then verified through RLS)
-- -----------------------------------------------------------------------------
CREATE TEMP TABLE _ids (
  inquiry_ok_id uuid,
  doc_access_pending_id uuid,
  contact_msg_id uuid,
  request_only_doc_id uuid,
  public_doc_id uuid
);

INSERT INTO _ids DEFAULT VALUES;

DO $$
DECLARE
  c record;
  v_doc_id uuid;
BEGIN
  SELECT * INTO c FROM _ctx;

  -- Ensure published property has one request_only and one public document
  UPDATE _ids
  SET request_only_doc_id = (
    SELECT pd.id
    FROM public.property_documents pd
    WHERE pd.property_id = c.property_published_id
      AND pd.visibility = 'request_only'
    LIMIT 1
  );

  UPDATE _ids
  SET public_doc_id = (
    SELECT pd.id
    FROM public.property_documents pd
    WHERE pd.property_id = c.property_published_id
      AND pd.visibility = 'public'
    LIMIT 1
  );

  IF (SELECT request_only_doc_id IS NULL FROM _ids) THEN
    INSERT INTO public.property_documents (property_id, doc_type, storage_path, visibility, verified)
    VALUES (c.property_published_id, 'smoke_request_only', 'smoke/request-only.pdf', 'request_only', false)
    RETURNING id INTO v_doc_id;

    UPDATE _ids SET request_only_doc_id = v_doc_id;
  END IF;

  IF (SELECT public_doc_id IS NULL FROM _ids) THEN
    INSERT INTO public.property_documents (property_id, doc_type, storage_path, visibility, verified)
    VALUES (c.property_published_id, 'smoke_public', 'smoke/public.pdf', 'public', false)
    RETURNING id INTO v_doc_id;

    UPDATE _ids SET public_doc_id = v_doc_id;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 1) buyer can see a published property
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  ok boolean;
BEGIN
  SELECT * INTO c FROM _ctx;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);

  SELECT EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = c.property_published_id
  ) INTO ok;

  PERFORM pg_temp.assert_true('1 buyer can see published property', ok);
END $$;

-- -----------------------------------------------------------------------------
-- 2) buyer cannot see a non-published property
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  ok boolean;
BEGIN
  SELECT * INTO c FROM _ctx;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);

  SELECT NOT EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = c.property_non_published_id
  ) INTO ok;

  PERFORM pg_temp.assert_true('2 buyer cannot see non-published property', ok);
END $$;

-- -----------------------------------------------------------------------------
-- 3) buyer can create inquiry on published property
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  new_id uuid;
BEGIN
  SELECT * INTO c FROM _ctx;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);

  INSERT INTO public.inquiries (property_id, buyer_id, message)
  VALUES (c.property_published_id, c.buyer_id, 'smoke: inquiry on published property')
  RETURNING id INTO new_id;

  UPDATE _ids SET inquiry_ok_id = new_id;

  PERFORM pg_temp.assert_true('3 buyer can create inquiry on published property', new_id IS NOT NULL);
END $$;

-- -----------------------------------------------------------------------------
-- 4) buyer cannot create inquiry on archived or sold property
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  blocked_archived boolean := false;
  blocked_sold boolean := true; -- optional sold test
BEGIN
  SELECT * INTO c FROM _ctx;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);

  BEGIN
    INSERT INTO public.inquiries (property_id, buyer_id, message)
    VALUES (c.property_archived_id, c.buyer_id, 'smoke: should fail archived');
  EXCEPTION WHEN others THEN
    blocked_archived := true;
  END;

  IF c.property_sold_id IS NOT NULL THEN
    BEGIN
      INSERT INTO public.inquiries (property_id, buyer_id, message)
      VALUES (c.property_sold_id, c.buyer_id, 'smoke: should fail sold');
      blocked_sold := false;
    EXCEPTION WHEN others THEN
      blocked_sold := true;
    END;
  END IF;

  PERFORM pg_temp.assert_true('4 buyer cannot create inquiry on archived', blocked_archived);
  PERFORM pg_temp.assert_true('4b buyer cannot create inquiry on sold (if provided)', blocked_sold);
END $$;

-- -----------------------------------------------------------------------------
-- 5) buyer can request document access on buyer-open property
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  new_id uuid;
BEGIN
  SELECT * INTO c FROM _ctx;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);

  INSERT INTO public.property_document_access (property_id, buyer_id, status, note)
  VALUES (c.property_published_id, c.buyer_id, 'pending', 'smoke: doc access request')
  ON CONFLICT (property_id, buyer_id)
  DO UPDATE SET status = 'pending', note = EXCLUDED.note, decided_at = NULL
  RETURNING id INTO new_id;

  UPDATE _ids SET doc_access_pending_id = new_id;

  PERFORM pg_temp.assert_true('5 buyer can request doc access on buyer-open property', new_id IS NOT NULL);
END $$;

-- -----------------------------------------------------------------------------
-- 6) buyer cannot read request_only document without approval
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  i record;
  ok boolean;
BEGIN
  SELECT * INTO c FROM _ctx;
  SELECT * INTO i FROM _ids;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);

  UPDATE public.property_document_access
  SET status = 'pending', decided_at = NULL
  WHERE property_id = c.property_published_id
    AND buyer_id = c.buyer_id;

  SELECT NOT EXISTS (
    SELECT 1
    FROM public.property_documents pd
    WHERE pd.id = i.request_only_doc_id
  ) INTO ok;

  PERFORM pg_temp.assert_true('6 buyer cannot read request_only doc without approval', ok);
END $$;

-- -----------------------------------------------------------------------------
-- 7) buyer can read request_only document after approval
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  i record;
  ok boolean;
BEGIN
  SELECT * INTO c FROM _ctx;
  SELECT * INTO i FROM _ids;

  -- seller approves first
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.seller_id::text, true);
  UPDATE public.property_document_access
  SET status = 'approved', decided_at = now()
  WHERE property_id = c.property_published_id
    AND buyer_id = c.buyer_id;

  -- buyer can now read request_only doc
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);
  SELECT EXISTS (
    SELECT 1
    FROM public.property_documents pd
    WHERE pd.id = i.request_only_doc_id
  ) INTO ok;

  PERFORM pg_temp.assert_true('7 buyer can read request_only doc after approval', ok);
END $$;

-- -----------------------------------------------------------------------------
-- 8) seller/agency can see requests linked to their properties
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  ok_seller boolean;
  ok_agency boolean;
BEGIN
  SELECT * INTO c FROM _ctx;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.seller_id::text, true);
  SELECT EXISTS (
    SELECT 1
    FROM public.property_document_access pda
    WHERE pda.property_id = c.property_published_id
      AND pda.buyer_id = c.buyer_id
  ) INTO ok_seller;

  PERFORM set_config('request.jwt.claim.sub', c.agency_id::text, true);
  SELECT EXISTS (
    SELECT 1
    FROM public.property_document_access pda
    WHERE pda.property_id = c.property_published_id
      AND pda.buyer_id = c.buyer_id
  ) INTO ok_agency;

  PERFORM pg_temp.assert_true('8 seller can see requests linked to own property', ok_seller);
  PERFORM pg_temp.assert_true('8b agency can see requests linked to managed property', ok_agency);
END $$;

-- -----------------------------------------------------------------------------
-- 9) seller/agency can approve document access request
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  ok_seller boolean;
  ok_agency boolean;
BEGIN
  SELECT * INTO c FROM _ctx;

  -- reset to pending as buyer
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);
  UPDATE public.property_document_access
  SET status = 'pending', decided_at = NULL
  WHERE property_id = c.property_published_id
    AND buyer_id = c.buyer_id;

  -- seller approval
  PERFORM set_config('request.jwt.claim.sub', c.seller_id::text, true);
  UPDATE public.property_document_access
  SET status = 'approved', decided_at = now()
  WHERE property_id = c.property_published_id
    AND buyer_id = c.buyer_id;

  SELECT EXISTS (
    SELECT 1
    FROM public.property_document_access
    WHERE property_id = c.property_published_id
      AND buyer_id = c.buyer_id
      AND status = 'approved'
  ) INTO ok_seller;

  -- agency approval check (set pending then approve)
  PERFORM set_config('request.jwt.claim.sub', c.buyer_id::text, true);
  UPDATE public.property_document_access
  SET status = 'pending', decided_at = NULL
  WHERE property_id = c.property_published_id
    AND buyer_id = c.buyer_id;

  PERFORM set_config('request.jwt.claim.sub', c.agency_id::text, true);
  UPDATE public.property_document_access
  SET status = 'approved', decided_at = now()
  WHERE property_id = c.property_published_id
    AND buyer_id = c.buyer_id;

  SELECT EXISTS (
    SELECT 1
    FROM public.property_document_access
    WHERE property_id = c.property_published_id
      AND buyer_id = c.buyer_id
      AND status = 'approved'
  ) INTO ok_agency;

  PERFORM pg_temp.assert_true('9 seller can approve document access request', ok_seller);
  PERFORM pg_temp.assert_true('9b agency can approve document access request', ok_agency);
END $$;

-- -----------------------------------------------------------------------------
-- 10) admin has global access
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  c record;
  ok boolean;
BEGIN
  SELECT * INTO c FROM _ctx;
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claim.sub', c.admin_id::text, true);

  SELECT EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = c.property_non_published_id
  ) INTO ok;
  PERFORM pg_temp.assert_true('10 admin can see non-published property', ok);
END $$;

-- -----------------------------------------------------------------------------
-- 11) public can see only public docs linked to published property
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  i record;
  ok boolean;
BEGIN
  SELECT * INTO i FROM _ids;
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claim.role', 'anon', true);
  PERFORM set_config('request.jwt.claim.sub', '', true);

  SELECT EXISTS (
    SELECT 1 FROM public.property_documents pd WHERE pd.id = i.public_doc_id
  ) INTO ok;

  PERFORM pg_temp.assert_true('11 public can see public docs on published property', ok);
END $$;

-- -----------------------------------------------------------------------------
-- 12) public cannot see request_only docs
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  i record;
  ok boolean;
BEGIN
  SELECT * INTO i FROM _ids;
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claim.role', 'anon', true);
  PERFORM set_config('request.jwt.claim.sub', '', true);

  SELECT NOT EXISTS (
    SELECT 1 FROM public.property_documents pd WHERE pd.id = i.request_only_doc_id
  ) INTO ok;

  PERFORM pg_temp.assert_true('12 public cannot see request_only docs', ok);
END $$;

-- End smoke tests
RAISE NOTICE 'MVP RLS smoke tests completed';

ROLLBACK;
