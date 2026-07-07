"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { PROJECTS, PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/lib/data/projects";

const BANNER_MAP: Record<string, string> = {
  "amrut": "/images/projects/banner/amrut.png",
  "egpg": "/images/projects/banner/egpg.png",
  "entry360": "/images/projects/banner/entry360.png",
  "handyman-q8": "/images/projects/banner/handyman.png",
  "ksvp-parent-app": "/images/projects/banner/ksvp.png",
  "lezzgoo": "/images/projects/banner/lezzgoo.png",
  "nexsti-erp": "/images/projects/banner/nexsti.png",
  "sanskaradhama": "/images/projects/banner/sanskaradhama.png",
  "scanai": "/images/projects/banner/scanai.png",
  "srinivas-university-app": "/images/projects/banner/srinivas.png",
  "teleseen": "/images/projects/banner/teleseenapp.png",
  "yiaco-medshop": "/images/projects/banner/yiacoapp.png",
};

// ─── Marquee Strip ────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = Array(12).fill("ALL PROJECTS ✦ ");
  return (
    <div className="projects-marquee" aria-hidden="true">
      <div className="projects-marquee__track">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="projects-marquee__item">{text}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Cursor-following image preview ──────────────────────────────────────────
function HoverImagePreview({ project }: { project: Project | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 200, damping: 22, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className="projects-hover-preview"
      style={{ x: springX, y: springY }}
      animate={{ opacity: project ? 1 : 0, scale: project ? 1 : 0.9 }}
      transition={{ duration: 0.28, ease: [0.625, 0.05, 0, 1] }}
    >
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.625, 0.05, 0, 1] }}
            className="projects-hover-preview__inner"
          >
            <div className="projects-hover-preview__image-wrap">
              <Image
                src={BANNER_MAP[project.handle] || project.rightImage}
                alt={project.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="projects-hover-preview__caption">
              <span className="projects-hover-preview__caption-title">{project.title}</span>
              <span className="projects-hover-preview__caption-role">{project.role}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Single Project Row ───────────────────────────────────────────────────────
function ProjectRow({
  project,
  index,
  onHover,
  onLeave,
  isAnyHovered,
  activeCategory,
}: {
  project: Project;
  index: number;
  onHover: (p: Project) => void;
  onLeave: () => void;
  isAnyHovered: boolean;
  activeCategory: ProjectCategory | "All";
}) {
  const [hovered, setHovered] = useState(false);

  const enter = () => {
    setHovered(true);
    onHover(project);
  };
  const leave = () => {
    setHovered(false);
    onLeave();
  };

  const num = String(index + 1).padStart(2, "0");
  const isWebFilter = activeCategory === "Web";
  const isMobileFilter = activeCategory === "Mobile";
  const rowUrl = isWebFilter && project.websiteUrl ? project.websiteUrl : project.url;

  let displayTitle = project.title;
  if (isWebFilter && displayTitle.endsWith(" App")) {
    displayTitle = displayTitle.replace(/ App$/, "");
  }

  let shouldShowButtons = true;
  if (isWebFilter) {
    shouldShowButtons = false;
  } else if (isMobileFilter) {
    shouldShowButtons = Boolean(project.playStoreUrl && project.appStoreUrl);
  }

  return (
    <motion.div
      onClick={() => rowUrl !== '#' && window.open(rowUrl, '_blank')}
      className={`projects-row cursor-pointer${hovered ? " projects-row--hovered" : ""}${
        isAnyHovered && !hovered ? " projects-row--dimmed" : ""
      }`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        ease: [0.625, 0.05, 0, 1],
        delay: index * 0.04,
      }}
    >
      {/* Number */}
      <span className="projects-row__num">{num}</span>

      {/* Center: title + meta */}
      <div className="projects-row__center">
        <h2 className="projects-row__title">{displayTitle}</h2>
        <div className="projects-row__meta">
          <span className="projects-row__role">{project.role}</span>
          <span className="projects-row__dot" aria-hidden="true">·</span>
          <span className="projects-row__year">{project.year}</span>
        </div>
      </div>

      {/* Action Buttons Only */}
      {shouldShowButtons && (
        <div className="projects-row__tags relative z-10">
          {project.playStoreUrl && (
            <a
              href={project.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="projects-row__tag hover:!border-white hover:!text-white hover:!opacity-100 transition-colors cursor-pointer"
            >
              Google Play
            </a>
          )}
          {project.appStoreUrl && (
            <a
              href={project.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="projects-row__tag hover:!border-white hover:!text-white hover:!opacity-100 transition-colors cursor-pointer"
            >
              App Store
            </a>
          )}
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="projects-row__tag hover:!border-white hover:!text-white hover:!opacity-100 transition-colors cursor-pointer"
            >
              Website
            </a>
          )}
        </div>
      )}

      {/* Status + arrow */}
      <div className="projects-row__right">
        <span className="projects-row__status">{project.status}</span>
        <span className="projects-row__arrow" aria-hidden="true">↗</span>
      </div>
    </motion.div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: ProjectCategory | "All";
  onChange: (v: ProjectCategory | "All") => void;
  counts: Record<string, number>;
}) {
  const all: Array<ProjectCategory | "All"> = ["All", ...PROJECT_CATEGORIES];
  return (
    <div className="projects-filters" role="tablist" aria-label="Filter by category">
      {all.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`projects-filter-btn${active === cat ? " projects-filter-btn--active" : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
          <span className="projects-filter-btn__count">{counts[cat] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const isAnyHovered = hoveredProject !== null;

  const filtered = activeCategory === "All"
    ? [...PROJECTS].sort((a, b) => a.title.localeCompare(b.title))
    : PROJECTS.filter((p) => p.categories?.includes(activeCategory));

  const counts: Record<string, number> = { All: PROJECTS.length };
  PROJECT_CATEGORIES.forEach((cat) => {
    counts[cat] = PROJECTS.filter((p) => p.categories?.includes(cat)).length;
  });

  const handleCategoryChange = (cat: ProjectCategory | "All") => {
    setHoveredProject(null);
    setActiveCategory(cat);
  };

  return (
    <>
      {/* Cursor-following preview — rendered at root of section, fixed position */}
      <HoverImagePreview project={hoveredProject} />

      <section
        className="projects-page"
        data-header-theme="dark"
        id="projects-page"
      >
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="projects-page__header container">
          <motion.p
            className="projects-page__eyebrow label text-gray"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.625, 0.05, 0, 1], delay: 0.1 }}
          >
            Selected Work
          </motion.p>

          <div className="projects-page__heading-wrap" aria-label="Projects">
            {["PRO", "JECTS"].map((word, i) => (
              <div key={i} className="projects-page__heading-mask">
                <motion.h1
                  className="projects-page__heading heading text-black"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.2,
                    ease: [0.625, 0.05, 0, 1],
                    delay: 0.15 + i * 0.08,
                  }}
                >
                  {word}
                </motion.h1>
              </div>
            ))}
          </div>

          <motion.p
            className="projects-page__subheading regular text-gray"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.625, 0.05, 0, 1], delay: 0.45 }}
          >
            {PROJECTS.length} projects spanning mobile, web, and beyond.
          </motion.p>
        </div>

        {/* ── Marquee ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <MarqueeStrip />
        </motion.div>

        {/* ── Filter Tabs ─────────────────────────────────────────────── */}
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.625, 0.05, 0, 1], delay: 0.7 }}
        >
          <FilterTabs
            active={activeCategory}
            onChange={handleCategoryChange}
            counts={counts}
          />
        </motion.div>

        {/* ── Project Rows ─────────────────────────────────────────────── */}
        <div className="projects-list container" role="list">
          {/* Top border */}
          <div className="projects-list__border-top custom-border border-t" aria-hidden="true" />

          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.625, 0.05, 0, 1] }}
              className="projects-list__wrapper w-full"
            >
              {filtered.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  onHover={setHoveredProject}
                  onLeave={() => setHoveredProject(prev => prev?.id === project.id ? null : prev)}
                  isAnyHovered={isAnyHovered}
                  activeCategory={activeCategory}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Count Footer ─────────────────────────────────────────────── */}
        <div className="projects-page__footer container">
          <span className="label text-gray">
            {filtered.length} / {PROJECTS.length} projects
          </span>
        </div>
      </section>
    </>
  );
}
