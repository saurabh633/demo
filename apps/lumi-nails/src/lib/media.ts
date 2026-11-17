const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "/api-proxy"
).replace(/\/$/, "");

/** Resolve relative `/uploads/...` paths against the API base for next/image + <img>. */
export function mediaUrl(url: string | undefined | null) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  if (!API_URL) return path;
  return `${API_URL}${path}`;
}
