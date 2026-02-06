"use client";

import { useEffect } from "react";
import { useSectionColor } from "@/app/context/SectionColorContext";

const SECTION_COLORS: Record<string, string> = {
  interior: "#C6A67C",
  exterior: "#4F6D7A",
  floorplan: "#5F7F73",
  extra: "#6A5D7B",
  furniture: "#B08968"
};

export function CenikScrollSpy() {
  const { setActiveColor } = useSectionColor();

  useEffect(() => {
    function updateActiveColor() {
      const sections = document.querySelectorAll<HTMLElement>("[data-cenik-section]");
      const visible: { el: HTMLElement; top: number }[] = [];
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.2;
        if (inView) visible.push({ el, top: rect.top });
      });
      if (visible.length === 0) {
        setActiveColor(null);
        return;
      }
      visible.sort((a, b) => a.top - b.top);
      const sectionId = visible[0].el.getAttribute("data-cenik-section");
      const color = sectionId ? SECTION_COLORS[sectionId] ?? null : null;
      setActiveColor(color);
    }

    const sections = document.querySelectorAll<HTMLElement>("[data-cenik-section]");
    if (sections.length === 0) return;

    updateActiveColor();

    const observer = new IntersectionObserver(
      updateActiveColor,
      { rootMargin: "-15% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => {
      sections.forEach((el) => observer.unobserve(el));
      setActiveColor(null);
    };
  }, [setActiveColor]);

  return null;
}
