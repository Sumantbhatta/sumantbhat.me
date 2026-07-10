"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT HERO — cinematic title with a thin rule below leading into the form
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactHero() {
  return (
    <section
      className="ctc-hero"
      id="top"
      data-header-theme="light"
      aria-label="Contact — Get In Touch"
    >
      {/* Title */}
      <div className="ctc-hero__head container">
        <motion.h1
          className="ctc-hero__title"
          initial={{ opacity: 0, y: -44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          <span className="ctc-hero__title-line">Get In</span>
          <em className="ctc-hero__title-em">Touch.</em>
        </motion.h1>
      </div>


    </section>
  );
}
