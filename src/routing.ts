export type Route = { view: 'home' } | { view: 'essay'; essayId: string };

export function parseHashRoute(hash: string): Route {
  const normalized = hash.replace(/^#/, '') || '/';
  const match = normalized.match(/^\/essay\/([^/]+)$/);

  if (match) {
    return { view: 'essay', essayId: decodeURIComponent(match[1]) };
  }

  return { view: 'home' };
}

export function essayPath(essayId: string): string {
  return `#/essay/${encodeURIComponent(essayId)}`;
}

export function homePath(): string {
  return '#/';
}
