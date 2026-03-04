"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

interface Service {
  fields: {
    title?: string;
    cardText?: string;
    modalId?: string;
  };
  sys: {
    id: string;
  };
}

interface ServicesProps {
  data: Service[];
}

export function Services({ data }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".service-card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [data]);

  return (
    <section ref={sectionRef} id="services" className="py-24 lg:py-32 bg-bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="What We Do">
            Services
          </SectionHeading>
        </FadeIn>

        {/* 2-column grid of numbered service cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border"
        >
          {data.map((service, index) => {
            const isLastOdd = index === data.length - 1 && data.length % 2 !== 0;
            return (
            <div
              key={service.sys.id}
              className={`service-card bg-bg-primary p-8 lg:p-10 group cursor-pointer transition-colors duration-300 hover:bg-bg-blue ${isLastOdd ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-start gap-6">
                {/* Number */}
                <span className="text-sm font-mono text-text-tertiary mt-1 flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-serif heading-sm font-normal text-text-primary group-hover:text-accent transition-colors duration-300">
                      {service.fields.title}
                    </h3>

                    {/* Arrow icon that slides on hover */}
                    <svg
                      className="w-5 h-5 text-text-tertiary flex-shrink-0 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>

                  <p className="text-text-secondary mt-3 leading-relaxed line-clamp-3">
                    {service.fields.cardText}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
