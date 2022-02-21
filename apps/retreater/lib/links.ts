export function generatePostTypeUrl(type: string, slug: string | number): string {
  if (type === 'post') return `/${slug}`;
  return `/${type}/${slug}`;
}
