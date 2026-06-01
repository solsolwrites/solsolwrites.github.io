export type Intro = {
  title: string;
  years: string;
  tagline: string;
  body: string[];
};

export type ImageContent = {
  src?: string;
  alt?: string;
};

export type Author = {
  id: string;
  name: string;
  hue?: number;
  motif: 'fern' | 'leaf' | 'branch' | string;
  line: string;
  image?: ImageContent;
};

export type Essay = {
  id: string;
  author: string;
  title: string;
  date: string;
  read: number;
  excerpt: string;
  paragraphs: string[];
  image?: ImageContent;
};

export type Exhibition = {
  intro: Intro;
  authors: Author[];
  essays: Essay[];
};

export function getEssay(exhibition: Exhibition, essayId: string): Essay {
  const essay = exhibition.essays.find((item) => item.id === essayId);
  if (!essay) {
    throw new Error(`Essay not found: ${essayId}`);
  }
  return essay;
}

export function getAuthor(exhibition: Exhibition, authorId: string): Author {
  const author = exhibition.authors.find((item) => item.id === authorId);
  if (!author) {
    throw new Error(`Author not found: ${authorId}`);
  }
  return author;
}

export function getEssayNeighbors(exhibition: Exhibition, essayId: string): { prev: Essay | null; next: Essay | null } {
  const essay = getEssay(exhibition, essayId);
  const byAuthor = exhibition.essays.filter((item) => item.author === essay.author);
  const index = byAuthor.findIndex((item) => item.id === essay.id);

  return {
    prev: byAuthor[index - 1] ?? null,
    next: byAuthor[index + 1] ?? null,
  };
}

export function hasImage(item: { image?: ImageContent }): boolean {
  return Boolean(item.image?.src);
}

export async function loadExhibition(): Promise<Exhibition> {
  const response = await fetch('/content/exhibition.json');
  if (!response.ok) {
    throw new Error(`Failed to load exhibition content: ${response.status}`);
  }
  return response.json() as Promise<Exhibition>;
}
