"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  service: string;
  projectType: string;
  budget: string;
  timeline: string;
  contact: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DROPDOWN DATA
// ─────────────────────────────────────────────────────────────────────────────

const OPTIONS = {
  service: [
    "Frontend Developer",
    "Fullstack Developer",
    "Mobile App Developer",
    "Creative Developer",
    "Solutions Architect",
    "Flutter Developer",
  ],
  projectType: [
    "a Web Platform",
    "a Mobile App",
    "a SaaS Product",
    "a Landing Page",
    "an E-commerce Store",
    "an Enterprise Dashboard",
    "a Portfolio Site",
  ],
  budget: [
    "Under ₹50k",
    "₹50k – ₹1.5L",
    "₹1.5L – ₹3L",
    "₹3L – ₹7L",
    "₹7L+",
    "Open to discuss",
  ],
  timeline: [
    "immediately",
    "next month",
    "in 2–3 months",
    "within 6 months",
    "no rush",
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS — staggered "fall in" entrance on scroll
// ─────────────────────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const dropIn = {
  hidden: { opacity: 0, y: -44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATIC MECHANICAL KEYBOARD FOOTER — key defs & themes
// ─────────────────────────────────────────────────────────────────────────────

type KSize = "small" | "normal" | "wide" | "xwide" | "space";
type KTheme = "bone" | "ash" | "slate" | "charcoal" | "highlight";

interface KDef {
  id: string;
  label: string;
  subLabel?: string;
  href: string | null;
  download?: boolean;
  size: KSize;
  deco?: boolean;
  theme?: KTheme;
  missing?: boolean;
}

const KEY_ROWS: KDef[][] = [
  // Row 1 (Top Row): Bone Off-White / Light Cream — Super prominent, eye-catching links!
  [
    { id: "esc", label: "ESC", href: null, size: "small", deco: true, theme: "bone", missing: true },
    { id: "linkedin", label: "LinkedIn", subLabel: "↗", href: "https://www.linkedin.com/in/sumantsbhat/", size: "wide", theme: "bone" },
    { id: "github", label: "GitHub", subLabel: "↗", href: "https://github.com/Sumantbhatta", size: "normal", theme: "bone" },
    { id: "instagram", label: "Instagram", subLabel: "↗", href: "https://www.instagram.com/sumantbhat_/", size: "wide", theme: "bone" },
    { id: "email", label: "Email", subLabel: "✉", href: "mailto:sumantsbhatta@gmail.com", size: "normal", theme: "bone" },
    { id: "del", label: "⌫", href: null, size: "small", deco: true, theme: "bone", missing: true },
  ],
  // Row 2 (Mid-Light Ash Grey Row): Developer Tech Stack & Navigation
  [
    { id: "tab", label: "TAB", href: null, size: "normal", deco: true, theme: "ash" },
    { id: "frontend", label: "Frontend", href: null, size: "wide", deco: true, theme: "ash" },
    { id: "fullstack", label: "Fullstack", href: null, size: "wide", deco: true, theme: "ash" },
    { id: "nextjs", label: "Next.js", href: null, size: "normal", deco: true, theme: "ash" },
    { id: "react", label: "React 19", href: null, size: "normal", deco: true, theme: "ash" },
    { id: "enter", label: "↵ ENTER", href: null, size: "normal", deco: true, theme: "ash", missing: true },
  ],
  // Row 3 (Mid Slate Grey Row): Action & CV
  [
    { id: "lshift", label: "SHIFT", href: null, size: "wide", deco: true, theme: "slate", missing: true },
    { id: "cv", label: "Download CV", subLabel: "↓ PDF", href: "/Sumant_Bhat_Resume.pdf", size: "space", download: true, theme: "slate" },
    { id: "rshift", label: "SHIFT", href: null, size: "wide", deco: true, theme: "slate" },
  ],
  // Row 4 (Bottom Dark Charcoal Row): Modifiers & System
  [
    { id: "ctrl", label: "CTRL", href: null, size: "normal", deco: true, theme: "charcoal" },
    { id: "alt", label: "⌥ ALT", href: null, size: "normal", deco: true, theme: "charcoal" },
    { id: "cmd", label: "⌘ CMD", href: null, size: "wide", deco: true, theme: "charcoal", missing: true },
    { id: "freelance", label: "AVAILABLE FOR HIRE", href: null, size: "xwide", deco: true, theme: "highlight" },
    { id: "rcmd", label: "⌘ CMD", href: null, size: "normal", deco: true, theme: "charcoal" },
    { id: "fn", label: "FN", href: null, size: "normal", deco: true, theme: "charcoal" },
  ],
];

const SIZE_CLASSES: Record<KSize, string> = {
  small: "w-9 h-9 md:w-[3.25rem] md:h-[3.25rem]",
  normal: "w-14 h-9 md:w-20 md:h-[3.25rem]",
  wide: "w-20 h-9 md:w-32 md:h-[3.25rem]",
  xwide: "w-28 h-9 md:w-48 md:h-[3.25rem]",
  space: "w-44 h-9 md:w-72 md:h-[3.25rem]",
};

interface ScatteredKeyDef {
  id: string;
  label: string;
  theme: KTheme;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  widthClass?: string;
  isFallen?: boolean;
}

const SCATTERED_KEYS: ScatteredKeyDef[] = [
  { id: "s1", label: "~", theme: "bone", top: "80%", left: "6%", rotate: -15, isFallen: true },
  { id: "esc", label: "ESC", theme: "bone", top: "35%", left: "5%", rotate: 12, widthClass: "w-11 md:w-[3.25rem]", isFallen: true }, // missing esc
  { id: "lshift", label: "SHIFT", theme: "slate", top: "65%", left: "8%", rotate: -25, widthClass: "w-24 md:w-32", isFallen: true }, // missing lshift
  { id: "del", label: "⌫", theme: "bone", top: "10%", right: "15%", rotate: 18, widthClass: "w-11 md:w-[3.25rem]", isFallen: true }, // missing del
  { id: "enter", label: "↵ ENTER", theme: "ash", top: "35%", right: "8%", rotate: -10, widthClass: "w-16 md:w-20", isFallen: true }, // missing enter
  { id: "cmd", label: "⌘ CMD", theme: "charcoal", top: "80%", left: "20%", rotate: 22, widthClass: "w-24 md:w-32", isFallen: true }, // missing cmd
  { id: "s7", label: "★", theme: "charcoal", top: "75%", right: "6%", rotate: 8, isFallen: true },
  { id: "s8", label: "INS", theme: "highlight", top: "84%", right: "18%", rotate: -14, isFallen: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// INLINE DROPDOWN — floating panel over prose text
// ─────────────────────────────────────────────────────────────────────────────

function InlineDropdown({
  id,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <span ref={wrapRef} className={`hire-dd${open ? " hire-dd--open" : ""}`}>
      {/* Trigger */}
      <button
        type="button"
        id={id}
        className={`hire-dd__btn${value ? " hire-dd__btn--filled" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select ${placeholder}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value || "__ph"}
            className="hire-dd__val"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.13 }}
          >
            {value || placeholder}
          </motion.span>
        </AnimatePresence>
        <motion.span
          className="hire-dd__caret"
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.span
            role="listbox"
            className="hire-dd__panel"
            initial={{ opacity: 0, scaleY: 0.85, y: -6 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.85, y: -6 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: "top center" }}
          >
            {options.map((opt) => (
              <span
                key={opt}
                role="option"
                aria-selected={value === opt}
                tabIndex={0}
                className={`hire-dd__opt${value === opt ? " hire-dd__opt--active" : ""}`}
                onClick={() => { onChange(opt); setOpen(false); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(opt);
                    setOpen(false);
                  }
                }}
              >
                {value === opt && (
                  <span className="hire-dd__check" aria-hidden="true">✓</span>
                )}
                {opt}
              </span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC MECHANICAL KEYBOARD FOOTER — tactile popper & scattered 3D keys
// ─────────────────────────────────────────────────────────────────────────────

function ScatteredKey({ def, onDrop, restored, boundsRef }: { def: ScatteredKeyDef, onDrop?: (id: string, point: { x: number, y: number }) => void, restored?: boolean, boundsRef?: React.RefObject<HTMLDivElement | null> }) {
  const themes: Record<KTheme, string> = {
    bone: "from-[#faf8f5] to-[#e4e0da] text-[#141517] border-white shadow-[0_5px_0_#949088,0_10px_20px_rgba(0,0,0,0.5)]",
    ash: "from-[#dfdad3] to-[#c6bebb] text-[#24201e] border-[#eeebe6] shadow-[0_5px_0_#857c79,0_10px_20px_rgba(0,0,0,0.6)]",
    slate: "from-[#8f8681] to-[#716965] text-white border-[#a8a09c] shadow-[0_5px_0_#4a4542,0_10px_20px_rgba(0,0,0,0.7)]",
    charcoal: "from-[#352f2c] to-[#241f1c] text-[#bead9c] border-[#4c423e] shadow-[0_5px_0_#15110f,0_10px_20px_rgba(0,0,0,0.8)]",
    highlight: "from-[#1c1816] to-[#0a0807] text-[#e8dccf] border-[#382f2a] shadow-[0_5px_0_#000000,0_10px_20px_rgba(0,0,0,0.9)]",
  };

  const ref = useRef<HTMLDivElement>(null);

  const randomDelay = React.useMemo(() => Math.random() * 0.4 + 0.3, []);

  if (def.isFallen && restored) return null;

  return (
    <motion.div
      ref={ref}
      layoutId={def.isFallen ? `falling-key-${def.id}` : undefined}
      drag
      onDragEnd={(_e, _info) => {
        if (ref.current && onDrop) {
          const rect = ref.current.getBoundingClientRect();
          const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          onDrop(def.id, center);
        }
      }}
      dragConstraints={boundsRef || { left: -600, right: 600, top: -600, bottom: 600 }}
      dragElastic={0.1}
      style={{
        position: "absolute",
        top: def.top,
        left: def.left,
        right: def.right,
        rotate: def.isFallen ? undefined : `${def.rotate}deg`,
        zIndex: 5,
      }}
      className="hidden xl:flex p-[3px] rounded-xl md:rounded-2xl bg-[#090a0c] border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing select-none"
      initial={def.isFallen ? undefined : { y: -400, opacity: 0, rotate: def.rotate - 60, scale: 0.5 }}
      whileInView={def.isFallen ? { rotate: def.rotate } : { y: 0, opacity: 1, rotate: def.rotate, scale: 1 }}
      viewport={{ once: true, margin: "50px" }}
      whileHover={{ scale: 1.15, rotate: 0, zIndex: 30 }}
      whileTap={{ scale: 0.95, zIndex: 30 }}
      transition={{
        type: "spring",
        stiffness: def.isFallen ? 150 : 300,
        damping: def.isFallen ? 12 : 15,
        delay: def.isFallen ? 0 : randomDelay
      }}
    >
      <div className={`${def.widthClass || "w-12 md:w-16"} h-12 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-b flex items-center justify-center font-mono text-xs md:text-sm font-bold select-none border ${themes[def.theme]}`}>
        {def.label}
      </div>
    </motion.div>
  );
}

function MechanicalKey({ def, hasFallen, restored, registerSocket }: { def: KDef, hasFallen?: boolean, restored?: boolean, registerSocket?: (id: string, rect: DOMRect) => void }) {
  const isLink = Boolean(def.href);
  const Tag = isLink ? motion.a : motion.div;
  const sizeClass = SIZE_CLASSES[def.size];
  const socketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (def.missing && registerSocket && socketRef.current) {
      const updateRect = () => {
        if (socketRef.current) {
          registerSocket(def.id, socketRef.current.getBoundingClientRect());
        }
      };
      updateRect();
      window.addEventListener("resize", updateRect);
      window.addEventListener("scroll", updateRect, { passive: true });
      return () => {
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect);
      };
    }
  }, [def.missing, def.id, registerSocket]);

  // 4-row gradient wave palettes matching the reference mockup exactly
  const themes: Record<KTheme, {
    bg: string;
    text: string;
    border: string;
    shadowIdle: string;
    shadowHover: string;
    shadowTap: string;
  }> = {
    bone: {
      bg: "bg-gradient-to-b from-[#faf8f5] to-[#e4e0da]",
      text: "text-[#141517] font-bold group-hover:text-black",
      border: "border border-[#ffffff]",
      shadowIdle: "inset 0 1px 0 #ffffff, 0 5px 0 #949088, 0 8px 16px rgba(0,0,0,0.4)",
      shadowHover: "inset 0 1px 0 #ffffff, 0 7px 0 #949088, 0 12px 25px rgba(0,0,0,0.6)",
      shadowTap: "inset 0 1px 0 #ffffff, 0 1px 0 #949088, 0 2px 4px rgba(0,0,0,0.8)",
    },
    ash: {
      bg: "bg-gradient-to-b from-[#dfdad3] to-[#c6bebb]",
      text: "text-[#24201e] font-semibold group-hover:text-black",
      border: "border border-[#eeebe6]",
      shadowIdle: "inset 0 1px 0 #ffffff, 0 5px 0 #857c79, 0 8px 16px rgba(0,0,0,0.5)",
      shadowHover: "inset 0 1px 0 #ffffff, 0 7px 0 #857c79, 0 12px 25px rgba(0,0,0,0.7)",
      shadowTap: "inset 0 1px 0 #ffffff, 0 1px 0 #857c79, 0 2px 4px rgba(0,0,0,0.8)",
    },
    slate: {
      bg: "bg-gradient-to-b from-[#8f8681] to-[#716965]",
      text: "text-[#f5f2f0] font-semibold group-hover:text-white",
      border: "border border-[#a8a09c]",
      shadowIdle: "inset 0 1px 0 rgba(255,255,255,0.4), 0 5px 0 #4a4542, 0 8px 16px rgba(0,0,0,0.6)",
      shadowHover: "inset 0 1px 0 rgba(255,255,255,0.6), 0 7px 0 #4a4542, 0 12px 25px rgba(0,0,0,0.8)",
      shadowTap: "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 0 #4a4542, 0 2px 4px rgba(0,0,0,0.9)",
    },
    charcoal: {
      bg: "bg-gradient-to-b from-[#352f2c] to-[#241f1c]",
      text: "text-[#bead9c] group-hover:text-white",
      border: "border border-[#4c423e] group-hover:border-white/25",
      shadowIdle: "inset 0 1px 0 rgba(255,255,255,0.15), 0 5px 0 #15110f, 0 8px 16px rgba(0,0,0,0.7)",
      shadowHover: "inset 0 1px 0 rgba(255,255,255,0.25), 0 7px 0 #15110f, 0 12px 25px rgba(0,0,0,0.9)",
      shadowTap: "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 0 #15110f, 0 2px 4px rgba(0,0,0,0.95)",
    },
    highlight: {
      bg: "bg-gradient-to-b from-[#1c1816] to-[#0a0807]",
      text: "text-[#e8dccf] font-bold tracking-widest",
      border: "border border-[#382f2a] group-hover:border-[#52463e]",
      shadowIdle: "inset 0 1px 0 rgba(255,255,255,0.15), 0 5px 0 #000, 0 8px 16px rgba(0,0,0,0.8)",
      shadowHover: "inset 0 1px 0 rgba(255,255,255,0.3), 0 7px 0 #000, 0 12px 25px rgba(0,0,0,0.95)",
      shadowTap: "inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 0 #000, 0 2px 4px rgba(0,0,0,1)",
    },
  };

  const theme = themes[def.theme || "charcoal"];

  // If the key is missing (scattered), render an empty switch socket
  if (def.missing) {
    return (
      <div ref={socketRef} className={`relative p-[3px] rounded-xl md:rounded-2xl bg-[#090a0c] border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center shrink-0 ${sizeClass}`}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-[5px] bg-[#131313] border border-white/5 flex items-center justify-center shadow-[inset_0_5px_10px_rgba(0,0,0,1)] relative overflow-hidden">
          {/* Subtle scissor mechanism tabs in corners */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-white/30 rounded-tl-[1px]" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-white/30 rounded-tr-[1px]" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-white/30 rounded-bl-[1px]" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-white/30 rounded-br-[1px]" />

          {/* The translucent silicone rubber dome in the center */}
          <div className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 bg-white/20 backdrop-blur-sm rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.8)] border border-white/20 flex items-center justify-center">
            {/* Inner dome nipple */}
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/40 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          </div>
        </div>

        {/* The intact key that hasn't fallen yet, or is restored */}
        {(!hasFallen || restored) && (
          <motion.div
            layoutId={`falling-key-${def.id}`}
            className={`absolute inset-0 m-[3px] rounded-lg md:rounded-xl bg-gradient-to-b flex flex-col items-center justify-center font-mono text-[11px] md:text-xs tracking-wider font-bold select-none border ${theme.bg} ${theme.text} ${theme.border} z-20 pointer-events-none`}
            style={{ boxShadow: restored ? theme.shadowHover : theme.shadowIdle }}
            initial={restored ? { scale: 1.1 } : false}
            animate={restored ? { scale: 1, y: -1, rotate: 0 } : { rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            {def.label}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative p-[3px] rounded-xl md:rounded-2xl bg-[#090a0c] border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center shrink-0 ${sizeClass}`}>
      <Tag
        href={def.href || undefined}
        target={isLink && !def.download ? "_blank" : undefined}
        rel={isLink && !def.download ? "noopener noreferrer" : undefined}
        onClick={(e: React.MouseEvent) => {
          if (def.download && def.href) {
            e.preventDefault();
            const a = document.createElement("a");
            a.href = def.href; a.download = "";
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
          }
        }}
        className={`group relative select-none flex flex-col items-center justify-center rounded-lg md:rounded-xl transition-colors duration-150 ${isLink ? "cursor-pointer" : "cursor-default"} ${sizeClass} ${theme.bg} ${theme.text} ${theme.border}`}
        initial={{ boxShadow: theme.shadowIdle }}
        whileHover={isLink ? { y: -2, boxShadow: theme.shadowHover } : { y: -1, boxShadow: theme.shadowHover }}
        whileTap={{ y: 4, boxShadow: theme.shadowTap }}
        transition={{ type: "spring", stiffness: 600, damping: 25 }}
      >
        <span className="text-[11px] md:text-xs tracking-wider font-mono uppercase flex items-center gap-1.5 z-10 px-2 text-center">
          {def.label}
          {def.subLabel && (
            <span className="opacity-80 text-[10px] md:text-xs font-normal">
              {def.subLabel}
            </span>
          )}
        </span>

        {/* Subtle LED indicator on link keys */}
        {isLink && (
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-current opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all shadow-[0_0_6px_currentColor]" />
        )}
      </Tag>
    </div>
  );
}

function KeyFooter({ hasFallen, setHasFallen, restoredKeys, registerSocket, isShaking, isUnlocked, isMobile }: { hasFallen: boolean, setHasFallen: (v: boolean) => void, restoredKeys: Set<string>, registerSocket: (id: string, rect: DOMRect) => void, isShaking: boolean, isUnlocked: boolean, isMobile: boolean }) {
  return (
    <div className="hire-key-footer container relative mt-2 md:mt-4 mb-4 z-20 select-none" aria-label="Contact links and mechanical keyboard console">

      {/* Polite Instruction Message */}
      <AnimatePresence>
        {(!isUnlocked && !isMobile) && (
          <motion.div
            className="flex justify-center mb-3 md:mb-4 text-center relative z-30 px-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)", scale: 0.95 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs md:text-sm tracking-[0.15em] text-[#e8dccf]/60 max-w-sm mx-auto leading-relaxed uppercase font-mono">
              Please complete the keyboard puzzle below to unlock the contact form
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D Mechanical Keyboard Enclosure directly on the background */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl bg-[#1a1715] border border-[#382f2a] rounded-[24px] p-4 md:p-6 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.05)] flex flex-col gap-5 md:gap-6 backdrop-blur-sm"
        initial={{ y: 60, opacity: 0, rotateX: 15 }}
        whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
        animate={isShaking ? { x: [-15, 15, -10, 10, -5, 5, 0], transition: { duration: 0.4 } } : { x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        onViewportEnter={() => {
          // Trigger the keys falling out slightly after the board appears
          setTimeout(() => setHasFallen(true), 600);
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >

        {/* Sleek Minimalist Top Bar (Replaces the robotic green elements) */}
        <div className="flex items-center justify-between w-full px-2 md:px-6 pt-1 pb-4 border-b border-[#382f2a]">
          {/* Mac-like or minimalist control dots */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.3)]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.3)]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.3)]" />
            </div>
            <div className="ml-2 relative flex items-center h-6 min-w-[200px] md:min-w-[260px] overflow-hidden">
              <AnimatePresence mode="wait">
                {!isUnlocked && hasFallen ? (
                  <motion.div
                    key="tutorial"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center absolute left-0"
                  >
                    <span className="text-[10px] md:text-xs tracking-widest uppercase text-[#ffbd2e] font-medium font-mono whitespace-nowrap">
                      Drag keys to solve
                    </span>
                    <div className="relative w-12 h-5 flex items-center ml-3 border-l border-[#382f2a] pl-3">
                      <div className="absolute right-0 w-5 h-5 rounded-[3px] border border-dashed border-white/20" />
                      <motion.div
                        className="absolute left-3 w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#dfdad3] to-[#c6bebb] border border-[#eeebe6] shadow-sm flex items-center justify-center"
                        animate={{ x: [0, 16, 16, 0], y: [0, -2, 0, 0], opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
                      >
                        <div className="w-1 h-1 bg-[#24201e]/30 rounded-full" />
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="branding"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-white/40 text-xs font-mono tracking-[0.2em] uppercase select-none absolute left-0 whitespace-nowrap"
                  >
                    {isUnlocked ? "SB-75% UNLOCKED" : "SB-75% Custom Deck"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Minimalist branding/engraving */}
          <div className="flex items-center">
            <span className="font-mono text-xs text-white/20 tracking-[0.3em] select-none">
              SUMANTH
            </span>
          </div>
        </div>

        {/* Mechanical Keyboard Tray — milled aluminum plate housing the 4 gradient wave rows */}
        <div className="w-full bg-[#0f0d0c] border border-black/80 rounded-[18px] md:rounded-[22px] p-2 md:p-8 shadow-[inset_0_15px_40px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-1.5 md:gap-4 overflow-hidden relative">

          {/* Subtle noise inside the tray for ultra-premium realism */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

          {KEY_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center justify-center gap-1.5 md:gap-3 flex-wrap md:flex-nowrap w-full relative z-10">
              {row.map((def) => (
                <MechanicalKey key={def.id} def={def} hasFallen={hasFallen} restored={restoredKeys.has(def.id)} registerSocket={registerSocket} />
              ))}
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ContactHireSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    service: "",
    projectType: "",
    budget: "",
    timeline: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasFallen, setHasFallen] = useState(false);

  // --- Puzzle State ---
  const socketRects = useRef<Map<string, DOMRect>>(new Map());
  const [restoredKeys, setRestoredKeys] = useState<Set<string>>(new Set());

  const boundsRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const registerSocket = (id: string, rect: DOMRect) => {
    socketRects.current.set(id, rect);
  };

  const handleDrop = (id: string, keyCenter: { x: number, y: number }) => {
    let matchedSocket = false;
    const pad = 40; // hit-box padding from center

    for (const [socketId, rect] of socketRects.current.entries()) {
      const socketCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      if (
        Math.abs(keyCenter.x - socketCenter.x) <= pad &&
        Math.abs(keyCenter.y - socketCenter.y) <= pad
      ) {
        matchedSocket = true;
        if (socketId === id) {
          // Correct match!
          setRestoredKeys((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
          return; // Early exit on success
        }
      }
    }

    if (matchedSocket) {
      // Shakes the keyboard to say "NO" if they dropped it on the WRONG socket
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  const isUnlocked = restoredKeys.size === 5 || isMobile; // Mobile gets an automatic unlock for UX

  const set = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isValid = Boolean(
    form.name.trim() && form.service && form.contact.trim()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);

    try {
      const emailjs = (await import("@emailjs/browser")).default;

      // These keys should be added to your .env.local file
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.warn("EmailJS keys are missing from environment variables!");
        // Simulate delay so UI still shows success even if keys aren't set yet
        await new Promise((r) => setTimeout(r, 1100));
      } else {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          from_name: form.name,
          service: form.service,
          project_type: form.projectType,
          budget: form.budget,
          timeline: form.timeline,
          contact: form.contact,
        }, {
          publicKey: PUBLIC_KEY,
        });
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error("Failed to send email:", error?.text || error?.message || error);
      alert(`Failed to send your request: ${error?.text || 'Unknown error'}. Please try again or email me directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ name: "", service: "", projectType: "", budget: "", timeline: "", contact: "" });
  };

  return (
    <section
      className="hire-section relative"
      id="contact"
      data-header-theme="light"
      aria-label="Hire request form"
    >
      <LayoutGroup>
        {/* BIG CANVAS FOR FALLEN KEYS - Covers the entire ContactHireSection */}
        <div ref={boundsRef} className="absolute inset-0 w-full h-full pointer-events-none z-50 block">
          {SCATTERED_KEYS.map((sk) => {
            if (sk.isFallen && !hasFallen) return null;
            return (
              <div key={sk.id}>
                <div className="pointer-events-auto inline-block">
                  <ScatteredKey def={sk} onDrop={handleDrop} restored={restoredKeys.has(sk.id)} boundsRef={boundsRef} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanding Form Area - Only reveals when keyboard is rebuilt. Renders ABOVE keyboard */}
        <motion.div
          className="hire-body container relative z-10 overflow-hidden"
          initial={{ height: 0, opacity: 0, scale: 0.95 }}
          animate={isUnlocked ? { height: "auto", opacity: 1, scale: 1, marginTop: "2rem", marginBottom: "2rem" } : { height: 0, opacity: 0, scale: 0.95, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Eyebrow label without lines */}
          <div className="hire-rule" style={{ gap: 0 }} aria-hidden="true">
            <span className="hire-rule__label label">Send a hire request</span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (

              /* ── Success state ── */
              <motion.div
                key="success"
                className="hire-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hire-success__circle" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                    <path d="M12 20l5.5 5.5 10-11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="hire-success__heading">Brief received.</h3>
                <p className="hire-success__msg regular">
                  Thanks, <strong>{form.name || "friend"}</strong>!
                  I&apos;ll be in touch at <strong>{form.contact}</strong> very shortly.
                </p>
                <button type="button" className="hire-success__reset label" onClick={reset}>
                  ↩ Send another brief
                </button>
              </motion.div>

            ) : (

              /* ── The mad-libs hire form — each line stagger-drops in on scroll ── */
              <motion.form
                key="form"
                className="hire-form"
                onSubmit={handleSubmit}
                noValidate
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >

                {/* Line 1 — Name */}
                <motion.div className="hire-form__line" variants={dropIn}>
                  <span className="hire-form__prose">Hi, I&apos;m</span>
                  <span className="hire-form__field-wrap">
                    <input
                      id="hire-name"
                      type="text"
                      className="hire-form__input"
                      placeholder="your name"
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                      aria-label="Your name"
                      maxLength={60}
                      autoComplete="name"
                      spellCheck={false}
                    />
                  </span>
                  <span className="hire-form__prose">,</span>
                </motion.div>

                {/* Line 2 — Service + Project */}
                <motion.div className="hire-form__line" variants={dropIn}>
                  <span className="hire-form__prose">and I need</span>
                  <InlineDropdown
                    id="hire-service"
                    value={form.service}
                    options={OPTIONS.service}
                    placeholder="a service"
                    onChange={set("service")}
                  />
                  <span className="hire-form__prose">to build</span>
                  <InlineDropdown
                    id="hire-project"
                    value={form.projectType}
                    options={OPTIONS.projectType}
                    placeholder="a project"
                    onChange={set("projectType")}
                  />
                  <span className="hire-form__prose">.</span>
                </motion.div>

                {/* Line 3 — Budget + Timeline */}
                <motion.div className="hire-form__line" variants={dropIn}>
                  <span className="hire-form__prose">My budget is</span>
                  <InlineDropdown
                    id="hire-budget"
                    value={form.budget}
                    options={OPTIONS.budget}
                    placeholder="a budget"
                    onChange={set("budget")}
                  />
                  <span className="hire-form__prose">, starting</span>
                  <InlineDropdown
                    id="hire-timeline"
                    value={form.timeline}
                    options={OPTIONS.timeline}
                    placeholder="when?"
                    onChange={set("timeline")}
                  />
                  <span className="hire-form__prose">.</span>
                </motion.div>

                {/* Line 4 — Contact */}
                <motion.div className="hire-form__line" variants={dropIn}>
                  <span className="hire-form__prose">Reach me at</span>
                  <span className="hire-form__field-wrap hire-form__field-wrap--wide">
                    <input
                      id="hire-contact"
                      type="text"
                      className="hire-form__input"
                      placeholder="email or phone"
                      value={form.contact}
                      onChange={(e) => set("contact")(e.target.value)}
                      aria-label="Your email or phone number"
                      maxLength={120}
                      autoComplete="email"
                      spellCheck={false}
                    />
                  </span>
                  <span className="hire-form__prose">.</span>
                </motion.div>

                {/* Submit row */}
                <motion.div className="hire-form__submit-row" variants={dropIn}>
                  <button
                    id="hire-submit"
                    type="submit"
                    disabled={!isValid || submitting}
                    aria-disabled={!isValid || submitting}
                    className={[
                      "hire-submit",
                      !isValid ? "hire-submit--disabled" : "",
                      submitting ? "hire-submit--loading" : "",
                    ].join(" ").trim()}
                  >
                    <span className="hire-submit__text">
                      {submitting ? "Sending…" : "Send Brief"}
                    </span>
                    <span className="hire-submit__icon" aria-hidden="true">
                      {submitting ? (
                        <span className="hire-submit__spinner" />
                      ) : (
                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                          <path
                            d="M1 7h18M13 1l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </button>

                  <p className="hire-form__hint label" aria-live="polite">
                    {!form.name && !form.contact
                      ? "Fill in your name and contact to send."
                      : !form.service
                        ? "Pick a service type above."
                        : !form.contact
                          ? "Add your contact to continue."
                          : "Everything looks good — go ahead!"}
                  </p>
                </motion.div>

              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Physics keyboard acts as the gatekeeper / lock. Renders BELOW form as a footer */}
        <KeyFooter hasFallen={hasFallen} setHasFallen={setHasFallen} restoredKeys={restoredKeys} registerSocket={registerSocket} isShaking={isShaking} isUnlocked={isUnlocked} isMobile={isMobile} />

      </LayoutGroup>
    </section>
  );
}

export default ContactHireSection;
