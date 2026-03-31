/**
 * MVP RLS smoke test (real Supabase clients + real sessions).
 *
 * How to run:
 * 1) Ensure env vars below are set (or use your shell/.env loader).
 * 2) Run: npx tsx supabase/tests/mvp_rls_smoke.ts
 *
 * Required env vars:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - TEST_BUYER_EMAIL
 * - TEST_BUYER_PASSWORD
 * - TEST_SELLER_EMAIL
 * - TEST_SELLER_PASSWORD
 * - TEST_AGENCY_EMAIL
 * - TEST_AGENCY_PASSWORD
 * - TEST_ADMIN_EMAIL
 * - TEST_ADMIN_PASSWORD
 * - TEST_PROPERTY_PUBLISHED_ID
 * - TEST_PROPERTY_NON_PUBLISHED_ID
 * - TEST_PROPERTY_ARCHIVED_ID
 *
 * Optional env vars:
 * - TEST_PROPERTY_SOLD_ID
 * - TEST_REQUEST_ONLY_DOCUMENT_ID
 * - TEST_PUBLIC_DOCUMENT_ID
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type RoleKey = "buyer" | "seller" | "agency" | "admin";

type Ctx = {
  url: string;
  anonKey: string;
  ids: {
    propertyPublishedId: string;
    propertyNonPublishedId: string;
    propertyArchivedId: string;
    propertySoldId?: string;
    requestOnlyDocumentId?: string;
    publicDocumentId?: string;
  };
  clients: Record<RoleKey, SupabaseClient>;
  anonClient: SupabaseClient;
  runtime: {
    buyerUserId?: string;
    sellerUserId?: string;
    agencyUserId?: string;
    adminUserId?: string;
    inquiryId?: string;
    documentAccessId?: string;
  };
};

type Scenario = {
  name: string;
  run: (ctx: Ctx) => Promise<void>;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim() === "") return undefined;
  return value.trim();
}

function fail(message: string): never {
  throw new Error(message);
}

function assertTrue(condition: boolean, message: string): void {
  if (!condition) fail(message);
}

async function signInClient(
  url: string,
  anonKey: string,
  email: string,
  password: string,
): Promise<SupabaseClient> {
  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw new Error(`Login failed for ${email}: ${error?.message ?? "no session"}`);
  }
  return client;
}

async function resolveAuthUserId(client: SupabaseClient, label: RoleKey): Promise<string> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new Error(`Cannot read authenticated user for ${label}: ${error?.message ?? "no user"}`);
  }
  return data.user.id;
}

async function ensureTestDocuments(ctx: Ctx): Promise<void> {
  const { propertyPublishedId } = ctx.ids;
  const admin = ctx.clients.admin;

  if (!ctx.ids.requestOnlyDocumentId) {
    const { data, error } = await admin
      .from("property_documents")
      .select("id")
      .eq("property_id", propertyPublishedId)
      .eq("visibility", "request_only")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(`Cannot fetch request_only document: ${error.message}`);
    if (!data?.id) {
      throw new Error(
        "No request_only document found for TEST_PROPERTY_PUBLISHED_ID. Set TEST_REQUEST_ONLY_DOCUMENT_ID or seed one.",
      );
    }
    ctx.ids.requestOnlyDocumentId = data.id;
  }

  if (!ctx.ids.publicDocumentId) {
    const { data, error } = await admin
      .from("property_documents")
      .select("id")
      .eq("property_id", propertyPublishedId)
      .eq("visibility", "public")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(`Cannot fetch public document: ${error.message}`);
    if (!data?.id) {
      throw new Error(
        "No public document found for TEST_PROPERTY_PUBLISHED_ID. Set TEST_PUBLIC_DOCUMENT_ID or seed one.",
      );
    }
    ctx.ids.publicDocumentId = data.id;
  }
}

async function runScenario(index: number, scenario: Scenario, ctx: Ctx): Promise<boolean> {
  const label = `${index}. ${scenario.name}`;
  try {
    await scenario.run(ctx);
    console.log(`OK     ${label}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAILED ${label}`);
    console.error(`       ${message}`);
    return false;
  }
}

const scenarios: Scenario[] = [
  {
    name: "buyer can see published property",
    run: async (ctx) => {
      const { data, error } = await ctx.clients.buyer
        .from("properties")
        .select("id")
        .eq("id", ctx.ids.propertyPublishedId)
        .maybeSingle();
      if (error) throw error;
      assertTrue(!!data?.id, "Published property not visible for buyer");
    },
  },
  {
    name: "buyer cannot see non-published property",
    run: async (ctx) => {
      const { data, error } = await ctx.clients.buyer
        .from("properties")
        .select("id")
        .eq("id", ctx.ids.propertyNonPublishedId)
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      assertTrue(!data, "Non-published property should be hidden for buyer");
    },
  },
  {
    name: "buyer can create inquiry on published property",
    run: async (ctx) => {
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId) fail("Missing buyer user id");

      const { data, error } = await ctx.clients.buyer
        .from("inquiries")
        .insert({
          property_id: ctx.ids.propertyPublishedId,
          buyer_id: buyerId,
          message: `smoke published inquiry ${Date.now()}`,
        })
        .select("id")
        .single();

      if (error) throw error;
      assertTrue(!!data?.id, "Inquiry was not created on published property");
      ctx.runtime.inquiryId = data.id;
    },
  },
  {
    name: "buyer cannot create inquiry on archived property",
    run: async (ctx) => {
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId) fail("Missing buyer user id");

      const { error } = await ctx.clients.buyer.from("inquiries").insert({
        property_id: ctx.ids.propertyArchivedId,
        buyer_id: buyerId,
        message: `smoke archived inquiry ${Date.now()}`,
      });

      assertTrue(!!error, "Expected insert to fail on archived property");
    },
  },
  {
    name: "buyer cannot create inquiry on sold property (if configured)",
    run: async (ctx) => {
      if (!ctx.ids.propertySoldId) return;
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId) fail("Missing buyer user id");

      const { error } = await ctx.clients.buyer.from("inquiries").insert({
        property_id: ctx.ids.propertySoldId,
        buyer_id: buyerId,
        message: `smoke sold inquiry ${Date.now()}`,
      });

      assertTrue(!!error, "Expected insert to fail on sold property");
    },
  },
  {
    name: "buyer can request document access on buyer-open property",
    run: async (ctx) => {
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId) fail("Missing buyer user id");

      const { data, error } = await ctx.clients.buyer
        .from("property_document_access")
        .upsert(
          {
            property_id: ctx.ids.propertyPublishedId,
            buyer_id: buyerId,
            status: "pending",
            note: `smoke request ${Date.now()}`,
            decided_at: null,
          },
          { onConflict: "property_id,buyer_id" },
        )
        .select("id,status")
        .single();

      if (error) throw error;
      assertTrue(data.status === "pending", "Document access request should be pending");
      ctx.runtime.documentAccessId = data.id;
    },
  },
  {
    name: "buyer cannot read request_only document before approval",
    run: async (ctx) => {
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId || !ctx.ids.requestOnlyDocumentId) fail("Missing test ids");

      const { error: resetError } = await ctx.clients.buyer
        .from("property_document_access")
        .upsert(
          {
            property_id: ctx.ids.propertyPublishedId,
            buyer_id: buyerId,
            status: "pending",
            decided_at: null,
          },
          { onConflict: "property_id,buyer_id" },
        );
      if (resetError) throw resetError;

      const { data, error } = await ctx.clients.buyer
        .from("property_documents")
        .select("id")
        .eq("id", ctx.ids.requestOnlyDocumentId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      assertTrue(!data, "request_only document should be hidden before approval");
    },
  },
  {
    name: "seller can approve document access request",
    run: async (ctx) => {
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId) fail("Missing buyer user id");

      const { data, error } = await ctx.clients.seller
        .from("property_document_access")
        .update({
          status: "approved",
          decided_at: new Date().toISOString(),
          note: "approved by seller (smoke)",
        })
        .eq("property_id", ctx.ids.propertyPublishedId)
        .eq("buyer_id", buyerId)
        .select("id,status")
        .single();

      if (error) throw error;
      assertTrue(data.status === "approved", "Seller approval did not apply");
    },
  },
  {
    name: "buyer can read request_only document after approval",
    run: async (ctx) => {
      if (!ctx.ids.requestOnlyDocumentId) fail("Missing request_only doc id");

      const { data, error } = await ctx.clients.buyer
        .from("property_documents")
        .select("id")
        .eq("id", ctx.ids.requestOnlyDocumentId)
        .maybeSingle();

      if (error) throw error;
      assertTrue(!!data?.id, "Buyer still cannot read request_only document after approval");
    },
  },
  {
    name: "seller and agency can see requests linked to their properties",
    run: async (ctx) => {
      const buyerId = ctx.runtime.buyerUserId;
      if (!buyerId) fail("Missing buyer user id");

      const sellerRes = await ctx.clients.seller
        .from("property_document_access")
        .select("id")
        .eq("property_id", ctx.ids.propertyPublishedId)
        .eq("buyer_id", buyerId)
        .maybeSingle();
      if (sellerRes.error && sellerRes.error.code !== "PGRST116") throw sellerRes.error;

      const agencyRes = await ctx.clients.agency
        .from("property_document_access")
        .select("id")
        .eq("property_id", ctx.ids.propertyPublishedId)
        .eq("buyer_id", buyerId)
        .maybeSingle();
      if (agencyRes.error && agencyRes.error.code !== "PGRST116") throw agencyRes.error;

      assertTrue(!!sellerRes.data?.id, "Seller cannot see linked document access request");
      assertTrue(!!agencyRes.data?.id, "Agency cannot see linked document access request");
    },
  },
  {
    name: "public can see only public documents",
    run: async (ctx) => {
      if (!ctx.ids.publicDocumentId) fail("Missing public document id");

      const { data, error } = await ctx.anonClient
        .from("property_documents")
        .select("id")
        .eq("id", ctx.ids.publicDocumentId)
        .maybeSingle();
      if (error) throw error;
      assertTrue(!!data?.id, "Public should see public document");
    },
  },
  {
    name: "public cannot see request_only documents",
    run: async (ctx) => {
      if (!ctx.ids.requestOnlyDocumentId) fail("Missing request_only document id");

      const { data, error } = await ctx.anonClient
        .from("property_documents")
        .select("id")
        .eq("id", ctx.ids.requestOnlyDocumentId)
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      assertTrue(!data, "Public should not see request_only document");
    },
  },
  {
    name: "admin has global access to non-published properties",
    run: async (ctx) => {
      const { data, error } = await ctx.clients.admin
        .from("properties")
        .select("id")
        .eq("id", ctx.ids.propertyNonPublishedId)
        .maybeSingle();
      if (error) throw error;
      assertTrue(!!data?.id, "Admin should see non-published property");
    },
  },
];

async function main(): Promise<void> {
  const url = requiredEnv("SUPABASE_URL");
  const anonKey = requiredEnv("SUPABASE_ANON_KEY");

  const buyerClient = await signInClient(
    url,
    anonKey,
    requiredEnv("TEST_BUYER_EMAIL"),
    requiredEnv("TEST_BUYER_PASSWORD"),
  );
  const sellerClient = await signInClient(
    url,
    anonKey,
    requiredEnv("TEST_SELLER_EMAIL"),
    requiredEnv("TEST_SELLER_PASSWORD"),
  );
  const agencyClient = await signInClient(
    url,
    anonKey,
    requiredEnv("TEST_AGENCY_EMAIL"),
    requiredEnv("TEST_AGENCY_PASSWORD"),
  );
  const adminClient = await signInClient(
    url,
    anonKey,
    requiredEnv("TEST_ADMIN_EMAIL"),
    requiredEnv("TEST_ADMIN_PASSWORD"),
  );

  const ctx: Ctx = {
    url,
    anonKey,
    ids: {
      propertyPublishedId: requiredEnv("TEST_PROPERTY_PUBLISHED_ID"),
      propertyNonPublishedId: requiredEnv("TEST_PROPERTY_NON_PUBLISHED_ID"),
      propertyArchivedId: requiredEnv("TEST_PROPERTY_ARCHIVED_ID"),
      propertySoldId: optionalEnv("TEST_PROPERTY_SOLD_ID"),
      requestOnlyDocumentId: optionalEnv("TEST_REQUEST_ONLY_DOCUMENT_ID"),
      publicDocumentId: optionalEnv("TEST_PUBLIC_DOCUMENT_ID"),
    },
    clients: {
      buyer: buyerClient,
      seller: sellerClient,
      agency: agencyClient,
      admin: adminClient,
    },
    anonClient: createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
    runtime: {},
  };

  ctx.runtime.buyerUserId = await resolveAuthUserId(buyerClient, "buyer");
  ctx.runtime.sellerUserId = await resolveAuthUserId(sellerClient, "seller");
  ctx.runtime.agencyUserId = await resolveAuthUserId(agencyClient, "agency");
  ctx.runtime.adminUserId = await resolveAuthUserId(adminClient, "admin");

  await ensureTestDocuments(ctx);

  console.log("=== MVP RLS Smoke Test (Supabase client) ===");
  console.log(`Project: ${ctx.url}`);
  console.log(`Published property: ${ctx.ids.propertyPublishedId}`);

  let passed = 0;
  for (let i = 0; i < scenarios.length; i += 1) {
    const ok = await runScenario(i + 1, scenarios[i], ctx);
    if (ok) passed += 1;
  }

  const failed = scenarios.length - passed;
  console.log("===========================================");
  console.log(`Result: ${passed}/${scenarios.length} passed, ${failed} failed`);

  // Explicit non-zero exit code on failure for CI usage
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Fatal error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
