/* global React, AuthorMotif, CornerSprig */
// 솔솔글방 — 글 조회(읽기) 화면

function Reader({ essay, author, onBack, onNav, prev, next }) {
  const mainRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);

  // 읽기 진행 바
  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [essay.id]);

  // 문단 순차 등장
  React.useEffect(() => {
    window.scrollTo(0, 0);
    const ps = mainRef.current.querySelectorAll("p.para");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    ps.forEach(p => io.observe(p));
    return () => io.disconnect();
  }, [essay.id]);

  return (
    <div className="reader">
      <aside className="reader-aside">
        <div className="aside-grain" />
        <CornerSprig className="sprig" style={{ position: "absolute", right: -30, bottom: -20 }} />
        <button className="back-btn" onClick={onBack}>← 전시로 돌아가기</button>

        <div style={{ marginTop: "auto" }}>
          <div className="aside-author">
            <AuthorMotif motif={author.motif} className="am" />
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
              <span className="t">{prev ? prev.title : "처음 글"}</span>
            </button>
            <button disabled={!next} onClick={() => next && onNav(next)}>
              <span className="dir">다음 →</span>
              <span className="t">{next ? next.title : "마지막 글"}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="reader-main" ref={mainRef}>
        <div className="read-progress"><div className="bar" style={{ width: `${progress * 100}%` }} /></div>
        <div className="reader-body">
          <div className="reader-kicker">솔솔글방 졸업전시 · {author.name}</div>
          <p className="reader-excerpt">{essay.excerpt}</p>
          {essay.paragraphs.map((p, i) => (
            <p className="para" key={i}>{p}</p>
          ))}
          <div className="reader-end">
            <svg className="leaf" viewBox="0 0 40 40" width="34" height="34">
              <path d="M20 4 C30 12 32 26 20 38 C8 26 10 12 20 4 Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M20 7 L20 35" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { Reader });
