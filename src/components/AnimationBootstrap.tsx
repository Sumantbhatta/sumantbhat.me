"use client";

import { useEffect } from "react";
import { initAllAnimations } from "@/lib/animations/init";

export default function AnimationBootstrap() {
  useEffect(() => {
    // Wait a tick for GSAP scripts to be ready
    const run = () => {
      if (typeof (window as any).gsap !== "undefined") {
        initAllAnimations();
      } else {
        setTimeout(run, 50);
      }
    };
    run();
  }, []);

  return null;
}
