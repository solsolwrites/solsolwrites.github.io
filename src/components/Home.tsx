import { useEffect, useState } from 'react';
import type { Author, Essay, Exhibition } from '../content';
import { Drifters, ForestRidges, TreeLine } from './Forest';
import { ExhibitionVisual } from './Visual';

type HomeProps = {
  exhibition: Exhibition;
  onOpen: (essay: Essay) => void;
};

function Hero({ intro }: { intro: Exhibition['intro'] }) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="hero">
      <div className="hero-grain" />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${scroll * 0.18}px)` }}>
        <ForestRidges offset={scroll} />
      </div>
      <div className="hero-trees l"><TreeLine side="left" /></div>
      <div className="hero-trees r"><TreeLine side="right" /></div>
      <Drifters count={16} />
      <div className="hero-inner wrap" style={{ transform: `translateY(${scroll * -0.12}px)`, opacity: Math.max(0, 1 - scroll / 600) }}>
        <div className="hero-eyebrow">SOLSOL · ONLINE EXHIBITION</div>
        <h1 className="hero-title">
          {intro.title.split('').map((char, index) => (
            <span key={`${char}-${index}`} className="ch" style={{ animationDelay: `${0.45 + index * 0.16}s` }}>{char}</span>
          ))}
        </h1>
        <div className="hero-years">{intro.years}</div>
        <div className="hero-tag">{intro.tagline}</div>
        <div className="hero-divider" />
      </div>
      <div className="scroll-cue" aria-hidden="true"><span className="arrow" /></div>
    </header>
  );
}

function Intro({ intro }: { intro: Exhibition['intro'] }) {
  return (
    <section className="intro wrap">
      <div className="intro-grid reveal">
        <div className="intro-body">
          {intro.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

function EssayCard({ author, essay, onOpen, delay }: { author: Author; essay: Essay; onOpen: (essay: Essay) => void; delay: number }) {
  const open = () => onOpen(essay);
  return (
    <article className="card reveal" style={{ transitionDelay: `${delay}ms` }} onClick={open} role="button" tabIndex={0} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && open()}>
      <div className="card-thumb">
        <ExhibitionVisual author={author} essay={essay} />
        <div className="veil" />
        <div className="open">글 읽기 →</div>
      </div>
      <div className="card-meta">
        <span>{essay.date}</span>
      </div>
      <h3 className="card-title">{essay.title}</h3>
      <p className="card-excerpt">{essay.excerpt}</p>
    </article>
  );
}

function AuthorBlock({ author, index, essays, onOpen }: { author: Author; index: number; essays: Essay[]; onOpen: (essay: Essay) => void }) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <section className="author-block" id={author.id}>
      <div className="author-head reveal">
        <span className="author-index">{number}</span>
        <div>
          <h2 className="author-name">{author.name}</h2>
          <div className="author-line">{author.line}</div>
        </div>
      </div>
      <div className="cards">
        {essays.map((essay, essayIndex) => (
          <EssayCard key={essay.id} author={author} essay={essay} onOpen={onOpen} delay={essayIndex * 80} />
        ))}
      </div>
    </section>
  );
}

export function Home({ exhibition, onOpen }: HomeProps) {
  return (
    <div className="home">
      <Hero intro={exhibition.intro} />
      <Intro intro={exhibition.intro} />
      <div className="authors wrap">
        {exhibition.authors.map((author, index) => (
          <AuthorBlock key={author.id} author={author} index={index} essays={exhibition.essays.filter((essay) => essay.author === author.id)} onOpen={onOpen} />
        ))}
      </div>
      <footer className="footer wrap">솔솔글방 · {exhibition.intro.years} · 천천히, 그러나 멈추지 말고</footer>
    </div>
  );
}
