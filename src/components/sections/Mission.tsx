"use client";

import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/hooks/useGSAP";

interface MissionProps {
  data?: {
    fields: {
      heading?: string;
      description?: string;
    };
  };
}

export function Mission({ data }: MissionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    ).fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.4"
    );
  }, []);

  const heading = data?.fields?.heading || "Our Mission";
  const description =
    data?.fields?.description ||
    "At Ateed Tech, we're more than just a custom software development company – we are your dedicated technology partner, committed to bringing your unique vision to life.";

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {heading}
          </h2>
          <p
            ref={textRef}
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
