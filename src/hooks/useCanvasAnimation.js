import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

/**
 * Hook that manages a per-section canvas with:
 * - DPR-aware sizing via ResizeObserver
 * - IntersectionObserver to detect when section is in view
 * - rAF loop that only runs when visible
 * - Time-based progress tween (0→1) on enter
 *
 * @param {Function} drawFn - (ctx, progress, time, W, H, particleState) => void
 * @param {React.RefObject} scrollContainerRef - ref to the snap-container
 * @param {object} options
 * @param {number} options.duration - tween duration in seconds (default 5)
 * @param {boolean} options.resetOnLeave - reset progress when leaving (default true)
 */
export function useCanvasAnimation(drawFn, scrollContainerRef, options = {}) {
  const { duration = 5, resetOnLeave = true } = options;
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const rafId = useRef(null);
  const progressRef = useRef({ value: 0 });
  const timeRef = useRef(0);
  const particleStateRef = useRef({});
  const tweenRef = useRef(null);
  const isVisibleRef = useRef(false);
  const drawFnRef = useRef(drawFn);
  drawFnRef.current = drawFn;

  const startLoop = useCallback(() => {
    if (rafId.current) return;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      timeRef.current += 1;
      drawFnRef.current(
        ctx,
        progressRef.current.value,
        timeRef.current,
        W,
        H,
        particleStateRef.current
      );

      ctx.restore();
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  // Resize observer for canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    const ro = new ResizeObserver(resize);
    ro.observe(section);
    resize();

    return () => ro.disconnect();
  }, []);

  // IntersectionObserver for visibility + progress tween
  useEffect(() => {
    const section = sectionRef.current;
    const container = scrollContainerRef?.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isVisibleRef.current = true;

          // Small delay to let snap settle
          setTimeout(() => {
            if (!isVisibleRef.current) return;
            startLoop();

            // Tween progress from current to 1
            if (tweenRef.current) tweenRef.current.kill();
            tweenRef.current = gsap.to(progressRef.current, {
              value: 1,
              duration,
              ease: "none",
            });
          }, 120);
        } else {
          isVisibleRef.current = false;
          stopLoop();

          if (tweenRef.current) tweenRef.current.kill();
          if (resetOnLeave) {
            progressRef.current.value = 0;
            timeRef.current = 0;
            // Reset particle state
            particleStateRef.current = {};
          }
        }
      },
      {
        root: container || null,
        threshold: 0.5,
      }
    );

    io.observe(section);
    return () => {
      io.disconnect();
      stopLoop();
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [scrollContainerRef, duration, resetOnLeave, startLoop, stopLoop]);

  return { canvasRef, sectionRef, particleStateRef };
}
