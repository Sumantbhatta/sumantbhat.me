"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.documentElement.classList.remove("lenis-stopped");
    }
    
    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`navigation fixed top-0 left-0 right-0 z-50 container py-4 ${isOpen ? "menu-open" : ""}`}
      data-navigation
      data-header-theme="light"
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
            href="/pages/contact"
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
        className={`mobile-menu h-dvh w-screen fixed top-0 left-0 container py-12 bg-black text-off-white md:hidden ${isOpen ? "is-open" : ""} z-0`}
      >
        <div className="h-full w-full items-center justify-center flex flex-col gap-6 pt-16">
          <Link href="/projects" onClick={closeMenu} data-underline-link="" className="heading">
            Projects
          </Link>
          <Link href="/about" onClick={closeMenu} data-underline-link="" className="heading">
            About
          </Link>
          <Link href="/pages/contact" onClick={closeMenu} data-underline-link="" className="heading">
            Contact
          </Link>
        </div>
      </aside>
    </nav>
  );
}

