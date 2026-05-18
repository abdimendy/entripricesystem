/** Trigger a file download from a Blob in the browser. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Parse JSON error body when axios responseType is blob. */
export async function blobErrorMessage(blob, fallback = 'Download failed') {
  if (!(blob instanceof Blob)) return fallback;
  if (blob.type?.includes('json') || blob.size < 4096) {
    try {
      const text = await blob.text();
      const parsed = JSON.parse(text);
      return parsed.message || parsed.title || fallback;
    } catch {
      /* not JSON */
    }
  }
  return fallback;
}
