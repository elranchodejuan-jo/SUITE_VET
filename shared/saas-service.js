// =============================================================================
// SUITE VET - Acceso SaaS sobre Supabase. Auth, grants y RLS son autoritativos.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetSaas) return;

  const PLAN_COLUMNS = "id,slug,name,description,currency,price_cents,billing_interval,is_active,is_public,is_purchasable,sort_order,created_at,updated_at";
  const ENTITLEMENT_COLUMNS = "id,plan_id,capability_key,value_type,value,label,description,sort_order,is_active,created_at,updated_at";
  const SUBSCRIPTION_COLUMNS = "id,user_id,plan_id,status,starts_at,ends_at,canceled_at,source,assigned_by,created_at,updated_at";
  const PAYMENT_COLUMNS = "id,user_id,subscription_id,plan_id,amount_cents,currency,status,payment_method,reference,note,paid_at,verified_at,verified_by,created_at,updated_at";
  const ACCOUNT_COLUMNS = "user_id,email,email_confirmed_at,auth_created_at,last_sign_in_at,role,updated_at";
  const USAGE_COLUMNS = "id,user_id,event_type,resource_key,session_key,metadata,occurred_at";
  const AUDIT_COLUMNS = "id,actor_user_id,action,entity_type,entity_id,metadata,occurred_at";
  const SETTING_COLUMNS = "key,value_type,value,description,is_public,created_at,updated_at";
  const PROFILE_ADMIN_COLUMNS = "id,display_name,first_name,last_name,username,career,semester,institution,created_at,updated_at";

  class SaasError extends Error {
    constructor(message, code = "SAAS_ERROR", cause = null) {
      super(message);
      this.name = "SuiteVetSaasError";
      this.code = code;
      if (cause) this.cause = cause;
    }
  }

  function safeError(error, fallbackCode = "SAAS_ERROR") {
    if (error instanceof SaasError) return error;
    const raw = String(error?.message || "").toLowerCase();
    if (raw.includes("jwt") || raw.includes("expired") || error?.status === 401) {
      return new SaasError("La sesión expiró. Inicia sesión nuevamente.", "SESSION_EXPIRED", error);
    }
    if (raw.includes("fetch") || raw.includes("network") || error?.name === "TypeError") {
      return new SaasError("No fue posible conectar con el servicio de datos.", "NETWORK_ERROR", error);
    }
    if (error?.code === "23505") return new SaasError("Ya existe un registro con esa referencia.", "DUPLICATE", error);
    return new SaasError("No fue posible completar la operación.", fallbackCode, error);
  }

  async function context() {
    const auth = root.SuiteVetAuth;
    if (!auth) throw new SaasError("El servicio de acceso no está disponible.", "AUTH_UNAVAILABLE");
    const user = await auth.getCurrentUser();
    if (!user?.id) throw new SaasError("Debes iniciar sesión para continuar.", "AUTH_REQUIRED");
    return { user, client: auth.getClient() };
  }

  async function requireSuperAdmin() {
    if (!(await root.SuiteVetUserData?.isSuperAdmin?.())) {
      throw new SaasError("No tienes permisos para abrir el Centro de Control.", "FORBIDDEN");
    }
  }

  async function checked(promise, code) {
    try {
      const result = await promise;
      if (result?.error) throw result.error;
      return result?.data ?? null;
    } catch (error) {
      throw safeError(error, code);
    }
  }

  async function loadPublicProduct() {
    const auth = root.SuiteVetAuth;
    await auth?.initialize?.();
    if (!auth?.getStatus?.().configured) return { plans: [], entitlements: [], settings: [] };
    const client = auth.getClient();
    const [plans, entitlements, settings] = await Promise.all([
      checked(client.from("plans").select(PLAN_COLUMNS).order("sort_order", { ascending: true }), "PLANS_LOAD_FAILED"),
      checked(client.from("plan_entitlements").select(ENTITLEMENT_COLUMNS).eq("is_active", true).order("sort_order", { ascending: true }), "ENTITLEMENTS_LOAD_FAILED"),
      checked(client.from("saas_settings").select(SETTING_COLUMNS), "SETTINGS_LOAD_FAILED")
    ]);
    return { plans: plans || [], entitlements: entitlements || [], settings: settings || [] };
  }

  async function loadOwnSaasAccount() {
    const { user, client } = await context();
    try {
      const [plans, entitlements, subscriptions, payments, settings] = await Promise.all([
        checked(client.from("plans").select(PLAN_COLUMNS).order("sort_order", { ascending: true }), "PLANS_LOAD_FAILED"),
        checked(client.from("plan_entitlements").select(ENTITLEMENT_COLUMNS).eq("is_active", true).order("sort_order", { ascending: true }), "ENTITLEMENTS_LOAD_FAILED"),
        checked(client.from("subscriptions").select(SUBSCRIPTION_COLUMNS).eq("user_id", user.id).order("created_at", { ascending: false }), "SUBSCRIPTIONS_LOAD_FAILED"),
        checked(client.from("payments").select(PAYMENT_COLUMNS).eq("user_id", user.id).order("created_at", { ascending: false }).limit(100), "PAYMENTS_LOAD_FAILED"),
        checked(client.from("saas_settings").select(SETTING_COLUMNS), "SETTINGS_LOAD_FAILED")
      ]);
      return { plans: plans || [], entitlements: entitlements || [], subscriptions: subscriptions || [], payments: payments || [], settings: settings || [] };
    } catch (error) {
      throw safeError(error, "ACCOUNT_SAAS_LOAD_FAILED");
    }
  }

  async function loadAdminSnapshot() {
    await requireSuperAdmin();
    const { client } = await context();
    try {
      const [accounts, profiles, plans, entitlements, subscriptions, payments, usage, feedback, audit, settings] = await Promise.all([
        checked(client.from("account_directory").select(ACCOUNT_COLUMNS).order("auth_created_at", { ascending: false }).limit(500), "ACCOUNTS_LOAD_FAILED"),
        checked(client.from("profiles").select(PROFILE_ADMIN_COLUMNS).order("created_at", { ascending: false }).limit(500), "PROFILES_LOAD_FAILED"),
        checked(client.from("plans").select(PLAN_COLUMNS).order("sort_order", { ascending: true }), "PLANS_LOAD_FAILED"),
        checked(client.from("plan_entitlements").select(ENTITLEMENT_COLUMNS).order("sort_order", { ascending: true }), "ENTITLEMENTS_LOAD_FAILED"),
        checked(client.from("subscriptions").select(SUBSCRIPTION_COLUMNS).order("created_at", { ascending: false }).limit(1500), "SUBSCRIPTIONS_LOAD_FAILED"),
        checked(client.from("payments").select(PAYMENT_COLUMNS).order("created_at", { ascending: false }).limit(2000), "PAYMENTS_LOAD_FAILED"),
        checked(client.from("usage_events").select(USAGE_COLUMNS).order("occurred_at", { ascending: false }).limit(5000), "USAGE_LOAD_FAILED"),
        root.SuiteVetUserData.loadAdminFeedback(),
        checked(client.from("audit_events").select(AUDIT_COLUMNS).order("occurred_at", { ascending: false }).limit(1000), "AUDIT_LOAD_FAILED"),
        checked(client.from("saas_settings").select(SETTING_COLUMNS), "SETTINGS_LOAD_FAILED")
      ]);
      return { accounts: accounts || [], profiles: profiles || [], plans: plans || [], entitlements: entitlements || [], subscriptions: subscriptions || [], payments: payments || [], usage: usage || [], feedback: feedback || [], audit: audit || [], settings: settings || [] };
    } catch (error) {
      throw safeError(error, "ADMIN_SNAPSHOT_FAILED");
    }
  }

  async function assignPlan(userId, planSlug) {
    await requireSuperAdmin();
    const { client } = await context();
    const data = await checked(
      client.rpc("assign_user_plan", { target_user_id: String(userId || ""), target_plan_slug: String(planSlug || "") }),
      "PLAN_ASSIGNMENT_FAILED"
    );
    return data;
  }

  async function updatePlan(planId, input) {
    await requireSuperAdmin();
    const { client } = await context();
    const payload = {
      name: String(input?.name || "").trim(),
      description: String(input?.description || "").trim() || null,
      price_cents: input?.price_cents == null ? null : Number(input.price_cents),
      billing_interval: String(input?.billing_interval || "none"),
      is_active: Boolean(input?.is_active),
      is_public: Boolean(input?.is_public),
      is_purchasable: Boolean(input?.is_purchasable),
      sort_order: Number(input?.sort_order || 0)
    };
    return checked(client.from("plans").update(payload).eq("id", String(planId || "")).select(PLAN_COLUMNS).single(), "PLAN_UPDATE_FAILED");
  }

  async function upsertEntitlement(input) {
    await requireSuperAdmin();
    const { client } = await context();
    const valueType = String(input?.value_type || "text");
    let value = String(input?.value ?? "").trim();
    if (valueType === "boolean") value = value === "true";
    else if (valueType === "integer") {
      if (!/^-?[0-9]+$/.test(value)) throw new SaasError("El valor debe ser un entero.", "ENTITLEMENT_INVALID");
      value = Number(value);
    }
    const payload = {
      plan_id: String(input?.plan_id || ""),
      capability_key: String(input?.capability_key || "").trim().toLowerCase(),
      value_type: valueType,
      value,
      label: String(input?.label || "").trim(),
      description: String(input?.description || "").trim() || null,
      sort_order: Number(input?.sort_order || 0),
      is_active: input?.is_active !== false
    };
    return checked(client.from("plan_entitlements").upsert(payload, { onConflict: "plan_id,capability_key" }).select(ENTITLEMENT_COLUMNS).single(), "ENTITLEMENT_SAVE_FAILED");
  }

  async function deleteEntitlement(id) {
    await requireSuperAdmin();
    const { client } = await context();
    return checked(client.from("plan_entitlements").delete().eq("id", String(id || "")), "ENTITLEMENT_DELETE_FAILED");
  }

  async function createManualPayment(input) {
    await requireSuperAdmin();
    const { client } = await context();
    const payload = {
      user_id: String(input?.user_id || ""),
      subscription_id: input?.subscription_id ? String(input.subscription_id) : null,
      plan_id: String(input?.plan_id || ""),
      amount_cents: Number(input?.amount_cents),
      currency: "USD",
      payment_method: String(input?.payment_method || "manual_other"),
      reference: String(input?.reference || "").trim() || null,
      note: String(input?.note || "").trim() || null,
      paid_at: input?.paid_at || null
    };
    if (!Number.isSafeInteger(payload.amount_cents) || payload.amount_cents <= 0) {
      throw new SaasError("El importe debe ser mayor que cero.", "PAYMENT_INVALID");
    }
    return checked(client.from("payments").insert(payload).select(PAYMENT_COLUMNS).single(), "PAYMENT_CREATE_FAILED");
  }

  async function changePaymentStatus(id, status) {
    await requireSuperAdmin();
    const allowed = new Set(["verified", "rejected", "refunded"]);
    if (!allowed.has(status)) throw new SaasError("Estado financiero no permitido.", "PAYMENT_STATUS_INVALID");
    const { client } = await context();
    return checked(client.from("payments").update({ status }).eq("id", String(id || "")).select(PAYMENT_COLUMNS).single(), "PAYMENT_STATUS_FAILED");
  }

  async function updateSetting(key, value) {
    await requireSuperAdmin();
    const { client } = await context();
    return checked(client.from("saas_settings").update({ value }).eq("key", String(key || "")).select(SETTING_COLUMNS).single(), "SETTING_UPDATE_FAILED");
  }

  root.SuiteVetSaas = Object.freeze({
    SaasError,
    assignPlan,
    changePaymentStatus,
    createManualPayment,
    deleteEntitlement,
    loadAdminSnapshot,
    loadOwnSaasAccount,
    loadPublicProduct,
    requireSuperAdmin,
    updatePlan,
    updateSetting,
    upsertEntitlement
  });
})(window);
