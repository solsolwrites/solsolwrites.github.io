import { describe, expect, it } from 'vitest';
import exhibition from '../public/content/exhibition.json';
import { getAuthor, getEssay, getEssayNeighbors, hasImage } from './content';

describe('exhibition content helpers', () => {
  it('finds essays and their authors from the JSON source', () => {
    const essay = getEssay(exhibition, 's1');
    const author = getAuthor(exhibition, essay.author);

    expect(essay.title).toBe('유리병에 담은 오후');
    expect(author.name).toBe('스쉘');
  });

  it('returns previous and next essays within the same author only', () => {
    const { prev, next } = getEssayNeighbors(exhibition, 's2');

    expect(prev?.id).toBe('s1');
    expect(next?.id).toBe('s3');
  });

  it('treats images as optional content', () => {
    const essay = getEssay(exhibition, 's1');

    expect(hasImage(essay)).toBe(false);
  });
});
