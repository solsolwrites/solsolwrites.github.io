import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export function ForestRidges({ offset = 0 }: { offset?: number }) {
  return (
    <svg className="ridges" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rg-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sage)" stopOpacity="0.30" />
          <stop offset="1" stopColor="var(--sage)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <g style={{ transform: `translateY(${offset * 0.15}px)` }}>
        <path fill="url(#rg-far)" d="M0,300 C220,230 360,260 520,250 C720,238 880,290 1080,262 C1240,240 1360,268 1440,256 L1440,420 L0,420 Z" />
      </g>
      <g style={{ transform: `translateY(${offset * 0.32}px)` }}>
        <path fill="var(--forest)" fillOpacity="0.55" d="M0,330 C180,300 320,340 480,320 C680,296 820,346 1010,330 C1200,314 1330,344 1440,330 L1440,420 L0,420 Z" />
      </g>
      <g style={{ transform: `translateY(${offset * 0.5}px)` }}>
        <path fill="var(--forest-deep)" d="M0,372 C200,352 300,380 500,366 C700,352 860,386 1060,372 C1240,360 1360,384 1440,374 L1440,420 L0,420 Z" />
      </g>
    </svg>
  );
}

export function TreeLine({ side = 'left' }: { side?: 'left' | 'right' }) {
  const flip = side === 'right' ? 'scaleX(-1)' : 'none';
  return (
    <svg viewBox="0 0 140 520" width="140" height="520" aria-hidden="true" style={{ transform: flip, overflow: 'visible' }}>
      <g stroke="var(--hero-fg)" strokeOpacity="0.22" fill="none" strokeLinecap="round">
        <path strokeWidth="2.4" d="M40,520 C42,400 30,330 38,250 C44,190 30,140 40,70" />
        <path strokeWidth="1.4" d="M40,300 C20,288 8,300 -4,288" />
        <path strokeWidth="1.4" d="M38,230 C58,216 72,228 88,214" />
        <path strokeWidth="1.4" d="M40,160 C22,150 12,160 0,150" />
        <path strokeWidth="1.2" d="M39,110 C58,100 70,110 84,98" />
        <path strokeWidth="2" d="M96,520 C98,420 90,360 98,300 C104,250 96,210 104,160" />
        <path strokeWidth="1.2" d="M98,330 C118,318 130,330 144,318" />
        <path strokeWidth="1.2" d="M100,250 C82,238 70,250 56,238" />
      </g>
    </svg>
  );
}

export function Drifters({ count = 14 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: (i * 29) % 100,
        top: (i * 47) % 100,
        size: 7 + ((i * 5) % 14),
        dur: 30 + ((i * 7) % 24),
        delay: -((i * 5) % 32),
        rot: (i * 53) % 360,
        kind: i % 2 === 0 ? 'leaf' : 'dot',
      })),
    [count],
  );

  return (
    <div className="drifters" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {items.map((item, index) => (
        <span key={index} style={{ position: 'absolute', left: `${item.left}%`, top: `${item.top}%`, width: item.size, height: item.size, animation: `drift ${item.dur}s ${item.delay}s var(--ease-soft) infinite`, transform: `rotate(${item.rot}deg)` }}>
          {item.kind === 'leaf' ? (
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M12 2 C18 6 20 14 12 22 C4 14 6 6 12 2 Z" fill="var(--sage)" fillOpacity="0.42" />
              <path d="M12 4 L12 20" stroke="var(--forest)" strokeOpacity="0.3" strokeWidth="0.7" />
            </svg>
          ) : (
            <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--hero-fg)', opacity: 0.18 }} />
          )}
        </span>
      ))}
    </div>
  );
}

export function AuthorMotif({ motif = 'fern', className, style }: { motif?: string; className?: string; style?: CSSProperties }) {
  const motifs: Record<string, ReactNode> = {
    fern: (
      <g stroke="var(--accent)" fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M60,108 C60,80 60,52 60,28" strokeWidth="2.2" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 96 - i * 13;
          const len = 10 + i * 4.5;
          return (
            <g key={i}>
              <path d={`M60,${y} C${60 - len * 0.6},${y - 2} ${60 - len},${y - 7} ${60 - len - 4},${y - 12}`} />
              <path d={`M60,${y} C${60 + len * 0.6},${y - 2} ${60 + len},${y - 7} ${60 + len + 4},${y - 12}`} />
            </g>
          );
        })}
      </g>
    ),
    leaf: (
      <g>
        <path d="M64,104 C30,86 28,44 64,18 C100,44 98,86 64,104 Z" fill="var(--accent)" fillOpacity="0.16" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M64,100 L64,24" stroke="var(--accent)" strokeWidth="1.4" />
      </g>
    ),
    branch: (
      <g stroke="var(--accent)" fill="none" strokeWidth="1.7" strokeLinecap="round">
        <path d="M20,100 C44,92 56,70 60,44 C62,30 68,20 84,14" strokeWidth="2.2" />
        <path d="M52,58 C60,52 70,52 80,46" />
        <path d="M46,74 C40,68 32,66 24,68" />
        <path d="M60,44 C68,42 74,36 76,28" />
      </g>
    ),
  };

  return (
    <svg className={className} viewBox="0 0 120 120" style={style} aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" rx="3" fill="var(--paper-2)" />
      <rect x="6" y="6" width="108" height="108" rx="2" fill="none" stroke="var(--accent)" strokeOpacity="0.22" />
      {motifs[motif] ?? motifs.fern}
    </svg>
  );
}

export function CornerSprig({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 160 160" width="160" height="160" style={style} aria-hidden="true">
      <g stroke="var(--sage)" strokeOpacity="0.4" fill="none" strokeWidth="1.4" strokeLinecap="round">
        <path d="M10,150 C50,130 80,90 96,40" strokeWidth="1.8" />
        <path d="M60,98 C58,80 66,66 84,58" />
        <path d="M44,118 C30,114 22,104 20,90" />
        <path d="M80,60 C92,54 100,42 100,28" />
        <path d="M96,40 C108,40 116,32 120,20" />
      </g>
    </svg>
  );
}
