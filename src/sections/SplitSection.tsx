"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from "framer-motion";

// Helper function to wrap values
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// Sub-component for the velocity marquee
interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function VelocityText({ children, baseVelocity = 2 }: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // Wrap from 0% to -25% (because we render 4 identical children, -25% shifts exactly one child over)
  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    // Change direction based on scroll direction if velocity is high enough
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * Math.abs(moveBy) * Math.abs(velocityFactor.get());
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0">
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        <h2 className="display text-[14vw] md:text-[9vw] leading-none px-4 text-[#f4f4f5]/10 uppercase tracking-tighter">
          {children}
        </h2>
        <h2 className="display text-[14vw] md:text-[9vw] leading-none px-4 text-[#f4f4f5]/10 uppercase tracking-tighter">
          {children}
        </h2>
        <h2 className="display text-[14vw] md:text-[9vw] leading-none px-4 text-[#f4f4f5]/10 uppercase tracking-tighter">
          {children}
        </h2>
        <h2 className="display text-[14vw] md:text-[9vw] leading-none px-4 text-[#f4f4f5]/10 uppercase tracking-tighter">
          {children}
        </h2>
      </motion.div>
    </div>
  );
}

export default function SplitSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Section Background: Transitions from light (Projects theme) to dark (Archive/About theme)
  const backgroundColor = useTransform(smoothProgress, [0, 0.4], ["#f2f2f2", "#0a0a0a"]);
  
  // Fade in the marquees smoothly as you enter the section
  const marqueeOpacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);

  return (
    <section
      id="split-section"
      ref={containerRef}
      className="relative w-full h-[120vh]"
      data-header-theme="light"
    >
      {/* Sticky Container */}
      <motion.div 
        style={{ backgroundColor }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        
        {/* Massive Background Marquees */}
        <motion.div 
          style={{ opacity: marqueeOpacity }}
          className="absolute inset-0 flex flex-col justify-center gap-2 pointer-events-none whitespace-nowrap z-0"
        >
          <VelocityText baseVelocity={-2}>
            AMRUT — EGPG — ENTRY360 — HANDYMAN Q8 — IFP HOMEWORK AI — KSVP PARENT APP — LEZZGOO — 
          </VelocityText>
          
          <VelocityText baseVelocity={1.5}>
            NEXSTI ERP — SANSKARADHAMA — SCANAI — SRINIVAS UNIVERSITY APP — TELESEEN — YIACO MEDSHOP — 
          </VelocityText>

          <VelocityText baseVelocity={-2.5}>
            LEZZGOO — KSVP PARENT APP — TELESEEN — EGPG — AMRUT — SCANAI — NEXSTI ERP — 
          </VelocityText>
        </motion.div>
      </motion.div>
    </section>
  );
}
