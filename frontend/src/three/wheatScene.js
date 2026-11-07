// A wheat clump growing out of a cut-away block of soil: topsoil, subsoil and parent
// material as three strata, roots on the cut face, stones in the deepest layer, a ring of
// twelve months around the surface with this month lit, and a little drifting pollen.
// Colours are read from the CSS tokens (OKLCH) so the scene follows the palette and mode.
import * as THREE from "three";

// --- OKLCH token to sRGB --------------------------------------------------------------
function oklchToRgb(l, c, h) {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;
  const r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  const bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;
  return [r, g, bl].map((v) => Math.min(1, Math.max(0, v)));
}

function tokenColor(style, name, fallback) {
  const raw = style.getPropertyValue(name).trim();
  const m = /oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/i.exec(raw);
  if (!m) return new THREE.Color(fallback);
  const l = parseFloat(m[1]) / (raw.includes("%") ? 100 : 1);
  const [r, g, b] = oklchToRgb(l, parseFloat(m[2]), parseFloat(m[3]));
  // values above are linear-light; three expects linear for Color.setRGB with LinearSRGB
  return new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
}

// --- seeded randomness -----------------------------------------------------------------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// How far the wheat has grown, by month (Rabi: sown Nov, ripe by Apr).
const GROWTH = { 11: 0.42, 12: 0.55, 1: 0.68, 2: 0.82, 3: 0.95, 4: 1, 5: 1, 6: 0.6, 7: 0.6, 8: 0.6, 9: 0.6, 10: 0.5 };
const SEASON_OF = { 6: "kharif", 7: "kharif", 8: "kharif", 9: "kharif", 10: "kharif", 11: "rabi", 12: "rabi", 1: "rabi", 2: "rabi", 3: "rabi", 4: "zaid", 5: "zaid" };
const YEAR = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5];

function leafGeometry(curve, width, segments = 24) {
  const pos = [];
  const idx = [];
  const up = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    const side = new THREE.Vector3().crossVectors(tan, up).normalize();
    const w = width * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * 0.6);
    pos.push(p.x - side.x * w, p.y - side.y * w, p.z - side.z * w, p.x + side.x * w, p.y + side.y * w, p.z + side.z * w);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function createWheatScene(canvas, { month, reduced = false } = {}) {
  const style = getComputedStyle(canvas);
  const C = {
    soil1: tokenColor(style, "--color-soil-1", "#3b2a1f"),
    soil2: tokenColor(style, "--color-soil-2", "#5a4330"),
    soil3: tokenColor(style, "--color-soil-3", "#7d6a55"),
    stone: tokenColor(style, "--color-stone", "#9a9488"),
    root: tokenColor(style, "--color-root", "#e8e0cf"),
    stem: tokenColor(style, "--color-stem", "#6f8f3a"),
    ripe: tokenColor(style, "--color-stem-ripe", "#d1b46a"),
    pollen: tokenColor(style, "--color-pollen", "#f6f2e6"),
    brass: tokenColor(style, "--color-accent", "#c9a45a"),
    kharif: tokenColor(style, "--color-kharif", "#4f9a96"),
    rabi: tokenColor(style, "--color-rabi", "#c9a45a"),
    zaid: tokenColor(style, "--color-zaid", "#7f9150"),
    sky: tokenColor(style, "--color-on-night", "#f3efe4"),
    ground: tokenColor(style, "--color-night", "#0f1a14"),
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 100);
  camera.position.set(0.3, 2.3, 8.8);
  const target = new THREE.Vector3(0, 0.25, 0);
  camera.lookAt(target);

  // Light: a low warm sun from the left, a cool rim behind, sky and ground fill.
  scene.add(new THREE.HemisphereLight(C.sky, C.ground, 0.4));
  const sun = new THREE.DirectionalLight(C.ripe.clone().lerp(C.sky, 0.5), 3.1);
  sun.position.set(-5, 4.2, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -3;
  sun.shadow.camera.right = 3;
  sun.shadow.camera.top = 4;
  sun.shadow.camera.bottom = -3;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(C.ripe, 2.4);
  rim.position.set(2.5, 3.5, -5);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);
  const r = rng(7);

  // --- the soil block --------------------------------------------------------------
  const W = 2.5;
  const D = 1.45;
  const strata = [
    { h: 0.42, color: C.soil1, rough: 0.98 },
    { h: 0.48, color: C.soil2, rough: 0.95 },
    { h: 0.58, color: C.soil3, rough: 0.9 },
  ];
  let y = 0;
  const soil = new THREE.Group();
  strata.forEach((layer, i) => {
    const g = new THREE.BoxGeometry(W, layer.h, D, 24, 6, 12);
    // break up the cut faces a little so the strata read as earth, not plastic
    const p = g.attributes.position;
    const colors = [];
    for (let k = 0; k < p.count; k += 1) {
      const vx = p.getX(k);
      const vy = p.getY(k);
      const vz = p.getZ(k);
      const n = Math.sin(vx * 7.3 + i) * Math.cos(vz * 5.1) * 0.012 + (r() - 0.5) * 0.01;
      if (Math.abs(vz) > D / 2 - 0.001) p.setZ(k, vz + n);
      if (Math.abs(vx) > W / 2 - 0.001) p.setX(k, vx + n);
      const shade = 0.88 + r() * 0.2 + (vy / layer.h) * 0.06;
      colors.push(layer.color.r * shade, layer.color.g * shade, layer.color.b * shade);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: layer.rough, metalness: 0 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.y = -(y + layer.h / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    soil.add(mesh);
    y += layer.h;
  });
  const depth = y;
  // the surface: a slightly uneven skin of topsoil
  const surfG = new THREE.PlaneGeometry(W, D, 40, 24);
  surfG.rotateX(-Math.PI / 2);
  {
    const p = surfG.attributes.position;
    for (let k = 0; k < p.count; k += 1) p.setY(k, Math.sin(p.getX(k) * 4) * Math.cos(p.getZ(k) * 5) * 0.012 + r() * 0.012);
    surfG.computeVertexNormals();
  }
  const surf = new THREE.Mesh(surfG, new THREE.MeshStandardMaterial({ color: C.soil1.clone().multiplyScalar(0.92), roughness: 1 }));
  surf.position.y = 0.002;
  surf.receiveShadow = true;
  soil.add(surf);
  // stones in the parent layer, on the cut face
  const stoneG = new THREE.IcosahedronGeometry(1, 1);
  const stoneM = new THREE.MeshStandardMaterial({ color: C.stone.clone().multiplyScalar(0.62), roughness: 0.85, flatShading: true });
  for (let k = 0; k < 13; k += 1) {
    const s = 0.022 + r() * 0.045;
    const st = new THREE.Mesh(stoneG, stoneM);
    st.scale.set(s * (1 + r() * 0.6), s, s * (0.8 + r() * 0.5));
    st.position.set((r() - 0.5) * (W - 0.2), -(strata[0].h + strata[1].h + 0.08 + r() * (strata[2].h - 0.16)), D / 2 + s * 0.2);
    st.rotation.set(r() * 3, r() * 3, r() * 3);
    st.castShadow = true;
    soil.add(st);
  }
  root.add(soil);

  // --- the wheat ----------------------------------------------------------------------
  const grow = GROWTH[month] ?? 0.6;
  const muted = C.stem.clone().lerp(C.zaid, 0.45).lerp(C.ripe, 0.12);
  const stemColor = muted.clone().lerp(C.ripe, Math.max(0, (grow - 0.7) / 0.3));
  const leafColor = muted.clone().lerp(C.ripe, Math.max(0, (grow - 0.8) / 0.2)).multiplyScalar(0.86);
  const stemM = new THREE.MeshStandardMaterial({ color: stemColor, roughness: 0.55 });
  const leafM = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.62, side: THREE.DoubleSide, emissive: C.ripe, emissiveIntensity: 0.04 });
  const earM = new THREE.MeshStandardMaterial({ color: C.ripe.clone().lerp(C.stem, grow < 0.95 ? 0.45 : 0), roughness: 0.5 });
  const rootM = new THREE.MeshStandardMaterial({ color: C.root.clone().lerp(C.soil3, 0.35), roughness: 0.85, transparent: true, opacity: 0.7 });
  const grainG = new THREE.SphereGeometry(1, 10, 8);
  const awnM = new THREE.LineBasicMaterial({ color: C.ripe, transparent: true, opacity: 0.8 });

  const stalks = [];
  const count = 11;
  for (let i = 0; i < count; i += 1) {
    const g = new THREE.Group();
    const angle = (i / count) * Math.PI * 2 + r() * 0.6;
    const rad = 0.14 + r() * 0.62;
    g.position.set(Math.cos(angle) * rad, 0, Math.sin(angle) * rad * 0.62);
    const height = (1.5 + r() * 0.7) * (0.45 + grow * 0.7);
    const lean = new THREE.Vector3((r() - 0.5) * 0.5, 0, (r() - 0.5) * 0.3);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(lean.x * 0.15, height * 0.35, lean.z * 0.15),
      new THREE.Vector3(lean.x * 0.5, height * 0.7, lean.z * 0.5),
      new THREE.Vector3(lean.x, height, lean.z),
    ]);
    const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.008 + grow * 0.008, 6, false), stemM);
    stem.castShadow = true;
    g.add(stem);
    // leaves from the lower stem
    const leaves = 3 + Math.round(r() * 2);
    for (let k = 0; k < leaves; k += 1) {
      const t0 = 0.04 + k * 0.15 + r() * 0.06;
      const base = curve.getPoint(t0);
      const dir = new THREE.Vector3(Math.cos(angle + k * 2.1 + r()), 0, Math.sin(angle + k * 2.1 + r())).normalize();
      const len = (0.7 + r() * 0.55) * (0.65 + grow * 0.45);
      const lc = new THREE.CatmullRomCurve3([
        base,
        base.clone().add(dir.clone().multiplyScalar(len * 0.3)).add(new THREE.Vector3(0, len * 0.45, 0)),
        base.clone().add(dir.clone().multiplyScalar(len * 0.75)).add(new THREE.Vector3(0, len * 0.5, 0)),
        base.clone().add(dir.clone().multiplyScalar(len)).add(new THREE.Vector3(0, len * 0.22, 0)),
      ]);
      const leaf = new THREE.Mesh(leafGeometry(lc, 0.035 + r() * 0.015), leafM);
      leaf.castShadow = true;
      g.add(leaf);
    }
    // the ear, once the crop has headed
    if (grow >= 0.65) {
      const earLen = 0.38 + r() * 0.12;
      const top = curve.getPoint(1);
      const tan = curve.getTangent(1);
      const awnPts = [];
      const grains = 16;
      for (let k = 0; k < grains; k += 1) {
        const t = k / grains;
        const side = k % 2 ? 1 : -1;
        const pos = top.clone().add(tan.clone().multiplyScalar(t * earLen));
        const grain = new THREE.Mesh(grainG, earM);
        grain.scale.set(0.028, 0.05, 0.022);
        grain.position.copy(pos).add(new THREE.Vector3(side * 0.022, 0, 0));
        grain.rotation.z = -side * 0.35;
        grain.castShadow = true;
        g.add(grain);
        awnPts.push(grain.position.clone(), grain.position.clone().add(new THREE.Vector3(side * 0.12, 0.28 + r() * 0.1, (r() - 0.5) * 0.05)));
      }
      g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(awnPts), awnM));
    }
    g.userData = { phase: r() * Math.PI * 2, amp: 0.025 + r() * 0.03 };
    root.add(g);
    stalks.push(g);

    // roots, drawn on the cut face below this stalk
    const nRoots = 2;
    for (let k = 0; k < nRoots; k += 1) {
      const x0 = g.position.x;
      const pts = [new THREE.Vector3(x0, -0.02, D / 2 + 0.004)];
      let px = x0;
      const len = depth * (0.45 + r() * 0.45) * (0.5 + grow * 0.5);
      const steps = 7;
      for (let s = 1; s <= steps; s += 1) {
        px += (r() - 0.5) * 0.22;
        pts.push(new THREE.Vector3(px, -(len * s) / steps, D / 2 + 0.004 + r() * 0.006));
      }
      const rc = new THREE.CatmullRomCurve3(pts);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(rc, 40, 0.0048 - k * 0.001, 5, false), rootM);
      root.add(tube);
      // fine laterals
      for (let s = 0; s < 2; s += 1) {
        const t = 0.25 + r() * 0.6;
        const p0 = rc.getPoint(t);
        const lat = new THREE.CatmullRomCurve3([
          p0,
          p0.clone().add(new THREE.Vector3((r() - 0.5) * 0.25, -0.08 - r() * 0.12, 0.002)),
          p0.clone().add(new THREE.Vector3((r() - 0.5) * 0.45, -0.18 - r() * 0.2, 0.003)),
        ]);
        root.add(new THREE.Mesh(new THREE.TubeGeometry(lat, 12, 0.0024, 4, false), rootM));
      }
    }
  }

  // --- the ring of months: season arcs, month initials, this month named in brass ----
  const ring = new THREE.Group();
  const R = 2.35;
  const nowIndex = YEAR.indexOf(month);
  const step = (Math.PI * 2) / 12;
  // this month sits at the front left, clear of the block's cut face
  const angleOf = (i) => Math.PI / 2 + 0.8 + (i - nowIndex) * step;
  const bodyFont = style.getPropertyValue("--font-body").trim() || "sans-serif";
  function label(text, color, size, weight) {
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 128;
    const ctx = cv.getContext("2d");
    ctx.font = `${weight} ${size}px ${bodyFont}`;
    ctx.fillStyle = `#${color.getHexString()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 64);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.scale.set(0.6, 0.3, 1);
    return sp;
  }
  // one arc per run of months in the same season
  let start = 0;
  for (let i = 1; i <= 12; i += 1) {
    if (i === 12 || SEASON_OF[YEAR[i]] !== SEASON_OF[YEAR[start]]) {
      const key = SEASON_OF[YEAR[start]];
      const len = (i - start) * step - 0.03;
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(R, key === SEASON_OF[month] ? 0.016 : 0.009, 6, 64, len),
        new THREE.MeshStandardMaterial({ color: C[key], roughness: 0.4, metalness: key === "rabi" ? 0.4 : 0.1 })
      );
      arc.rotation.x = -Math.PI / 2;
      // the flat torus mirrors its angle when laid down, so start the arc at the season's end
      arc.rotation.z = -(angleOf(start) - step / 2 + 0.015 + len);
      ring.add(arc);
      start = i;
    }
  }
  YEAR.forEach((m, i) => {
    const a = angleOf(i);
    const isNow = m === month;
    const names = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    const full = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sp = label(isNow ? full[m] : names[m], isNow ? C.brass : C.sky, isNow ? 64 : 44, isNow ? 600 : 400);
    sp.material.opacity = isNow ? 1 : 0.55;
    const rr = R + (isNow ? 0.42 : 0.3);
    sp.position.set(Math.cos(a) * rr, isNow ? 0.5 : 0.12, Math.sin(a) * rr);
    if (isNow) sp.scale.set(0.9, 0.45, 1);
    ring.add(sp);
    if (isNow) {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.36, 0.03),
        new THREE.MeshStandardMaterial({ color: C.brass, roughness: 0.3, metalness: 0.6, emissive: C.brass, emissiveIntensity: 0.3 })
      );
      marker.position.set(Math.cos(a) * R, 0.18, Math.sin(a) * R);
      ring.add(marker);
    }
  });
  ring.position.y = 0.01;
  ring.scale.set(1, 1, 0.74);
  ring.rotation.y = 0.42; // cancel the block's turn so this month faces the viewer
  root.add(ring);

  // --- pollen ---------------------------------------------------------------------------
  const pCount = reduced ? 0 : 90;
  const pPos = new Float32Array(pCount * 3);
  for (let k = 0; k < pCount; k += 1) {
    pPos[k * 3] = (r() - 0.5) * 4.5;
    pPos[k * 3 + 1] = r() * 3.2;
    pPos[k * 3 + 2] = (r() - 0.5) * 2.5;
  }
  const pollenG = new THREE.BufferGeometry();
  pollenG.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pollen = new THREE.Points(pollenG, new THREE.PointsMaterial({ color: C.pollen, size: 0.022, transparent: true, opacity: 0.55, depthWrite: false }));
  root.add(pollen);

  // --- a soft shadow on the photograph beneath ---------------------------------------------
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.45 }));
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -depth - 0.01;
  shadowPlane.receiveShadow = true;
  root.add(shadowPlane);

  root.rotation.y = -0.42;
  root.position.y = 0.05;

  // --- loop ---------------------------------------------------------------------------
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  let running = !reduced;
  let visible = true;
  let frame = 0;
  const clock = new THREE.Clock();

  function size() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function render() {
    const t = clock.getElapsedTime();
    eased.x += (pointer.x - eased.x) * 0.05;
    eased.y += (pointer.y - eased.y) * 0.05;
    root.rotation.y = -0.42 + eased.x * 0.28 + (running ? Math.sin(t * 0.12) * 0.05 : 0);
    root.rotation.x = eased.y * 0.06;
    if (running) {
      stalks.forEach((g) => {
        g.rotation.z = Math.sin(t * 0.9 + g.userData.phase) * g.userData.amp;
        g.rotation.x = Math.cos(t * 0.7 + g.userData.phase) * g.userData.amp * 0.6;
      });
      const pp = pollenG.attributes.position;
      for (let k = 0; k < pCount; k += 1) {
        let py = pp.getY(k) + 0.0025;
        if (py > 3.3) py = 0.2;
        pp.setY(k, py);
        pp.setX(k, pp.getX(k) + Math.sin(t * 0.5 + k) * 0.0008);
      }
      pp.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }

  function loop() {
    render();
    frame = running && visible ? requestAnimationFrame(loop) : 0;
  }

  size();
  render();
  if (running) frame = requestAnimationFrame(loop);

  const ro = new ResizeObserver(() => {
    size();
    if (!frame) render();
  });
  ro.observe(canvas);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && running && !frame) frame = requestAnimationFrame(loop);
  });
  io.observe(canvas);

  function onVisibility() {
    visible = document.visibilityState === "visible";
    if (visible && running && !frame) frame = requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
      if (!frame) render();
    },
    setRunning(value) {
      running = value;
      if (running && visible && !frame) frame = requestAnimationFrame(loop);
    },
    dispose() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) [].concat(o.material).forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}
