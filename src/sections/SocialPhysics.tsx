"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// DATA — big social link buttons
// ─────────────────────────────────────────────────────────────────────────────

interface SocialDef {
  id: string;
  label: string;
  handle: string;
  href: string;
  download?: boolean;
  size: "md" | "lg" | "xl";
}

const SOCIALS: SocialDef[] = [
  {
    id:     "linkedin",
    label:  "LinkedIn",
    handle: "/in/sumanth-bhat",
    href:   "#",
    size:   "lg",
  },
  {
    id:     "github",
    label:  "GitHub",
    handle: "@sumantbhatta",
    href:   "#",
    size:   "md",
  },
  {
    id:     "instagram",
    label:  "Instagram",
    handle: "@sumantbhatta",
    href:   "#",
    size:   "lg",
  },
  {
    id:     "gmail",
    label:  "Gmail",
    handle: "hello@sumanthbhat.me",
    href:   "mailto:hello@sumanthbhat.me",
    size:   "md",
  },
  {
    id:      "cv",
    label:   "Resume",
    handle:  "Download PDF ↓",
    href:    "#",
    size:    "xl",
    download: true,
  },
];

// Physics dimensions (px) — BIG by design
const SIZE_DIM: Record<SocialDef["size"], { w: number; h: number }> = {
  md:  { w: 220, h: 88 },
  lg:  { w: 300, h: 88 },
  xl:  { w: 360, h: 88 },
};

function wasActualDrag(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  return Math.hypot(b.x - a.x, b.y - a.y) > 8;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SocialPhysics() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const btnsLayerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engineRef  = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runnerRef  = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRef  = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodiesRef  = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wallsRef   = useRef<any[]>([]);
  const elRefs     = useRef<HTMLElement[]>([]);
  const rafRef     = useRef<number>(0);
  const spawnedRef = useRef(false);

  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const didDragRef      = useRef(false);

  // ── Init physics ──────────────────────────────────────────────────────────
  const initPhysics = useCallback(async () => {
    const M = await import("matter-js");
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = M;

    const stage  = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const T = 80;

    const engine = Engine.create({ gravity: { x: 0, y: 1.6 } });
    engineRef.current = engine;

    const render = Render.create({
      canvas,
      engine,
      options: { width: W, height: H, background: "transparent", wireframes: false },
    });
    renderRef.current = render;
    Render.run(render);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Walls — floor + sides, open ceiling so buttons fall in from top
    const floor  = Bodies.rectangle(W / 2,       H + T / 2,   W * 4, T,    { isStatic: true, label: "floor" });
    const wallL  = Bodies.rectangle(-T / 2,       H / 2,       T,    H * 4, { isStatic: true, label: "wallL" });
    const wallR  = Bodies.rectangle(W + T / 2,   H / 2,       T,    H * 4, { isStatic: true, label: "wallR" });
    wallsRef.current = [floor, wallL, wallR];
    Composite.add(engine.world, [floor, wallL, wallR]);

    // Mouse drag
    const mouse = Mouse.create(stage);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.15, render: { visible: false } },
    });
    Composite.add(engine.world, mc);

    // Click vs drag tracking
    stage.addEventListener("mousedown", (e) => {
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      didDragRef.current = false;
    });
    stage.addEventListener("mousemove", (e) => {
      if (!mouseDownPosRef.current) return;
      if (wasActualDrag(mouseDownPosRef.current, { x: e.clientX, y: e.clientY })) {
        didDragRef.current = true;
      }
    });

    // RAF sync: physics bodies → DOM elements
    function syncDom() {
      bodiesRef.current.forEach((body, i) => {
        const el = elRefs.current[i];
        if (!el) return;
        el.style.transform =
          `translate(${body.position.x}px,${body.position.y}px) rotate(${body.angle}rad) translate(-50%,-50%)`;
      });
      rafRef.current = requestAnimationFrame(syncDom);
    }
    rafRef.current = requestAnimationFrame(syncDom);
  }, []);

  // ── Spawn big button bodies ───────────────────────────────────────────────
  const spawnButtons = useCallback(async () => {
    if (spawnedRef.current) return;
    spawnedRef.current = true;

    const M = await import("matter-js");
    const { Bodies, Body, Composite } = M;

    const engine   = engineRef.current;
    const stage    = stageRef.current;
    const layer    = btnsLayerRef.current;
    if (!engine || !stage || !layer) return;

    const W = stage.clientWidth;

    SOCIALS.forEach((def, idx) => {
      const { w, h } = SIZE_DIM[def.size];

      // Distribute: 3 on top row, 2 on bottom — spaced across width
      const col   = idx % 3;
      const startX = W * 0.12 + (col / 2) * W * 0.76;
      const startY = -120 - Math.random() * 600 - idx * 60;

      const body = Bodies.rectangle(startX, startY, w, h, {
        restitution: 0.32,
        friction:    0.05,
        frictionAir: 0.015,
        label:       def.id,
        angle:       (Math.random() - 0.5) * 0.5,
        chamfer:     { radius: 14 },   // rounded physics corners
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: Math.random() * 3 });
      Composite.add(engine.world, body);
      bodiesRef.current.push(body);

      // ── DOM element ──────────────────────────────────────────────────────
      const el   = document.createElement("div");
      el.className = `sph-btn sph-btn--${def.size}`;
      el.dataset.id = def.id;
      el.role    = "link";
      el.tabIndex = 0;

      // Size must match physics body exactly
      el.style.width  = `${w}px`;
      el.style.height = `${h}px`;

      // Inner layout
      el.innerHTML = `
        <div class="sph-btn__text">
          <span class="sph-btn__label">${def.label}</span>
          <span class="sph-btn__handle">${def.handle}</span>
        </div>
        <span class="sph-btn__arrow" aria-hidden="true">↗</span>
      `;

      layer.appendChild(el);
      elRefs.current.push(el);

      // Click handler — only fires if not dragging
      el.addEventListener("mouseup", () => {
        if (didDragRef.current) return;
        if (def.download) {
          const a = document.createElement("a");
          a.href = def.href; a.download = "";
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        } else if (def.href.startsWith("mailto:")) {
          window.location.href = def.href;
        } else {
          window.open(def.href, "_blank", "noopener,noreferrer");
        }
        el.classList.add("sph-btn--pressed");
        setTimeout(() => el.classList.remove("sph-btn--pressed"), 200);
      });

      // Keyboard trigger (Enter / Space)
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.dispatchEvent(new Event("mouseup"));
        }
      });
    });
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
  const handleResize = useCallback(async () => {
    const M = await import("matter-js");
    const { Body, Render } = M;
    const engine = engineRef.current;
    const render = renderRef.current;
    const stage  = stageRef.current;
    if (!engine || !render || !stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const T = 80;
    const [floor, wL, wR] = wallsRef.current;
    if (floor) Body.setPosition(floor, { x: W / 2,       y: H + T / 2 });
    if (wL)    Body.setPosition(wL,    { x: -T / 2,      y: H / 2     });
    if (wR)    Body.setPosition(wR,    { x: W + T / 2,   y: H / 2     });
    render.canvas.width   = W;
    render.canvas.height  = H;
    render.options.width  = W;
    render.options.height = H;
  }, []);

  // ── Proximity repulsion ───────────────────────────────────────────────────
  const handleMouseMove = useCallback(async (e: MouseEvent) => {
    const M = await import("matter-js");
    const { Body } = M;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const RADIUS = 140, FORCE = 0.0018;
    bodiesRef.current.forEach((body) => {
      if (body.isStatic) return;
      const dx = body.position.x - mx;
      const dy = body.position.y - my;
      const d  = Math.hypot(dx, dy);
      if (d < RADIUS && d > 0) {
        const s = (1 - d / RADIUS) * FORCE;
        Body.applyForce(body, body.position, { x: (dx / d) * s, y: (dy / d) * s });
      }
    });
  }, []);

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const stage   = stageRef.current;
    if (!section || !stage) return;

    initPhysics();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && spawnButtons()),
      { threshold: 0.05 }
    );
    io.observe(section);

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(stage);

    stage.addEventListener("mousemove", handleMouseMove as unknown as EventListener);

    return () => {
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
      cancelAnimationFrame(rafRef.current);
      import("matter-js").then(({ Runner, Render, Engine }) => {
        if (runnerRef.current) Runner.stop(runnerRef.current);
        if (renderRef.current) Render.stop(renderRef.current);
        if (engineRef.current) Engine.clear(engineRef.current);
      });
      bodiesRef.current = [];
      wallsRef.current  = [];
      elRefs.current    = [];
      spawnedRef.current = false;
    };
  }, [initPhysics, spawnButtons, handleResize, handleMouseMove]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      className="sph-section"
      id="connect"
      data-header-theme="light"
      aria-label="Social and contact links"
    >
      {/* Header */}
      <div className="sph-header container">
        <motion.span
          className="sph-eyebrow label"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Find Me
        </motion.span>

        <motion.h2
          className="sph-title"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          <span className="sph-title__line">Or just</span>
          <em className="sph-title__em">say hi.</em>
        </motion.h2>

        <motion.p
          className="sph-subtitle"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          viewport={{ once: true }}
        >
          Drag, toss, or click any button to connect.
        </motion.p>
      </div>

      {/* Physics playground */}
      <div ref={stageRef} className="sph-stage" data-lenis-prevent>
        {/* Hidden canvas — required for MouseConstraint */}
        <canvas ref={canvasRef} className="sph-canvas" aria-hidden="true" />
        {/* DOM buttons — positioned each frame by physics transforms */}
        <div ref={btnsLayerRef} className="sph-btns-layer" aria-label="Social link buttons" />
      </div>

      {/* Copyright */}
      <footer className="sph-footer">
        <div className="sph-footer__inner container">
          <p className="label sph-footer__copy">
            © {new Date().getFullYear()} Sumanth Bhat — All rights reserved
          </p>
        </div>
      </footer>
    </section>
  );
}
