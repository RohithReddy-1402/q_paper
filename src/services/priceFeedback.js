import { apiFetch } from "./api";

/** POST /api/price-feedback — lets a visitor suggest what they'd pay per plan. */
export async function submitPriceFeedback({ monthly, yearly, lifetime }) {
  const res = await apiFetch("/api/price-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      suggestedMonthly: monthly,
      suggestedYearly: yearly,
      suggestedLifetime: lifetime,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Could not submit feedback");
  return data;
}
