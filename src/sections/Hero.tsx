// src/sections/Hero.tsx
"use client";

import Link from "next/link";

const HERO_VIDEO_ID = "d1f4284262354287b36960caad09be01";
const HERO_VIDEO_SRC = `/videos/shop/videos/c/vp/${HERO_VIDEO_ID}/${HERO_VIDEO_ID}.HD-1080p-7.2Mbps-65059168a4f0.mp4`;

export default function Hero() {
  return (
    <section
      className="relative h-dvh overflow-hidden"
      data-header-theme="light"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* Black overlay (opacity driven by scroll progress) */}
      <div
        className="absolute inset-0 bg-black z-[1] pointer-events-none"
        style={{ opacity: 0 }}
        data-scroll-event-progress
      />

      {/* Hero content */}
      <div className="relative z-[2] h-full flex flex-col container py-4">
        {/* Logo in hero center (will GSAP-flip to nav on scroll) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] lg:w-[800px] aspect-video" data-flip-element="wrapper-hero">
          <div
            data-flip-element="target"
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src="/images/hero/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
              data-delay="0"
            />
          </div>
        </div>

        {/* Bottom left: description + CTA */}
        <div className="mt-auto pb-4 md:pb-8 grid grid-cols-4 md:grid-cols-12 gap-4">
          <div
            className="col-span-4 md:col-span-4"
            data-reveal-group="load"
            data-delay="2"
          >
            <p className="regular text-off-white max-w-xs mb-6">
              Exceptional caviar sourced globally. Enjoyed anywhere.
            </p>

            <Link
              href="/collections/all"
              className="group relative flex items-center cursor-pointer"
            >
              <span className="button-text label text-off-white">Shop Caviar</span>
              <span className="button-icon-default text-off-white">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="button-icon-sweep text-off-white">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Bottom right: label (desktop only) */}
          <div
            className="hidden md:flex col-span-4 col-start-9 items-end justify-end"
            data-reveal-group="load"
            data-delay="2.5"
          >
            <p className="label text-off-white">Caviar Below</p>
          </div>
        </div>
      </div>
    </section>
  );
}
