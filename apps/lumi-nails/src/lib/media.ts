const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

/** Resolve relative `/uploads/...` paths against the API host for next/image + <img>. */
export function mediaUrl(url: string | undefined | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (!API_URL) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}
