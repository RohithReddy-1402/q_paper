import { useId } from "react";

const star = (cx, cy, outer, inner, points = 5) =>
  Array.from({ length: points * 2 }, (_, i) => {
    const radius = i % 2 ? inner : outer;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(" ");

const DROP = 70;
const OUTER = star(30, 52, 25, 11);
const INNER = star(30, 52, 15, 6.6);

const TASSELS = [
  { x: 19, color: "#fbbf24", length: 34 },
  { x: 24.5, color: "#dc2626", length: 44 },
  { x: 30, color: "#f59e0b", length: 52 },
  { x: 35.5, color: "#db2777", length: 44 },
  { x: 41, color: "#fbbf24", length: 34 },
];

export default function AkashKandil({ side = "left" }) {
  const id = useId().replace(/:/g, "");

  return (
    <div className={`dw-kandil dw-kandil-${side}`}>
      <svg className="dw-kandil-svg" viewBox="0 0 60 210" width="60" height="210" focusable="false">
        <defs>
          <radialGradient id={`${id}-paper`} cx="50%" cy="50%" r="55%">
            <stop offset="0" stopColor="#fff7cc" />
            <stop offset="0.35" stopColor="#fdba74" />
            <stop offset="0.75" stopColor="#ea580c" />
            <stop offset="1" stopColor="#9f1239" />
          </radialGradient>
          <radialGradient id={`${id}-aura`}>
            <stop offset="0" stopColor="#fdba74" stopOpacity="0.6" />
            <stop offset="1" stopColor="#fdba74" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="30" y1="0" x2="30" y2={DROP + 26} stroke="#78350f" strokeWidth="1.2" />
        <g transform={`translate(0 ${DROP})`}>
          <circle className="dw-kandil-aura" cx="30" cy="52" r="30" fill={`url(#${id}-aura)`} />
          <g className="dw-kandil-tassels">
            {TASSELS.map((tassel) => (
              <path
                key={tassel.x}
                d={`M${tassel.x} 64q-2.5 ${tassel.length / 3} 0 ${tassel.length * 0.6}t0 ${tassel.length * 0.4}`}
                fill="none"
                stroke={tassel.color}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ))}
          </g>
          <polygon
            points={OUTER}
            fill={`url(#${id}-paper)`}
            stroke="#fbbf24"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <polygon
            points={INNER}
            fill="#fff7cc"
            fillOpacity="0.35"
            stroke="#fde68a"
            strokeOpacity="0.7"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <circle className="dw-kandil-core" cx="30" cy="52" r="4.5" fill="#fffbeb" />
          <rect x="26.5" y="24" width="7" height="5" rx="1.5" fill="#f59e0b" />
        </g>
      </svg>
    </div>
  );
}
