"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // As the user scrolls down, this section fades and scales away
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.94]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  return (
    <section
      ref={containerRef}
      className="about-entrance__section"
      data-header-theme="light"
    >
      <motion.div
        className="about-entrance__inner"
        style={{ opacity, scale }}
      >
        {/* Film grain */}
        <div className="about-entrance__grain" aria-hidden="true" />

        {/* Radial vignette */}
        <div className="about-entrance__vignette" aria-hidden="true" />

        {/* Content */}
        <motion.div className="about-entrance__content" style={{ y: textY }}>

          {/* Eyebrow */}
          <motion.span
            className="about-entrance__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            A life in motion
          </motion.span>

          {/* Main headline */}
          <div className="about-entrance__headline-wrap" aria-label="My Story">
            <motion.h1
              className="about-entrance__headline"
              initial={{ opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              My
            </motion.h1>
            <motion.h1
              className="about-entrance__headline about-entrance__headline--italic"
              initial={{ opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.1, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              Story.
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            className="about-entrance__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            45 seconds. A life&rsquo;s worth of moments.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            className="about-entrance__scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              className="about-entrance__scroll-line"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="about-entrance__scroll-text">
              Scroll to begin
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom metadata strip */}
        <motion.div
          className="about-entrance__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.3 }}
        >
          <span>Sumanth Bhat</span>
          <span className="about-entrance__meta-dot" aria-hidden="true" />
          <span>Life Story</span>
          <span className="about-entrance__meta-dot" aria-hidden="true" />
          <span>2024 — Present</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
