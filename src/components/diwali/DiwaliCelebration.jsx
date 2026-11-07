import { lazy, Suspense, useEffect, useState } from "react";
import { isDiwaliSeason } from "./season";

const DiwaliScene = lazy(() => import("./DiwaliScene"));

export default function DiwaliCelebration({ force = false, start, end, greeting = true, name, brand, crackers }) {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    if (navigator.webdriver) return;
    const preview = new URLSearchParams(window.location.search).has("diwali");
    const active = force || preview || isDiwaliSeason(new Date(), start, end);
    setMode(active ? { preview } : null);
  }, [force, start, end]);

  if (!mode) return null;

  return (
    <Suspense fallback={null}>
      <DiwaliScene
        greeting={greeting}
        forceGreeting={mode.preview}
        name={name}
        brand={brand}
        crackers={crackers}
      />
    </Suspense>
  );
}
