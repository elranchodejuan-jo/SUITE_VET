// =============================================================================
// SUITE VET - Centro de Control Super Admin, sin backend publico dependiente.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetAdminCenter) return;

  const TITLES = Object.freeze({
    dashboard: "Dashboard",
    users: "Usuarios",
    plans: "Planes y suscripciones",
    payments: "Pagos e ingresos",
    usage: "Métricas de uso",
    feedback: "Comentarios y reportes",
    activity: "Actividad del sistema",
    settings: "Configuración",
    security: "Seguridad"
  });
  const PAGE_SIZE = 20;
  const FOCUSABLE = "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";
  const state = {
    initialized: false,
    loading: false,
    mutationBusy: false,
    paymentSubmitting: false,
    authorized: false,
    snapshot: null,
    userPage: 1,
    section: "dashboard",
    drawerTrigger: null,
    dialogTrigger: null,
    confirmResolve: null
  };

  const byId = (id) => document.getElementById(id);
  const utils = () => root.SuiteVetSaasUtils;
  const service = () => root.SuiteVetSaas;
  const userData = () => root.SuiteVetUserData;

  function node(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== "") element.textContent = String(text);
    return element;
  }

  function clear(target) {
    target?.replaceChildren();
  }

  function setStatus(message = "", kind = "") {
    const target = byId("sv-admin-global-status");
    if (!target) return;
    target.textContent = message;
    target.dataset.kind = kind;
  }

  function formatDate(value, empty = "Sin datos") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? empty : date.toLocaleString("es-EC");
  }

  function settingValue(key, fallback = null) {
    const setting = state.snapshot?.settings?.find((item) => item.key === key);
    return setting ? setting.value : fallback;
  }

  function maps() {
    const snapshot = state.snapshot || {};
    return {
      accountById: new Map((snapshot.accounts || []).map((item) => [item.user_id, item])),
      profileById: new Map((snapshot.profiles || []).map((item) => [item.id, item])),
      planById: new Map((snapshot.plans || []).map((item) => [item.id, item])),
      activeSubscriptionByUser: new Map((snapshot.subscriptions || []).filter((item) => item.status === "active").map((item) => [item.user_id, item]))
    };
  }

  function showAccess(title, message, signIn = false) {
    byId("sv-admin-access")?.toggleAttribute("hidden", false);
    byId("sv-admin-app")?.toggleAttribute("hidden", true);
    const heading = byId("sv-admin-center-title");
    const copy = byId("sv-admin-access-message");
    if (heading) heading.textContent = title;
    if (copy) copy.textContent = message;
    byId("sv-admin-signin")?.toggleAttribute("hidden", !signIn);
  }

  function showApp(user) {
    byId("sv-admin-access")?.toggleAttribute("hidden", true);
    byId("sv-admin-app")?.toggleAttribute("hidden", false);
    const label = byId("sv-admin-session-label");
    if (label) label.textContent = user?.email ? `Sesión: ${user.email}` : "Sesión Super Admin";
  }

  function metricCard(label, value) {
    const card = node("article", "sv-admin-metric");
    card.append(node("span", "", label), node("strong", "", value));
    return card;
  }

  function emptyState(message) {
    return node("p", "sv-auth-empty", message);
  }

  function createTable(headers) {
    const table = node("table", "sv-admin-table");
    const head = node("thead");
    const row = node("tr");
    headers.forEach((header) => row.append(node("th", "", header)));
    head.append(row);
    const body = node("tbody");
    table.append(head, body);
    return { table, body };
  }

  function cell(value) {
    return node("td", "", value ?? "");
  }

  function renderBarList(target, items, labelFor = (item) => item.key) {
    clear(target);
    if (!items.length) return target?.append(emptyState("Sin datos todavía."));
    const list = node("div", "sv-admin-bar-list");
    const max = Math.max(...items.map((item) => Number(item.count) || 0), 1);
    items.forEach((item) => {
      const row = node("div", "sv-admin-bar-row");
      const track = node("div", "sv-admin-bar-track");
      const fill = node("div", "sv-admin-bar-fill");
      fill.style.width = `${Math.max(3, Math.round(((Number(item.count) || 0) / max) * 100))}%`;
      track.append(fill);
      row.append(node("span", "", labelFor(item)), track, node("strong", "", item.count));
      list.append(row);
    });
    target?.append(list);
  }

  function renderDashboard() {
    const target = byId("sv-admin-dashboard-metrics");
    clear(target);
    if (!state.snapshot) return;
    const metrics = utils().computeDashboardMetrics(state.snapshot);
    const cards = [
      ["Usuarios académicos", metrics.academicUsers], ["Nuevos hoy", metrics.newToday],
      ["Nuevos esta semana", metrics.newWeek], ["Nuevos este mes", metrics.newMonth],
      ["Free activos", metrics.freeActive], ["Plus activos", metrics.plusActive],
      ["Comentarios pendientes", metrics.pendingFeedback], ["Pagos pendientes", metrics.pendingPayments],
      ["Ingresos verificados hoy", utils().formatUsd(metrics.incomeTodayCents)],
      ["Ingresos verificados semana", utils().formatUsd(metrics.incomeWeekCents)],
      ["Ingresos verificados mes", utils().formatUsd(metrics.incomeMonthCents)],
      ["Ingresos verificados totales", utils().formatUsd(metrics.incomeTotalCents)],
      ["Activos hoy", metrics.activeToday], ["Activos semana", metrics.activeWeek], ["Activos mes", metrics.activeMonth]
    ];
    cards.forEach(([label, value]) => target?.append(metricCard(label, value)));
    renderBarList(byId("sv-admin-top-modules"), metrics.moduleOpens.slice(0, 8));
  }

  function userRows() {
    if (!state.snapshot) return [];
    const { profileById, planById, activeSubscriptionByUser } = maps();
    const lastActivity = new Map();
    state.snapshot.usage.forEach((event) => {
      if (!lastActivity.has(event.user_id)) lastActivity.set(event.user_id, event.occurred_at);
    });
    return state.snapshot.accounts.map((account) => {
      const profile = profileById.get(account.user_id) || {};
      const subscription = activeSubscriptionByUser.get(account.user_id) || null;
      const plan = subscription ? planById.get(subscription.plan_id) || null : null;
      const displayName = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.username || "Perfil incompleto";
      return { account, profile, subscription, plan, displayName, lastActivity: lastActivity.get(account.user_id) || null };
    });
  }

  function filterValue(id) {
    return String(byId(id)?.value || "").trim();
  }

  function filteredUsers() {
    const search = filterValue("sv-admin-user-search").toLocaleLowerCase("es");
    const role = filterValue("sv-admin-user-role");
    const plan = filterValue("sv-admin-user-plan");
    const career = filterValue("sv-admin-user-career");
    const semester = filterValue("sv-admin-user-semester");
    const institution = filterValue("sv-admin-user-institution");
    const sort = filterValue("sv-admin-user-sort") || "newest";
    const rows = userRows().filter((row) => {
      const haystack = `${row.displayName} ${row.account.email || ""} ${row.profile.username || ""}`.toLocaleLowerCase("es");
      return (!search || haystack.includes(search)) && (!role || row.account.role === role) &&
        (!plan || row.plan?.slug === plan) && (!career || row.profile.career === career) &&
        (!semester || row.profile.semester === semester) && (!institution || row.profile.institution === institution);
    });
    rows.sort((left, right) => {
      if (sort === "oldest") return new Date(left.account.auth_created_at) - new Date(right.account.auth_created_at);
      if (sort === "name") return left.displayName.localeCompare(right.displayName, "es");
      return new Date(right.account.auth_created_at) - new Date(left.account.auth_created_at);
    });
    return rows;
  }

  function fillUniqueSelect(id, values, emptyLabel) {
    const select = byId(id);
    if (!select) return;
    const current = select.value;
    const empty = node("option", "", emptyLabel);
    empty.value = "";
    const options = Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "es")).map((value) => {
      const option = node("option", "", value);
      option.value = value;
      return option;
    });
    select.replaceChildren(empty, ...options);
    if (options.some((option) => option.value === current)) select.value = current;
  }

  function profileComplete(profile) {
    return ["first_name", "last_name", "username", "career", "semester", "institution"].every((key) => Boolean(profile?.[key]));
  }

  function renderUsers() {
    const target = byId("sv-admin-users-table");
    clear(target);
    const all = userRows();
    fillUniqueSelect("sv-admin-user-career", all.map((row) => row.profile.career), "Todas");
    fillUniqueSelect("sv-admin-user-semester", all.map((row) => row.profile.semester), "Todos");
    fillUniqueSelect("sv-admin-user-institution", all.map((row) => row.profile.institution), "Todas");
    const rows = filteredUsers();
    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    state.userPage = Math.min(Math.max(1, state.userPage), pageCount);
    const pageRows = rows.slice((state.userPage - 1) * PAGE_SIZE, state.userPage * PAGE_SIZE);
    const pageLabel = byId("sv-admin-users-page");
    if (pageLabel) pageLabel.textContent = `Página ${state.userPage} de ${pageCount} · ${rows.length} cuentas`;
    if (byId("sv-admin-users-prev")) byId("sv-admin-users-prev").disabled = state.userPage <= 1;
    if (byId("sv-admin-users-next")) byId("sv-admin-users-next").disabled = state.userPage >= pageCount;
    if (!pageRows.length) return target?.append(emptyState("No hay usuarios para estos filtros."));
    const { table, body } = createTable(["Usuario", "Correo", "Rol", "Institución", "Carrera", "Semestre", "Plan", "Suscripción", "Registro", "Última actividad", "Perfil", "Acciones"]);
    pageRows.forEach((row) => {
      const tr = node("tr");
      [row.displayName, row.account.email || "Sin correo", row.account.role, row.profile.institution || "—", row.profile.career || "—", row.profile.semester || "—", row.plan?.name || "Sin plan", row.subscription?.status || "—", formatDate(row.account.auth_created_at), formatDate(row.lastActivity), profileComplete(row.profile) ? "Completo" : "Incompleto"].forEach((value) => tr.append(cell(value)));
      const actions = cell("");
      const button = node("button", "sv-btn sv-btn-secondary", "Ver detalle");
      button.type = "button";
      button.addEventListener("click", () => openUserDetail(row, button));
      actions.append(button);
      tr.append(actions);
      body.append(tr);
    });
    target?.append(table);
  }

  function detailRow(label, value) {
    const wrapper = node("div", "sv-admin-card");
    wrapper.append(node("strong", "", label), node("p", "", value || "Sin datos"));
    return wrapper;
  }

  function openUserDetail(row, trigger) {
    const body = node("div", "sv-admin-grid-two");
    body.append(
      detailRow("Nombre visible", row.displayName), detailRow("Correo", row.account.email || "Sin correo"),
      detailRow("Rol", row.account.role), detailRow("Plan actual", row.plan?.name || "Sin plan"),
      detailRow("Institución", row.profile.institution), detailRow("Carrera / semestre", [row.profile.career, row.profile.semester].filter(Boolean).join(" · ")),
      detailRow("Registro", formatDate(row.account.auth_created_at)), detailRow("Última actividad", formatDate(row.lastActivity))
    );
    const history = node("div", "sv-admin-card");
    history.style.gridColumn = "1 / -1";
    history.append(node("h3", "", "Historial de suscripción y pagos"));
    const subscriptions = state.snapshot.subscriptions.filter((item) => item.user_id === row.account.user_id);
    const payments = state.snapshot.payments.filter((item) => item.user_id === row.account.user_id);
    const planById = maps().planById;
    history.append(node("p", "", subscriptions.length ? subscriptions.map((item) => `${planById.get(item.plan_id)?.name || "Plan"}: ${item.status} (${formatDate(item.starts_at)})`).join(" | ") : "Sin historial de suscripciones."));
    history.append(node("p", "", payments.length ? payments.map((item) => `${utils().formatUsd(item.amount_cents)} · ${item.status} · ${formatDate(item.created_at)}`).join(" | ") : "Sin pagos registrados."));
    body.append(history);
    const actions = [];
    if (row.account.role !== "super_admin") {
      state.snapshot.plans.filter((plan) => plan.is_active).forEach((plan) => {
        const button = node("button", "sv-btn sv-btn-primary", `Asignar ${plan.name}`);
        button.type = "button";
        button.addEventListener("click", async () => {
          const confirmed = await confirmAction("Confirmar cambio de plan", `Se asignará ${plan.name} a ${row.displayName}. El cambio es atómico y quedará auditado.`);
          if (!confirmed) return;
          await runMutation(async () => service().assignPlan(row.account.user_id, plan.slug), "Plan asignado correctamente.");
          closeDialog();
        });
        actions.push(button);
      });
    }
    openDialog("Detalle de usuario", body, actions, trigger);
  }

  function centsInputValue(cents) {
    if (cents == null) return "";
    const value = Number(cents);
    return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
  }

  function renderPlans() {
    const target = byId("sv-admin-plans");
    clear(target);
    if (!state.snapshot?.plans.length) return target?.append(emptyState("No hay planes configurados."));
    state.snapshot.plans.forEach((plan) => {
      const card = node("article", "sv-admin-card sv-admin-plan-card");
      const form = node("form");
      form.append(node("h3", "", `${plan.name} (${plan.slug})`));
      const name = labeledInput("Nombre", plan.name, "text");
      const description = labeledInput("Descripción", plan.description || "", "text");
      const price = labeledInput("Precio USD (vacío = sin configurar)", centsInputValue(plan.price_cents), "text");
      price.input.inputMode = "decimal";
      const interval = labeledSelect("Intervalo", [["none", "Sin intervalo"], ["monthly", "Mensual"], ["yearly", "Anual"]], plan.billing_interval);
      const publicCheck = labeledCheck("Visible públicamente", plan.is_public);
      const purchasable = labeledCheck("Disponible para compra", plan.is_purchasable);
      const active = labeledCheck("Activo", plan.is_active);
      form.append(name.label, description.label, price.label, interval.label, publicCheck.label, purchasable.label, active.label);
      const save = node("button", "sv-btn sv-btn-primary", "Guardar plan");
      save.type = "submit";
      form.append(save);
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        let priceCents = null;
        try { if (price.input.value.trim()) priceCents = utils().parseDecimalToCents(price.input.value); }
        catch (error) { return setStatus(error.message, "error"); }
        if (purchasable.input.checked && (priceCents == null || priceCents <= 0 || interval.select.value === "none")) {
          return setStatus("Un plan comprable requiere precio positivo e intervalo de cobro.", "error");
        }
        await runMutation(() => service().updatePlan(plan.id, { name: name.input.value, description: description.input.value, price_cents: priceCents, billing_interval: interval.select.value, is_public: publicCheck.input.checked, is_purchasable: purchasable.input.checked, is_active: active.input.checked, sort_order: plan.sort_order }), "Plan actualizado.");
      });
      card.append(form);

      const entitlements = state.snapshot.entitlements.filter((item) => item.plan_id === plan.id);
      const list = node("div", "sv-admin-entitlement-list");
      list.append(node("h4", "", "Beneficios y límites configurados"));
      if (!entitlements.length) list.append(emptyState("Sin beneficios definitivos configurados."));
      entitlements.forEach((item) => {
        const row = node("div", "sv-admin-entitlement");
        const copy = node("div");
        copy.append(node("strong", "", item.label), node("p", "", `${item.capability_key}: ${String(item.value)}`));
        const remove = node("button", "sv-btn sv-btn-ghost", "Quitar");
        remove.type = "button";
        remove.addEventListener("click", async () => {
          if (await confirmAction("Quitar entitlement", `Se quitará ${item.label}. Esto no bloqueará módulos en este hito.`)) {
            await runMutation(() => service().deleteEntitlement(item.id), "Entitlement eliminado.");
          }
        });
        row.append(copy, remove);
        list.append(row);
      });
      card.append(list, entitlementForm(plan));
      target?.append(card);
    });
  }

  function labeledInput(labelText, value = "", type = "text") {
    const label = node("label", "", labelText);
    const input = node("input");
    input.type = type;
    input.value = String(value ?? "");
    label.append(input);
    return { label, input };
  }

  function labeledSelect(labelText, options, selected) {
    const label = node("label", "", labelText);
    const select = node("select");
    options.forEach(([value, text]) => {
      const option = node("option", "", text);
      option.value = value;
      option.selected = value === selected;
      select.append(option);
    });
    label.append(select);
    return { label, select };
  }

  function labeledCheck(labelText, checked = false) {
    const label = node("label", "sv-admin-check");
    const input = node("input");
    input.type = "checkbox";
    input.checked = Boolean(checked);
    label.append(input, document.createTextNode(labelText));
    return { label, input };
  }

  function entitlementForm(plan) {
    const form = node("form", "sv-admin-card");
    form.append(node("h4", "", "Agregar o actualizar entitlement"));
    const key = labeledInput("Clave de capacidad", "");
    const label = labeledInput("Etiqueta", "");
    const type = labeledSelect("Tipo", [["text", "Texto"], ["boolean", "Booleano"], ["integer", "Entero"]], "text");
    const value = labeledInput("Valor", "");
    const save = node("button", "sv-btn sv-btn-secondary", "Guardar entitlement");
    save.type = "submit";
    form.append(key.label, label.label, type.label, value.label, save);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!key.input.value.trim() || !label.input.value.trim()) return setStatus("Completa clave y etiqueta.", "error");
      await runMutation(() => service().upsertEntitlement({ plan_id: plan.id, capability_key: key.input.value, label: label.input.value, value_type: type.select.value, value: value.input.value, is_active: true }), "Entitlement guardado.");
    });
    return form;
  }

  function paymentFilters() {
    const status = filterValue("sv-payment-filter-status");
    const user = filterValue("sv-payment-filter-user");
    const plan = filterValue("sv-payment-filter-plan");
    const from = filterValue("sv-payment-filter-from");
    const to = filterValue("sv-payment-filter-to");
    return state.snapshot.payments.filter((payment) => {
      const created = new Date(payment.created_at);
      const beforeEnd = !to || created < new Date(`${to}T23:59:59.999`);
      return (!status || payment.status === status) && (!user || payment.user_id === user) && (!plan || payment.plan_id === plan) && (!from || created >= new Date(`${from}T00:00:00`)) && beforeEnd;
    });
  }

  function fillPaymentSelects() {
    const { profileById } = maps();
    const customers = state.snapshot.accounts.filter((item) => item.role !== "super_admin");
    [["sv-payment-user", false], ["sv-payment-filter-user", true]].forEach(([id, includeAll]) => {
      const select = byId(id);
      if (!select) return;
      const current = select.value;
      const options = [];
      if (includeAll) { const all = node("option", "", "Todos"); all.value = ""; options.push(all); }
      customers.forEach((account) => {
        const profile = profileById.get(account.user_id) || {};
        const option = node("option", "", profile.display_name || profile.username || account.email || account.user_id);
        option.value = account.user_id;
        options.push(option);
      });
      select.replaceChildren(...options);
      if (options.some((option) => option.value === current)) select.value = current;
    });
    [["sv-payment-plan", false], ["sv-payment-filter-plan", true]].forEach(([id, includeAll]) => {
      const select = byId(id);
      if (!select) return;
      const current = select.value;
      const options = [];
      if (includeAll) { const all = node("option", "", "Todos"); all.value = ""; options.push(all); }
      state.snapshot.plans.forEach((plan) => { const option = node("option", "", plan.name); option.value = plan.id; options.push(option); });
      select.replaceChildren(...options);
      if (options.some((option) => option.value === current)) select.value = current;
    });
  }

  function renderPayments() {
    fillPaymentSelects();
    const metrics = utils().computeDashboardMetrics(state.snapshot);
    const summary = byId("sv-admin-payment-summary");
    clear(summary);
    [["Verificados totales", utils().formatUsd(metrics.incomeTotalCents)], ["Pendientes", state.snapshot.payments.filter((item) => item.status === "pending").length], ["Rechazados", state.snapshot.payments.filter((item) => item.status === "rejected").length], ["Reembolsados", state.snapshot.payments.filter((item) => item.status === "refunded").length]].forEach(([label, value]) => summary?.append(metricCard(label, value)));
    const target = byId("sv-admin-payments");
    clear(target);
    const payments = paymentFilters();
    if (!payments.length) return target?.append(emptyState("No existen pagos para estos filtros. Ingresos verificados: USD 0,00 cuando no hay pagos verificados."));
    const { accountById, planById } = maps();
    const { table, body } = createTable(["Fecha", "Usuario", "Plan", "Importe", "Estado", "Método", "Referencia", "Acciones"]);
    payments.forEach((payment) => {
      const tr = node("tr");
      [formatDate(payment.created_at), accountById.get(payment.user_id)?.email || payment.user_id, planById.get(payment.plan_id)?.name || "Plan", utils().formatUsd(payment.amount_cents), payment.status, payment.payment_method, payment.reference || "—"].forEach((value) => tr.append(cell(value)));
      const actionsCell = cell("");
      const actions = node("div", "sv-admin-table-actions");
      const nextStates = payment.status === "pending" ? [["verified", "Verificar"], ["rejected", "Rechazar"]] : payment.status === "verified" ? [["refunded", "Reembolsar"]] : [];
      nextStates.forEach(([nextStatus, label]) => {
        const button = node("button", "sv-btn sv-btn-secondary", label);
        button.type = "button";
        button.addEventListener("click", async () => {
          const confirmed = await confirmAction(`Confirmar: ${label}`, `El pago por ${utils().formatUsd(payment.amount_cents)} cambiará de ${payment.status} a ${nextStatus}. La operación quedará auditada.`);
          if (confirmed) await runMutation(() => service().changePaymentStatus(payment.id, nextStatus), "Estado financiero actualizado.");
        });
        actions.append(button);
      });
      if (!nextStates.length) actions.append(node("span", "", "Estado final"));
      actionsCell.append(actions);
      tr.append(actionsCell);
      body.append(tr);
    });
    target?.append(table);
  }

  function renderUsage() {
    const metrics = utils().computeDashboardMetrics(state.snapshot);
    const target = byId("sv-admin-usage-metrics");
    clear(target);
    [["Usuarios activos hoy", metrics.activeToday], ["Usuarios activos semana", metrics.activeWeek], ["Usuarios activos mes", metrics.activeMonth], ["Comentarios enviados", state.snapshot.usage.filter((item) => item.event_type === "feedback_submit").length]].forEach(([label, value]) => target?.append(metricCard(label, value)));
    renderBarList(byId("sv-admin-usage-modules"), metrics.moduleOpens.slice(0, 12));
    const days = new Map();
    state.snapshot.usage.forEach((event) => {
      const date = new Date(event.occurred_at);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toLocaleDateString("es-EC");
      days.set(key, (days.get(key) || 0) + 1);
    });
    renderBarList(byId("sv-admin-usage-trend"), Array.from(days, ([key, count]) => ({ key, count })).slice(0, 14).reverse());
  }

  function feedbackItems() {
    const subject = filterValue("sv-admin-feedback-subject");
    const status = filterValue("sv-admin-feedback-state");
    const rating = Number(filterValue("sv-admin-feedback-rating"));
    return state.snapshot.feedback.filter((item) => {
      const stateMatches = !status || (status === "pending" && !item.approved && !item.response) || (status === "approved" && item.approved) || (status === "responded" && Boolean(item.response));
      return (!subject || item.subject === subject) && (!rating || item.rating === rating) && stateMatches;
    });
  }

  function renderFeedback() {
    const target = byId("sv-admin-feedback");
    clear(target);
    const items = feedbackItems();
    if (!items.length) return target?.append(emptyState("No hay comentarios para estos filtros."));
    items.forEach((item) => {
      const card = node("article", "sv-admin-card sv-admin-feedback-card");
      card.append(node("p", "sv-admin-meta", formatDate(item.created_at)), node("h3", "", item.author?.display_name || item.author?.username || "Usuario"), node("p", "", `Asunto: ${userData().SUBJECTS[item.subject] || item.subject} · ${item.rating}/5`), node("h4", "", "Comentario del usuario"), node("p", "", item.message));
      const approved = labeledCheck("Aprobado", item.approved);
      approved.input.addEventListener("change", async () => {
        approved.input.disabled = true;
        const previous = !approved.input.checked;
        try {
          const updated = await userData().updateFeedbackApproval(item.id, approved.input.checked);
          Object.assign(item, updated || { approved: approved.input.checked });
          setStatus("Moderación actualizada.", "success");
        } catch (_error) {
          approved.input.checked = previous;
          setStatus("No fue posible actualizar la moderación.", "error");
        } finally { approved.input.disabled = false; }
      });
      card.append(approved.label);
      const response = node("textarea");
      response.rows = 4;
      response.maxLength = 2000;
      response.value = item.response || "";
      response.setAttribute("aria-label", "Respuesta administrativa");
      const save = node("button", "sv-btn sv-btn-secondary", "Guardar respuesta");
      save.type = "button";
      save.addEventListener("click", async () => {
        save.disabled = true;
        try {
          const updated = await userData().updateFeedbackResponse(item.id, response.value);
          Object.assign(item, updated || { response: response.value });
          setStatus("Respuesta guardada.", "success");
        } catch (_error) { setStatus("No fue posible guardar la respuesta. El texto se conserva para reintentar.", "error"); }
        finally { save.disabled = false; }
      });
      card.append(response, save);
      target?.append(card);
    });
  }

  function auditMetadataSummary(metadata) {
    const allowed = new Set(["status", "previous_status", "amount_cents", "currency", "slug", "key", "capability_key", "approved", "responded", "source"]);
    return Object.entries(metadata || {}).filter(([key]) => allowed.has(key)).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "Sin metadata adicional";
  }

  function renderAudit() {
    const target = byId("sv-admin-audit");
    clear(target);
    const action = filterValue("sv-admin-audit-action").toLowerCase();
    const actor = filterValue("sv-admin-audit-actor");
    const from = filterValue("sv-admin-audit-from");
    const { accountById } = maps();
    fillUniqueSelect("sv-admin-audit-actor", state.snapshot.audit.map((item) => item.actor_user_id), "Todos");
    const items = state.snapshot.audit.filter((item) => (!action || item.action.toLowerCase().includes(action)) && (!actor || item.actor_user_id === actor) && (!from || new Date(item.occurred_at) >= new Date(`${from}T00:00:00`)));
    if (!items.length) return target?.append(emptyState("No hay actividad para estos filtros."));
    const { table, body } = createTable(["Fecha", "Actor", "Acción", "Entidad", "Resumen no sensible"]);
    items.forEach((item) => {
      const tr = node("tr");
      [formatDate(item.occurred_at), accountById.get(item.actor_user_id)?.email || (item.actor_user_id ? "Cuenta interna" : "Sistema"), item.action, `${item.entity_type}${item.entity_id ? ` · ${item.entity_id}` : ""}`, auditMetadataSummary(item.metadata)].forEach((value) => tr.append(cell(value)));
      body.append(tr);
    });
    target?.append(table);
  }

  function renderSettings() {
    if (byId("sv-setting-plus")) byId("sv-setting-plus").checked = settingValue("plus_available", false) === true;
    if (byId("sv-setting-manual-payments")) byId("sv-setting-manual-payments").checked = settingValue("manual_payments_enabled", true) === true;
    if (byId("sv-setting-plus-message")) byId("sv-setting-plus-message").value = String(settingValue("plus_availability_message", "Próximamente"));
  }

  function renderSecurity() {
    const target = byId("sv-admin-security");
    clear(target);
    const counts = new Map();
    state.snapshot.accounts.forEach((account) => counts.set(account.role, (counts.get(account.role) || 0) + 1));
    const roles = node("article", "sv-admin-card");
    roles.append(node("h3", "", "Cuentas por rol"));
    Array.from(counts, ([role, count]) => `${role}: ${count}`).forEach((line) => roles.append(node("p", "", line)));
    const rls = node("article", "sv-admin-card");
    rls.append(node("h3", "", "Contratos de seguridad conocidos"), node("p", "", "RLS requerido en cuentas, planes, entitlements, suscripciones, pagos, telemetría, auditoría y configuración."), node("p", "", "La publishable key no otorga privilegios administrativos. La autorización usa user_roles y RLS."), node("p", "", "Estado en vivo del Security Advisor: no consultado desde el navegador."));
    target?.append(roles, rls);
  }

  function renderAll() {
    renderDashboard();
    renderUsers();
    renderPlans();
    renderPayments();
    renderUsage();
    renderFeedback();
    renderAudit();
    renderSettings();
    renderSecurity();
  }

  async function loadSnapshot() {
    if (state.loading || !state.authorized) return;
    state.loading = true;
    byId("sv-admin-refresh-all")?.toggleAttribute("disabled", true);
    setStatus("Actualizando datos reales…");
    try {
      state.snapshot = await service().loadAdminSnapshot();
      renderAll();
      setStatus(`Datos actualizados: ${formatDate(new Date())}`, "success");
    } catch (error) {
      if (error?.code === "SESSION_EXPIRED") showAccess("Sesión expirada", "Inicia sesión nuevamente para continuar.", true);
      else setStatus("No fue posible actualizar los datos. Las secciones conservan el último estado disponible.", "error");
    } finally {
      state.loading = false;
      byId("sv-admin-refresh-all")?.toggleAttribute("disabled", false);
    }
  }

  async function runMutation(operation, successMessage) {
    if (state.loading || state.mutationBusy) return false;
    state.mutationBusy = true;
    setStatus("Guardando cambio…");
    try {
      await operation();
      setStatus(successMessage, "success");
      await loadSnapshot();
      return true;
    } catch (error) {
      setStatus(error?.code === "SESSION_EXPIRED" ? "La sesión expiró. Inicia sesión nuevamente." : "No fue posible guardar el cambio.", "error");
      return false;
    } finally {
      state.mutationBusy = false;
    }
  }

  async function activate() {
    document.body.classList.add("sv-admin-mode");
    showAccess("Verificando acceso…", "La autorización se comprueba con la sesión y las políticas RLS.");
    try {
      const status = await root.SuiteVetAuth?.initialize?.();
      if (!status?.configured) return showAccess("Centro de Control no disponible", "Supabase no está configurado en este entorno. La aplicación académica pública sigue disponible.");
      const user = await root.SuiteVetAuth.getCurrentUser();
      if (!user) return showAccess("Inicia sesión", "El Centro de Control requiere una cuenta Super Admin.", true);
      const allowed = await userData().isSuperAdmin();
      if (!allowed) {
        state.authorized = false;
        return showAccess("Acceso restringido", "Tu cuenta no tiene permisos para consultar datos administrativos. La base de datos aplica la misma restricción mediante RLS.");
      }
      state.authorized = true;
      showApp(user);
      setSection(state.section, false);
      await loadSnapshot();
    } catch (_error) {
      state.authorized = false;
      showAccess("Acceso restringido", "No fue posible verificar permisos administrativos. Vuelve a la aplicación académica o inicia sesión nuevamente.");
    }
  }

  function deactivate() {
    document.body.classList.remove("sv-admin-mode");
    closeDrawer(false);
    closeDialog(false);
  }

  function setSection(section, moveFocus = true) {
    if (!Object.prototype.hasOwnProperty.call(TITLES, section)) section = "dashboard";
    state.section = section;
    document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
      const active = panel.dataset.adminPanel === section;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    document.querySelectorAll("[data-admin-section]").forEach((button) => {
      if (button.dataset.adminSection === section) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    const title = byId("sv-admin-section-title");
    if (title) title.textContent = TITLES[section];
    closeDrawer(false);
    if (moveFocus) byId("sv-admin-main")?.focus({ preventScroll: true });
  }

  function openDrawer(trigger) {
    const sidebar = byId("sv-admin-sidebar");
    if (!sidebar) return;
    state.drawerTrigger = trigger || document.activeElement;
    sidebar.classList.add("is-open");
    byId("sv-admin-backdrop")?.classList.add("is-open");
    byId("sv-admin-menu-toggle")?.setAttribute("aria-expanded", "true");
    sidebar.focus({ preventScroll: true });
  }

  function closeDrawer(restore = true) {
    byId("sv-admin-sidebar")?.classList.remove("is-open");
    byId("sv-admin-backdrop")?.classList.remove("is-open");
    byId("sv-admin-menu-toggle")?.setAttribute("aria-expanded", "false");
    if (restore) state.drawerTrigger?.focus?.({ preventScroll: true });
    state.drawerTrigger = null;
  }

  function trapFocus(event, container) {
    const focusable = Array.from(container.querySelectorAll(FOCUSABLE)).filter((item) => !item.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function openDialog(title, body, actions = [], trigger = document.activeElement) {
    const overlay = byId("sv-admin-dialog");
    if (!overlay) return;
    state.dialogTrigger = trigger;
    byId("sv-admin-dialog-title").textContent = title;
    byId("sv-admin-dialog-body").replaceChildren(body);
    const footer = byId("sv-admin-dialog-actions");
    const close = node("button", "sv-btn sv-btn-secondary", "Cerrar");
    close.type = "button";
    close.dataset.adminDialogClose = "";
    footer.replaceChildren(...actions, close);
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    overlay.querySelector(".sv-admin-dialog")?.focus({ preventScroll: true });
  }

  function closeDialog(restore = true, result = false) {
    const overlay = byId("sv-admin-dialog");
    if (!overlay?.classList.contains("is-open")) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    const resolver = state.confirmResolve;
    state.confirmResolve = null;
    if (resolver) resolver(result);
    if (restore) state.dialogTrigger?.focus?.({ preventScroll: true });
    state.dialogTrigger = null;
  }

  function confirmAction(title, message) {
    return new Promise((resolve) => {
      const body = node("p", "", message);
      const confirm = node("button", "sv-btn sv-btn-primary", "Confirmar");
      confirm.type = "button";
      confirm.addEventListener("click", () => closeDialog(true, true), { once: true });
      state.confirmResolve = resolve;
      openDialog(title, body, [confirm]);
    });
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();
    if (state.paymentSubmitting) return;
    state.paymentSubmitting = true;
    const form = event.currentTarget;
    const amountText = filterValue("sv-payment-amount");
    let amountCents;
    try {
      try { amountCents = utils().parseDecimalToCents(amountText); }
      catch (error) { setStatus(error.message, "error"); return; }
      if (amountCents <= 0) { setStatus("El importe debe ser mayor que cero.", "error"); return; }
      const confirmed = await confirmAction("Crear pago manual", `Se creará un pago pendiente por ${utils().formatUsd(amountCents)}. No se contará como ingreso hasta ser verificado.`);
      if (!confirmed) return;
      const paidAt = filterValue("sv-payment-paid-at");
      const created = await runMutation(() => service().createManualPayment({ user_id: filterValue("sv-payment-user"), plan_id: filterValue("sv-payment-plan"), amount_cents: amountCents, payment_method: filterValue("sv-payment-method"), reference: filterValue("sv-payment-reference"), note: filterValue("sv-payment-note"), paid_at: paidAt ? new Date(paidAt).toISOString() : null }), "Pago pendiente creado.");
      if (created) form.reset();
    } finally {
      state.paymentSubmitting = false;
    }
  }

  function exportPayments() {
    const payments = paymentFilters();
    const { planById, accountById } = maps();
    const csv = utils().paymentsCsv(payments, planById, accountById);
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = node("a");
    link.href = url;
    link.download = `suite-vet-pagos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    root.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function saveSettings(event) {
    event.preventDefault();
    const message = filterValue("sv-setting-plus-message");
    if (!message || message.length > 500 || /[<>]/.test(message)) return setStatus("Escribe un mensaje público válido de hasta 500 caracteres.", "error");
    await runMutation(async () => {
      await service().updateSetting("plus_available", Boolean(byId("sv-setting-plus")?.checked));
      await service().updateSetting("manual_payments_enabled", Boolean(byId("sv-setting-manual-payments")?.checked));
      await service().updateSetting("plus_availability_message", message);
    }, "Configuración guardada.");
  }

  function bindEvents() {
    document.querySelectorAll("[data-admin-back]").forEach((button) => button.addEventListener("click", () => root.SuiteVet?.showView?.("home")));
    byId("sv-admin-signin")?.addEventListener("click", () => root.SuiteVetAuthUI?.openModal?.("signin"));
    byId("sv-admin-signout")?.addEventListener("click", async () => {
      try { await root.SuiteVetAuth.signOut(); root.SuiteVet?.showView?.("landing"); }
      catch (_error) { showAccess("No fue posible cerrar la sesión", "Inténtalo nuevamente desde el menú de cuenta."); }
    });
    byId("sv-admin-refresh-all")?.addEventListener("click", loadSnapshot);
    document.querySelectorAll("[data-admin-section]").forEach((button) => button.addEventListener("click", () => setSection(button.dataset.adminSection)));
    byId("sv-admin-menu-toggle")?.addEventListener("click", (event) => openDrawer(event.currentTarget));
    byId("sv-admin-backdrop")?.addEventListener("click", () => closeDrawer());
    byId("sv-admin-sidebar")?.addEventListener("click", (event) => { if (event.target.closest("[data-admin-drawer-close]")) closeDrawer(); });
    document.addEventListener("keydown", (event) => {
      const dialog = byId("sv-admin-dialog");
      if (dialog?.classList.contains("is-open")) {
        if (event.key === "Escape") { event.preventDefault(); closeDialog(); }
        else if (event.key === "Tab") trapFocus(event, dialog);
        return;
      }
      const sidebar = byId("sv-admin-sidebar");
      if (sidebar?.classList.contains("is-open")) {
        if (event.key === "Escape") { event.preventDefault(); closeDrawer(); }
        else if (event.key === "Tab") trapFocus(event, sidebar);
      }
    });
    byId("sv-admin-dialog")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget || event.target.closest("[data-admin-dialog-close]")) closeDialog();
    });
    ["sv-admin-user-search", "sv-admin-user-role", "sv-admin-user-plan", "sv-admin-user-career", "sv-admin-user-semester", "sv-admin-user-institution", "sv-admin-user-sort"].forEach((id) => byId(id)?.addEventListener("input", () => { state.userPage = 1; renderUsers(); }));
    byId("sv-admin-users-prev")?.addEventListener("click", () => { state.userPage -= 1; renderUsers(); });
    byId("sv-admin-users-next")?.addEventListener("click", () => { state.userPage += 1; renderUsers(); });
    byId("sv-admin-payment-form")?.addEventListener("submit", handlePaymentSubmit);
    ["sv-payment-filter-status", "sv-payment-filter-user", "sv-payment-filter-plan", "sv-payment-filter-from", "sv-payment-filter-to"].forEach((id) => byId(id)?.addEventListener("input", renderPayments));
    byId("sv-payment-export")?.addEventListener("click", exportPayments);
    ["sv-admin-feedback-subject", "sv-admin-feedback-state", "sv-admin-feedback-rating"].forEach((id) => byId(id)?.addEventListener("input", renderFeedback));
    ["sv-admin-audit-action", "sv-admin-audit-actor", "sv-admin-audit-from"].forEach((id) => byId(id)?.addEventListener("input", renderAudit));
    byId("sv-admin-settings-form")?.addEventListener("submit", saveSettings);
    document.addEventListener("suitevet:viewchange", (event) => {
      const view = event.detail?.view;
      if (view === "feedback-admin") return root.SuiteVet?.showView?.("admin");
      if (view === "admin") activate(); else deactivate();
    });
  }

  function initialize() {
    if (state.initialized) return;
    state.initialized = true;
    bindEvents();
    root.SuiteVetAuth?.subscribeToAuthChanges?.(() => {
      if (root.SuiteVet?.currentView === "admin") activate();
    });
    if (root.SuiteVet?.currentView === "admin") activate();
  }

  root.SuiteVetAdminCenter = Object.freeze({ activate, closeDialog, computeUserRows: userRows, initialize, setSection });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})(window);
