import { useMemo } from "react";

const GOLDEN = 0.618034;

export default function SkyLanterns({ count = 7 }) {
  const lanterns = useMemo(() => {
    const seed = Math.random();
    return Array.from({ length: count }, (_, index) => {
      const duration = 24 + Math.random() * 16;
      const slot = (seed + index * GOLDEN) % 1;
      return {
        left: `${4 + slot * 92}%`,
        size: `${14 + Math.random() * 10}px`,
        drift: `${(Math.random() - 0.5) * 16}vw`,
        duration: `${duration}s`,
        delay: `${-Math.random() * duration}s`,
        sway: `${3 + Math.random() * 2.5}s`,
      };
    });
  }, [count]);

  return (
    <div className="dw-lanterns">
      {lanterns.map((lantern, index) => (
        <span
          key={index}
          className="dw-lantern"
          style={{
            left: lantern.left,
            "--dw-size": lantern.size,
            "--dw-drift": lantern.drift,
            animationDuration: lantern.duration,
            animationDelay: lantern.delay,
          }}
        >
          <span className="dw-lantern-body" style={{ animationDuration: lantern.sway }} />
        </span>
      ))}
    </div>
  );
}
