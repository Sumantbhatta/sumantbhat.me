"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PhysicsHero() {
  const getWord = "GET IN".split("");
  const touchWord = "Touch".split("");

  // Animation variants for the dropping letters
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      y: -800, 
      rotate: -45,
      opacity: 0 
    },
    visible: {
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
        mass: 1.5,
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full select-none pointer-events-none pb-8"
    >
      <div className="relative flex flex-col items-start ml-4 md:ml-16">
        
        {/* "GET IN" Line */}
        <div className="flex text-[6rem] md:text-[11rem] font-title uppercase tracking-tighter text-off-white font-bold leading-[0.8]">
          {getWord.map((letter, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className={letter === " " ? "w-8 md:w-16" : "inline-block origin-bottom"}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* "Touch" Line */}
        <div className="flex text-[5rem] md:text-[10rem] font-script text-gray relative z-10 md:ml-32 leading-none mt-2 md:mt-4">
          {touchWord.map((letter, i) => (
            <motion.span
              key={i + getWord.length}
              variants={letterVariants}
              className="inline-block origin-bottom"
            >
              {letter}
            </motion.span>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
