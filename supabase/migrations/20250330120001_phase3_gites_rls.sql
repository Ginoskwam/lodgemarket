-- PHASE 3 — Row Level Security (tables plateforme gîtes)
-- Les politiques sur profiles ne sont créées que si aucune politique n’existe encore
-- (évite le double jeu avec supabase/rls.sql legacy).

-- ---------------------------------------------------------------------------
-- profiles (projet neuf uniquement, ou sans politiques préexistantes)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF (SELECT COUNT(*)::int FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') = 0 THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    EXECUTE $pol$
      CREATE POLICY phase3_profiles_select ON public.profiles
        FOR SELECT USING (true)
    $pol$;
    EXECUTE $pol$
      CREATE POLICY phase3_profiles_insert_own ON public.profiles
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = id)
    $pol$;
    EXECUTE $pol$
      CREATE POLICY phase3_profiles_update_own ON public.profiles
        FOR UPDATE TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id)
    $pol$;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- user_roles
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_user_roles_select ON public.user_roles;
CREATE POLICY phase3_user_roles_select ON public.user_roles
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase3_user_roles_insert ON public.user_roles;
CREATE POLICY phase3_user_roles_insert ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      auth.uid() = user_id
      AND role <> 'admin'::public.app_role
    )
  );

DROP POLICY IF EXISTS phase3_user_roles_delete ON public.user_roles;
CREATE POLICY phase3_user_roles_delete ON public.user_roles
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR public.is_admin_user(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_org_select ON public.organizations;
CREATE POLICY phase3_org_select ON public.organizations
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS phase3_org_insert ON public.organizations;
CREATE POLICY phase3_org_insert ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_org_update ON public.organizations;
CREATE POLICY phase3_org_update ON public.organizations
  FOR UPDATE TO authenticated
  USING (
    public.is_admin_user(auth.uid())
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
    )
  )
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
    )
  );

DROP POLICY IF EXISTS phase3_org_delete ON public.organizations;
CREATE POLICY phase3_org_delete ON public.organizations
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- organization_members
-- ---------------------------------------------------------------------------
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_org_members_select ON public.organization_members;
CREATE POLICY phase3_org_members_select ON public.organization_members
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = organization_members.organization_id
        AND o.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
        AND om2.user_id = auth.uid()
        AND om2.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
    )
  );

DROP POLICY IF EXISTS phase3_org_members_insert ON public.organization_members;
CREATE POLICY phase3_org_members_insert ON public.organization_members
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = organization_id
        AND o.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
    )
  );

DROP POLICY IF EXISTS phase3_org_members_update ON public.organization_members;
CREATE POLICY phase3_org_members_update ON public.organization_members
  FOR UPDATE TO authenticated
  USING (
    public.is_admin_user(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = organization_members.organization_id
        AND o.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
    )
  );

DROP POLICY IF EXISTS phase3_org_members_delete ON public.organization_members;
CREATE POLICY phase3_org_members_delete ON public.organization_members
  FOR DELETE TO authenticated
  USING (
    public.is_admin_user(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = organization_members.organization_id
        AND o.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
    )
  );

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_properties_select ON public.properties;
CREATE POLICY phase3_properties_select ON public.properties
  FOR SELECT USING (
    publication_status = 'published'::public.publication_status
    OR public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase3_properties_insert ON public.properties;
CREATE POLICY phase3_properties_insert ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_user(auth.uid())
    OR (
      owner_user_id = auth.uid()
      AND organization_id IS NULL
    )
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = organization_id
          AND om.user_id = auth.uid()
          AND om.role IN ('owner'::public.org_member_role, 'admin'::public.org_member_role)
      )
    )
  );

DROP POLICY IF EXISTS phase3_properties_update ON public.properties;
CREATE POLICY phase3_properties_update ON public.properties
  FOR UPDATE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase3_properties_delete ON public.properties;
CREATE POLICY phase3_properties_delete ON public.properties
  FOR DELETE TO authenticated
  USING (
    public.user_manages_property(auth.uid(), id)
    OR public.is_admin_user(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- property_images, property_business_metrics, property_amenities
-- ---------------------------------------------------------------------------
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_property_images_select ON public.property_images;
CREATE POLICY phase3_property_images_select ON public.property_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_images.property_id
        AND (
          p.publication_status = 'published'::public.publication_status
          OR public.user_manages_property(auth.uid(), p.id)
          OR public.is_admin_user(auth.uid())
        )
    )
  );

DROP POLICY IF EXISTS phase3_property_images_insert ON public.property_images;
CREATE POLICY phase3_property_images_insert ON public.property_images
  FOR INSERT TO authenticated
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_property_images_update ON public.property_images;
CREATE POLICY phase3_property_images_update ON public.property_images
  FOR UPDATE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()))
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_property_images_delete ON public.property_images;
CREATE POLICY phase3_property_images_delete ON public.property_images
  FOR DELETE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

ALTER TABLE public.property_business_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_metrics_select ON public.property_business_metrics;
CREATE POLICY phase3_metrics_select ON public.property_business_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_business_metrics.property_id
        AND (
          p.publication_status = 'published'::public.publication_status
          OR public.user_manages_property(auth.uid(), p.id)
          OR public.is_admin_user(auth.uid())
        )
    )
  );

DROP POLICY IF EXISTS phase3_metrics_insert ON public.property_business_metrics;
CREATE POLICY phase3_metrics_insert ON public.property_business_metrics
  FOR INSERT TO authenticated
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_metrics_update ON public.property_business_metrics;
CREATE POLICY phase3_metrics_update ON public.property_business_metrics
  FOR UPDATE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()))
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_metrics_delete ON public.property_business_metrics;
CREATE POLICY phase3_metrics_delete ON public.property_business_metrics
  FOR DELETE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_property_amenities_select ON public.property_amenities;
CREATE POLICY phase3_property_amenities_select ON public.property_amenities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_amenities.property_id
        AND (
          p.publication_status = 'published'::public.publication_status
          OR public.user_manages_property(auth.uid(), p.id)
          OR public.is_admin_user(auth.uid())
        )
    )
  );

DROP POLICY IF EXISTS phase3_property_amenities_insert ON public.property_amenities;
CREATE POLICY phase3_property_amenities_insert ON public.property_amenities
  FOR INSERT TO authenticated
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_property_amenities_update ON public.property_amenities;
CREATE POLICY phase3_property_amenities_update ON public.property_amenities
  FOR UPDATE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()))
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_property_amenities_delete ON public.property_amenities;
CREATE POLICY phase3_property_amenities_delete ON public.property_amenities
  FOR DELETE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- amenities, certifications (référentiels)
-- ---------------------------------------------------------------------------
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_amenities_select ON public.amenities;
CREATE POLICY phase3_amenities_select ON public.amenities FOR SELECT USING (true);

DROP POLICY IF EXISTS phase3_amenities_insert ON public.amenities;
CREATE POLICY phase3_amenities_insert ON public.amenities
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_amenities_update ON public.amenities;
CREATE POLICY phase3_amenities_update ON public.amenities
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_amenities_delete ON public.amenities;
CREATE POLICY phase3_amenities_delete ON public.amenities
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()));

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_certifications_select ON public.certifications;
CREATE POLICY phase3_certifications_select ON public.certifications FOR SELECT USING (true);

DROP POLICY IF EXISTS phase3_certifications_insert ON public.certifications;
CREATE POLICY phase3_certifications_insert ON public.certifications
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_certifications_update ON public.certifications;
CREATE POLICY phase3_certifications_update ON public.certifications
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_certifications_delete ON public.certifications;
CREATE POLICY phase3_certifications_delete ON public.certifications
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- property_documents (visibilité fine V2 via server actions + signed URLs)
-- ---------------------------------------------------------------------------
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;

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
  );

DROP POLICY IF EXISTS phase3_documents_insert ON public.property_documents;
CREATE POLICY phase3_documents_insert ON public.property_documents
  FOR INSERT TO authenticated
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_documents_update ON public.property_documents;
CREATE POLICY phase3_documents_update ON public.property_documents
  FOR UPDATE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()))
  WITH CHECK (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_documents_delete ON public.property_documents;
CREATE POLICY phase3_documents_delete ON public.property_documents
  FOR DELETE TO authenticated
  USING (public.user_manages_property(auth.uid(), property_id) OR public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- favorites
-- ---------------------------------------------------------------------------
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_favorites_select ON public.favorites;
CREATE POLICY phase3_favorites_select ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS phase3_favorites_insert ON public.favorites;
CREATE POLICY phase3_favorites_insert ON public.favorites
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS phase3_favorites_delete ON public.favorites;
CREATE POLICY phase3_favorites_delete ON public.favorites
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- inquiries
-- ---------------------------------------------------------------------------
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_inquiries_select ON public.inquiries;
CREATE POLICY phase3_inquiries_select ON public.inquiries
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase3_inquiries_insert ON public.inquiries;
CREATE POLICY phase3_inquiries_insert ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS phase3_inquiries_update ON public.inquiries;
CREATE POLICY phase3_inquiries_update ON public.inquiries
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

-- ---------------------------------------------------------------------------
-- visit_requests
-- ---------------------------------------------------------------------------
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_visit_select ON public.visit_requests;
CREATE POLICY phase3_visit_select ON public.visit_requests
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR public.user_manages_property(auth.uid(), property_id)
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS phase3_visit_insert ON public.visit_requests;
CREATE POLICY phase3_visit_insert ON public.visit_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS phase3_visit_update ON public.visit_requests;
CREATE POLICY phase3_visit_update ON public.visit_requests
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

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_articles_select ON public.articles;
CREATE POLICY phase3_articles_select ON public.articles
  FOR SELECT USING (published = true OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_articles_insert ON public.articles;
CREATE POLICY phase3_articles_insert ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_articles_update ON public.articles;
CREATE POLICY phase3_articles_update ON public.articles
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_articles_delete ON public.articles;
CREATE POLICY phase3_articles_delete ON public.articles
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS phase3_audit_select ON public.audit_logs;
CREATE POLICY phase3_audit_select ON public.audit_logs
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS phase3_audit_insert ON public.audit_logs;
CREATE POLICY phase3_audit_insert ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Grants API Supabase
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_business_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_amenities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visit_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;

GRANT SELECT ON public.amenities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.amenities TO authenticated;
GRANT SELECT ON public.certifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT SELECT ON public.properties TO anon;
GRANT SELECT ON public.property_images TO anon;
GRANT SELECT ON public.property_business_metrics TO anon;
GRANT SELECT ON public.property_amenities TO anon;
GRANT SELECT ON public.property_documents TO anon;
GRANT SELECT ON public.articles TO anon;

-- service_role : accès complet pour le client admin / Edge (RLS contourné côté API)
GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.organizations TO service_role;
GRANT ALL ON public.organization_members TO service_role;
GRANT ALL ON public.properties TO service_role;
GRANT ALL ON public.property_images TO service_role;
GRANT ALL ON public.property_business_metrics TO service_role;
GRANT ALL ON public.property_amenities TO service_role;
GRANT ALL ON public.property_documents TO service_role;
GRANT ALL ON public.amenities TO service_role;
GRANT ALL ON public.certifications TO service_role;
GRANT ALL ON public.favorites TO service_role;
GRANT ALL ON public.inquiries TO service_role;
GRANT ALL ON public.visit_requests TO service_role;
GRANT ALL ON public.articles TO service_role;
GRANT ALL ON public.audit_logs TO service_role;
