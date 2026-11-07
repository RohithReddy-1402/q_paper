import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { GREETINGS, WISHES } from "./content";

const HOLD_SECONDS = 1.4;
const RELEASE_SECONDS = 0.5;
const FOCUSABLE = "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";

const rand = (min, max) => min + Math.random() * (max - min);

const firstName = (name) => {
  const first = typeof name === "string" ? name.trim().split(/\s+/)[0] : "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
};

function Letters({ text, offset = 0 }) {
  return Array.from(text).map((char, index) => (
    <span key={index} className="dw-letter" style={{ "--i": offset + index }}>
      {char === " " ? " " : char}
    </span>
  ));
}

function Flame() {
  const id = useId().replace(/:/g, "");

  return (
    <svg className="dw-flame" viewBox="0 0 44 60" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-fire`} cx="0.5" cy="0.78" r="0.85">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="0.4" stopColor="#fde047" />
          <stop offset="0.75" stopColor="#f97316" />
          <stop offset="1" stopColor="#dc2626" />
        </radialGradient>
      </defs>
      <g className="dw-flame-body">
        <path d="M22 2C31 15 38 25 38 37C38 49 31 57 22 57C13 57 6 49 6 37C6 25 13 15 22 2Z" fill={`url(#${id}-fire)`} />
        <path
          d="M22 24C27 31 30 36 30 42C30 48 26.5 52 22 52C17.5 52 14 48 14 42C14 36 17 31 22 24Z"
          fill="#fffbeb"
          opacity="0.92"
        />
      </g>
    </svg>
  );
}

export default function Greeting({ fireworks, reducedMotion, name, brand, onClose }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const igniteRef = useRef(null);
  const ctaRef = useRef(null);
  const holding = useRef(false);
  const viaKeyboard = useRef(false);
  const center = useRef(null);
  const ringId = useId().replace(/:/g, "");
  const [phase, setPhase] = useState(reducedMotion ? "lit" : "invite");
  const [isHolding, setIsHolding] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const wish = useMemo(() => WISHES[Math.floor(Math.random() * WISHES.length)], []);
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const person = firstName(name);
  const lines = person ? ["Happy Diwali,", `${person}.`] : ["Happy", "Diwali."];
  const accentSize = person.length > 9 ? `${Math.max(0.55, 10 / (person.length + 1)).toFixed(2)}em` : undefined;

  const startHold = useCallback(
    (event) => {
      if (phase !== "invite" || holding.current) return;
      if (event?.cancelable) event.preventDefault();
      viaKeyboard.current = !event;
      const rect = igniteRef.current?.getBoundingClientRect();
      center.current = rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      holding.current = true;
      setIsHolding(true);
      navigator.vibrate?.(12);
    },
    [phase],
  );

  const endHold = useCallback(() => {
    holding.current = false;
    setIsHolding(false);
  }, []);

  useEffect(() => {
    if (phase !== "invite") return;
    const root = rootRef.current;
    let progress = 0;
    let last = performance.now();
    let frame = 0;

    const tick = (now) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      const delta = holding.current ? dt / HOLD_SECONDS : -dt / RELEASE_SECONDS;
      progress = Math.min(Math.max(progress + delta, 0), 1);
      root.style.setProperty("--dw-p", progress.toFixed(3));

      if (holding.current && center.current) {
        fireworks.current?.gather(center.current.x, center.current.y, progress);
      }

      if (progress >= 1) {
        holding.current = false;
        setIsHolding(false);
        setPhase("lit");
        fireworks.current?.ignite(center.current.x, center.current.y);
        navigator.vibrate?.([30, 50, 90]);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, fireworks]);

  useEffect(() => {
    if (phase !== "invite") return;
    const isHoldKey = (event) => event.key === " " || event.key === "Enter";

    const onDown = (event) => {
      if (!isHoldKey(event)) return;
      if (event.target instanceof Element && event.target.closest("button:not(.dw-ignite)")) return;
      event.preventDefault();
      if (!event.repeat) startHold();
    };

    const onUp = (event) => {
      if (isHoldKey(event)) endHold();
    };

    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
    };
  }, [phase, startHold, endHold]);

  useEffect(() => {
    window.addEventListener("pointerup", endHold);
    window.addEventListener("pointercancel", endHold);
    window.addEventListener("blur", endHold);
    return () => {
      window.removeEventListener("pointerup", endHold);
      window.removeEventListener("pointercancel", endHold);
      window.removeEventListener("blur", endHold);
    };
  }, [endHold]);

  useEffect(() => {
    if (reducedMotion || leaving) return;
    const lit = phase === "lit";

    const show = () => {
      if (document.hidden) return;
      const { innerWidth: width, innerHeight: height } = window;
      const side = Math.random() < 0.5 ? rand(0.05, 0.25) : rand(0.75, 0.95);
      const x = (lit && width > 720 ? side : rand(0.08, 0.92)) * width;
      const y = rand(0.08, lit ? 0.4 : 0.3) * height;
      fireworks.current?.launch(x, y, { scale: lit ? rand(0.75, 1) : rand(0.35, 0.5) });
    };

    const timer = setInterval(show, lit ? 1400 : 2600);
    return () => clearInterval(timer);
  }, [phase, reducedMotion, leaving, fireworks]);

  useEffect(() => {
    if (!leaving) return;
    endHold();
    if (!reducedMotion) fireworks.current?.shower(90);
    const timer = setTimeout(onClose, reducedMotion ? 0 : 1100);
    return () => clearTimeout(timer);
  }, [leaving, reducedMotion, fireworks, onClose, endHold]);

  useEffect(() => {
    const previous = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") {
        setLeaving(true);
        return;
      }
      if (event.key !== "Tab" || !stageRef.current) return;
      const items = [...stageRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active !== stageRef.current && stageRef.current.contains(active);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const target = phase === "lit" && viaKeyboard.current ? ctaRef.current : stageRef.current;
    target?.focus({ preventScroll: true });
  }, [phase]);

  const launchAt = (event) => {
    if (!reducedMotion) fireworks.current?.launch(event.clientX, event.clientY);
  };

  const rootClass = ["dw-greet", `dw-greet-${phase}`, isHolding && "dw-holding", leaving && "dw-greet-leaving"]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClass}>
      <div
        className="dw-night"
        aria-hidden="true"
        onPointerDown={phase === "invite" ? startHold : undefined}
        onClick={phase === "lit" ? launchAt : undefined}
      >
        <div className="dw-stars" />
        <div className="dw-stars dw-stars-far" />
        <div className="dw-horizon" />
        <div className="dw-heat" />
      </div>
      <section
        ref={stageRef}
        className="dw-stage"
        role="dialog"
        aria-modal="true"
        aria-label={`Happy Diwali from ${brand}`}
        tabIndex={-1}
      >
        <div className="dw-flash" aria-hidden="true" />
        <header className="dw-topbar">
          <span className="dw-tag">
            <span className="dw-tag-dot" />
            {brand} · Diwali {new Date().getFullYear()}
          </span>
          {phase === "invite" && (
            <button type="button" className="dw-skip" onClick={() => setLeaving(true)}>
              Skip
            </button>
          )}
        </header>
        <div className="dw-center">
          {phase === "invite" ? (
            <div className="dw-invite">
              <button
                ref={igniteRef}
                type="button"
                className="dw-ignite"
                aria-label="Press and hold to light up Diwali"
                onPointerDown={startHold}
                onContextMenu={(event) => event.preventDefault()}
              >
                <span className="dw-ignite-glow" />
                <svg className="dw-ignite-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id={`${ringId}-ring`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#fde68a" />
                      <stop offset="1" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <circle className="dw-ignite-track" cx="50" cy="50" r="47" />
                  <circle className="dw-ignite-fill" cx="50" cy="50" r="47" pathLength="1" stroke={`url(#${ringId}-ring)`} />
                </svg>
                <Flame />
              </button>
              <p className="dw-hint" aria-hidden="true">
                {isHolding ? "Keep holding…" : `${touch ? "Touch" : "Press"} and hold to light up Diwali`}
              </p>
            </div>
          ) : (
            <div className="dw-lit">
              <h2 className="dw-headline" aria-label={lines.join(" ")}>
                <span className="dw-line" aria-hidden="true">
                  <Letters text={lines[0]} />
                </span>
                <span className="dw-line dw-line-accent" aria-hidden="true" style={{ fontSize: accentSize }}>
                  <Letters text={lines[1]} offset={lines[0].length} />
                </span>
              </h2>
              <p className="dw-sub">{wish}</p>
              <div className="dw-cta-row">
                <button ref={ctaRef} type="button" className="dw-cta" onClick={() => setLeaving(true)}>
                  Enter {brand}
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {!reducedMotion && <span className="dw-tip">Tap anywhere for more crackers</span>}
              </div>
            </div>
          )}
        </div>
        <div className="dw-marquee" aria-hidden="true">
          <div className="dw-marquee-track">
            {[0, 1].map((copy) =>
              GREETINGS.map((greeting) => (
                <span key={`${copy}-${greeting.lang}`} className="dw-marquee-item" lang={greeting.lang}>
                  {greeting.text}
                </span>
              )),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
