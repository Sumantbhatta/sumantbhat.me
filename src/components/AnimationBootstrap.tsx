"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAllAnimations, cleanupAnimations } from "@/lib/animations/init";

export default function AnimationBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Immediately clean up any previous animations/ScrollTriggers from the previous route
    cleanupAnimations();

    // 2. Wait a tick for Next.js to finish painting the new route's DOM
    const run = () => {
      if (typeof (window as any).gsap !== "undefined") {
        initAllAnimations();
      } else {
        setTimeout(run, 50);
      }
    };
    
    // Slight delay ensures the new page layout is actually in the DOM before we bind triggers
    const timeoutId = setTimeout(run, 50);

    // 3. Cleanup function when component unmounts or before the next route change runs this effect again
    return () => {
      clearTimeout(timeoutId);
      cleanupAnimations();
    };
  }, [pathname]);

  return null;
}
