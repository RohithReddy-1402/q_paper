import { useEffect, useId, useRef, useState } from "react";

export default function Diya({ lit = true, className = "" }) {
  const id = useId().replace(/:/g, "");
  const [flicker] = useState(() => `${(1.3 + Math.random() * 0.9).toFixed(2)}s`);
  const [snuffed, setSnuffed] = useState(false);
  const wasLit = useRef(lit);

  useEffect(() => {
    setSnuffed(wasLit.current && !lit);
    wasLit.current = lit;
  }, [lit]);

  const status = lit ? "dw-diya-lit" : snuffed ? "dw-diya-out dw-diya-snuffed" : "dw-diya-out";

  return (
    <svg
      className={`dw-diya ${status} ${className}`.trim()}
      style={{ "--dw-flicker": flicker }}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#fb923c" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-flame`} cx="0.5" cy="0.78" r="0.8">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="0.35" stopColor="#fde047" />
          <stop offset="0.72" stopColor="#f97316" />
          <stop offset="1" stopColor="#dc2626" />
        </radialGradient>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c2410c" />
          <stop offset="1" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a3412" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <circle className="dw-diya-halo" cx="32" cy="20" r="20" fill={`url(#${id}-halo)`} />
      <path
        className="dw-diya-smoke"
        d="M32 26C29.5 21 34.5 17 31.5 12C29 8 33 5 31.5 1"
        fill="none"
        stroke="#d6d3d1"
        strokeWidth="1.3"
        strokeLinecap="round"
        pathLength="1"
      />
      <g className="dw-diya-flame">
        <path
          d="M32 5C37.5 13 40 20 36.5 25.5C34.8 28.5 29.2 28.5 27.5 25.5C24 20 26.5 13 32 5Z"
          fill={`url(#${id}-flame)`}
        />
        <path
          d="M32 14C34.6 18.5 35.2 22 33.8 24.8C33 26.2 31 26.2 30.2 24.8C28.8 22 29.4 18.5 32 14Z"
          fill="#fffbeb"
        />
        <ellipse cx="32" cy="26.6" rx="2" ry="1.3" fill="#60a5fa" opacity="0.65" />
      </g>
      <path d="M31.2 32L32.8 32L32.4 27.4L31.6 27.4Z" fill="#292524" />
      <path d="M7 34L57 34C55 44 45 50 32 50C19 50 9 44 7 34Z" fill={`url(#${id}-clay)`} />
      <ellipse cx="32" cy="34" rx="25" ry="4.2" fill={`url(#${id}-rim)`} />
      <ellipse cx="32" cy="34.2" rx="20.5" ry="2.6" fill="#78350f" />
      <path d="M26 35.6Q32 29.8 38 35.6Q32 37.6 26 35.6Z" fill="#c2410c" />
      <path d="M10.5 38.5Q32 47 53.5 38.5" fill="none" stroke="#f59e0b" strokeWidth="0.9" opacity="0.8" />
      <path
        d="M13 41.5Q32 49 51 41.5"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.8"
        strokeDasharray="0.01 3.4"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="51" rx="9" ry="2" fill="#7c2d12" />
    </svg>
  );
}
