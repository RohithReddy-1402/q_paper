import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AkashKandil from "./AkashKandil";
import Diya from "./Diya";
import FireworksCanvas from "./FireworksCanvas";
import Greeting from "./Greeting";
import Rangoli from "./Rangoli";
import SkyLanterns from "./SkyLanterns";
import Toran from "./Toran";
import { todayKey } from "./season";
import "./diwali.css";

const ENABLED_KEY = "dw-enabled";
const GREETED_KEY = "dw-greeted";
const FONT_ID = "dw-font";
const FONT_URL = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700..800&display=swap";
const INTERACTIVE =
  "a, button, input, textarea, select, label, summary, video, iframe, [role='button'], [contenteditable='true'], [tabindex]:not([tabindex='-1'])";

let introPlayed = false;

const readStorage = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
};

const rand = (min, max) => min + Math.random() * (max - min);

const isInteractive = (target) =>
  target instanceof Element &&
  (Boolean(target.closest(INTERACTIVE)) || window.getComputedStyle(target).cursor === "pointer");

export default function DiwaliScene({
  greeting = true,
  forceGreeting = false,
  name,
  brand = "site",
  crackers = true,
}) {
  const fireworks = useRef(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [intro] = useState(() => !introPlayed);
  const [enabled, setEnabled] = useState(() => readStorage(ENABLED_KEY) !== "0");
  const [decorMounted, setDecorMounted] = useState(enabled);
  const [showGreeting, setShowGreeting] = useState(
    () => greeting && (forceGreeting || (enabled && readStorage(GREETED_KEY) !== todayKey())),
  );
  const motion = enabled && !reducedMotion;

  useEffect(() => {
    introPlayed = true;
  }, []);

  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = Object.assign(document.createElement("link"), { id: FONT_ID, rel: "stylesheet", href: FONT_URL });
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (enabled) {
      setDecorMounted(true);
      return;
    }
    const timer = setTimeout(() => setDecorMounted(false), 700);
    return () => clearTimeout(timer);
  }, [enabled]);

  useEffect(() => {
    if (!motion || showGreeting) return;

    const onClick = (event) => {
      if (event.button !== 0 || isInteractive(event.target)) return;
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) return;
      fireworks.current?.launch(event.clientX, event.clientY);
    };

    const onMove = (event) => {
      if (event.pointerType === "mouse") fireworks.current?.sparkle(event.clientX, event.clientY);
    };

    window.addEventListener("click", onClick);
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
    };
  }, [motion, showGreeting, finePointer]);

  useEffect(() => {
    if (!motion || showGreeting || !crackers) return;
    let timer = 0;

    const fire = () => {
      if (!document.hidden) {
        const { innerWidth: width, innerHeight: height } = window;
        fireworks.current?.launch(rand(0.08, 0.92) * width, rand(0.1, 0.42) * height, { scale: rand(0.6, 0.95) });
      }
      timer = setTimeout(fire, Math.random() < 0.25 ? rand(300, 700) : rand(5000, 11000));
    };

    timer = setTimeout(fire, rand(1500, 3000));
    return () => clearTimeout(timer);
  }, [motion, showGreeting, crackers]);

  const toggle = (event) => {
    const next = !enabled;
    setEnabled(next);
    writeStorage(ENABLED_KEY, next ? "1" : "0");
    if (!next || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    fireworks.current?.burst(rect.left + rect.width / 2, rect.top + rect.height * 0.2, {
      scale: 0.4,
      type: "peony",
      hue: 42,
    });
    fireworks.current?.shower(40);
  };

  const closeGreeting = useCallback(() => {
    setShowGreeting(false);
    writeStorage(GREETED_KEY, todayKey());
  }, []);

  return createPortal(
    <div className={`dw-scene${intro ? " dw-intro" : ""}`}>
      {decorMounted && (
        <div className={`dw-decor${enabled ? "" : " dw-decor-hidden"}`} aria-hidden="true">
          <Toran />
          <AkashKandil side="left" />
          <AkashKandil side="right" />
          <div className="dw-glow" />
          {motion && <SkyLanterns />}
          <Rangoli className="dw-corner dw-corner-left" animate={intro} />
          <Rangoli className="dw-corner dw-corner-right" animate={intro} />
          <div className="dw-corner-diya">
            <Diya />
          </div>
        </div>
      )}
      <FireworksCanvas ref={fireworks} night={showGreeting} />
      <button type="button" className="dw-toggle" aria-label="Diwali lights" aria-pressed={enabled} onClick={toggle}>
        <Diya lit={enabled} />
        <span className="dw-toggle-label" aria-hidden="true">
          {enabled ? "Happy Diwali! Tap to dim the lights" : "Tap to light the diya"}
        </span>
      </button>
      {showGreeting && (
        <Greeting
          fireworks={fireworks}
          reducedMotion={reducedMotion}
          name={name}
          brand={brand}
          onClose={closeGreeting}
        />
      )}
    </div>,
    document.body,
  );
}
