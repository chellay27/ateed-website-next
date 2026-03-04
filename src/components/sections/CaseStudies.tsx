"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

interface CaseStudy {
  fields: {
    name?: string;
    description?: string;
    duration?: string;
    team?: string;
    clientFeedback?: string;
  };
  sys: {
    id: string;
  };
}

interface CaseStudiesProps {
  data: CaseStudy[];
}

export function CaseStudies({ data }: CaseStudiesProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [data]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  if (!data || data.length === 0) {
    return null;
  }

  const currentStudy = data[currentIndex];

  return (
    <section className="py-24 lg:py-32 bg-bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Case Studies">
            Selected work
          </SectionHeading>
        </FadeIn>

        {/* Editorial layout */}
        <div ref={contentRef} className="max-w-4xl">
          {/* Project name - large serif */}
          <h3 className="font-serif heading-md font-normal text-text-primary mb-6">
            {currentStudy.fields.name}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-2xl">
            {currentStudy.fields.description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-10 mb-10">
            {currentStudy.fields.duration && (
              <div>
                <span className="block text-xs font-medium tracking-[0.15em] uppercase text-text-tertiary mb-1">
                  Duration
                </span>
                <span className="text-text-primary font-medium">
                  {currentStudy.fields.duration}
                </span>
              </div>
            )}
            {currentStudy.fields.team && (
              <div>
                <span className="block text-xs font-medium tracking-[0.15em] uppercase text-text-tertiary mb-1">
                  Team
                </span>
                <span className="text-text-primary font-medium">
                  {currentStudy.fields.team}
                </span>
              </div>
            )}
          </div>

          {/* Client feedback as blockquote with accent left border */}
          {currentStudy.fields.clientFeedback && (
            <blockquote className="border-l-2 border-accent pl-6 py-2 mb-10">
              <p className="text-text-secondary italic text-lg leading-relaxed">
                &ldquo;{currentStudy.fields.clientFeedback}&rdquo;
              </p>
            </blockquote>
          )}

          {/* Text-based prev/next pagination */}
          {data.length > 1 && (
            <div className="flex items-center gap-6 pt-6 border-t border-border">
              <button
                onClick={prevSlide}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Previous case study"
              >
                &larr; Prev
              </button>
              <span className="text-sm text-text-tertiary">
                {currentIndex + 1} / {data.length}
              </span>
              <button
                onClick={nextSlide}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Next case study"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
