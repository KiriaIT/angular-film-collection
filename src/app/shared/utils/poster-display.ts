/**
 * Keeps `films.json` posterUrl values unchanged. placehold.co often serves more reliably
 * when the size segment includes an extension (e.g. `/300x450.png` vs `/300x450`).
 */
export function posterDisplayUrl(url: string): string {
  if (!url.includes('placehold.co')) {
    return url;
  }
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'placehold.co') {
      return url;
    }
    const path = parsed.pathname.replace(/^\//, '');
    if (!path) {
      return url;
    }
    if (/\.(png|jpg|jpeg|webp|gif)$/i.test(path)) {
      return url;
    }
    parsed.pathname = `/${path}.png`;
    return parsed.toString();
  } catch {
    return url;
  }
}
