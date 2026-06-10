import { useEffect, useMemo, useState } from 'react';
import { getAuthor, getEssay, getEssayNeighbors, loadExhibition } from './content';
import type { Essay, Exhibition } from './content';
import { essayPath, homePath, parseHashRoute } from './routing';
import { trackPageView } from './analytics';
import { Home } from './components/Home';
import { Reader } from './components/Reader';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; exhibition: Exhibition }
  | { status: 'error'; message: string };

function useReveal(dep: unknown) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal:not(.in)'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dep]);
}

function useHashRoute() {
  const [route, setRoute] = useState(() => parseHashRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

export function App() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const route = useHashRoute();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'forest');
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadExhibition()
      .then((exhibition) => {
        if (!cancelled) setState({ status: 'ready', exhibition });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: 'error', message: error instanceof Error ? error.message : '전시 콘텐츠를 불러오지 못했습니다.' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.classList.add('motion-stalled');
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  useReveal(route.view);

  const detail = useMemo(() => {
    if (state.status !== 'ready' || route.view !== 'essay') return null;
    try {
      const essay = getEssay(state.exhibition, route.essayId);
      const author = getAuthor(state.exhibition, essay.author);
      const neighbors = getEssayNeighbors(state.exhibition, essay.id);
      return { essay, author, ...neighbors };
    } catch {
      return null;
    }
  }, [route, state]);

  useEffect(() => {
    if (state.status !== 'ready') return;

    if (route.view === 'essay' && detail) {
      trackPageView(`${detail.essay.title} | 솔솔글방 온라인 전시`);
      return;
    }

    trackPageView('솔솔글방 온라인 전시');
  }, [detail, route.view, state.status]);

  const openEssay = (essay: Essay) => {
    window.location.hash = essayPath(essay.id);
  };

  const goHome = () => {
    window.location.hash = homePath();
  };

  if (state.status === 'loading') {
    return (
      <>
        <div className="paper-grain" />
        <main className="app-status">전시를 불러오는 중입니다.</main>
      </>
    );
  }

  if (state.status === 'error') {
    return (
      <>
        <div className="paper-grain" />
        <main className="app-status">{state.message}</main>
      </>
    );
  }

  return (
    <>
      <div className="paper-grain" />
      {route.view === 'essay' && detail ? (
        <Reader essay={detail.essay} author={detail.author} prev={detail.prev} next={detail.next} onBack={goHome} onNav={openEssay} />
      ) : (
        <Home exhibition={state.exhibition} onOpen={openEssay} />
      )}
    </>
  );
}
