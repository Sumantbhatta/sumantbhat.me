"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────────────────

type KeySize = "small" | "normal" | "wide" | "xwide";

interface KeyDef {
  id: string;
  label: string;
  subLabel?: string;
  href: string | null;
  download?: boolean;
  size: KeySize;
  deco?: boolean;
}

const KEY_DEFS: KeyDef[] = [
  // Decorative row
  { id: "esc",       label: "ESC",         href: null, size: "small",  deco: true },
  { id: "tab",       label: "TAB",         href: null, size: "small",  deco: true },
  { id: "del",       label: "⌫",           href: null, size: "small",  deco: true },
  { id: "fn",        label: "FN",          href: null, size: "small",  deco: true },
  // Link keys
  { id: "linkedin",  label: "LinkedIn",    subLabel: "↗", href: "#",   size: "wide"   },
  { id: "github",    label: "GitHub",      subLabel: "↗", href: "#",   size: "normal" },
  { id: "instagram", label: "Instagram",   subLabel: "↗", href: "#",   size: "wide"   },
  { id: "email",     label: "Email",       subLabel: "✉", href: "#",   size: "normal" },
  { id: "cv",        label: "Download CV", subLabel: "↓", href: "#",   size: "xwide", download: true },
  // More decorative
  { id: "shift",     label: "SHIFT",       href: null, size: "wide",   deco: true },
  { id: "ctrl",      label: "CTRL",        href: null, size: "small",  deco: true },
  { id: "cmd",       label: "⌘",           href: null, size: "small",  deco: true },
  { id: "alt",       label: "⌥",           href: null, size: "small",  deco: true },
  { id: "enter",     label: "↵",           href: null, size: "normal", deco: true },
];

const SIZE_DIM: Record<KeySize, { w: number; h: number }> = {
  small:  { w: 52,  h: 52 },
  normal: { w: 76,  h: 52 },
  wide:   { w: 116, h: 52 },
  xwide:  { w: 156, h: 52 },
};

function isActualDrag(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y) > 8;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function PhysicsKeyboard() {
  const sectionRef   = useRef<HTMLElement>(null);
  const stageRef     = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const keysLayerRef = useRef<HTMLDivElement>(null);

  // Matter.js world refs — never trigger re-render
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engineRef   = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runnerRef   = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRef   = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodiesRef   = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wallsRef    = useRef<any[]>([]);
  const keyElsRef   = useRef<HTMLElement[]>([]);
  const rafRef      = useRef<number>(0);
  const spawnedRef  = useRef(false);

  // Click vs drag tracking
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const didDragRef      = useRef(false);

  // ── Init physics engine ───────────────────────────────────────────────────
  const initPhysics = useCallback(async () => {
    const M = await import("matter-js");
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = M;

    const stage  = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const T = 60;

    // Engine & gravity
    const engine = Engine.create({ gravity: { x: 0, y: 1.9 } });
    engineRef.current = engine;

    // Hidden render — only here to provide canvas context for MouseConstraint
    const render = Render.create({
      canvas,
      engine,
      options: { width: W, height: H, background: "transparent", wireframes: false },
    });
    renderRef.current = render;
    Render.run(render);

    // Runner at ~60fps
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Static walls — floor + sides, no ceiling so keys fall in
    const floor  = Bodies.rectangle(W / 2,        H + T / 2,   W * 4, T,    { isStatic: true, label: "floor" });
    const wallL  = Bodies.rectangle(-T / 2,        H / 2,       T,    H * 4, { isStatic: true, label: "wallL" });
    const wallR  = Bodies.rectangle(W + T / 2,    H / 2,       T,    H * 4, { isStatic: true, label: "wallR" });
    wallsRef.current = [floor, wallL, wallR];
    Composite.add(engine.world, [floor, wallL, wallR]);

    // Mouse constraint for dragging
    const mouse = Mouse.create(stage);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, render: { visible: false } },
    });
    Composite.add(engine.world, mc);

    // Micro-bounce on collision for snappiness
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Events.on(engine, "collisionStart", (ev: any) => {
      ev.pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        if (!bodyA.isStatic) Body.setVelocity(bodyA as unknown as import("matter-js").Body, { x: bodyA.velocity.x * 1.04, y: bodyA.velocity.y * 1.04 });
        if (!bodyB.isStatic) Body.setVelocity(bodyB as unknown as import("matter-js").Body, { x: bodyB.velocity.x * 1.04, y: bodyB.velocity.y * 1.04 });
      });
    });

    // Track mousedown for click-vs-drag detection
    stage.addEventListener("mousedown", (e) => {
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      didDragRef.current = false;
    });
    stage.addEventListener("mousemove", (e) => {
      if (!mouseDownPosRef.current) return;
      if (isActualDrag(mouseDownPosRef.current, { x: e.clientX, y: e.clientY })) {
        didDragRef.current = true;
      }
    });

    // RAF sync loop — reads physics body positions, applies to DOM elements
    function syncDom() {
      bodiesRef.current.forEach((body, i) => {
        const el = keyElsRef.current[i];
        if (!el) return;
        el.style.transform =
          `translate(${body.position.x}px,${body.position.y}px) rotate(${body.angle}rad) translate(-50%,-50%)`;
      });
      rafRef.current = requestAnimationFrame(syncDom);
    }
    rafRef.current = requestAnimationFrame(syncDom);
  }, []);

  // ── Spawn key bodies & DOM elements ──────────────────────────────────────
  const spawnKeys = useCallback(async () => {
    if (spawnedRef.current) return;
    spawnedRef.current = true;

    const M = await import("matter-js");
    const { Bodies, Body, Composite } = M;

    const engine    = engineRef.current;
    const stage     = stageRef.current;
    const keysLayer = keysLayerRef.current;
    if (!engine || !stage || !keysLayer) return;

    const W = stage.clientWidth;

    KEY_DEFS.forEach((def, idx) => {
      const { w, h } = SIZE_DIM[def.size];

      // Distribute across width with some randomness
      const col   = idx % 5;
      const startX = W * 0.08 + (col / 4) * W * 0.84;
      const startY = -100 - Math.random() * 550 - idx * 30;

      const body = Bodies.rectangle(startX, startY, w, h, {
        restitution: 0.36,
        friction:    0.06,
        frictionAir: 0.013,
        label:       def.id,
        angle:       (Math.random() - 0.5) * 0.85,
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: Math.random() * 2 });

      Composite.add(engine.world, body);
      bodiesRef.current.push(body);

      // ── Create DOM key element ────────────────────────────────────────────
      const el = document.createElement("div");
      el.className = [
        "bk-key",
        `bk-key--${def.size}`,
        def.href    ? "bk-key--link" : "",
        def.deco    ? "bk-key--deco" : "",
      ].join(" ").trim();
      el.dataset.keyId = def.id;

      const face = document.createElement("div");
      face.className = "bk-key__face";

      const labelEl = document.createElement("span");
      labelEl.className = "bk-key__label";
      labelEl.textContent = def.label;
      face.appendChild(labelEl);

      if (def.subLabel) {
        const sub = document.createElement("span");
        sub.className = "bk-key__sub";
        sub.textContent = def.subLabel;
        face.appendChild(sub);
      }

      el.appendChild(face);
      keysLayer.appendChild(el);
      keyElsRef.current.push(el);

      // ── Link / download click handler ─────────────────────────────────────
      if (def.href) {
        el.addEventListener("mouseup", () => {
          if (didDragRef.current) return;
          if (def.download) {
            const a = document.createElement("a");
            a.href     = def.href!;
            a.download = "";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            window.open(def.href!, "_blank", "noopener,noreferrer");
          }
          el.classList.add("bk-key--pressed");
          setTimeout(() => el.classList.remove("bk-key--pressed"), 180);
        });
      }
    });
  }, []);

  // ── Resize handler ────────────────────────────────────────────────────────
  const handleResize = useCallback(async () => {
    const M = await import("matter-js");
    const { Body, Render } = M;
    const engine = engineRef.current;
    const render = renderRef.current;
    const stage  = stageRef.current;
    if (!engine || !render || !stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const T = 60;
    const [floor, wL, wR] = wallsRef.current;
    if (floor) Body.setPosition(floor, { x: W / 2,       y: H + T / 2 });
    if (wL)    Body.setPosition(wL,    { x: -T / 2,      y: H / 2     });
    if (wR)    Body.setPosition(wR,    { x: W + T / 2,   y: H / 2     });
    render.canvas.width   = W;
    render.canvas.height  = H;
    render.options.width  = W;
    render.options.height = H;
  }, []);

  // ── Proximity repulsion on mouse move ─────────────────────────────────────
  const handleMouseMove = useCallback(async (e: MouseEvent) => {
    const M = await import("matter-js");
    const { Body } = M;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const RADIUS = 100;
    const FORCE  = 0.0013;
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

  // ── Main effect ───────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const stage   = stageRef.current;
    if (!section || !stage) return;

    initPhysics();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && spawnKeys()),
      { threshold: 0.04 }
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
      bodiesRef.current  = [];
      wallsRef.current   = [];
      keyElsRef.current  = [];
      spawnedRef.current = false;
    };
  }, [initPhysics, spawnKeys, handleResize, handleMouseMove]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      className="pbk-section"
      id="links"
      data-header-theme="light"
      aria-label="Quick links — interactive keyboard"
    >
      {/* ── Thin label rule — "reach me directly" ── */}
      <motion.div
        className="pbk-label-rule container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-40px" }}
        aria-hidden="true"
      >
        <span className="pbk-label-text label">Reach me directly — drag, toss, click</span>
      </motion.div>

      {/* ── Physics stage — keys fall in on scroll, fill this section ── */}
      <div ref={stageRef} className="pbk-stage" data-lenis-prevent>
        <canvas ref={canvasRef} className="pbk-canvas" aria-hidden="true" />
        <div ref={keysLayerRef} className="pbk-keys-layer" aria-label="Interactive keyboard keys" />
      </div>
    </section>
  );
}
