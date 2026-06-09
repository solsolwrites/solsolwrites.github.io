/* global React, ForestRidges, TreeLine, Drifters, AuthorMotif */
// 솔솔글방 — 메인 화면

function Hero() {
  const [scroll, setScroll] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const title = "솔솔글방";
  return (
    <header className="hero">
      <div className="hero-grain" />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${scroll * 0.18}px)` }}>
        <ForestRidges offset={scroll} />
      </div>
      <div className="hero-trees l"><TreeLine side="left" /></div>
      <div className="hero-trees r"><TreeLine side="right" /></div>
      <Drifters count={16} />
      <div className="hero-inner wrap" style={{ transform: `translateY(${scroll * -0.12}px)`, opacity: Math.max(0, 1 - scroll / 600) }}>
        <div className="hero-eyebrow">SOLSOL · ONLINE EXHIBITION</div>
        <h1 className="hero-title">
          {title.split("").map((c, i) => (
            <span key={i} className="ch" style={{ animationDelay: `${0.25 + i * 0.09}s` }}>{c}</span>
          ))}
        </h1>
        <div className="hero-years">2021 — 2026</div>
        <div className="hero-tag">다섯 해 동안, 우리는 매주 한 줄씩 자랐다</div>
        <div className="hero-divider" />
      </div>
      <div className="scroll-cue"><span>S C R O L L</span><span className="dot" /></div>
    </header>
  );
}

function Intro() {
  const { intro } = window.SOLSOL;
  return (
    <section className="intro wrap">
      <div className="intro-grid reveal">
        <div className="intro-mark">
          溫<br />故
          <small>솔솔글방 5년의 기록</small>
        </div>
        <div className="intro-body">
          {intro.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}

function EssayCard({ essay, motif, onOpen, delay }) {
  return (
    <article className="card reveal" style={{ transitionDelay: `${delay}ms` }}
             onClick={() => onOpen(essay)} role="button" tabIndex={0}
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(essay)}>
      <div className="card-thumb">
        <AuthorMotif motif={motif} />
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

function AuthorBlock({ author, index, essays, onOpen }) {
  const idx = String(index + 1).padStart(2, "0");
  return (
    <section className="author-block" id={author.id}>
      <div className="author-head reveal">
        <span className="author-index">{idx}</span>
        <div>
          <h2 className="author-name">{author.name}</h2>
          <div className="author-line">{author.line}</div>
        </div>
        <span className="author-count">FIVE PIECES · 다섯 편</span>
      </div>
      <div className="cards">
        {essays.map((e, i) => (
          <EssayCard key={e.id} essay={e} motif={author.motif} onOpen={onOpen} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

function Home({ onOpen }) {
  const { authors, essays } = window.SOLSOL;
  return (
    <div className="home">
      <Hero />
      <Intro />
      <div className="authors wrap">
        {authors.map((a, i) => (
          <AuthorBlock key={a.id} author={a} index={i}
            essays={essays.filter(e => e.author === a.id)} onOpen={onOpen} />
        ))}
      </div>
      <footer className="footer wrap">솔솔글방 · 2021 — 2026 · 천천히, 그러나 멈추지 말고</footer>
    </div>
  );
}

Object.assign(window, { Home });
