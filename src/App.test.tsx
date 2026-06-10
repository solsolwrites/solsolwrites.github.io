import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Exhibition } from './content';
import { App } from './App';
import { trackPageView } from './analytics';

const { exhibition } = vi.hoisted(() => ({
  exhibition: {
  intro: {
    title: '솔솔글방 온라인 전시',
    years: '2021-2026',
    tagline: '서로의 글을 가장 먼저 읽어준 다섯 해',
    body: ['전시 소개'],
  },
  authors: [
    {
      id: 'sushell',
      name: '수셸',
      motif: 'leaf',
      line: '문장 곁에 머무는 사람',
    },
  ],
  essays: [
    {
      id: 's1',
      author: 'sushell',
      title: '첫 번째 글',
      date: '2026.06.10',
      read: 3,
      excerpt: '첫 번째 글 소개',
      paragraphs: ['첫 번째 글 본문'],
    },
  ],
  } satisfies Exhibition,
}));

vi.mock('./content', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./content')>();
  return {
    ...actual,
    loadExhibition: vi.fn().mockResolvedValue(exhibition),
  };
});

vi.mock('./analytics', () => ({
  trackPageView: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('App analytics', () => {
  it('tracks home and essay hash routes as page views', async () => {
    window.scrollTo = vi.fn();
    window.history.replaceState(null, '', '/');

    render(<App />);

    await waitFor(() => {
      expect(trackPageView).toHaveBeenCalledWith('솔솔글방 온라인 전시');
    });

    window.location.hash = '#/essay/s1';

    await waitFor(() => {
      expect(trackPageView).toHaveBeenCalledWith('첫 번째 글 | 솔솔글방 온라인 전시');
    });
  });
});
