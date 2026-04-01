import { useRef, useEffect, useCallback } from "react";

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useGlobalReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("vis");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function useStagedReveal(buildTimeline, threshold = 0.25) {
  const ref = useRef(null);
  const triggered = useRef(false);
  const stableBuild = useCallback(buildTimeline, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timeouts = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered.current) {
            triggered.current = true;
            stableBuild(
              (delay, fn) => timeouts.push(setTimeout(fn, delay)),
              el
            );
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, [stableBuild, threshold]);

  return ref;
}
