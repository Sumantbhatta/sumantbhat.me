"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  // Lock/unlock scroll on mobile menu
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen]);

  // Scroll-driven nav theme — reads the most specific element covering the top
  // of the viewport and switches nav text between light and dark.
  // Uses elementsFromPoint (most-specific first) so deeply nested elements like
  // TimelineOutro correctly override their parent section's theme.
  useEffect(() => {
    const applyTheme = () => {
      // Returns all elements at this point, from top of z-stack (most specific) downward
      const elements = document.elementsFromPoint(window.innerWidth / 2, 20);
      let active: "light" | "dark" = "light";

      for (const el of elements) {
        if (!(el instanceof HTMLElement)) continue;
        if (el.hasAttribute("data-navigation")) continue; // skip the nav bar itself
        const theme = el.dataset.headerTheme;
        if (theme === "dark" || theme === "light") {
          active = theme;
          break; // first match = most specific element wins
        }
      }
      setTheme(active);
    };

    // Fire immediately + retries for dynamically rendered sections
    applyTheme();
    const t1 = setTimeout(applyTheme, 100);
    const t2 = setTimeout(applyTheme, 400);

    window.addEventListener("scroll", applyTheme, { passive: true });
    window.addEventListener("resize", applyTheme);

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.body, { childList: true, subtree: false });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("scroll", applyTheme);
      window.removeEventListener("resize", applyTheme);
      observer.disconnect();
    };
  }, [pathname]);

  const toggleMenu = () => setIsOpen((o) => !o);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`navigation fixed top-0 left-0 right-0 z-50 container py-4 ${isOpen ? "menu-open" : ""}`}
      data-navigation
      data-header-theme={theme}
    >
      <div className="flex items-center justify-between relative z-10">
        {/* Left links */}
        <div className="flex items-center gap-4 relative z-20">
          <button
            className={`hamburger-button relative w-[20px] h-[12px] block md:hidden cursor-pointer ${isOpen ? "is-open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className="hamburger-line block absolute h-[2px] w-full left-0 top-0" />
            <span className="hamburger-line block absolute h-[2px] w-full left-0 top-[5px]" />
            <span className="hamburger-line block absolute h-[2px] w-full left-0 top-[10px]" />
          </button>
          <Link
            href="/projects"
            data-underline-link=""
            className="regular nav-link hidden md:block"
            data-split="heading"
            data-split-reveal="words"
            data-split-type="load"
          >
            Projects
          </Link>
          <Link
            href="/about"
            data-underline-link=""
            className="regular nav-link hidden md:block"
            data-split="heading"
            data-split-reveal="words"
            data-split-type="load"
          >
            About
          </Link>
        </div>

        {/* Centre logo */}
        <Link
          href="/"
          onClick={closeMenu}
          data-flip-element="wrapper-nav"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-56 aspect-video flex items-center justify-center z-20"
        >
          <div className="nav-static-logo w-full h-full lottie-wrapper">
            <img
              src="/images/hero/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Right links */}
        <div className="flex items-center gap-4 relative z-20">
          <Link
            href="/contact"
            data-underline-link=""
            className="regular nav-link"
            data-split="heading"
            data-split-reveal="words"
            data-split-type="load"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <aside
        className={`mobile-menu h-dvh w-screen fixed top-0 left-0 container py-12 bg-black text-off-white md:hidden transition-transform duration-500 ease-[0.83, 0, 0.17, 1] ${isOpen ? "translate-y-0 is-open" : "-translate-y-full"} z-0`}
      >
        <div className="h-full w-full items-center justify-center flex flex-col gap-10 pt-16">
          <Link href="/projects" onClick={closeMenu} className="text-5xl uppercase tracking-widest font-medium transition-colors hover:text-white/70">
            Projects
          </Link>
          <Link href="/about" onClick={closeMenu} className="text-5xl uppercase tracking-widest font-medium transition-colors hover:text-white/70">
            About
          </Link>
          <Link href="/contact" onClick={closeMenu} className="text-5xl uppercase tracking-widest font-medium transition-colors hover:text-white/70">
            Contact
          </Link>
          
          <div className="absolute bottom-12 flex gap-8 text-sm text-white/50 tracking-widest uppercase font-mono">
            <a href="https://www.linkedin.com/in/sumantsbhat/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com/Sumantbhatta" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.instagram.com/sumantbhat_/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </aside>
    </nav>
  );
}
