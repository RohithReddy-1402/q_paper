const petal = (inner, outer, width) => {
  const length = outer - inner;
  const near = -(inner + length * 0.25);
  const far = -(inner + length * 0.85);
  return `M0 ${-inner}C${width} ${near} ${width * 0.7} ${far} 0 ${-outer}C${-width * 0.7} ${far} ${-width} ${near} 0 ${-inner}Z`;
};

const ring = (count, path, colors, delay, offset = 0) =>
  Array.from({ length: count }, (_, index) => ({
    path,
    angle: offset + (360 / count) * index,
    fill: colors[index % colors.length],
    delay: delay + index * 0.03,
  }));

const dots = (count, radius, size, fill, delay, offset = 0) =>
  Array.from({ length: count }, (_, index) => {
    const angle = ((offset + (360 / count) * index) * Math.PI) / 180;
    return {
      cx: Number((Math.cos(angle) * radius).toFixed(2)),
      cy: Number((Math.sin(angle) * radius).toFixed(2)),
      r: size,
      fill,
      delay: delay + index * 0.02,
    };
  });

const SHAPES = [
  ...ring(24, petal(80, 97, 6.5), ["#db2777", "#9333ea"], 1.1),
  { radius: 76, fill: "none", stroke: "#facc15", strokeWidth: 2.5, delay: 0.95 },
  ...ring(12, petal(42, 78, 12), ["#f97316", "#facc15"], 0.55),
  ...ring(12, petal(52, 70, 5.5), ["#16a34a"], 0.8, 15),
  { radius: 38, fill: "#2563eb", delay: 0.35 },
  ...ring(8, petal(13, 33, 8), ["#fde047"], 0.2, 22.5),
  { radius: 12, fill: "#dc2626", delay: 0.05 },
  { radius: 4.5, fill: "#fff7ed", delay: 0 },
];

const DOTS = [...dots(24, 101, 2.3, "#f59e0b", 1.7, 7.5), ...dots(12, 45, 2.4, "#ffffff", 1, 15)];

export default function Rangoli({ className = "", animate = false }) {
  return (
    <svg
      className={`dw-rangoli${animate ? " dw-rangoli-draw" : ""} ${className}`.trim()}
      viewBox="-105 -105 210 210"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="#ffffff" strokeWidth="1" strokeLinejoin="round">
        {SHAPES.map((shape, index) =>
          shape.path ? (
            <path
              key={index}
              className="dw-r-shape"
              d={shape.path}
              fill={shape.fill}
              transform={`rotate(${shape.angle})`}
              pathLength="1"
              style={{ "--d": `${shape.delay}s` }}
            />
          ) : (
            <circle
              key={index}
              className="dw-r-shape"
              r={shape.radius}
              fill={shape.fill}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              pathLength="1"
              style={{ "--d": `${shape.delay}s` }}
            />
          ),
        )}
        {DOTS.map((dot, index) => (
          <circle
            key={`dot-${index}`}
            className="dw-r-dot"
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dot.fill}
            stroke="none"
            style={{ "--d": `${dot.delay}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
