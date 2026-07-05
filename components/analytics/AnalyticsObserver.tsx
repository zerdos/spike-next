"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 100];

/**
 * Small client island (mounted once in the root layout) covering the
 * remaining FR-4 events that aren't already tracked inline: section
 * visibility, scroll depth, and generic [data-cta] clicks.
 */
export function AnalyticsObserver() {
  useEffect(() => {
    const seenSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-section");
          if (id && !seenSections.has(id)) {
            seenSections.add(id);
            track("section_visible", { section: id });
          }
        }
      },
      { threshold: 0.5 },
    );
    for (const section of document.querySelectorAll("[data-section]")) {
      observer.observe(section);
    }

    const seenDepths = new Set<number>();
    function handleScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const percent = total > 0 ? Math.round((scrolled / total) * 100) : 0;
      for (const depth of SCROLL_MILESTONES) {
        if (percent >= depth && !seenDepths.has(depth)) {
          seenDepths.add(depth);
          track("scroll_depth", { depth });
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest("[data-cta]");
      if (target) {
        track("cta_click", { cta: target.getAttribute("data-cta") ?? "unknown" });
      }
    }
    document.addEventListener("click", handleClick);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
