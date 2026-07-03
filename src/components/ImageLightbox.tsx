"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageLightbox({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isGif = src.endsWith(".gif");

  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen]);

  // Reset zoom when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setScale(1);
      }, 300);
    }
  }, [isOpen]);

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in/out with mouse wheel
    const newScale = Math.min(Math.max(1, scale - e.deltaY * 0.005), 5);
    setScale(newScale);
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
    } else {
      setScale(2.5);
    }
  };

  return (
    <>
      <div
        className="w-full h-full relative z-10 cursor-zoom-in group"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          unoptimized={isGif}
        />
        {/* Subtle zoom indicator on hover */}
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 overflow-hidden cursor-zoom-out"
              onClick={() => setIsOpen(false)}
              onWheel={handleWheel}
              data-lenis-prevent="true" // Stop Lenis from scrolling background!
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`relative w-full h-full flex items-center justify-center ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-auto'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image wrapper
                onDoubleClick={handleDoubleClick}
              >
                <motion.img
                  src={src}
                  alt={alt}
                  className="max-w-[90vw] max-h-[90vh] object-contain pointer-events-auto"
                  drag={scale > 1} // Only drag if zoomed in
                  dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
                  dragElastic={0.1}
                  animate={scale === 1 ? { scale: 1, x: 0, y: 0 } : { scale }}
                  style={{ touchAction: "none" }} // Allows drag on mobile devices
                />
              </motion.div>

              {/* Controls hint */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none text-center hidden md:block">
                Scroll or double-click to zoom • Drag to pan
              </div>

              {/* Close Button */}
              <button
                className="absolute top-6 right-6 md:top-10 md:right-10 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
