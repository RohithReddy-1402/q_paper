import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import campus from "../../data/campus.json";

const FLOOR_HEIGHT = 4; // metres per floor for buildings without floor data
const KIND_COLOR = { corridor: 0xf59e0b, building: 0x60a5fa };
const BASE = 0.2; // thickness of the ground-floor slab
const WALL_T = 0.25;
const DOOR_H = 2.2;
const DOOR_T = 0.1;
const STEP_RISE = 0.18;

// campus.json stores [x, z] in metres (x east, z south). Shapes live in the XY
// plane, so use (x, -z) and rotate -90deg about X to land back on (x, y, z).
const toVec = ([x, z]) => new THREE.Vector2(x, -z);
const toShape = (pts) => new THREE.Shape(pts.map(toVec));

// Straight-up extrusion of a polygon (optionally with holes) from y=0.
const prism = (pts, height, holes = []) => {
  const shape = toShape(pts);
  shape.holes = holes.map((h) => new THREE.Path(h.map(toVec)));
  return new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false }).rotateX(-Math.PI / 2);
};

const centroid = (pts) => {
  const n = pts.length;
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
};

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Features that have floors/rooms get the detailed build; the rest are plain blocks.
const isDetailed = (f) => Array.isArray(f.floorLabels);

// Every room/washroom by id, for click-to-select.
const spaceById = new Map();
for (const f of campus.features) {
  if (!isDetailed(f)) continue;
  for (const s of [...f.rooms, ...f.washrooms]) spaceById.set(s.id, { feature: f, space: s });
}

function buildDetailedBuilding(f, scene, pickable) {
  const H = f.floorHeight;
  const n = f.floorLabels.length;
  const holes = f.gardens.map((g) => g.polygon);

  const mat = (color) => new THREE.MeshLambertMaterial({ color });
  const m = {
    slab: mat(0xe5e7eb),
    roof: mat(0xcbd5e1),
    wall: mat(0xf5f5f4),
    door: mat(0x92400e),
    stair: mat(0x9ca3af),
    garden: mat(0x4ade80),
    trunk: mat(0x78350f),
    leaf: mat(0x15803d),
  };

  const levels = []; // floor groups, y-offset per floor
  const stairLevels = []; // stair steps, absolute y, toggled with the matching floor
  const labels = [];
  const patchMats = new Map();

  const tag = (mesh, extra = {}) => {
    mesh.userData = { featureId: f.id, ...extra };
    pickable.push(mesh);
    return mesh;
  };

  const addWall = (parent, a, b, y0, y1, material, thick, extra) => {
    const len = dist(a, b);
    if (len < 0.01) return;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, y1 - y0, thick), material);
    mesh.position.set((a[0] + b[0]) / 2, (y0 + y1) / 2, (a[1] + b[1]) / 2);
    mesh.rotation.y = Math.atan2(-(b[1] - a[1]), b[0] - a[0]);
    parent.add(tag(mesh, extra));
  };

  // Walls around a polygon, with a gap (lintel + door leaf) for each door.
  const addWalls = (parent, poly, doors, roomId) => {
    const extra = { roomId };
    poly.forEach((a, i) => {
      const b = poly[(i + 1) % poly.length];
      const ds = doors.filter((d) => d.edge === i).sort((p, q) => p.t0 - q.t0);
      let cursor = 0;
      for (const d of ds) {
        const p0 = lerp2(a, b, d.t0);
        const p1 = lerp2(a, b, d.t1);
        addWall(parent, lerp2(a, b, cursor), p0, 0, H, m.wall, WALL_T, extra);
        addWall(parent, p0, p1, DOOR_H, H, m.wall, WALL_T, extra);
        addWall(parent, p0, p1, 0, DOOR_H, m.door, DOOR_T, extra);
        cursor = d.t1;
      }
      addWall(parent, lerp2(a, b, cursor), b, 0, H, m.wall, WALL_T, extra);
    });
  };

  for (let k = 0; k < n; k++) {
    const g = new THREE.Group();
    g.position.y = BASE + k * H;
    scene.add(g);
    levels.push(g);
    const sg = new THREE.Group();
    scene.add(sg);
    stairLevels.push(sg);

    // Floor slab. Upper floors are open over the gardens.
    const slabGeo = k === 0 ? prism(f.footprint, BASE).translate(0, -BASE, 0) : prism(f.footprint, 0.3, holes).translate(0, -0.3, 0);
    g.add(tag(new THREE.Mesh(slabGeo, m.slab)));

    if (k === 0) {
      for (const garden of f.gardens) {
        g.add(tag(new THREE.Mesh(prism(garden.polygon, 0.12), m.garden)));
        const [p0, p1, p2, p3] = garden.polygon;
        // A few trees spread over the quad (bilinear interpolation).
        for (const [s, t] of [[0.25, 0.3], [0.75, 0.3], [0.5, 0.65], [0.25, 0.85], [0.8, 0.8]]) {
          const top = lerp2(p0, p1, s);
          const bottom = lerp2(p3, p2, s);
          const [x, z] = lerp2(top, bottom, t);
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.6, 8), m.trunk);
          trunk.position.set(x, 0.12 + 0.8, z);
          const crown = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 10), m.leaf);
          crown.position.set(x, 0.12 + 1.6 + 2, z);
          g.add(trunk, crown);
        }
      }
    }

    for (const sp of [...f.rooms, ...f.washrooms].filter((s) => s.floor === k)) {
      const patchMat = new THREE.MeshLambertMaterial({
        color: sp.type === "room" ? 0x93c5fd : 0x5eead4,
      });
      patchMats.set(sp.id, patchMat);
      g.add(tag(new THREE.Mesh(prism(sp.polygon, 0.04), patchMat), { roomId: sp.id }));
      addWalls(g, sp.polygon, sp.doors, sp.id);

      const el = document.createElement("div");
      el.textContent = sp.name;
      el.style.cssText =
        "background:rgba(255,255,255,.92);color:#0f172a;font:600 11px system-ui;padding:1px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.3)";
      const label = new CSS2DObject(el);
      const [cx, cz] = centroid(sp.polygon);
      label.position.set(cx, 1.8, cz);
      label.visible = false;
      label.userData.floor = k;
      g.add(label);
      labels.push(label);
    }
  }

  // Stairs: one straight run from the ground to the top floor, along the
  // long axis of each stair polygon.
  const totalRise = (n - 1) * H;
  const steps = Math.max(1, Math.round(totalRise / STEP_RISE));
  for (const st of f.stairs) {
    const [p0, p1, p2, p3] = st.polygon;
    const e0 = dist(p0, p1);
    const e1 = dist(p1, p2);
    const along = e0 >= e1 ? [p1[0] - p0[0] + p2[0] - p3[0], p1[1] - p0[1] + p2[1] - p3[1]] : [p2[0] - p1[0] + p3[0] - p0[0], p2[1] - p1[1] + p3[1] - p0[1]];
    const len = Math.hypot(along[0], along[1]);
    const u = [along[0] / len, along[1] / len];
    const L = (Math.max(e0, e1) + Math.max(dist(p2, p3), dist(p3, p0))) / 2;
    const W = Math.min(e0, e1);
    const [cx, cz] = centroid(st.polygon);
    const run = L / steps;
    for (let i = 0; i < steps; i++) {
      const top = BASE + ((i + 1) * totalRise) / steps;
      const level = Math.min(n - 1, Math.floor((i * totalRise) / steps / H));
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(run, top, W), m.stair);
      const off = -L / 2 + (i + 0.5) * run;
      mesh.position.set(cx + u[0] * off, top / 2, cz + u[1] * off);
      mesh.rotation.y = Math.atan2(-u[1], u[0]);
      stairLevels[level].add(tag(mesh));
    }
  }

  const roof = new THREE.Mesh(prism(f.footprint, 0.3, holes), m.roof);
  roof.position.y = BASE + n * H;
  scene.add(tag(roof));

  return { id: f.id, levels, stairLevels, labels, patchMats, roof, n };
}

export default function Campus3D() {
  const mountRef = useRef(null);
  const api = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [spaceId, setSpaceId] = useState(null);
  const [floorView, setFloorView] = useState("all"); // "all" or a floor index

  const selected = campus.features.find((f) => f.id === selectedId);
  const space = spaceId ? spaceById.get(spaceId)?.space : null;

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 6000);
    camera.position.set(0, 900, 900);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    mount.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 2500;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x94a3b8, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(300, 600, 200);
    scene.add(sun);

    // Ground = campus boundary.
    scene.add(
      new THREE.Mesh(
        new THREE.ShapeGeometry(toShape(campus.boundary)).rotateX(-Math.PI / 2),
        new THREE.MeshLambertMaterial({ color: 0xbbf7d0, side: THREE.DoubleSide }),
      ),
    );
    scene.add(
      new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(campus.boundary.map(([x, z]) => new THREE.Vector3(x, 0.5, z))),
        new THREE.LineBasicMaterial({ color: 0x16a34a }),
      ),
    );

    const pickable = [];
    const detailed = [];
    for (const f of campus.features) {
      let top;
      if (isDetailed(f)) {
        const b = buildDetailedBuilding(f, scene, pickable);
        detailed.push(b);
        top = BASE + b.n * f.floorHeight;
      } else {
        top = f.kind === "corridor" ? 4 : f.floors * FLOOR_HEIGHT;
        const mesh = new THREE.Mesh(
          prism(f.footprint, top),
          new THREE.MeshLambertMaterial({ color: KIND_COLOR[f.kind] ?? KIND_COLOR.building }),
        );
        mesh.userData.featureId = f.id;
        scene.add(mesh);
        pickable.push(mesh);
      }

      const el = document.createElement("div");
      el.textContent = f.name;
      el.style.cssText =
        "background:rgba(15,23,42,.85);color:#fff;font:600 12px system-ui;padding:2px 8px;border-radius:6px;white-space:nowrap";
      const label = new CSS2DObject(el);
      const [cx, cz] = centroid(f.footprint);
      label.position.set(cx, top + 6, cz);
      scene.add(label);
    }

    // Floor cut-away, room highlight and label visibility.
    const update = ({ selectedId: sel, spaceId: sp, floorView: fv }) => {
      for (const b of detailed) {
        const all = fv === "all";
        b.levels.forEach((g, k) => (g.visible = all || k <= fv));
        b.stairLevels.forEach((g, k) => (g.visible = all || k <= fv));
        b.roof.visible = all;
        for (const l of b.labels) l.visible = sel === b.id && !all && l.userData.floor === fv;
        for (const [id, material] of b.patchMats) {
          material.emissive.setHex(id === sp ? 0xb45309 : 0x000000);
        }
      }
    };
    update({ selectedId: null, spaceId: null, floorView: "all" });

    // Smooth camera fly-to a polygon (or the whole campus when null).
    let anim = null;
    const flyTo = ({ polygon, y = 0 } = {}) => {
      let target = new THREE.Vector3(0, 0, 0);
      let d = 1300;
      if (polygon) {
        const [cx, cz] = centroid(polygon);
        target = new THREE.Vector3(cx, y, cz);
        const xs = polygon.map((p) => p[0]);
        const zs = polygon.map((p) => p[1]);
        const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs));
        d = Math.max(30, size * 1.3);
      }
      anim = {
        t: 0,
        fromPos: camera.position.clone(),
        fromTarget: controls.target.clone(),
        toTarget: target,
        toPos: target.clone().add(new THREE.Vector3(0, d * 0.75, d * 0.65)),
      };
    };
    api.current = { update, flyTo };

    // Click to select a room, or else a building.
    const ray = new THREE.Raycaster();
    let downAt = null;
    const visible = (o) => {
      for (let p = o; p; p = p.parent) if (!p.visible) return false;
      return true;
    };
    const onDown = (e) => (downAt = [e.clientX, e.clientY]);
    const onUp = (e) => {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(
        new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1),
        camera,
      );
      const hit = ray.intersectObjects(pickable).find((h) => visible(h.object));
      if (!hit) return;
      const { featureId, roomId } = hit.object.userData;
      setSelectedId(featureId);
      const found = roomId && spaceById.get(roomId);
      if (found) {
        setSpaceId(roomId);
        setFloorView(found.space.floor);
        flyTo({ polygon: found.space.polygon, y: BASE + found.space.floor * found.feature.floorHeight });
      } else {
        setSpaceId(null);
        flyTo({ polygon: campus.features.find((x) => x.id === featureId).footprint });
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (anim) {
        anim.t = Math.min(1, anim.t + 0.03);
        const e = 1 - Math.pow(1 - anim.t, 3);
        camera.position.lerpVectors(anim.fromPos, anim.toPos, e);
        controls.target.lerpVectors(anim.fromTarget, anim.toTarget, e);
        if (anim.t >= 1) anim = null;
      }
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
      mount.replaceChildren();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.update({ selectedId, spaceId, floorView });
  }, [selectedId, spaceId, floorView]);

  const selectFeature = (id) => {
    setSelectedId(id);
    setSpaceId(null);
    setFloorView("all");
    const f = campus.features.find((x) => x.id === id);
    api.current?.flyTo({ polygon: f?.footprint });
  };

  const selectFloor = (view) => {
    setFloorView(view);
    setSpaceId(null);
    if (selected && view !== "all") {
      api.current?.flyTo({ polygon: selected.footprint, y: BASE + view * selected.floorHeight });
    }
  };

  const selectSpace = (s) => {
    setSpaceId(s.id);
    setFloorView(s.floor);
    api.current?.flyTo({ polygon: s.polygon, y: BASE + s.floor * selected.floorHeight });
  };

  const floorRooms = selected && isDetailed(selected) && floorView !== "all" ? selected.rooms.filter((r) => r.floor === floorView) : [];
  const floorWashrooms = selected && isDetailed(selected) && floorView !== "all" ? selected.washrooms.filter((r) => r.floor === floorView) : [];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Helmet>
        <title>NIT Kurukshetra 3D Campus Map</title>
        <meta name="description" content="Explore the NIT Kurukshetra campus in 3D." />
      </Helmet>
      <div ref={mountRef} className="absolute inset-0" />

      <div className="absolute top-3 left-3 w-72 max-h-[calc(100%-1.5rem)] overflow-auto rounded-xl bg-white/90 p-3 shadow-lg text-sm">
        <Link to="/nit-kkr-pyqs" className="text-blue-600 hover:underline">
          ← Back to site
        </Link>
        <h1 className="mt-2 text-base font-bold">NIT Kurukshetra Campus</h1>
        <button className="mt-2 w-full rounded-md bg-slate-100 px-2 py-1 text-left hover:bg-slate-200" onClick={() => selectFeature(null)}>
          Whole campus
        </button>
        <ul className="mt-2 space-y-1">
          {campus.features.map((f) => (
            <li key={f.id}>
              <button
                className={`w-full rounded-md px-2 py-1 text-left hover:bg-slate-200 ${f.id === selectedId ? "bg-blue-100" : "bg-slate-100"}`}
                onClick={() => selectFeature(f.id)}
              >
                {f.name}
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <div className="mt-3 border-t pt-2">
            <div className="font-semibold">{selected.name}</div>
            <div className="text-slate-600 capitalize">{selected.kind}</div>

            {isDetailed(selected) ? (
              <>
                <div className="mt-2 flex flex-wrap gap-1">
                  {["all", ...selected.floorLabels.keys()].map((v) => (
                    <button
                      key={v}
                      className={`rounded-md px-2 py-1 ${v === floorView ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
                      onClick={() => selectFloor(v)}
                    >
                      {v === "all" ? "Whole building" : `${selected.floorLabels[v]} floor`}
                    </button>
                  ))}
                </div>
                {floorView === "all" ? (
                  <div className="mt-2 text-slate-500">Pick a floor to look inside and see its rooms.</div>
                ) : (
                  <>
                    <div className="mt-2 font-medium">Rooms</div>
                    <ul className="mt-1 space-y-1">
                      {floorRooms.map((r) => (
                        <li key={r.id}>
                          <button
                            className={`w-full rounded-md px-2 py-1 text-left hover:bg-slate-200 ${r.id === spaceId ? "bg-amber-100" : "bg-slate-100"}`}
                            onClick={() => selectSpace(r)}
                          >
                            {r.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 font-medium">Washrooms</div>
                    <ul className="mt-1 grid grid-cols-2 gap-1">
                      {floorWashrooms.map((r) => (
                        <li key={r.id}>
                          <button
                            className={`w-full rounded-md px-2 py-1 text-left hover:bg-slate-200 ${r.id === spaceId ? "bg-amber-100" : "bg-slate-100"}`}
                            onClick={() => selectSpace(r)}
                          >
                            {r.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {space && (
                  <div className="mt-3 rounded-md bg-amber-50 p-2">
                    <div className="font-semibold">{space.name}</div>
                    <div className="text-slate-600">
                      {selected.floorLabels[space.floor]} floor · {space.type}
                    </div>
                    {space.size && (
                      <div className="text-slate-600">
                        {space.size[0]} m × {space.size[1]} m ({space.area} m²)
                      </div>
                    )}
                    <div className="text-slate-600">
                      {space.doors.length} door{space.doors.length === 1 ? "" : "s"}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-1 text-slate-500">Rooms not added yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
