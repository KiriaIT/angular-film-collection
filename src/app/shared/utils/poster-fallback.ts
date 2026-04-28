/** Placeholder when a remote poster fails to load (broken URL, blockers, offline). */
export function posterFallbackUrl(title: string): string {
  const short = title.trim().slice(0, 28) || 'Film';
  return `https://placehold.co/300x450/1a1a2e/e8e8e8?text=${encodeURIComponent(short)}`;
}
