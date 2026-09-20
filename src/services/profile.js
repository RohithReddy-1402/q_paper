import { API, apiFetch } from "./api";
import { resizeToSquare } from "../utils/resizeImage";

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

/** The backend returns a relative avatar path; prefix it with the API base. */
export function avatarSrc(path) {
  return path ? `${API}${path}` : null;
}

export async function fetchProfile() {
  return readJson(await apiFetch("/api/profile/me"), "Could not load your profile");
}

export async function updateProfile(fields) {
  return readJson(
    await apiFetch("/api/profile/me", {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(fields),
    }),
    "Could not save your profile"
  );
}

const HISTORY_ENDPOINTS = {
  uploads: "/api/profile/uploads",
  downloads: "/api/profile/downloads",
  payments: "/api/profile/payments",
  redeems: "/api/rewards/redemptions",
};

/** Cursor-paginated history: resolves to { items, hasMore, nextCursor }. */
export async function fetchHistory(kind, { before, limit = 20 } = {}) {
  const qs = new URLSearchParams({ limit: String(limit) });
  if (before) qs.set("before", before);
  return readJson(await apiFetch(`${HISTORY_ENDPOINTS[kind]}?${qs}`), "Could not load history");
}

/** Resize → presigned PUT straight to storage → confirm. Resolves to { avatarUrl }. */
export async function uploadAvatar(file) {
  const blob = await resizeToSquare(file);

  const { key, uploadUrl } = await readJson(
    await apiFetch("/api/profile/avatar/upload-url", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ contentType: blob.type, size: blob.size }),
    }),
    "Could not start the upload"
  );

  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": blob.type },
    body: blob,
  });
  if (!put.ok) throw new Error("Image upload failed — please try again");

  return readJson(
    await apiFetch("/api/profile/avatar/confirm", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ key }),
    }),
    "Could not save your photo"
  );
}

export async function removeAvatar() {
  const res = await apiFetch("/api/profile/avatar", { method: "DELETE" });
  if (!res.ok) throw new Error("Could not remove your photo");
}
