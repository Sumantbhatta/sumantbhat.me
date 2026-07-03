"use client";

import { useState, useEffect, useRef } from "react";

// How long before eyes "notice" the cursor on first load (ms).
// Long enough to feel like awareness, short enough not to feel broken.
const AWARENESS_DELAY_MS = 800;

// How long a new direction must be stable before committing (ms).
// 40ms is below conscious perception but prevents jitter at zone borders.
const DIRECTION_COMMIT_DELAY_MS = 40;

// Hysteresis deadzone (px). Cursor must cross this far past a boundary
// to begin the commit timer. Prevents oscillation at zone edges.
const DEADZONE = 40;

export function useViewportTracking() {
  const [direction, setDirection] = useState<number>(5);
  const currentDirRef = useRef(5);

  const hasBeenNoticedRef = useRef(false);
  const awarenessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Store the last known position so the awareness timer can use it
  const lastPosRef = useRef({ x: 0, y: 0 });

  const pendingDirRef = useRef<number | null>(null);
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeRawDirection = (clientX: number, clientY: number): number => {
      const { innerWidth, innerHeight } = window;
      const xThird = innerWidth / 3;
      const yThird = innerHeight / 3;

      const currentDir = currentDirRef.current;
      const currentCol = (currentDir - 1) % 3;
      const currentRow = Math.floor((currentDir - 1) / 3);

      const leftBoundary = currentCol === 0 ? xThird + DEADZONE : xThird - DEADZONE;
      const rightBoundary = currentCol === 2 ? xThird * 2 - DEADZONE : xThird * 2 + DEADZONE;
      const topBoundary = currentRow === 0 ? yThird + DEADZONE : yThird - DEADZONE;
      const bottomBoundary = currentRow === 2 ? yThird * 2 - DEADZONE : yThird * 2 + DEADZONE;

      let newCol = currentCol;
      if (clientX < leftBoundary) newCol = 0;
      else if (clientX > rightBoundary) newCol = 2;
      else newCol = 1;

      let newRow = currentRow;
      if (clientY < topBoundary) newRow = 0;
      else if (clientY > bottomBoundary) newRow = 2;
      else newRow = 1;

      return newRow * 3 + newCol + 1;
    };

    const commitDirection = (dir: number) => {
      if (dir !== currentDirRef.current) {
        currentDirRef.current = dir;
        setDirection(dir);
      }
      pendingDirRef.current = null;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          return;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      lastPosRef.current = { x: clientX, y: clientY };

      // ── First interaction: relaxed gaze → awareness ───────────────────────
      if (!hasBeenNoticedRef.current) {
        if (awarenessTimerRef.current === null) {
          awarenessTimerRef.current = setTimeout(() => {
            hasBeenNoticedRef.current = true;
            const { x, y } = lastPosRef.current;
            commitDirection(computeRawDirection(x, y));
          }, AWARENESS_DELAY_MS);
        }
        return;
      }

      // ── Fluid tracking ────────────────────────────────────────────────────
      const rawDir = computeRawDirection(clientX, clientY);

      if (rawDir === currentDirRef.current) {
        // Back in current zone — cancel any pending commit
        if (commitTimerRef.current) {
          clearTimeout(commitTimerRef.current);
          commitTimerRef.current = null;
          pendingDirRef.current = null;
        }
        return;
      }

      // Same pending direction — already waiting, let it fire
      if (rawDir === pendingDirRef.current) return;

      // New candidate — restart debounce
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
      pendingDirRef.current = rawDir;
      commitTimerRef.current = setTimeout(() => {
        commitDirection(rawDir);
        commitTimerRef.current = null;
      }, DIRECTION_COMMIT_DELAY_MS);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      if (awarenessTimerRef.current) clearTimeout(awarenessTimerRef.current);
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    };
  }, []);

  return direction;
}
