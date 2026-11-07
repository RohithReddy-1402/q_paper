import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const HUES = [44, 330, 8, 192, 145, 280, 52];
const GOLDS = [34, 40, 46];
const PETAL_HUES = [20, 28, 36, 44];
const METHODS = ["burst", "launch", "volley", "fountain", "finale", "sparkle", "shower", "gather", "ignite"];

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

function createEngine(canvas) {
  const ctx = canvas.getContext("2d");
  const state = {
    width: 0,
    height: 0,
    scale: 1,
    cap: 1600,
    night: false,
    frame: 0,
    last: 0,
    lastSparkle: 0,
    sparks: [],
    rockets: [],
    fountains: [],
    flashes: [],
    petals: [],
    timers: new Set(),
  };

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    state.width = document.documentElement.clientWidth;
    state.height = document.documentElement.clientHeight;
    state.scale = Math.min(Math.max(Math.min(state.width, state.height) / 800, 0.55), 1.15);
    state.cap = state.width < 768 ? 700 : 1600;
    canvas.width = Math.round(state.width * ratio);
    canvas.height = Math.round(state.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function alive() {
    return (
      state.sparks.length + state.rockets.length + state.fountains.length + state.flashes.length + state.petals.length >
      0
    );
  }

  function spark(props) {
    if (state.sparks.length >= state.cap) return;
    state.sparks.push({
      age: 0,
      sat: 95,
      light: 52,
      width: 1.6,
      trail: 0.045,
      gravity: 110,
      drag: 1.2,
      glitter: false,
      fadeIn: false,
      ...props,
    });
  }

  function later(delay, task) {
    const timer = setTimeout(() => {
      state.timers.delete(timer);
      task();
    }, delay);
    state.timers.add(timer);
  }

  function burst(x, y, options = {}) {
    const size = (options.scale ?? 1) * state.scale;
    const type = options.type ?? pick(["peony", "peony", "dual", "ring", "willow"]);
    const hue = options.hue ?? pick(HUES);
    const accent = pick(HUES);
    const willow = type === "willow";
    const ring = type === "ring";
    const count = Math.round((ring ? 56 : willow ? 70 : 96) * Math.max(size, 0.45));
    const tilt = rand(0, Math.PI);
    const squash = rand(0.3, 0.75);

    for (let i = 0; i < count; i += 1) {
      const angle = ring ? (Math.PI * 2 * i) / count : rand(0, Math.PI * 2);
      const depth = rand(-1, 1);
      const speed = (ring ? 240 : willow ? rand(150, 200) : 260 * Math.sqrt(1 - depth * depth)) * size;
      let vx = Math.cos(angle) * speed;
      let vy = Math.sin(angle) * speed;

      if (ring) {
        const flat = vy * squash;
        vy = vx * Math.sin(tilt) + flat * Math.cos(tilt);
        vx = vx * Math.cos(tilt) - flat * Math.sin(tilt);
      }

      spark({
        x,
        y,
        vx,
        vy,
        life: willow ? rand(2.2, 3) : rand(1.1, 1.7),
        hue: willow ? pick(GOLDS) : type === "dual" && i % 2 ? accent : hue,
        light: willow ? 50 : 52,
        width: willow ? 1.3 : 1.8,
        trail: willow ? 0.1 : 0.05,
        gravity: willow ? 60 : 110,
        drag: willow ? 1.5 : 1.15,
        glitter: Math.random() < (willow ? 0.6 : 0.3),
      });
    }

    state.flashes.push({ x, y, age: 0, life: 0.25, radius: 80 * size, hue });
    wake();
  }

  function launch(x, y, options = {}) {
    if (state.height - y < 90) {
      burst(x, y, { ...options, scale: (options.scale ?? 1) * 0.6 });
      return;
    }
    const gravity = 820;
    const startX = x + rand(-50, 50) * state.scale;
    const startY = state.height + 6;
    const vy = -Math.sqrt(2 * gravity * (startY - y));
    const vx = (x - startX) / (-vy / gravity);
    state.rockets.push({ x: startX, y: startY, vx, vy, gravity, options });
    wake();
  }

  function volley(count = 5) {
    for (let i = 0; i < count; i += 1) {
      later(i * 170, () => launch(rand(0.08, 0.92) * state.width, rand(0.1, 0.42) * state.height));
    }
  }

  function fountain(x, duration = 2.6) {
    state.fountains.push({ x, age: 0, life: duration, carry: 0 });
    wake();
  }

  function finale() {
    fountain(state.width * 0.12, 3);
    fountain(state.width * 0.88, 3);
    for (let i = 0; i < 10; i += 1) {
      const last = i === 9;
      later(200 + i * 240, () =>
        launch(rand(0.1, 0.9) * state.width, rand(0.08, 0.38) * state.height, {
          type: last ? "willow" : undefined,
          scale: last ? 1.3 : 1,
        }),
      );
    }
  }

  function sparkle(x, y) {
    const now = performance.now();
    if (now - state.lastSparkle < 18) return;
    state.lastSparkle = now;
    for (let i = 0; i < 5; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(50, 210);
      spark({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        life: rand(0.25, 0.6),
        hue: pick(GOLDS),
        sat: 100,
        light: 46,
        width: 1.6,
        trail: 0.045,
        gravity: 280,
        drag: 2.2,
        glitter: true,
      });
    }
    wake();
  }

  function gather(x, y, strength = 1) {
    const count = 1 + Math.round(strength * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const distance = rand(140, 320) * state.scale;
      const speed = rand(380, 620) * state.scale;
      spark({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: -Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        life: distance / speed,
        hue: pick(GOLDS),
        sat: 100,
        light: 55,
        width: 1.4,
        trail: 0.05,
        gravity: 0,
        drag: 0,
        fadeIn: true,
      });
    }
    wake();
  }

  function ignite(x, y) {
    burst(x, y, { scale: 1.5, type: "peony", hue: 44 });
    burst(x, y, { scale: 1.05, type: "ring", hue: 330 });
    later(160, () => burst(x, y, { scale: 0.8, type: "dual" }));
    finale();
  }

  function shower(count = 80) {
    const size = Math.max(state.scale, 0.75);
    for (let i = 0; i < count; i += 1) {
      state.petals.push({
        x: rand(0, state.width),
        y: rand(-state.height * 0.7, -12),
        vy: rand(70, 140),
        amp: rand(10, 36),
        freq: rand(0.8, 1.8),
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        spin: rand(-2.5, 2.5),
        size: rand(4, 7.5) * size,
        hue: pick(PETAL_HUES),
        light: rand(48, 58),
        age: 0,
      });
    }
    wake();
  }

  function update(dt) {
    const { sparks, rockets, fountains, flashes, petals, height } = state;
    let kept = 0;

    for (const rocket of rockets) {
      rocket.vy += rocket.gravity * dt;
      rocket.x += rocket.vx * dt;
      rocket.y += rocket.vy * dt;
      spark({
        x: rocket.x,
        y: rocket.y,
        vx: rand(-25, 25),
        vy: rand(20, 70),
        life: rand(0.25, 0.5),
        hue: 38,
        light: 56,
        width: 1.2,
        trail: 0.03,
        gravity: 100,
        drag: 2,
      });
      if (rocket.vy >= -30) burst(rocket.x, rocket.y, rocket.options);
      else rockets[kept++] = rocket;
    }
    rockets.length = kept;

    kept = 0;
    for (const source of fountains) {
      source.age += dt;
      const strength = Math.sin(Math.PI * Math.min(source.age / source.life, 1));
      source.carry += 240 * dt;
      while (source.carry >= 1) {
        source.carry -= 1;
        const angle = -Math.PI / 2 + rand(-0.3, 0.3);
        const speed = rand(0.6, 1) * 620 * state.scale * (0.5 + 0.5 * strength);
        const white = Math.random() < 0.12;
        spark({
          x: source.x + rand(-3, 3),
          y: height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: rand(0.8, 1.3),
          hue: white ? 50 : pick(GOLDS),
          sat: white ? 40 : 100,
          light: white ? 80 : 55,
          width: 1.4,
          trail: 0.04,
          gravity: 520,
          drag: 0.5,
          glitter: Math.random() < 0.4,
        });
      }
      if (source.age < source.life) fountains[kept++] = source;
    }
    fountains.length = kept;

    kept = 0;
    for (const particle of sparks) {
      particle.age += dt;
      if (particle.age >= particle.life) continue;
      const damping = Math.exp(-particle.drag * dt);
      particle.vx *= damping;
      particle.vy = particle.vy * damping + particle.gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      sparks[kept++] = particle;
    }
    sparks.length = kept;

    kept = 0;
    for (const flash of flashes) {
      flash.age += dt;
      if (flash.age < flash.life) flashes[kept++] = flash;
    }
    flashes.length = kept;

    kept = 0;
    for (const petal of petals) {
      petal.age += dt;
      petal.y += petal.vy * dt;
      petal.rot += petal.spin * dt;
      if (petal.y < height + 20) petals[kept++] = petal;
    }
    petals.length = kept;
  }

  function draw() {
    const { width, height, night } = state;
    ctx.clearRect(0, 0, width, height);

    ctx.globalCompositeOperation = "source-over";
    for (const petal of state.petals) {
      const x = petal.x + Math.sin(petal.age * petal.freq + petal.phase) * petal.amp;
      const flip = 0.35 + 0.65 * Math.abs(Math.sin(petal.age * petal.freq * 1.7 + petal.phase));
      ctx.save();
      ctx.translate(x, petal.y);
      ctx.rotate(petal.rot);
      ctx.scale(1, flip);
      ctx.fillStyle = `hsl(${petal.hue}, 95%, ${petal.light}%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.globalCompositeOperation = night ? "lighter" : "source-over";

    if (night) {
      for (const flash of state.flashes) {
        const fade = 1 - flash.age / flash.life;
        const glow = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.radius);
        glow.addColorStop(0, `hsla(${flash.hue}, 100%, 85%, ${0.55 * fade})`);
        glow.addColorStop(1, `hsla(${flash.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.lineCap = "round";
    for (const particle of state.sparks) {
      const progress = particle.age / particle.life;
      let alpha = particle.fadeIn
        ? Math.min(1, progress * 2.5, (1 - progress) * 8)
        : Math.min(1, (1 - progress) * 1.8);
      if (particle.glitter && progress > 0.5 && Math.random() < 0.4) alpha *= 0.2;
      const light = night ? Math.min(particle.light + 16, 94) : particle.light;
      ctx.strokeStyle = `hsla(${particle.hue}, ${particle.sat}%, ${light}%, ${alpha})`;
      ctx.lineWidth = particle.width * (1 - progress * 0.5);
      ctx.beginPath();
      ctx.moveTo(particle.x - particle.vx * particle.trail, particle.y - particle.vy * particle.trail);
      ctx.lineTo(particle.x, particle.y);
      ctx.stroke();
    }

    ctx.lineWidth = 2.4;
    ctx.strokeStyle = night ? "hsl(48, 100%, 88%)" : "hsl(40, 100%, 50%)";
    for (const rocket of state.rockets) {
      ctx.beginPath();
      ctx.moveTo(rocket.x - rocket.vx * 0.025, rocket.y - rocket.vy * 0.025);
      ctx.lineTo(rocket.x, rocket.y);
      ctx.stroke();
    }
  }

  function step(time) {
    const dt = Math.min(Math.max((time - state.last) / 1000, 0), 1 / 30);
    state.last = time;
    update(dt);
    draw();
    if (alive()) {
      state.frame = requestAnimationFrame(step);
      return;
    }
    state.frame = 0;
    ctx.clearRect(0, 0, state.width, state.height);
  }

  function wake() {
    if (state.frame) return;
    state.last = performance.now();
    state.frame = requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize);

  return {
    burst,
    launch,
    volley,
    fountain,
    finale,
    sparkle,
    shower,
    gather,
    ignite,
    setNight(value) {
      state.night = value;
    },
    destroy() {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
      state.timers.forEach((timer) => clearTimeout(timer));
      state.timers.clear();
      window.removeEventListener("resize", resize);
    },
  };
}

const FireworksCanvas = forwardRef(function FireworksCanvas({ night = false }, ref) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const engine = createEngine(canvasRef.current);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setNight(night);
  }, [night]);

  useImperativeHandle(
    ref,
    () => Object.fromEntries(METHODS.map((name) => [name, (...args) => engineRef.current?.[name](...args)])),
    [],
  );

  return <canvas ref={canvasRef} className="dw-canvas" aria-hidden="true" />;
});

export default FireworksCanvas;
