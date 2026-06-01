import { useEffect, useRef, useState } from 'react';
import type { Author, Essay } from '../content';
import { AuthorMotif, CornerSprig } from './Forest';

type ReaderProps = {
  essay: Essay;
  author: Author;
  prev: Essay | null;
  next: Essay | null;
  onBack: () => void;
  onNav: (essay: Essay) => void;
};

export function Reader({ essay, author, prev, next, onBack, onNav }: ReaderProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [essay.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const paragraphs = Array.from(mainRef.current?.querySelectorAll('p.para') ?? []);
    if (!('IntersectionObserver' in window)) {
      paragraphs.forEach((paragraph) => paragraph.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    paragraphs.forEach((paragraph) => observer.observe(paragraph));
    return () => observer.disconnect();
  }, [essay.id]);

  return (
    <div className="reader">
      <aside className="reader-aside">
        <div className="aside-grain" />
        <CornerSprig style={{ position: 'absolute', right: -30, bottom: -20 }} />
        <button className="back-btn" onClick={onBack}>← 전시로 돌아가기</button>

        <div style={{ marginTop: 'auto' }}>
          <div className="aside-author">
            {author.image?.src ? <img className="am" src={author.image.src} alt={`${author.name} 이미지`} /> : <AuthorMotif motif={author.motif} className="am" />}
            <div>
              <div className="an">{author.name}</div>
              <div className="al">{author.line}</div>
            </div>
          </div>
          <h1 className="aside-title">{essay.title}</h1>
          <div className="aside-meta">
            <span>{essay.date}</span>
          </div>
          <div className="aside-divider" />
          <div className="aside-nav">
            <button disabled={!prev} onClick={() => prev && onNav(prev)}>
              <span className="dir">← 이전</span>
              <span className="t">{prev ? prev.title : '처음 글'}</span>
            </button>
            <button disabled={!next} onClick={() => next && onNav(next)}>
              <span className="dir">다음 →</span>
              <span className="t">{next ? next.title : '마지막 글'}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="reader-main" ref={mainRef}>
        <div className="read-progress"><div className="bar" style={{ width: `${progress * 100}%` }} /></div>
        <div className="reader-body">
          <p className="reader-excerpt">{essay.excerpt}</p>
          {essay.paragraphs.map((paragraph, index) => (
            <p className="para" key={index}>{paragraph}</p>
          ))}
          <div className="reader-end">
            <svg className="leaf" viewBox="0 0 40 40" width="34" height="34">
              <path d="M20 4 C30 12 32 26 20 38 C8 26 10 12 20 4 Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M20 7 L20 35" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            </svg>
            <div className="txt">끝</div>
          </div>
        </div>
      </main>
    </div>
  );
}
