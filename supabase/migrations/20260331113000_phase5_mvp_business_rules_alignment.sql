-- PHASE 5 - Align schema/RLS with Business Rules MVP
-- Safe-forward migration: extends phase 3 without destructive changes.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) Enums aligned with MVP lifecycle and lead flow
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status') THEN
    ALTER TYPE public.publication_status ADD VALUE IF NOT EXISTS 'submitted';
    ALTER TYPE public.publication_status ADD VALUE IF NOT EXISTS 'under_review';
    ALTER TYPE public.publication_status ADD VALUE IF NOT EXISTS 'changes_requested';
    ALTER TYPE public.publication_status ADD VALUE IF NOT EXISTS 'approved';
    ALTER TYPE public.publication_status ADD VALUE IF NOT EXISTS 'sold';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_type') THEN
    CREATE TYPE public.lead_type AS ENUM ('document_request', 'visit_request', 'contact_message');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE public.lead_status AS ENUM ('new', 'in_progress', 'closed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_access_status') THEN
    CREATE TYPE public.document_access_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_badge') THEN
    CREATE TYPE public.property_badge AS ENUM (
      'verified',
      'certified',
      'documents_checked',
      'revenue_provided'
    );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2) Property moderation metadata and transition guardrails
-- ---------------------------------------------------------------------------
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderation_note TEXT;

CREATE OR REPLACE FUNCTION public.enforce_property_publication_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.publication_status IS DISTINCT FROM NEW.publication_status THEN
    -- seller/agency-managed transitions
    IF OLD.publication_status = 'draft' AND NEW.publication_status = 'submitted' THEN
      NEW.submitted_at := now();
      RETURN NEW;
    END IF;

    IF OLD.publication_status IN ('changes_requested', 'rejected')
       AND NEW.publication_status = 'submitted' THEN
      NEW.submitted_at := now();
      RETURN NEW;
    END IF;

    -- admin-only transitions for moderation and publication
    IF NEW.publication_status IN ('under_review', 'approved', 'published', 'rejected', 'archived', 'sold', 'changes_requested') THEN
      IF auth.uid() IS NULL THEN
        RETURN NEW;
      END IF;
      IF NOT public.is_admin_user(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can set moderation/publication statuses';
      END IF;
      NEW.reviewed_at := now();
      NEW.reviewed_by := auth.uid();
      RETURN NEW;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_properties_publication ON public.properties;
CREATE TRIGGER tr_properties_publication
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_property_publication_transition();

-- ---------------------------------------------------------------------------
-- 3) Badges and buyer document access after request approval
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  badge public.property_badge NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT,
  UNIQUE (property_id, badge)
);

CREATE INDEX IF NOT EXISTS idx_property_badges_property ON public.property_badges(property_id);

CREATE TABLE IF NOT EXISTS public.property_document_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.document_access_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT,
  UNIQUE (property_id, buyer_id)
);

CREATE INDEX IF NOT EXISTS idx_property_document_access_buyer ON public.property_document_access(buyer_id);

-- ---------------------------------------------------------------------------
-- 4) Contact message + unified leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_property ON public.contact_messages(property_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_buyer ON public.contact_messages(buyer_id);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  seller_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_type public.lead_type NOT NULL,
  source_id UUID,
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_property ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_buyer ON public.leads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_leads_seller ON public.leads(seller_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_org ON public.leads(organization_id);

DROP TRIGGER IF EXISTS tr_leads_updated_at ON public.leads;
CREATE TRIGGER tr_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.create_lead_from_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_org uuid;
  v_type public.lead_type;
BEGIN
  SELECT p.owner_user_id, p.organization_id
  INTO v_owner, v_org
  FROM public.properties p
  WHERE p.id = NEW.property_id;

  IF TG_TABLE_NAME = 'inquiries' THEN
    v_type := 'document_request'::public.lead_type;
  ELSIF TG_TABLE_NAME = 'visit_requests' THEN
    v_type := 'visit_request'::public.lead_type;
  ELSE
    v_type := 'contact_message'::public.lead_type;
  END IF;

  INSERT INTO public.leads (property_id, seller_user_id, organization_id, buyer_id, lead_type, source_id)
  VALUES (NEW.property_id, v_owner, v_org, NEW.buyer_id, v_type, NEW.id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_inquiries_create_lead ON public.inquiries;
CREATE TRIGGER tr_inquiries_create_lead
  AFTER INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_lead_from_event();

DROP TRIGGER IF EXISTS tr_visit_requests_create_lead ON public.visit_requests;
CREATE TRIGGER tr_visit_requests_create_lead
  AFTER INSERT ON public.visit_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.create_lead_from_event();

DROP TRIGGER IF EXISTS tr_contact_messages_create_lead ON public.contact_messages;
CREATE TRIGGER tr_contact_messages_create_lead
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.create_lead_from_event();

-- ---------------------------------------------------------------------------
-- 5) RLS for new tables + tighten docs access behavior
-- ---------------------------------------------------------------------------
ALTER TABLE public.property_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_document_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase5_property_badges_select ON public.property_badges;
CREATE POLICY phase5_property_badges_select ON public.property_badges
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
    OR public.user_manages_property(auth.uid(), property_id)
    OR EXISTS (
      SELECT 1
      FROM public.properties p
      WHERE p.id = property_badges.property_id
        AND p.publication_status = 'published'::public.publication_status
    )
  );

DROP POLICY IF EXISTS phase5_property_badges_mutate ON public.property_badges;
CREATE POLICY phase5_property_badges_mutate ON public.property_badges
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase5_doc_access_select ON public.property_document_access;
CREATE POLICY phase5_doc_access_select ON public.property_document_access
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase5_doc_access_insert ON public.property_document_access;
CREATE POLICY phase5_doc_access_insert ON public.property_document_access
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
        AND p.publication_status = 'published'::public.publication_status
    )
  );

DROP POLICY IF EXISTS phase5_doc_access_update ON public.property_document_access;
CREATE POLICY phase5_doc_access_update ON public.property_document_access
  FOR UPDATE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase5_contact_messages_select ON public.contact_messages;
CREATE POLICY phase5_contact_messages_select ON public.contact_messages
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase5_contact_messages_insert ON public.contact_messages;
CREATE POLICY phase5_contact_messages_insert ON public.contact_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
        AND p.publication_status = 'published'::public.publication_status
    )
  );

DROP POLICY IF EXISTS phase5_leads_select ON public.leads;
CREATE POLICY phase5_leads_select ON public.leads
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR auth.uid() = seller_user_id
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.user_id = auth.uid()
      )
    )
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase5_leads_update ON public.leads;
CREATE POLICY phase5_leads_update ON public.leads
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = seller_user_id
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.user_id = auth.uid()
      )
    )
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    auth.uid() = seller_user_id
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.user_id = auth.uid()
      )
    )
    OR public.is_admin_user(auth.uid())
  );

-- Update existing document policy to support "request_only" access after approval.
DROP POLICY IF EXISTS phase3_documents_select ON public.property_documents;
CREATE POLICY phase3_documents_select ON public.property_documents
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
    OR public.user_manages_property(auth.uid(), property_id)
    OR (
      visibility = 'public'::public.doc_visibility
      AND EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = property_documents.property_id
          AND p.publication_status = 'published'::public.publication_status
      )
    )
    OR (
      visibility = 'request_only'::public.doc_visibility
      AND EXISTS (
        SELECT 1 FROM public.property_document_access pda
        WHERE pda.property_id = property_documents.property_id
          AND pda.buyer_id = auth.uid()
          AND pda.status = 'approved'::public.document_access_status
      )
    )
  );

-- ---------------------------------------------------------------------------
-- 6) Grants for API roles
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_badges TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.property_document_access TO authenticated;
GRANT SELECT, INSERT ON public.contact_messages TO authenticated;
GRANT SELECT, UPDATE ON public.leads TO authenticated;

GRANT ALL ON public.property_badges TO service_role;
GRANT ALL ON public.property_document_access TO service_role;
GRANT ALL ON public.contact_messages TO service_role;
GRANT ALL ON public.leads TO service_role;
