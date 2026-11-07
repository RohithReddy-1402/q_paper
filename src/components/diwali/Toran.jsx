import { useEffect, useId, useMemo, useRef, useState } from "react";

const TONES = ["o", "y", "r"];

const quad = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

const buildLayout = (width) => {
  const compact = width < 640;
  const unit = compact ? 84 : 124;
  const dip = compact ? 11 : 14;
  const bead = compact ? 3.6 : 4.6;
  const band = compact ? 6 : 8;
  const perSwag = compact ? 7 : 9;
  const count = Math.ceil(width / unit);
  const offset = (width - count * unit) / 2;
  const middle = (perSwag - 1) / 2;

  const swags = Array.from({ length: count }, (_, s) => {
    const start = offset + s * unit;
    const mid = start + unit / 2;
    const beads = Array.from({ length: perSwag }, (_, k) => {
      const t = (k + 0.5) / perSwag;
      return {
        x: quad(t, start, mid, start + unit),
        y: quad(t, band, band + dip * 2, band),
        tone: k === middle ? "r" : k % 2 ? "y" : "o",
      };
    });
    const leaves = [0.3, 0.5, 0.7].map((f, k) => ({ x: start + unit * f, angle: (k - 1) * 10 }));
    return { mid, beads, leaves };
  });

  const strands = Array.from({ length: count + 1 }, (_, i) => offset + i * unit);
  const height = Math.ceil(band + bead * 5.6 + 3);

  return { compact, band, bead, dip, swags, strands, height, leafScale: (dip * 1.05) / 22 };
};

export default function Toran() {
  const ref = useRef(null);
  const id = useId().replace(/:/g, "");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => (width ? buildLayout(width) : null), [width]);

  return (
    <div ref={ref} className="dw-toran">
      {layout && (
        <svg width={width} height={layout.height} viewBox={`0 0 ${width} ${layout.height}`} focusable="false">
          <defs>
            <radialGradient id={`${id}-o`} cx="35%" cy="35%" r="70%">
              <stop offset="0" stopColor="#fed7aa" />
              <stop offset="0.45" stopColor="#f97316" />
              <stop offset="1" stopColor="#9a3412" />
            </radialGradient>
            <radialGradient id={`${id}-y`} cx="35%" cy="35%" r="70%">
              <stop offset="0" stopColor="#fef9c3" />
              <stop offset="0.45" stopColor="#facc15" />
              <stop offset="1" stopColor="#a16207" />
            </radialGradient>
            <radialGradient id={`${id}-r`} cx="35%" cy="35%" r="70%">
              <stop offset="0" stopColor="#fecaca" />
              <stop offset="0.45" stopColor="#dc2626" />
              <stop offset="1" stopColor="#7f1d1d" />
            </radialGradient>
            <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4ade80" />
              <stop offset="1" stopColor="#166534" />
            </linearGradient>
            <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fde68a" />
              <stop offset="1" stopColor="#b45309" />
            </linearGradient>
            {TONES.map((tone) => (
              <g id={`${id}-m${tone}`} key={tone}>
                <circle r={layout.bead} fill={`url(#${id}-${tone})`} />
                <circle
                  r={layout.bead * 0.62}
                  fill="none"
                  stroke="#7c2d12"
                  strokeOpacity="0.35"
                  strokeWidth="0.8"
                  strokeDasharray="1.1 1.3"
                />
                <circle r={layout.bead * 0.25} fill="#7c2d12" fillOpacity="0.45" />
              </g>
            ))}
            <g id={`${id}-lf`}>
              <path d="M0 0C5 5 6 14 0 22C-6 14 -5 5 0 0Z" fill={`url(#${id}-leaf)`} />
              <path d="M0 1L0 20" stroke="#14532d" strokeWidth="0.7" strokeOpacity="0.6" />
            </g>
            <g id={`${id}-bell`}>
              <circle cy={-layout.bead * 0.35} r={layout.bead * 0.32} fill="none" stroke="#b45309" strokeWidth="0.8" />
              <path
                d={`M${-layout.bead} ${layout.bead * 1.5}C${-layout.bead} ${-layout.bead * 0.1} ${layout.bead} ${-layout.bead * 0.1} ${layout.bead} ${layout.bead * 1.5}L${layout.bead * 1.25} ${layout.bead * 1.9}L${-layout.bead * 1.25} ${layout.bead * 1.9}Z`}
                fill={`url(#${id}-gold)`}
              />
              <circle cy={layout.bead * 2.15} r={layout.bead * 0.32} fill="#92400e" />
            </g>
          </defs>
          {layout.swags.map((swag, i) => (
            <g
              key={i}
              className="dw-swag"
              style={{ transformOrigin: `${swag.mid}px ${layout.band}px`, animationDelay: `${-(i % 6) * 0.9}s` }}
            >
              {swag.leaves.map((leaf, k) => (
                <use
                  key={k}
                  href={`#${id}-lf`}
                  transform={`translate(${leaf.x} ${layout.band - 1}) rotate(${leaf.angle}) scale(${layout.leafScale})`}
                />
              ))}
              {swag.beads.map((bead, k) => (
                <use key={k} href={`#${id}-m${bead.tone}`} x={bead.x} y={bead.y} />
              ))}
            </g>
          ))}
          {layout.strands.map((x, i) => (
            <g
              key={i}
              className="dw-strand"
              style={{ transformOrigin: `${x}px ${layout.band}px`, animationDelay: `${-(i % 4) * 0.8}s` }}
            >
              <line x1={x} y1={layout.band} x2={x} y2={layout.band + layout.bead * 2.6} stroke="#92400e" strokeWidth="0.8" />
              <use href={`#${id}-m${i % 2 ? "o" : "y"}`} x={x} y={layout.band + layout.bead * 1.3} />
              <use href={`#${id}-bell`} x={x} y={layout.band + layout.bead * 3.05} />
            </g>
          ))}
          <rect width={width} height={layout.band} fill="#7f1d1d" />
          <rect y={layout.band - 1.5} width={width} height="1.5" fill="#f59e0b" />
          <line
            x1="0"
            x2={width}
            y1={layout.band / 2 - 0.5}
            y2={layout.band / 2 - 0.5}
            stroke="#fcd34d"
            strokeWidth={layout.compact ? 1.2 : 1.6}
            strokeDasharray="0.01 6"
            strokeLinecap="round"
          />
          {layout.strands.map((x, i) => (
            <circle key={i} cx={x} cy={layout.band / 2} r={layout.band * 0.45} fill={`url(#${id}-gold)`} />
          ))}
        </svg>
      )}
    </div>
  );
}
