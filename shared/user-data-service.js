// =============================================================================
// SUITE VET - Perfil académico, roles propios y comentarios vía Supabase/RLS.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetUserData) return;

  const CAREERS = Object.freeze([
    "Medicina Veterinaria",
    "Agronomía",
    "Acuicultura",
    "Zootecnia",
    "Otra carrera"
  ]);
  const SEMESTERS = Object.freeze([
    "Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto",
    "Séptimo", "Octavo", "Noveno", "Décimo", "Egresado", "Graduado", "Otro"
  ]);
  const INSTITUTIONS = Object.freeze([
    "Universidad Técnica de Machala",
    "Universidad de Guayaquil",
    "Universidad Católica de Cuenca",
    "Universidad de Cuenca",
    "Universidad Nacional de Loja",
    "Otra institución"
  ]);
  const SUBJECTS = Object.freeze({
    comment: "Comentario",
    recommendation: "Recomendación",
    observed_error: "Error observado"
  });
  const PROFILE_COLUMNS = "id,display_name,first_name,last_name,username,career,semester,institution,avatar_path,created_at,updated_at";
  const FEEDBACK_COLUMNS = "id,user_id,subject,message,rating,approved,approved_at,approved_by,response,responded_at,responded_by,created_at,updated_at";
  const HUMAN_NAME = /^[\p{L}][\p{L}\p{M} .'-]{0,79}$/u;
  const USERNAME = /^[a-z0-9][a-z0-9_]{2,29}$/;

  class SuiteVetDataError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = "SuiteVetDataError";
      this.code = details.code || "DATA_ERROR";
      if (details.errors && typeof details.errors === "object") {
        this.errors = Object.freeze({ ...details.errors });
      }
      if (details.cause) this.cause = details.cause;
    }
  }

  function cleanText(value) {
    return String(value || "").normalize("NFC").trim();
  }

  function safeError(error, fallback = "DATA_ERROR") {
    if (error instanceof SuiteVetDataError) return error;
    if (error?.code === "23505") {
      return new SuiteVetDataError("Ese nombre de usuario ya está en uso.", {
        code: "USERNAME_TAKEN",
        cause: error
      });
    }
    if (error?.message?.toLowerCase?.().includes("fetch")) {
      return new SuiteVetDataError("No fue posible conectar para guardar los cambios.", {
        code: "NETWORK_ERROR",
        cause: error
      });
    }
    return new SuiteVetDataError("No fue posible completar la operación.", {
      code: fallback,
      cause: error
    });
  }

  async function context() {
    const auth = root.SuiteVetAuth;
    if (!auth) throw new SuiteVetDataError("El servicio de acceso no está disponible.", { code: "AUTH_UNAVAILABLE" });
    const user = await auth.getCurrentUser();
    if (!user?.id) throw new SuiteVetDataError("Debes iniciar sesión para continuar.", { code: "AUTH_REQUIRED" });
    return { user, client: auth.getClient() };
  }

  function validateProfile(input) {
    const profile = {
      first_name: cleanText(input?.first_name),
      last_name: cleanText(input?.last_name),
      username: cleanText(input?.username).toLowerCase(),
      career: cleanText(input?.career),
      semester: cleanText(input?.semester),
      institution: cleanText(input?.institution)
    };
    const errors = {};
    if (!HUMAN_NAME.test(profile.first_name)) errors.first_name = "Ingresa un nombre válido de hasta 80 caracteres.";
    if (!HUMAN_NAME.test(profile.last_name)) errors.last_name = "Ingresa un apellido válido de hasta 80 caracteres.";
    if (!USERNAME.test(profile.username)) errors.username = "Usa 3–30 caracteres: minúsculas, números y guion bajo.";
    if (!CAREERS.includes(profile.career)) errors.career = "Selecciona una carrera de la lista.";
    if (!SEMESTERS.includes(profile.semester)) errors.semester = "Selecciona un semestre de la lista.";
    if (!INSTITUTIONS.includes(profile.institution)) errors.institution = "Selecciona una institución de la lista.";
    if (Object.keys(errors).length) {
      throw new SuiteVetDataError("Revisa los campos marcados.", { code: "PROFILE_INVALID", errors });
    }
    return Object.freeze({
      ...profile,
      display_name: `${profile.first_name} ${profile.last_name}`.trim()
    });
  }

  function profileMissingFields(profile) {
    return ["first_name", "last_name", "username", "career", "semester", "institution"]
      .filter((field) => !cleanText(profile?.[field]));
  }

  async function loadProfile() {
    const { user, client } = await context();
    try {
      const [{ data: profile, error: profileError }, { data: roles, error: rolesError }] = await Promise.all([
        client.from("profiles").select(PROFILE_COLUMNS).eq("id", user.id).single(),
        client.from("user_roles").select("role").eq("user_id", user.id)
      ]);
      if (profileError) throw profileError;
      if (rolesError) throw rolesError;
      const role = Array.isArray(roles) && roles.some((item) => item.role === "super_admin")
        ? "super_admin"
        : (roles?.[0]?.role || "student");
      return Object.freeze({
        ...profile,
        email: user.email || "",
        role,
        missingFields: profileMissingFields(profile),
        complete: profileMissingFields(profile).length === 0
      });
    } catch (error) {
      throw safeError(error, "PROFILE_LOAD_FAILED");
    }
  }

  async function updateProfile(input) {
    const payload = validateProfile(input);
    const { user, client } = await context();
    try {
      const { data, error } = await client
        .from("profiles")
        .update(payload)
        .eq("id", user.id)
        .select(PROFILE_COLUMNS)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw safeError(error, "PROFILE_UPDATE_FAILED");
    }
  }

  function validateFeedback(input) {
    const subject = cleanText(input?.subject);
    const message = cleanText(input?.message);
    const rating = Number(input?.rating);
    const errors = {};
    if (!Object.prototype.hasOwnProperty.call(SUBJECTS, subject)) errors.subject = "Selecciona un asunto válido.";
    if (message.length < 10) errors.message = "Escribe al menos 10 caracteres.";
    else if (message.length > 2000) errors.message = "El comentario no puede superar 2000 caracteres.";
    else if (/[<>]/.test(message) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(message)) {
      errors.message = "El comentario contiene caracteres no permitidos.";
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Selecciona una calificación de 1 a 5.";
    if (Object.keys(errors).length) {
      throw new SuiteVetDataError("Revisa el comentario antes de enviarlo.", { code: "FEEDBACK_INVALID", errors });
    }
    return Object.freeze({ subject, message, rating });
  }

  async function submitFeedback(input) {
    const payload = validateFeedback(input);
    const { client } = await context();
    try {
      const { data, error } = await client.from("user_feedback")
        .insert(payload)
        .select(FEEDBACK_COLUMNS)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw safeError(error, "FEEDBACK_INSERT_FAILED");
    }
  }

  async function loadOwnFeedback() {
    const { user, client } = await context();
    try {
      const { data, error } = await client.from("user_feedback")
        .select(FEEDBACK_COLUMNS)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw safeError(error, "FEEDBACK_LOAD_FAILED");
    }
  }

  async function isSuperAdmin() {
    const { user, client } = await context();
    const { data, error } = await client.from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "super_admin")
      .maybeSingle();
    if (error) throw safeError(error, "ROLE_LOAD_FAILED");
    return data?.role === "super_admin";
  }

  async function requireSuperAdmin() {
    if (!(await isSuperAdmin())) {
      throw new SuiteVetDataError("No tienes permisos para abrir esta vista.", { code: "FORBIDDEN" });
    }
  }

  async function loadAdminFeedback(filters = {}) {
    await requireSuperAdmin();
    const { client } = await context();
    let query = client.from("user_feedback").select(FEEDBACK_COLUMNS).order("created_at", { ascending: false });
    if (Object.prototype.hasOwnProperty.call(SUBJECTS, filters.subject)) query = query.eq("subject", filters.subject);
    const rating = Number(filters.rating);
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) query = query.eq("rating", rating);
    const { data: feedback, error } = await query;
    if (error) throw safeError(error, "ADMIN_FEEDBACK_LOAD_FAILED");
    const userIds = Array.from(new Set((feedback || []).map((item) => item.user_id)));
    let profiles = [];
    if (userIds.length) {
      const profileResult = await client.from("profiles")
        .select("id,display_name,username")
        .in("id", userIds);
      if (profileResult.error) throw safeError(profileResult.error, "ADMIN_AUTHORS_LOAD_FAILED");
      profiles = profileResult.data || [];
    }
    const authors = new Map(profiles.map((profile) => [profile.id, profile]));
    return (feedback || []).map((item) => ({ ...item, author: authors.get(item.user_id) || null }));
  }

  async function updateFeedbackApproval(id, approved) {
    await requireSuperAdmin();
    const { client } = await context();
    const { data, error } = await client.from("user_feedback")
      .update({ approved: Boolean(approved) })
      .eq("id", String(id || ""))
      .select(FEEDBACK_COLUMNS)
      .single();
    if (error) throw safeError(error, "FEEDBACK_APPROVAL_FAILED");
    return data;
  }

  async function updateFeedbackResponse(id, response) {
    await requireSuperAdmin();
    const text = cleanText(response);
    if (text.length > 2000 || /[<>]/.test(text)) {
      throw new SuiteVetDataError("La respuesta no puede superar 2000 caracteres ni contener HTML.", {
        code: "RESPONSE_INVALID"
      });
    }
    const { client } = await context();
    const { data, error } = await client.from("user_feedback")
      .update({ response: text || null })
      .eq("id", String(id || ""))
      .select(FEEDBACK_COLUMNS)
      .single();
    if (error) throw safeError(error, "FEEDBACK_RESPONSE_FAILED");
    return data;
  }

  root.SuiteVetUserData = Object.freeze({
    CAREERS,
    INSTITUTIONS,
    SEMESTERS,
    SUBJECTS,
    DataError: SuiteVetDataError,
    isSuperAdmin,
    loadAdminFeedback,
    loadOwnFeedback,
    loadProfile,
    profileMissingFields,
    submitFeedback,
    updateFeedbackApproval,
    updateFeedbackResponse,
    updateProfile,
    validateFeedback,
    validateProfile
  });
})(window);
