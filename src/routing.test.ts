import { describe, expect, it } from 'vitest';
import { essayPath, parseHashRoute } from './routing';

describe('hash routing', () => {
  it('parses the home route from empty and root hashes', () => {
    expect(parseHashRoute('')).toEqual({ view: 'home' });
    expect(parseHashRoute('#/')).toEqual({ view: 'home' });
  });

  it('parses essay detail routes', () => {
    expect(parseHashRoute('#/essay/s1')).toEqual({ view: 'essay', essayId: 's1' });
  });

  it('builds GitHub Pages friendly essay paths', () => {
    expect(essayPath('m5')).toBe('#/essay/m5');
  });
});
