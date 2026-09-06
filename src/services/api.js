// Central API helper: Bearer-token auth + rate-limit helpers.
// Backend (branch feature/mailSystem) switched from cookie auth to
// `Authorization: Bearer <jwt>` and added per-IP download rate limiting.

export const API = import.meta.env.VITE_BACKEND_ENDPOINT;

const TOKEN_KEY = "token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * fetch wrapper that attaches the Bearer token and clears it on 401.
 * `path` is appended to the API base (e.g. apiFetch("/auth/check")).
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    credentials: "include", // harmless now, kept for the legacy cookie
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401) {
    clearToken();
  }
  return res;
}

/* ------------------------------------------------------------------ */
/* Email verification (backend branch feature/mailVerification)        */
/* ------------------------------------------------------------------ */

/**
 * POST /api/email-verification/resend
 * Returns { status, message, retryAfter } instead of throwing so callers can
 * branch on 200 / 208 (already verified) / 404 / 429 (rate limited).
 */
export async function resendVerificationEmail(EmailID) {
  const res = await fetch(`${API}/api/email-verification/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ EmailID }),
  });
  let body = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON body */
  }
  const retryAfter = Number(body?.retryAfter ?? res.headers.get("Retry-After"));
  return {
    status: res.status,
    message: body?.message || "",
    retryAfter: Number.isFinite(retryAfter) ? retryAfter : null,
  };
}

/**
 * GET /api/email-verification/status — one-off check of the *current* DB state
 * (unrelated to whatever was true when the session token was issued).
 * Returns { emailVerified, EmailID } or null when there is no valid session.
 */
export async function getVerificationStatus() {
  try {
    const res = await apiFetch("/api/email-verification/status", {
      method: "GET",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * SSE stream that pushes the moment the emailed link is clicked anywhere.
 * The JWT goes in the query string on purpose: EventSource cannot set an
 * Authorization header, and cross-site cookies are unreliable here.
 * Returns a cleanup function; safe to call when there is no token (no-op).
 */
export function watchEmailVerification(onVerified) {
  const token = getToken();
  if (!token || typeof EventSource === "undefined") return () => {};

  let es;
  try {
    es = new EventSource(
      `${API}/api/email-verification/stream?token=${encodeURIComponent(token)}`,
    );
  } catch {
    return () => {};
  }

  const finish = () => {
    es.close();
    onVerified();
  };

  // Sent immediately on connect with the current state, so this also covers
  // "already verified before this screen even loaded".
  es.addEventListener("status", (e) => {
    try {
      const { emailVerified } = JSON.parse(e.data);
      if (emailVerified) finish();
    } catch {
      /* ignore malformed payload — keep listening */
    }
  });

  es.addEventListener("verified", finish);

  // EventSource reconnects on its own; nothing to do on a dropped connection.
  es.onerror = () => {};

  return () => es.close();
}

/**
 * Reads the daily-quota RateLimit-* headers from a download response.
 * Returns nulls for logged-in / unlimited users (headers absent).
 */
export function parseRateLimit(res) {
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  return {
    limit: num(res.headers.get("RateLimit-Limit")),
    remaining: num(res.headers.get("RateLimit-Remaining")),
    reset: num(res.headers.get("RateLimit-Reset")),
  };
}

/**
 * Pulls the user-facing message + seconds-to-wait out of a 429 response.
 */
export async function readRateLimitError(res) {
  let message = "Too many downloads. Please slow down.";
  let retryAfter = Number(res.headers.get("Retry-After"));
  try {
    const body = await res.clone().json();
    if (body?.message) message = body.message;
    if (Number.isFinite(Number(body?.retryAfter))) {
      retryAfter = Number(body.retryAfter);
    }
  } catch {
    /* non-JSON body */
  }
  return { message, retryAfter: Number.isFinite(retryAfter) ? retryAfter : null };
}
