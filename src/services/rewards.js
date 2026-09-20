import { apiFetch } from "./api";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function readJson(res, fallback) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || fallback);
    err.status = res.status;
    throw err;
  }
  return data;
}

const post = (path, body) =>
  apiFetch(path, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body ?? {}) });

/** Cash amounts, plan costs (paise), balance and reward rate — all from the backend config. */
export async function fetchRewardOptions() {
  return readJson(await apiFetch("/api/rewards/options"), "Could not load redeem options");
}

export async function redeemCash({ amount, upiId }) {
  return readJson(await post("/api/rewards/redeem/cash", { amount, upiId }), "Could not redeem");
}

/** `recipientEmail` omitted → redeems for the logged-in user. */
export async function redeemPlan({ plan, recipientEmail }) {
  return readJson(await post("/api/rewards/redeem/plan", { plan, recipientEmail }), "Could not redeem");
}

/* ------------------------------ admin ------------------------------ */

export async function fetchPayouts(status = "pending", before) {
  const qs = new URLSearchParams({ status, limit: "50" });
  if (before) qs.set("before", before);
  return readJson(await apiFetch(`/api/rewards/admin/payouts?${qs}`), "Could not load payouts");
}

export async function markPayoutPaid(id, txnRef) {
  return readJson(await post(`/api/rewards/admin/payouts/${id}/paid`, { txnRef }), "Could not mark as paid");
}

export async function rejectPayout(id, note) {
  return readJson(await post(`/api/rewards/admin/payouts/${id}/reject`, { note }), "Could not reject payout");
}

/** A discretionary bonus not tied to any specific upload (e.g. completing a full semester's set). */
export async function grantBonus({ userEmail, points, reason, note }) {
  return readJson(await post("/api/rewards/admin/bonus", { userEmail, points, reason, note }), "Could not grant bonus points");
}

export async function fetchBonusGrants(before) {
  const qs = new URLSearchParams({ limit: "50" });
  if (before) qs.set("before", before);
  return readJson(await apiFetch(`/api/rewards/admin/bonuses?${qs}`), "Could not load bonus history");
}
