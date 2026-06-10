import { afterEach, describe, expect, it, vi } from 'vitest';
import exhibition from '../public/content/exhibition.json';
import latteEssays from '../public/content/essays/latte.json';
import miyaEssays from '../public/content/essays/miya.json';
import sushellEssays from '../public/content/essays/sushell.json';
import { getEssay, getEssayNeighbors, hasImage, loadExhibition } from './content';
import type { Essay, Exhibition } from './content';

type EssayManifestItem = Omit<Essay, 'paragraphs'> & { body: string };

function toEssayFixture(essay: EssayManifestItem): Essay {
  return {
    ...essay,
    paragraphs: [],
  };
}

const exhibitionWithEssays: Exhibition = {
  ...exhibition,
  essays: [...sushellEssays, ...latteEssays, ...miyaEssays].map((essay) => toEssayFixture(essay)),
};

function expectNewestFirstIds(essays: EssayManifestItem[], prefix: string) {
  expect(essays.map((essay) => essay.id)).toEqual(
    essays.map((_, index) => `${prefix}${index + 1}`),
  );
  expect(essays.map((essay) => essay.body)).toEqual(
    essays.map((_, index) => `${essays[0].author}/${prefix}${index + 1}.md`),
  );
}

describe('exhibition content helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps per-author essay ids newest-first with matching body filenames', () => {
    expectNewestFirstIds(latteEssays, 'l');
    expectNewestFirstIds(miyaEssays, 'm');
    expectNewestFirstIds(sushellEssays, 's');
  });

  it('returns previous and next essays within the same author only', () => {
    const { prev, next } = getEssayNeighbors(exhibitionWithEssays, 's2');

    expect(prev?.id).toBe('s1');
    expect(next?.id).toBe('s3');
  });

  it('treats images as optional content', () => {
    const essay = getEssay(exhibitionWithEssays, 's1');

    expect(hasImage(essay)).toBe(false);
  });

  it('loads exhibition metadata and merges per-author essay files', async () => {
    const responses: Record<string, unknown> = {
      '/content/exhibition.json': {
        intro: exhibition.intro,
        authors: exhibition.authors,
      },
      '/content/essays/sushell.json': [
        { ...sushellEssays[0], id: 'split-sushell', author: 'sushell', body: 'sushell/s1.md' },
      ],
      '/content/essays/latte.json': [
        { ...latteEssays[0], id: 'split-latte', author: 'latte', body: 'latte/l1.md' },
      ],
      '/content/essays/miya.json': [
        { ...miyaEssays[0], id: 'split-miya', author: 'miya', body: 'miya/m1.md' },
      ],
    };
    const markdownResponses: Record<string, string> = {
      '/content/essays/sushell/s1.md': '첫 문단에는 *기울임*이 있다.\n\n둘째 문단이다.',
      '/content/essays/latte/l1.md': '라떼 첫 문단',
      '/content/essays/miya/m1.md': '미야 첫 문단',
    };
    const fetchMock = vi.fn(async (url: string) => ({
      ok: true,
      status: 200,
      json: async () => responses[url],
      text: async () => markdownResponses[url],
    })) as unknown as typeof fetch;
    vi.stubGlobal('fetch', fetchMock);

    const loaded = await loadExhibition();

    expect(fetchMock).toHaveBeenCalledWith('/content/exhibition.json');
    expect(fetchMock).toHaveBeenCalledWith('/content/essays/sushell.json');
    expect(fetchMock).toHaveBeenCalledWith('/content/essays/latte.json');
    expect(fetchMock).toHaveBeenCalledWith('/content/essays/miya.json');
    expect(fetchMock).toHaveBeenCalledWith('/content/essays/sushell/s1.md');
    expect(loaded.essays.map((essay) => essay.author)).toEqual(exhibition.authors.map((author) => author.id));
    expect(getEssay(loaded, 'split-sushell').paragraphs).toEqual([
      [
        { type: 'text', text: '첫 문단에는 ' },
        { type: 'emphasis', text: '기울임' },
        { type: 'text', text: '이 있다.' },
      ],
      [{ type: 'text', text: '둘째 문단이다.' }],
    ]);
  });
});
