"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface PageHeroProps {
  heading: string;
  description?: string;
  backgroundImage?: string;
}

export function PageHero({ heading, description, backgroundImage }: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative py-20 md:py-28 bg-slate-900 overflow-hidden"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {heading}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
