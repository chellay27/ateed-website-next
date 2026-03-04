"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { FadeIn } from "@/components/animations/FadeIn";

interface MissionProps {
  data?: {
    fields: {
      heading?: string;
      description?: string;
    };
  };
}

export function Mission({ data }: MissionProps) {
  const description =
    data?.fields?.description ||
    "At Ateed Tech, we're more than just a custom software development company – we are your dedicated technology partner, committed to bringing your unique vision to life.";

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Blue background grows outward from center
    if (bgRef.current && sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        bgRef.current,
        { scale: 0, opacity: 0, borderRadius: "50%" },
        {
          scale: 1.5,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }
      ).to(bgRef.current, {
        borderRadius: "0%",
        scale: 1,
        duration: 0.4,
        ease: "power1.inOut",
      });
    }

    // Accent line
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-bg-primary overflow-hidden"
    >
      {/* Blue background that grows outward */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-bg-blue origin-center"
        style={{ borderRadius: "50%", transform: "scale(0)" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-14">
          {/* Left: Label + decorative vertical line */}
          <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 md:pt-2 flex-shrink-0">
            <FadeIn>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent whitespace-nowrap">
                Who We Are
              </span>
            </FadeIn>
            <div
              ref={lineRef}
              className="h-px w-12 md:h-16 md:w-px bg-accent/30 md:mt-5 origin-top"
            />
          </div>

          {/* Right: Large pull-quote style description */}
          <div className="flex-1">
            <FadeIn delay={0.15}>
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.5rem] font-normal text-text-primary leading-snug md:leading-[1.35]">
                {description}
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
