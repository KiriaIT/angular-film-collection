/** როცა პირველადი `posterUrl` ვერ იტვირთება — იგივე სერვისი, სათაურით (placehold.co + .png). */
export function posterFallbackUrl(title: string): string {
  const short = title.trim().slice(0, 40) || 'Film';
  return `https://placehold.co/300x450.png?text=${encodeURIComponent(short)}`;
}
