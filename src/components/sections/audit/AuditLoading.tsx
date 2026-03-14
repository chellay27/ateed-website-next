"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const categories = [
  { name: "Performance & Speed", icon: "⚡" },
  { name: "SEO & Discoverability", icon: "🔍" },
  { name: "Design & UX", icon: "🎨" },
  { name: "Security & Best Practices", icon: "🔒" },
];

export function AuditLoading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Fade in container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // Animate progress bars with stagger
    const bars = containerRef.current.querySelectorAll(".audit-progress-fill");
    bars.forEach((bar, i) => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 3 + i * 0.8,
          delay: i * 0.5,
          ease: "power1.inOut",
          transformOrigin: "left center",
          repeat: -1,
          yoyo: true,
        }
      );
    });

    // Pulse dots
    const dots = containerRef.current.querySelectorAll(".audit-loading-dot");
    gsap.to(dots, {
      opacity: 0.3,
      duration: 0.6,
      stagger: { each: 0.2, repeat: -1, yoyo: true },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-2xl p-8 lg:p-10"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(59,141,214,0.1)",
        boxShadow:
          "0 8px 32px rgba(30,80,160,0.08), 0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <div className="text-center mb-8">
        <h2 className="font-serif heading-md font-normal text-text-primary mb-2">
          Analyzing your website
        </h2>
        <p className="text-text-secondary flex items-center justify-center gap-1">
          This usually takes 15–30 seconds
          <span className="inline-flex gap-0.5 ml-1">
            <span className="audit-loading-dot w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="audit-loading-dot w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="audit-loading-dot w-1.5 h-1.5 rounded-full bg-accent" />
          </span>
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg" role="img" aria-label={cat.name}>
                {cat.icon}
              </span>
              <span className="text-sm font-medium text-text-primary">
                {cat.name}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="audit-progress-fill h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                style={{ transformOrigin: "left center" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
