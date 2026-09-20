const ALLOWED = ["image/webp", "image/jpeg", "image/png"];

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Center-crops an image to a square and downsizes it (default 256px) so the
 * avatar upload is tiny (tens of KB). Prefers WebP, falling back to JPEG if the
 * browser can't encode it (the blob's real type is what gets uploaded).
 */
export async function resizeToSquare(file, size = 256) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That image couldn't be read — try a JPG, PNG or WebP");
  }

  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size
  );
  bitmap.close?.();

  let blob = await toBlob(canvas, "image/webp", 0.85);
  if (!blob || !ALLOWED.includes(blob.type)) blob = await toBlob(canvas, "image/jpeg", 0.85);
  if (!blob) throw new Error("Couldn't process that image");
  return blob;
}
