"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 227;
const SCROLL_HEIGHT = "700vh";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(4, "0");
}

function frameSrc(index: number) {
  return `/frames/frame_${pad(index + 1)}.webp`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL MOUSE ICON — premium animated SVG indicator
// ─────────────────────────────────────────────────────────────────────────────

function ScrollMouseIcon() {
  return (
    <div className="ls-scroll-mouse">
      {/* Mouse body outline */}
      <svg
        width="28"
        height="42"
        viewBox="0 0 28 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer shell */}
        <rect
          x="1"
          y="1"
          width="26"
          height="40"
          rx="13"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.2"
        />
        {/* Center divider line */}
        <line
          x1="14"
          y1="1"
          x2="14"
          y2="18"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Animated scroll wheel dot — CSS animation (FM conflicts with SVG cy) */}
        <circle
          cx="14"
          cy="12"
          r="2.5"
          fill="white"
          className="ls-mouse-dot"
        />
      </svg>

      {/* Stacked chevrons below mouse */}
      <div className="ls-scroll-chevrons" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.svg
            key={i}
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            animate={{ opacity: [0, 0.7, 0], y: [0, 4, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ))}
      </div>

      <span className="ls-scroll-label">Scroll</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LifeStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  const [currentFrame, setCurrentFrame]   = useState(0);
  const [loadedFrames, setLoadedFrames]   = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress]   = useState(0);
  const [isReady, setIsReady]             = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  });

  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);
  const introOpacity   = useTransform(smoothProgress, [0, 0.04], [1, 0]);
  const canvasOpacity  = useTransform(smoothProgress, [0.01, 0.05], [0, 1]);

  // ── Preload all frames ─────────────────────────────────────────────────────
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        images[i] = img;
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) {
          setLoadedFrames(images);
          setIsReady(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          setLoadedFrames(images);
          setIsReady(true);
        }
      };
    }
  }, []);

  // ── Draw frame (CSS pixels, no DPR scaling) ────────────────────────────────
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img    = loadedFrames[index];
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      const imgRatio    = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let dw: number, dh: number, dx: number, dy: number;
      if (imgRatio > canvasRatio) {
        dw = cw;
        dh = Math.round(cw / imgRatio);
        dx = 0;
        dy = Math.round((ch - dh) / 2);
      } else {
        dh = ch;
        dw = Math.round(ch * imgRatio);
        dx = Math.round((cw - dw) / 2);
        dy = 0;
      }

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    },
    [loadedFrames]
  );

  // ── Scroll → frame index ───────────────────────────────────────────────────
  useEffect(() => {
    return smoothProgress.on("change", (v) => {
      const idx = Math.min(Math.max(Math.round(v * (TOTAL_FRAMES - 1)), 0), TOTAL_FRAMES - 1);
      setCurrentFrame(idx);
      drawFrame(idx);
    });
  }, [smoothProgress, drawFrame]);

  useEffect(() => {
    if (isReady) drawFrame(0);
  }, [isReady, drawFrame]);

  // ── Canvas resize ──────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame(currentFrame);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedFrames]);

  return (
    <section
      ref={containerRef}
      className="life-story__section"
      style={{ height: SCROLL_HEIGHT }}
      id="lifestory"
      data-header-theme="light"
    >
      <div className="life-story__sticky">

        {/* ── Canvas ──────────────────────────────────────────────────────── */}
        <motion.div className="life-story__canvas-wrap" style={{ opacity: canvasOpacity }}>
          <canvas ref={canvasRef} className="life-story__canvas" />
        </motion.div>

        {/* ── Overlays ────────────────────────────────────────────────────── */}
        <div className="life-story__vignette"        aria-hidden="true" />
        <div className="life-story__gradient-bottom" aria-hidden="true" />
        <div className="life-story__gradient-top"    aria-hidden="true" />
        <div className="life-story__grain"           aria-hidden="true" />

        {/* ── Loader — simple, centered on black ─────────────────────────── */}
        <AnimatePresence>
          {!isReady && (
            <motion.div
              className="life-story__loader"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="life-story__loader-bar">
                <motion.div
                  className="life-story__loader-fill"
                  style={{ scaleX: loadProgress / 100, transformOrigin: "left" }}
                />
              </div>
              <span className="life-story__loader-label">
                {loadProgress}% — Loading your story
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Black intro overlay — after load, before first scroll ────────── */}
        {isReady && (
          <motion.div
            className="life-story__intro"
            style={{ opacity: introOpacity }}
            aria-hidden="true"
          >
            {/* "MY Story." headline */}
            <motion.h2
              className="life-story__intro-headline"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              My
            </motion.h2>
            <motion.h2
              className="life-story__intro-headline life-story__intro-headline--script"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              Story.
            </motion.h2>

            {/* Premium scroll mouse icon */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ScrollMouseIcon />
            </motion.div>
          </motion.div>
        )}

        {/* ── Minimal chrome during playback (section label only) ──────────── */}
        {isReady && (
          <motion.div className="life-story__chrome" style={{ opacity: canvasOpacity }}>
            <div className="life-story__section-label" aria-hidden="true">
              <span>Life Story</span>
              <span className="life-story__section-label-line" />
            </div>
          </motion.div>
        )}

        {/* ── Progress bar ────────────────────────────────────────────────── */}
        <div className="life-story__progress-track" aria-hidden="true">
          <motion.div
            className="life-story__progress-fill"
            style={{ scaleX: progressScaleX, transformOrigin: "left" }}
          />
        </div>

      </div>
    </section>
  );
}
