"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAllAnimations, cleanupAnimations } from "@/lib/animations/init";

export default function AnimationBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Immediately clean up any previous animations/ScrollTriggers from the previous route
    cleanupAnimations();

    // 2. Wait for the browser to guarantee a DOM paint
    let raf1: number, raf2: number;
    const run = () => {
      if (typeof (window as any).gsap !== "undefined") {
        initAllAnimations();
      } else {
        raf1 = requestAnimationFrame(run);
      }
    };
    
    // Double requestAnimationFrame ensures layout is 100% stable before GSAP calculates heights
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(run);
    });

    // 3. Cleanup function when component unmounts or before the next route change runs this effect again
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      cleanupAnimations();
    };
  }, [pathname]);

  return null;
}
