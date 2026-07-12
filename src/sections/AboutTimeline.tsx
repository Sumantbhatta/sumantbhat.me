"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Milestone {
  id: string;
  date: string;
  company: string;
  title: string;
  body: string;
  link: string;
  linkText?: string;
  side: "left" | "right";
  image?: string;
  images?: string[];
  imageClassName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const MILESTONES: Milestone[] = [
  {
    id: "srinivas-uni",
    date: "Dec 2024 – Mar 2025",
    company: "Srinivas University",
    title: "Flutter Developer & Architect",
    body: "Scaled a multi-tenant Flutter + Firebase app to 10+ institutions and 500+ active users under a single codebase.",
    link: "https://play.google.com/store/apps/details?id=com.webflow.rip_college_app",
    side: "right",
    image: "/images/projects/banner/srinivas.png",
    imageClassName: "absolute inset-0 w-full h-full object-cover object-[-9px_center] scale-100 group-hover:scale-105",
  },
  {
    id: "alt-digital",
    date: "May 2025 – Jul 2025",
    company: "Alt Digital Technologies",
    title: "Frontend Developer Intern",
    body: "Shipped responsive UI components and form modules for an Equipment Management Dashboard in Next.js, React Hook Form, and Radix UI.",
    link: "https://drive.google.com/file/d/1xjJBeQL-JnDhtoEgtgdW8tFLROvFckIm/view?usp=sharing",
    linkText: "View Certificate ↗",
    side: "left",
    image: "/images/projects/banner/ALT.png",
    imageClassName: "absolute inset-0 w-full h-full object-cover object-top scale-100 group-hover:scale-105",
  },
  {
    id: "flione",
    date: "Dec 2025 – Present",
    company: "Flione Innovation & Technology Pvt Ltd",
    title: "Mobile Application Developer (Freelance)",
    body: "Own the full Flutter product lifecycle — UI to deployment — integrating REST APIs, Firebase, and GCP for Android & iOS.",
    link: "/projects",
    linkText: "View Apps ↗",
    side: "right",
    images: [
      "/images/projects/banner/ksvp.png",
      "/images/projects/banner/nexsti.png",
      "/images/projects/banner/sanskaradhama.png",
      "/images/projects/banner/scanai.png"
    ],
  },
  {
    id: "connectia",
    date: "Nov 2025 – Present",
    company: "Connectia Technology",
    title: "Full Stack Developer",
    body: "Deliver end-to-end client solutions with Node.js, Express, MongoDB, and React — from RESTful API design to production UI.",
    link: "/projects",
    linkText: "View Projects ↗",
    side: "left",
    images: [
      "/images/projects/banner/amrut.png",
      "/images/projects/banner/teleseenapp.png",
      "/images/projects/banner/handyman.png",
      "/images/projects/banner/yiacoapp.png"
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FILM GRAIN (Layer 1)
// ─────────────────────────────────────────────────────────────────────────────

function CinematicOverlay() {
  return <div aria-hidden="true" className="about-timeline__grain" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────────────────────────────────────

function ProjectCard({ link, linkText = "View Live Project ↗", image, images, imageClassName }: { link: string; linkText?: string; image?: string; images?: string[]; imageClassName?: string }) {
  const isExternal = link !== "#" && link.startsWith("http");
  return (
    <div className="about-timeline__card relative group overflow-hidden">
      {images && images.length > 0 ? (
        <>
          <div className="absolute inset-0 bg-black/40 z-[1] group-hover:bg-black/10 transition-colors duration-500 mix-blend-multiply" />
          <div className={`absolute inset-0 grid gap-[2px] p-1 ${images.length > 2 ? "grid-cols-2 grid-rows-2" : "grid-cols-2"} scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Project banner collage"
                className="w-full h-full object-cover object-left rounded-[2px] grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700"
              />
            ))}
          </div>
        </>
      ) : image ? (
        <>
          <div className="absolute inset-0 bg-black/40 z-[1] group-hover:bg-black/10 transition-colors duration-500 mix-blend-multiply" />
          <img
            src={image}
            alt="Project banner"
            className={`transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] grayscale-[0.6] group-hover:grayscale-0 ${imageClassName || "absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105"}`}
          />
        </>
      ) : (
        <div className="about-timeline__card-inner" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      )}
      <div className="about-timeline__card-overlay relative z-10">
        <a
          href={link}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="about-timeline__card-link"
          aria-label={linkText}
        >
          {linkText}
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE NODE (Layer 4)
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineNodeProps {
  milestone: Milestone;
  index: number;
}

function TimelineNode({ milestone, index }: TimelineNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });
  const isLeft = milestone.side === "left";

  const textBlock = (
    <motion.div
      className="about-timeline__text"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <span className="about-timeline__date">{milestone.date}</span>
      <motion.span
        className="about-timeline__node-label"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {String(index + 1).padStart(2, "0")} — {milestone.company}
      </motion.span>
      <p className="about-timeline__node-title">{milestone.title}</p>
      <p className="about-timeline__node-body">{milestone.body}</p>
    </motion.div>
  );

  const cardBlock = (
    <motion.div
      className="about-timeline__card-wrap"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <ProjectCard link={milestone.link} linkText={milestone.linkText} image={milestone.image} images={milestone.images} imageClassName={milestone.imageClassName} />
    </motion.div>
  );

  return (
    <div
      ref={ref}
      className={`about-timeline__node ${isLeft ? "about-timeline__node--left" : "about-timeline__node--right"
        }`}
    >
      {textBlock}
      {cardBlock}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG SPINE (Layer 3)
// ─────────────────────────────────────────────────────────────────────────────

function TimelineSpine({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="about-timeline__spine" aria-hidden="true">
      <svg
        width="1"
        height="100%"
        viewBox="0 0 1 1000"
        preserveAspectRatio="none"
        className="about-timeline__spine-svg"
      >
        <path
          d="M0.5 0 L0.5 1000"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 9"
          strokeOpacity="0.15"
          fill="none"
        />
        <motion.path
          d="M0.5 0 L0.5 1000"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: smoothProgress }}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTRO CTA (replaces climax)
// ─────────────────────────────────────────────────────────────────────────────

function TimelineOutro() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative w-full py-32 md:py-48 mt-20 flex flex-col items-center justify-center group cursor-pointer overflow-hidden border-t border-black/10" data-header-theme="dark">
      <Link href="/about" className="absolute inset-0 z-20" aria-label="About Me"></Link>
      
      {/* Background fill animation on hover */}
      <div className="absolute inset-0 bg-[#0a0a0a] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-0" />
      
      {/* Text Container with mix-blend-difference */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pointer-events-none mix-blend-difference text-[#f4f4f5] px-4">
        
        {/* Eyebrow */}
        <span className="label mb-6 tracking-[0.25em] uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-[0.8s]">
          The person behind the work
        </span>
        
        {/* Animated Headline Wrapper */}
        <div className="relative overflow-hidden w-full flex items-center justify-center">
          
          <h2 className="display text-[12vw] md:text-[8.5vw] leading-none text-center uppercase tracking-tight transition-transform duration-[0.85s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-[120%]">
            Who is Sumanth?
          </h2>
          
          <h2 className="display text-[12vw] md:text-[8.5vw] leading-none text-center uppercase tracking-tight transition-transform duration-[0.85s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] translate-y-[120%] group-hover:translate-y-0 absolute top-0 left-0 w-full h-full flex items-center justify-center">
            Read My Story
          </h2>
          
        </div>
      </div>
      
      {/* Floating Arrow */}
      <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 z-10 mix-blend-difference text-[#f4f4f5] pointer-events-none hidden md:block">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-current flex items-center justify-center overflow-hidden relative group-hover:scale-110 transition-transform duration-[0.85s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
           <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-10 md:h-10 transition-transform duration-[0.85s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-16 group-hover:-translate-y-16">
              <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
           <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute w-6 h-6 md:w-10 md:h-10 -translate-x-16 translate-y-16 transition-transform duration-[0.85s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0 group-hover:translate-y-0">
              <path d="M1 13L13 1M13 1H4M13 1V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutTimeline({ hideOutro = false }: { hideOutro?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["#0a0a0a", "#1a1a1a", "#1a1a1a", "#f4f4f5"]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.6, 0.85, 1],
    ["#f4f4f5", "#f4f4f5", "#1a1a1a", "#0a0a0a"]
  );

  const spineColor = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["#f4f4f5", "#f4f4f5", "#0a0a0a"]
  );

  return (
    <section className="about-timeline__section" id="about" data-header-theme="light">
      <CinematicOverlay />

      <motion.div
        ref={containerRef}
        className="about-timeline__container"
        style={{ backgroundColor, color: textColor }}
      >
        {/* Header */}
        <div className="about-timeline__header">
          <motion.span
            className="about-timeline__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Career
          </motion.span>
          <motion.h2
            className="about-timeline__heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            viewport={{ once: true }}
          >
            Professional Experience
          </motion.h2>
        </div>

        {/* Spine + Nodes */}
        <motion.div
          className="about-timeline__body"
          style={{ color: spineColor }}
        >
          <TimelineSpine scrollYProgress={scrollYProgress} />
          <div className="about-timeline__nodes">
            {MILESTONES.map((m, i) => (
              <TimelineNode key={m.id} milestone={m} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Outro CTA */}
        {!hideOutro && <TimelineOutro />}
      </motion.div>
    </section>
  );
}
