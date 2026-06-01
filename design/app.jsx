/* global React, ReactDOM, Home, Reader, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor */
// 솔솔글방 — 앱 셸 / 라우팅 / 전환 / Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "forest",
  "display": "song",
  "body": "gowun"
}/*EDITMODE-END*/;

const DISPLAY_FONTS = {
  song: "'Song Myung', serif",
  myeongjo: "'Nanum Myeongjo', serif",
};
const BODY_FONTS = {
  gowun: "'Gowun Batang', serif",
  myeongjo: "'Nanum Myeongjo', serif",
};

function useReveal(dep) {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = React.useState("home");      // "home" | "reader"
  const [current, setCurrent] = React.useState(null);  // essay id
  const { essays, authors } = window.SOLSOL;

  // 테마/폰트 적용
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
    document.documentElement.style.setProperty("--display", DISPLAY_FONTS[t.display] || DISPLAY_FONTS.song);
    document.documentElement.style.setProperty("--body", BODY_FONTS[t.body] || BODY_FONTS.gowun);
  }, [t.theme, t.display, t.body]);

  useReveal(view);

  // 안전망: 애니메이션 타임라인이 멈춘(비페인트) 환경이면 콘텐츠를 강제로 표시
  React.useEffect(() => {
    const probe = () => {
      const a = document.timeline.currentTime;
      setTimeout(() => {
        if (document.timeline.currentTime === a) {
          document.documentElement.classList.add("motion-stalled");
        }
      }, 450);
    };
    const id = setTimeout(probe, 350);
    return () => clearTimeout(id);
  }, []);

  const essay = essays.find(e => e.id === current);
  const author = essay ? authors.find(a => a.id === essay.author) : null;
  // 같은 작가 내 이전/다음
  let prev = null, next = null;
  if (essay) {
    const list = essays.filter(e => e.author === essay.author);
    const idx = list.findIndex(e => e.id === essay.id);
    prev = list[idx - 1] || null;
    next = list[idx + 1] || null;
  }

  const open = (e) => { setCurrent(e.id); setView("reader"); };
  const back = () => { setView("home"); };

  return (
    <>
      <div className="paper-grain" />
      {view === "home"
        ? <Home onOpen={open} />
        : <Reader essay={essay} author={author} onBack={back} onNav={open} prev={prev} next={next} />}

      <TweaksPanel>
        <TweakSection label="테마 방향" />
        <TweakRadio label="분위기" value={t.theme}
          options={[{value:"forest",label:"고요한 숲"},{value:"mist",label:"이끼와 안개"},{value:"ink",label:"종이와 잉크"}]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="활자" />
        <TweakRadio label="제목 서체" value={t.display}
          options={[{value:"song",label:"송명"},{value:"myeongjo",label:"나눔명조"}]}
          onChange={(v) => setTweak("display", v)} />
        <TweakRadio label="본문 서체" value={t.body}
          options={[{value:"gowun",label:"고운바탕"},{value:"myeongjo",label:"나눔명조"}]}
          onChange={(v) => setTweak("body", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
