/** Payments (real money) are integer paise on the backend; show as rupees. */
export function formatRupees(paise = 0) {
  const rupees = paise / 100;
  return `₹${Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}`;
}

/** Contributor rewards are integer points (1 point = ₹0.10, see back/config/rewards.config.js). */
export function formatPoints(points = 0) {
  const n = Math.round(points);
  return `${n.toLocaleString("en-IN")} pt${Math.abs(n) === 1 ? "" : "s"}`;
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
