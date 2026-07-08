"use client";

import Image from "next/image";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

interface HeroFrameProps {
  activeDirection: number;
}

// Normalized gaze vectors per direction zone (for the head-weight nudge).
const DIRECTION_GAZE: Record<number, { x: number; y: number }> = {
  1: { x: -1, y: -1 },
  2: { x:  0, y: -1 },
  3: { x:  1, y: -1 },
  4: { x: -1, y:  0 },
  5: { x:  0, y:  0 },
  6: { x:  1, y:  0 },
  7: { x: -1, y:  1 },
  8: { x:  0, y:  1 },
  9: { x:  1, y:  1 },
};

// Manual vertical alignment per face image.
// Positive = move DOWN, negative = move UP.
const FACE_Y_OFFSETS: Record<number, string> = {
  1: "+3.9%",
  2: "+3.7%",
  3: "+4%",
  4: "+1.5%",
  5: "+1.2%",
  6: "+2%",
  7: "0%",
  8: "0%",
  9: "0%",
};

const DIRECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function HeroFrame({ activeDirection }: HeroFrameProps) {
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isFaceVisible, setIsFaceVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // The direction we're currently showing. Separate from activeDirection so we
  // can control exactly when React re-renders (not on every mousemove).
  const [visibleDirection, setVisibleDirection] = useState(activeDirection);

  useEffect(() => {
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth < 1024;
    setIsTouchDevice(isTouch);
    setIsMounted(true);

    const handleResize = () => {
      setIsTouchDevice(
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        window.innerWidth < 1024
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync visible direction with the incoming prop
  useEffect(() => {
    setVisibleDirection(activeDirection);
  }, [activeDirection]);

  const effectiveDirection = isMounted && isTouchDevice ? 5 : visibleDirection;
  const effectiveActive    = isMounted && isTouchDevice ? 5 : activeDirection;

  // ── Raw mouse tracking ────────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      mouseX.set((e.clientX / window.innerWidth)  * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, isTouchDevice]);

  // ── Cursor-follow spring ──────────────────────────────────────────────────
  // Tuned for "crisp but not mechanical":
  //   - stiffness 70 → fast response, no noticeable lag
  //   - damping 20 + mass 1.2 → underdamped enough for a tiny natural overshoot
  //   - critically: NOT overdamped so it doesn't feel sticky
  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 20, mass: 1.2 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 20, mass: 1.2 });

  // Small parallax range (±3.5px / ±2.5px)
  const headX = useTransform(smoothX, [-1, 1], [-3.5, 3.5]);
  const headY = useTransform(smoothY, [-1, 1], [-2.5, 2.5]);

  // ── Gaze-direction weight nudge ───────────────────────────────────────────
  // When the face switches direction, the whole head subtly shifts 2px that way.
  // The spring here is slower than the cursor spring intentionally — it simulates
  // the inertia of an actual head turning toward a new point of interest.
  const gazeMV_X = useMotionValue(0);
  const gazeMV_Y = useMotionValue(0);
  const gazeX = useSpring(gazeMV_X, { stiffness: 40, damping: 22, mass: 1.6 });
  const gazeY = useSpring(gazeMV_Y, { stiffness: 40, damping: 22, mass: 1.6 });

  useEffect(() => {
    const gaze = DIRECTION_GAZE[effectiveActive] ?? { x: 0, y: 0 };
    gazeMV_X.set(gaze.x * 2);
    gazeMV_Y.set(gaze.y * 2);
  }, [effectiveActive, gazeMV_X, gazeMV_Y]);

  // ── Organic micro-drift ───────────────────────────────────────────────────
  // Imperceptibly small (±1px) random corrections every 2–5 seconds.
  // A very slow, heavy spring so they never feel like a glitch.
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  const driftSpX = useSpring(driftX, { stiffness: 10, damping: 20, mass: 2.5 });
  const driftSpY = useSpring(driftY, { stiffness: 10, damping: 20, mass: 2.5 });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      driftX.set((Math.random() - 0.5) * 2);
      driftY.set((Math.random() - 0.5) * 2);
      timer = setTimeout(tick, 2000 + Math.random() * 3000);
    };
    timer = setTimeout(tick, 2500);
    return () => clearTimeout(timer);
  }, [driftX, driftY]);

  // Preload all face images once on mount
  useEffect(() => {
    DIRECTIONS.forEach((dir) => {
      const img = new window.Image();
      img.src = `/images/hero/${dir}.png`;
    });
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-[49%] -translate-y-1/2 scale-[0.95] lg:scale-100 w-[100vw] h-[56.25vw] min-h-[100dvh] min-w-[177.77dvh] lg:relative lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 lg:w-full lg:h-auto lg:min-h-0 lg:min-w-0 lg:aspect-[16/9] lg:mx-auto overflow-hidden select-none pointer-events-none">

      {/* ── 0. Intro video ─────────────────────────────────────────────────── */}
      {isVideoVisible && (
        <video
          src="/images/hero/frame1.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration && v.duration - v.currentTime <= 2.0) {
              setIsFaceVisible(true);
            }
          }}
          onEnded={() => setIsVideoVisible(false)}
          className="absolute inset-0 w-full h-full object-cover z-20"
        />
      )}

      {/* ── 1. Background GIF ──────────────────────────────────────────────── */}
      <Image
        src="/images/hero/frame1.gif"
        alt="Animated Portfolio Frame"
        fill
        priority
        unoptimized
        className="object-cover relative z-10"
      />

      {/* ── 1b. Notebook intro text ─────────────────────────────────────────── */}
      {/*
        Positioned in the empty left zone of the notebook paper (~left 22%,
        top 26%). Fades in alongside the face so it feels like one reveal.
        Uses ONLY existing fonts & colors — no new design tokens introduced.
      */}
      <motion.div
        key={isVideoVisible ? "waiting" : "playing"}
        className="absolute pointer-events-none select-none"
        style={{
          left: "22%",
          top: "26%",
          width: "24%",
          zIndex: 15,
        }}
        initial="hidden"
        animate={!isVideoVisible ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0.99 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* "Hi, I'm!" — Smooth slide from left */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -15, rotate: -1.5 },
            visible: { 
              opacity: 0.88, 
              x: 0, 
              rotate: -1.5,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
          style={{
            fontFamily: "sloop-script-one, cursive",
            fontSize: "2.4vw",
            color: "#30241d",
            lineHeight: 1,
            marginBottom: "0.2em",
            display: "inline-block",
            transformOrigin: "left center",
          }}
        >
          Hi, I&apos;m!
        </motion.div>
        <br />
        
        {/* SUMANTH BHAT — Punchy spring pop-up */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.95, rotate: -2 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotate: 0,
              transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 } 
            }
          }}
          style={{
            fontFamily: "interstate-condensed, sans-serif",
            fontSize: "4vw",
            fontWeight: 700,
            color: "#202020",
            lineHeight: 0.92,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            marginBottom: "0.35em",
            display: "inline-block",
            transformOrigin: "left bottom",
            textShadow: "0.5px 0.5px 0 rgba(32,32,32,0.18), -0.3px 0.3px 0 rgba(32,32,32,0.09)",
          }}
        >
          SUMANTH<br />BHAT
        </motion.div>
        <br />

        {/* FULL STACK DEV • FLUTTER GUY — Smooth slide in */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -15 },
            visible: { 
              opacity: 0.72, 
              x: 0, 
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
          style={{
            fontFamily: "interstate-condensed, sans-serif",
            fontSize: "1vw",
            fontWeight: 700,
            color: "#30241d",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: "0.7em",
            display: "inline-block",
          }}
        >
          Full Stack Dev&nbsp;•&nbsp;Flutter Guy
        </motion.div>
        <br />

        {/* Short tagline — Gentle fade up */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { 
              opacity: 0.6, 
              y: 0, 
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
          style={{
            fontFamily: "interstate, sans-serif",
            fontSize: "0.85vw",
            fontWeight: 300,
            color: "#30241d",
            lineHeight: 1.5,
            maxWidth: "92%",
            display: "inline-block",
          }}
        >
          Building beautiful apps &amp;<br />delightful digital experiences.
        </motion.div>
        <br />

        {/* "yep, Flutter is my thing!" — Playful bouncy pop at the end */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.6, rotate: -8 },
            visible: { 
              opacity: 0.5, 
              scale: 1, 
              rotate: 2, 
              transition: { type: "spring", stiffness: 160, damping: 10, mass: 0.8 } 
            }
          }}
          style={{
            fontFamily: "sloop-script-one, cursive",
            fontSize: "1.3vw",
            color: "#30241d",
            marginTop: "1.8em",
            display: "inline-block",
            transformOrigin: "center center",
          }}
        >
          yep, Flutter is my thing!
        </motion.div>
      </motion.div>

      {/* ── 2. Face system ─────────────────────────────────────────────────── */}
      {/*
        Motion layer stack (bottom → top):
          [slide-up entrance]
            [breathing bob]
              [gaze weight nudge]  ← slower spring, sells head inertia
                [cursor parallax]  ← faster spring, sells live tracking
                  [micro-drift]    ← imperceptible jitter, sells life
                    [face images]  ← instant swap, no crossfade flash
      */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        initial={{ y: "15%", opacity: 0 }}
        animate={{
          y: isFaceVisible ? "0%" : "15%",
          opacity: isFaceVisible ? 1 : 0,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Breathing */}
        <motion.div
          className="absolute mix-blend-multiply"
          style={{
            width: "29%",
            left: "37%",
            bottom: isMounted && isTouchDevice ? "14.5%" : "15%",
            aspectRatio: "1/1",
          }}
          animate={{ y: [0, -1.5, 0, 1.5, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        >
          {/* Gaze weight */}
          <motion.div className="absolute inset-0" style={{ x: gazeX, y: gazeY }}>
            {/* Cursor parallax */}
            <motion.div className="absolute inset-0" style={{ x: headX, y: headY }}>
              {/* Micro-drift */}
              <motion.div className="absolute inset-0" style={{ x: driftSpX, y: driftSpY }}>

                {/*
                  Face swap strategy — "cut-in, fade-out":
                  ─────────────────────────────────────────
                  The INCOMING face (isCurrent=true) cuts in at full opacity
                  immediately with zIndex:10. It's on top and fully opaque —
                  the viewer only sees it. No transition needed.

                  The OUTGOING face stays at its last opacity and gently fades
                  to 0 underneath (zIndex:0), hidden behind the incoming face
                  the entire time. The viewer never sees the fade.

                  Result: zero double-exposure, zero flash. The face change reads
                  as "the person turned their head" not "an image was swapped".
                */}
                {DIRECTIONS.map((dir) => {
                  const isCurrent = effectiveDirection === dir;
                  return (
                    <motion.div
                      key={dir}
                      className="absolute inset-0"
                      style={{ zIndex: isCurrent ? 10 : 0 }}
                      animate={{ opacity: isCurrent ? 1 : 0 }}
                      transition={
                        isCurrent
                          ? { duration: 0, delay: 0 } // incoming: instant, on top
                          : { duration: 0.18, ease: "easeOut" } // outgoing: fades under
                      }
                    >
                      <div
                        className="relative w-full h-full"
                        style={{ top: FACE_Y_OFFSETS[dir] }}
                      >
                        <Image
                          src={`/images/hero/${dir}.png`}
                          alt={`Hero face direction ${dir}`}
                          fill
                          className="object-contain"
                          priority
                          unoptimized
                        />
                      </div>
                    </motion.div>
                  );
                })}

              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── 3. "Explore my work" click target ─────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[25%] h-[12%] z-50 pointer-events-auto cursor-pointer"
        aria-label="Explore my work"
        title="Explore my work"
      />

      {/* ── Face cursor zone: transparent overlay so the cursor dot hides over the face ── */}
      {isFaceVisible && (
        <div
          data-cursor="face"
          className="absolute z-40 pointer-events-auto"
          style={{
            // Match the face image container position/size from above
            width: "29%",
            left: "37%",
            bottom: isMounted && isTouchDevice ? "14.5%" : "15%",
            aspectRatio: "1/1",
          }}
        />
      )}
    </div>
  );
}
