-- PHASE 5 MVP SIMPLIFIED
-- Goal: keep only critical MVP behavior, remove non-essential abstractions.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 0) Cleanup from previous experimental phase 5
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_inquiries_create_lead ON public.inquiries;
DROP TRIGGER IF EXISTS tr_visit_requests_create_lead ON public.visit_requests;
DROP TRIGGER IF EXISTS tr_contact_messages_create_lead ON public.contact_messages;

DROP FUNCTION IF EXISTS public.create_lead_from_event();

DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.property_badges CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_type') THEN
    DROP TYPE public.lead_type;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    DROP TYPE public.lead_status;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_badge') THEN
    DROP TYPE public.property_badge;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 1) Enums (final MVP set)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  -- publication_status final:
  -- draft, submitted, changes_requested, published, rejected, archived, sold(optional kept)
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status_new') THEN
      CREATE TYPE public.publication_status_new AS ENUM (
        'draft',
        'submitted',
        'changes_requested',
        'published',
        'rejected',
        'archived',
        'sold'
      );
    END IF;
  ELSE
    CREATE TYPE public.publication_status AS ENUM (
      'draft',
      'submitted',
      'changes_requested',
      'published',
      'rejected',
      'archived',
      'sold'
    );
  END IF;

  -- document access workflow status
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_access_status') THEN
    CREATE TYPE public.document_access_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  -- contact message status (seller dashboard minimal triage)
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_message_status') THEN
    CREATE TYPE public.contact_message_status AS ENUM ('new', 'read', 'archived');
  END IF;
END $$;

-- Re-map existing properties.publication_status if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status_new') THEN
    ALTER TABLE public.properties
      ALTER COLUMN publication_status DROP DEFAULT;

    ALTER TABLE public.properties
      ALTER COLUMN publication_status TYPE public.publication_status_new
      USING (
        CASE publication_status::text
          WHEN 'pending_review' THEN 'submitted'
          WHEN 'under_review' THEN 'submitted'
          WHEN 'approved' THEN 'submitted'
          ELSE publication_status::text
        END
      )::public.publication_status_new;

    DROP TYPE public.publication_status;
    ALTER TYPE public.publication_status_new RENAME TO publication_status;

    ALTER TABLE public.properties
      ALTER COLUMN publication_status SET DEFAULT 'draft'::public.publication_status;
  END IF;
END $$;

-- doc_visibility is kept as-is from phase 3:
-- public, request_only, admin_only

-- -----------------------------------------------------------------------------
-- 2) properties: simple badges + light moderation metadata
-- -----------------------------------------------------------------------------
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_certified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_documents_checked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_revenue_provided BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS moderation_note TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- 3) Core MVP interaction tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_document_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.document_access_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ,
  note TEXT,
  UNIQUE (property_id, buyer_id)
);

CREATE INDEX IF NOT EXISTS idx_property_document_access_property
  ON public.property_document_access(property_id);
CREATE INDEX IF NOT EXISTS idx_property_document_access_buyer
  ON public.property_document_access(buyer_id);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status public.contact_message_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_property
  ON public.contact_messages(property_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_buyer
  ON public.contact_messages(buyer_id);

-- -----------------------------------------------------------------------------
-- 4) Helper for buyer actions (published-only gate)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.property_is_buyer_open(p_property uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = p_property
      AND p.publication_status = 'published'::public.publication_status
      AND p.publication_status <> 'archived'::public.publication_status
      AND p.publication_status <> 'sold'::public.publication_status
  );
$$;

GRANT EXECUTE ON FUNCTION public.property_is_buyer_open(uuid) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5) RLS reset for target tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_document_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- properties
DROP POLICY IF EXISTS phase3_properties_select ON public.properties;
DROP POLICY IF EXISTS phase3_properties_insert ON public.properties;
DROP POLICY IF EXISTS phase3_properties_update ON public.properties;
DROP POLICY IF EXISTS phase3_properties_delete ON public.properties;

CREATE POLICY mvp_properties_select ON public.properties
  FOR SELECT
  USING (
    publication_status = 'published'::public.publication_status
    OR public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_properties_insert ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      owner_user_id = auth.uid() AND organization_id IS NULL
    )
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = properties.organization_id
          AND om.user_id = auth.uid()
      )
    )
  );

CREATE POLICY mvp_properties_update ON public.properties
  FOR UPDATE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_properties_delete ON public.properties
  FOR DELETE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  );

-- property_documents
DROP POLICY IF EXISTS phase3_documents_select ON public.property_documents;
DROP POLICY IF EXISTS phase3_documents_insert ON public.property_documents;
DROP POLICY IF EXISTS phase3_documents_update ON public.property_documents;
DROP POLICY IF EXISTS phase3_documents_delete ON public.property_documents;

CREATE POLICY mvp_property_documents_select ON public.property_documents
  FOR SELECT
  USING (
    public.is_admin_user(auth.uid())
    OR public.user_manages_property(auth.uid(), property_id)
    OR (
      visibility = 'public'::public.doc_visibility
      AND public.property_is_buyer_open(property_id)
    )
    OR (
      visibility = 'request_only'::public.doc_visibility
      AND EXISTS (
        SELECT 1
        FROM public.property_document_access pda
        WHERE pda.property_id = property_documents.property_id
          AND pda.buyer_id = auth.uid()
          AND pda.status = 'approved'::public.document_access_status
      )
    )
  );

CREATE POLICY mvp_property_documents_insert ON public.property_documents
  FOR INSERT TO authenticated
  WITH CHECK (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_property_documents_update ON public.property_documents
  FOR UPDATE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_property_documents_delete ON public.property_documents
  FOR DELETE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

-- property_document_access
DROP POLICY IF EXISTS phase5_doc_access_select ON public.property_document_access;
DROP POLICY IF EXISTS phase5_doc_access_insert ON public.property_document_access;
DROP POLICY IF EXISTS phase5_doc_access_update ON public.property_document_access;

CREATE POLICY mvp_doc_access_select ON public.property_document_access
  FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_doc_access_insert ON public.property_document_access
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND public.property_is_buyer_open(property_id)
    AND status = 'pending'::public.document_access_status
  );

CREATE POLICY mvp_doc_access_update ON public.property_document_access
  FOR UPDATE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()))
    AND status IN ('approved'::public.document_access_status, 'rejected'::public.document_access_status, 'pending'::public.document_access_status)
  );

-- inquiries
DROP POLICY IF EXISTS phase3_inquiries_select ON public.inquiries;
DROP POLICY IF EXISTS phase3_inquiries_insert ON public.inquiries;
DROP POLICY IF EXISTS phase3_inquiries_update ON public.inquiries;

CREATE POLICY mvp_inquiries_select ON public.inquiries
  FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_inquiries_insert ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND public.property_is_buyer_open(property_id)
  );

CREATE POLICY mvp_inquiries_update ON public.inquiries
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

-- visit_requests
DROP POLICY IF EXISTS phase3_visit_select ON public.visit_requests;
DROP POLICY IF EXISTS phase3_visit_insert ON public.visit_requests;
DROP POLICY IF EXISTS phase3_visit_update ON public.visit_requests;

CREATE POLICY mvp_visit_requests_select ON public.visit_requests
  FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_visit_requests_insert ON public.visit_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND public.property_is_buyer_open(property_id)
  );

CREATE POLICY mvp_visit_requests_update ON public.visit_requests
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

-- contact_messages
DROP POLICY IF EXISTS phase5_contact_messages_select ON public.contact_messages;
DROP POLICY IF EXISTS phase5_contact_messages_insert ON public.contact_messages;

CREATE POLICY mvp_contact_messages_select ON public.contact_messages
  FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

CREATE POLICY mvp_contact_messages_insert ON public.contact_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND public.property_is_buyer_open(property_id)
    AND status = 'new'::public.contact_message_status
  );

CREATE POLICY mvp_contact_messages_update ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

-- -----------------------------------------------------------------------------
-- 6) Grants for updated tables
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT ON public.properties TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_documents TO authenticated;
GRANT SELECT ON public.property_documents TO anon;

GRANT SELECT, INSERT, UPDATE ON public.property_document_access TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.contact_messages TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visit_requests TO authenticated;

GRANT ALL ON public.properties TO service_role;
GRANT ALL ON public.property_documents TO service_role;
GRANT ALL ON public.property_document_access TO service_role;
GRANT ALL ON public.contact_messages TO service_role;
GRANT ALL ON public.inquiries TO service_role;
GRANT ALL ON public.visit_requests TO service_role;
