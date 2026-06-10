import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackPageView } from './analytics';

describe('analytics page views', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a GA4 page_view event for the current hash route', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    window.history.replaceState(null, '', '/#/essay/s1');

    trackPageView('첫 번째 글 | 솔솔글방 온라인 전시');

    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_title: '첫 번째 글 | 솔솔글방 온라인 전시',
      page_location: 'http://localhost:3000/#/essay/s1',
      page_path: '/#/essay/s1',
    });
  });

  it('does nothing when the Google tag is unavailable', () => {
    vi.stubGlobal('gtag', undefined);

    expect(() => trackPageView('솔솔글방 온라인 전시')).not.toThrow();
  });

  it('uses the previous virtual page as the next page referrer', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);

    window.history.replaceState(null, '', '/');
    trackPageView('솔솔글방 온라인 전시');
    window.history.replaceState(null, '', '/#/essay/s1');
    trackPageView('첫 번째 글 | 솔솔글방 온라인 전시');

    expect(gtag).toHaveBeenLastCalledWith('event', 'page_view', {
      page_title: '첫 번째 글 | 솔솔글방 온라인 전시',
      page_location: 'http://localhost:3000/#/essay/s1',
      page_path: '/#/essay/s1',
      page_referrer: 'http://localhost:3000/',
    });
  });
});
