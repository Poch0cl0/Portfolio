"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface ScrollRevealProps {
  id: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const visited = new Set<string>();
const targets = new Map<Element, (entry: IntersectionObserverEntry) => void>();
let observer: IntersectionObserver | undefined;
let initialPath: string | undefined;
let traversedHistory = false;

function observe(element: Element, callback: (entry: IntersectionObserverEntry) => void) {
  observer ??= new IntersectionObserver((entries) => {
    entries.forEach((entry) => targets.get(entry.target)?.(entry));
  }, { rootMargin: "0px 0px 180px 0px" });

  targets.set(element, callback);
  observer.observe(element);

  return () => {
    targets.delete(element);
    observer?.unobserve(element);
    if (!targets.size) {
      observer?.disconnect();
      observer = undefined;
    }
  };
}

function canReveal() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return !traversedHistory &&
    window.location.pathname === initialPath &&
    !window.location.hash &&
    (!navigation || navigation.type === "navigate") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function startAnimation(element: HTMLElement) {
  function finish(event: AnimationEvent) {
    if (event.target !== element || event.animationName !== "scroll-reveal-in") return;
    delete element.dataset.scrollRevealActive;
    element.removeEventListener("animationend", finish);
    element.removeEventListener("animationcancel", finish);
  }

  element.addEventListener("animationend", finish);
  element.addEventListener("animationcancel", finish);
  element.dataset.scrollRevealActive = "true";

  return () => {
    element.removeEventListener("animationend", finish);
    element.removeEventListener("animationcancel", finish);
    delete element.dataset.scrollRevealActive;
  };
}

export function ScrollReveal({ id, children, className, delay = 0, duration }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    if (initialPath === undefined) {
      initialPath = window.location.pathname;
      window.addEventListener("popstate", () => { traversedHistory = true; }, { once: true });
    }

    if (visited.has(id) || !canReveal()) return;
    if (element.getBoundingClientRect().top <= window.innerHeight) {
      visited.add(id);
      return;
    }

    let firstEntry = true;
    let timer: number | undefined;
    let stopAnimation: (() => void) | undefined;
    const stopObserving = observe(element, (entry) => {
      const initial = firstEntry;
      firstEntry = false;
      if (!entry.isIntersecting) return;

      visited.add(id);
      stopObserving();
      if (initial || !canReveal() || entry.boundingClientRect.top <= window.innerHeight) return;

      const reveal = () => {
        if (canReveal() && element.getBoundingClientRect().top > window.innerHeight && !element.matches(":focus-within")) {
          stopAnimation = startAnimation(element);
        }
      };

      if (delay > 0) timer = window.setTimeout(reveal, delay);
      else reveal();
    });

    return () => {
      stopObserving();
      window.clearTimeout(timer);
      stopAnimation?.();
    };
  }, [id, delay]);

  const style = duration === undefined ? undefined : { "--scroll-reveal-duration": `${duration}ms` } as CSSProperties;

  return (
    <div ref={ref} className={className} style={style} data-scroll-reveal={id}>
      {children}
    </div>
  );
}
