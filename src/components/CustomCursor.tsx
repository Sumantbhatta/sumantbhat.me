"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" | "hover" | "text" | "hidden";

/**
 * CustomCursor
 *
 * Architecture:
 *   Dot  — sticks exactly to the cursor via RAF (no spring lag, pixel-perfect)
 *   Ring — follows with a spring (stiffness:140, damping:18) giving depth + trailing weight
 *
 * States:
 *   default — dot + ring, both normal size
 *   hover   — dot shrinks to 0, ring expands to 52px, no border
 *   text    — thin I-beam (2×20px bar)
 *   hidden  — both invisible (e.g. over video / iframes)
 */
export function CustomCursor() {
  const [state, setState] = useState<CursorState>("default");
  const [isTouchDevice, setIsTouchDevice] = useState(true); // default true = hidden on SSR

  // Raw cursor position — updated every frame, no lag
  const dotRef = useRef<HTMLDivElement>(null);
  const rawX = useRef(0);
  const rawY = useRef(0);
  const rafRef = useRef<number>(0);
  const hoveredElRef = useRef<HTMLElement | null>(null);

  // Spring-driven ring position
  const springX = useMotionValue(0);
  const springY = useMotionValue(0);
  const ringX = useSpring(springX, { stiffness: 140, damping: 18, mass: 1 });
  const ringY = useSpring(springY, { stiffness: 140, damping: 18, mass: 1 });

  useEffect(() => {
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      "ontouchstart" in window;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    // Dot follows the cursor via RAF — no React state, no lag
    const tick = () => {
      if (dotRef.current) {
        // Position the wrapper at the raw cursor coords.
        // Centering (-50%/-50%) is handled by the inner motion.div via framer translateX/Y.
        dotRef.current.style.transform = `translate(${rawX.current}px, ${rawY.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      rawX.current = e.clientX;
      rawY.current = e.clientY;

      if (hoveredElRef.current) {
        const rect = hoveredElRef.current.getBoundingClientRect();
        
        // Only apply magnetic snap to reasonably sized elements (buttons, nav links, etc.)
        // Massive blocks (like full-width rows or large cards) will just use standard trailing.
        if (rect.width < 350 && rect.height < 150) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;
          
          // Parallax amount: 0 is completely locked to center, 1 is no magnetic effect.
          const magneticPull = 0.15; 
          
          springX.set(centerX + distanceX * magneticPull);
          springY.set(centerY + distanceY * magneticPull);
          return;
        }
      }

      // Default spring follow
      springX.set(e.clientX);
      springY.set(e.clientY);
    };

    const onLeave = () => setState("hidden");
    const onEnter = () => setState("default");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    // Detect interactive elements to switch cursor state
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, [role='button'], [data-cursor='hover'], label, select, summary"
      );
      const isTextInput = (e.target as HTMLElement).closest(
        "input[type='text'], input[type='email'], textarea"
      );
      if (isTextInput) {
        setState("text");
        hoveredElRef.current = null;
      } else if (target) {
        setState("hover");
        hoveredElRef.current = target as HTMLElement;
      } else {
        setState("default");
        hoveredElRef.current = null;
      }
    };

    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [springX, springY]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  const isHover  = state === "hover";
  const isText   = state === "text";
  const isHidden = state === "hidden";

  return (
    <>
      {/* ── Dot: pixel-perfect, no spring ─────────────────────────────── */}
      {/* Wrapper is translated to cursor position by RAF each frame */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ willChange: "transform" }}
      >
        <motion.div
          animate={{
            width:   isText ? 2  : isHover ? 4  : 8,
            height:  isText ? 20 : isHover ? 4  : 8,
            opacity: isHidden ? 0 : 1,
            // oklch() is not animatable in Framer Motion — use sRGB hex equivalent
            backgroundColor: isHover ? "#e8623a" : "#30241d",
          }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            borderRadius: isText ? 1 : "50%",
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      </div>

      {/* ── Ring: spring-trailing, gives depth ─────────────────────────── */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
      >
        <motion.div
          animate={{
            width:        isHover ? 52 : isText ? 0 : 28,
            height:       isHover ? 52 : isText ? 0 : 28,
            borderWidth:  isHover ? 1.5 : 1,
            borderColor:  isHover ? "#30241d" : "#b1ada7",
            opacity:      isHidden ? 0 : isText ? 0 : 1,
            // "transparent" is not animatable — use rgba(0,0,0,0) instead
            backgroundColor: "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.25, ease: [0.625, 0.05, 0, 1] }}
          style={{
            borderStyle: "solid",
            borderRadius: "50%",
          }}
        />
      </motion.div>
    </>
  );
}
