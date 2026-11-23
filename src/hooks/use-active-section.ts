"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: readonly string[], pathname: string) {
  const [activeId, setActiveId] = useState("home");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id));
    let frame = 0;

    function update() {
      const scrollY = window.scrollY;
      setCompact(scrollY > 32);
      const readingLine = Math.max(112, window.innerHeight * 0.22);
      let current = "home";
      if (scrollY > 8) {
        sections.forEach((section) => {
          if (section && section.getBoundingClientRect().top <= readingLine) {
            current = section.id;
          }
        });
      }
      setActiveId(current);
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sectionIds, pathname]);

  return { activeId, compact };
}
