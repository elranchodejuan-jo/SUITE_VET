// =============================================================================
// SUITE VET - Utilidades puras para planes, dinero y metricas SaaS.
// =============================================================================

(function (root) {
  "use strict";

  if (root.SuiteVetSaasUtils) return;

  const USD = new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const MAX_SAFE_CENTS = BigInt(Number.MAX_SAFE_INTEGER);

  function parseDecimalToCents(value) {
    const normalized = String(value ?? "").trim().replace(",", ".");
    if (!/^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,2})?$/.test(normalized)) {
      throw new TypeError("Usa un importe positivo con un maximo de dos decimales.");
    }
    const [whole, fraction = ""] = normalized.split(".");
    const cents = BigInt(whole) * 100n + BigInt((fraction + "00").slice(0, 2));
    if (cents > MAX_SAFE_CENTS) throw new RangeError("El importe supera el limite admitido.");
    return Number(cents);
  }

  function formatUsd(cents) {
    const safeCents = Number(cents);
    if (!Number.isSafeInteger(safeCents)) return USD.format(0);
    return USD.format(safeCents / 100);
  }

  function localPeriodStarts(now = new Date()) {
    const current = new Date(now);
    if (Number.isNaN(current.getTime())) throw new TypeError("Fecha invalida");
    const day = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    const week = new Date(day);
    const weekday = (day.getDay() + 6) % 7;
    week.setDate(day.getDate() - weekday);
    const month = new Date(current.getFullYear(), current.getMonth(), 1);
    return Object.freeze({ day, week, month, now: current });
  }

  function isAtOrAfter(value, boundary) {
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) && timestamp >= boundary.getTime();
  }

  function uniqueUsers(events, boundary) {
    return new Set(
      events
        .filter((event) => isAtOrAfter(event.occurred_at, boundary))
        .map((event) => event.user_id)
        .filter(Boolean)
    ).size;
  }

  function verifiedIncome(payments, boundary = null) {
    return payments
      .filter((payment) => payment.status === "verified")
      .filter((payment) => !boundary || isAtOrAfter(payment.verified_at, boundary))
      .reduce((total, payment) => total + (Number.isSafeInteger(Number(payment.amount_cents)) ? Number(payment.amount_cents) : 0), 0);
  }

  function moduleOpenCounts(events) {
    const counts = new Map();
    events.filter((event) => event.event_type === "module_open" && event.resource_key).forEach((event) => {
      counts.set(event.resource_key, (counts.get(event.resource_key) || 0) + 1);
    });
    return Array.from(counts, ([key, count]) => ({ key, count }))
      .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));
  }

  function computeDashboardMetrics(snapshot, now = new Date()) {
    const accounts = Array.isArray(snapshot?.accounts) ? snapshot.accounts : [];
    const subscriptions = Array.isArray(snapshot?.subscriptions) ? snapshot.subscriptions : [];
    const payments = Array.isArray(snapshot?.payments) ? snapshot.payments : [];
    const usage = Array.isArray(snapshot?.usage) ? snapshot.usage : [];
    const feedback = Array.isArray(snapshot?.feedback) ? snapshot.feedback : [];
    const plans = Array.isArray(snapshot?.plans) ? snapshot.plans : [];
    const starts = localPeriodStarts(now);
    const customers = accounts.filter((account) => account.role !== "super_admin");
    const customerIds = new Set(customers.map((account) => account.user_id));
    const planById = new Map(plans.map((plan) => [plan.id, plan.slug]));
    const activeSubscriptions = subscriptions.filter((subscription) =>
      subscription.status === "active" && customerIds.has(subscription.user_id)
    );
    const planCount = (slug) => activeSubscriptions.filter((subscription) => planById.get(subscription.plan_id) === slug).length;

    return Object.freeze({
      academicUsers: customers.length,
      newToday: customers.filter((account) => isAtOrAfter(account.auth_created_at, starts.day)).length,
      newWeek: customers.filter((account) => isAtOrAfter(account.auth_created_at, starts.week)).length,
      newMonth: customers.filter((account) => isAtOrAfter(account.auth_created_at, starts.month)).length,
      freeActive: planCount("free"),
      plusActive: planCount("plus"),
      pendingFeedback: feedback.filter((item) => !item.approved && !item.response).length,
      pendingPayments: payments.filter((payment) => payment.status === "pending").length,
      incomeTodayCents: verifiedIncome(payments, starts.day),
      incomeWeekCents: verifiedIncome(payments, starts.week),
      incomeMonthCents: verifiedIncome(payments, starts.month),
      incomeTotalCents: verifiedIncome(payments),
      activeToday: uniqueUsers(usage, starts.day),
      activeWeek: uniqueUsers(usage, starts.week),
      activeMonth: uniqueUsers(usage, starts.month),
      moduleOpens: moduleOpenCounts(usage)
    });
  }

  function safeCsvCell(value) {
    let text = String(value ?? "");
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function paymentsCsv(payments, planById = new Map(), accountById = new Map()) {
    const rows = [["Fecha", "Usuario", "Plan", "Estado", "Importe USD", "Metodo", "Referencia"]];
    payments.forEach((payment) => {
      rows.push([
        payment.created_at || "",
        accountById.get(payment.user_id)?.email || payment.user_id || "",
        planById.get(payment.plan_id)?.name || "",
        payment.status || "",
        formatUsd(payment.amount_cents),
        payment.payment_method || "",
        payment.reference || ""
      ]);
    });
    return rows.map((row) => row.map(safeCsvCell).join(",")).join("\r\n");
  }

  root.SuiteVetSaasUtils = Object.freeze({
    computeDashboardMetrics,
    formatUsd,
    localPeriodStarts,
    moduleOpenCounts,
    parseDecimalToCents,
    paymentsCsv,
    safeCsvCell,
    verifiedIncome
  });
})(typeof window === "undefined" ? globalThis : window);
