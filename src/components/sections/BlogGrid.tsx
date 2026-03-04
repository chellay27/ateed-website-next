"use client";

import { useRef, ReactNode } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface BlogGridProps {
  children: ReactNode;
}

export function BlogGrid({ children }: BlogGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.children;
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {children}
    </div>
  );
}
