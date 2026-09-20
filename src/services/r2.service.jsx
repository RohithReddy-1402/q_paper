import { apiFetch } from "./api";

/**
 * Uploads a PDF straight to R2 via a presigned URL, then registers it for
 * admin verification. Both backend calls are authenticated so the paper (and
 * later its reward) is tied to the logged-in user.
 *
 * Always resolves to `{ status, message? }` — never undefined: `status` is the
 * `/upload` HTTP status on success, or 0 for a network/storage failure.
 */
export const handleUpload = async (file, metadata) => {
  try {
    const urlResponse = await apiFetch("/api/r2/upload-url", { method: "GET" });
    if (!urlResponse.ok) {
      const err = await urlResponse.json().catch(() => ({}));
      return { status: urlResponse.status, message: err?.message || "Could not start the upload" };
    }
    const { key, uploadUrl, r2Id } = await urlResponse.json();

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error("R2 upload failed");
    }
    const r2ETag = uploadResponse.headers.get("ETag");

    const dbResponse = await apiFetch("/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...metadata,
        paper_id: r2Id,
        r2Key: key,
        r2ETag,
        fileId: r2Id,
      }),
    });

    const result = await dbResponse.json().catch(() => ({}));
    return {
      status: dbResponse.status,
      ...result,
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return { status: 0, message: error.message };
  }
};

export const viewPaper=  (key)=>{
  return `https://pdf.nitkkrpyqs.in/${key}`;
}
