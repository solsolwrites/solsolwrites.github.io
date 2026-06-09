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

export type MarkdownSegment = {
  type: 'text' | 'emphasis';
  text: string;
};

export type EssayParagraph = string | MarkdownSegment[];

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
  paragraphs: EssayParagraph[];
  image?: ImageContent;
};

export type Exhibition = {
  intro: Intro;
  authors: Author[];
  essays: Essay[];
};

type ExhibitionMetadata = Omit<Exhibition, 'essays'>;
type EssayMetadata = Omit<Essay, 'paragraphs'> & {
  body: string;
  paragraphs?: EssayParagraph[];
};

function parseMarkdownInline(markdown: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  const emphasisPattern = /(\*[^*\n]+\*|_[^_\n]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = emphasisPattern.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: markdown.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'emphasis', text: match[0].slice(1, -1) });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markdown.length) {
    segments.push({ type: 'text', text: markdown.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', text: '' }];
}

export function parseMarkdownBody(markdown: string): MarkdownSegment[][] {
  return markdown
    .trim()
    .split(/\n\s*\n+/)
    .map((paragraph) => parseMarkdownInline(paragraph.replace(/\s*\n\s*/g, ' ').trim()))
    .filter((paragraph) => paragraph.some((segment) => segment.text.length > 0));
}

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
  const metadata = await response.json() as ExhibitionMetadata;
  const essaysByAuthor = await Promise.all(metadata.authors.map(async (author) => {
    const essaysResponse = await fetch(`/content/essays/${author.id}.json`);
    if (!essaysResponse.ok) {
      throw new Error(`Failed to load essays for ${author.id}: ${essaysResponse.status}`);
    }
    const essayMetadata = await essaysResponse.json() as Array<Essay | EssayMetadata>;
    return Promise.all(essayMetadata.map(async (essay) => {
      if (!('body' in essay)) {
        return essay;
      }

      const bodyResponse = await fetch(essay.body.startsWith('/') ? essay.body : `/content/essays/${essay.body}`);
      if (!bodyResponse.ok) {
        throw new Error(`Failed to load essay body for ${essay.id}: ${bodyResponse.status}`);
      }
      const markdown = await bodyResponse.text();
      const { body: _body, ...essayContent } = essay;
      return {
        ...essayContent,
        paragraphs: parseMarkdownBody(markdown),
      };
    }));
  }));

  return {
    ...metadata,
    essays: essaysByAuthor.flat(),
  };
}
