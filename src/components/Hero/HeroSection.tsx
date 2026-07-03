"use client";

import { useViewportTracking } from "./hooks/useViewportTracking";
import { HeroFrame } from "./HeroFrame";

export function HeroSection() {
  const activeDirection = useViewportTracking();

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <HeroFrame activeDirection={activeDirection} />
      </div>
    </section>
  );
}
