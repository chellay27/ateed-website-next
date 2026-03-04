"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";

// Distinct accent color per service — muted, sophisticated tones
const SERVICE_COLORS = [
  "#3B8DD6", // 01 Requirements — primary blue
  "#0891B2", // 02 Consulting — cyan
  "#7C3AED", // 03 UX/UI — violet
  "#059669", // 04 Web Dev — emerald
  "#D97706", // 05 Mobile — amber
  "#4F46E5", // 06 Enterprise — indigo
  "#0D9488", // 07 API Integration — teal
  "#DB2777", // 08 AI/ML — pink
  "#E8762D", // 09 Digital Marketing — orange
];

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
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
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
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
        >
          {data.map((service, index) => {
            const color = SERVICE_COLORS[index % SERVICE_COLORS.length];
            return (
            <div
              key={service.sys.id}
              className="service-card bg-bg-primary p-6 lg:p-8 group transition-all duration-300"
              style={{
                // CSS custom property for this card's accent
                "--card-accent": color,
                "--card-accent-bg": `${color}08`,
                "--card-accent-bg-hover": `${color}0D`,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${color}0A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
            >
              {/* Large decorative number — tinted with card accent */}
              <span
                className="block font-serif text-4xl lg:text-5xl font-normal select-none mb-3 transition-colors duration-500"
                style={{ color: `${color}18` }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Heading + accent line wrapper — line expands to heading width on hover */}
              <div className="w-fit mb-3">
                <h3
                  className="font-serif heading-sm font-normal text-text-primary transition-colors duration-300 group-hover:text-[var(--card-accent)]"
                >
                  {service.fields.title}
                </h3>
                <div
                  className="w-8 h-[2px] rounded-full group-hover:w-full transition-all duration-500 mt-2"
                  style={{ backgroundColor: color }}
                />
              </div>

              <p className="text-text-secondary text-[0.925rem] leading-relaxed">
                {service.fields.cardText}
              </p>
            </div>
            );
          })}
          {/* CTA in the empty cell when odd number of services */}
          {data.length % 2 !== 0 && (
            <div className="hidden md:flex bg-bg-primary p-6 lg:p-8 flex-col items-center justify-center text-center">
              <p className="text-text-secondary mb-4">Have a project in mind?</p>
              <Button variant="primary" href="/contact">
                Let&apos;s Discuss Your Project
              </Button>
            </div>
          )}
        </div>

        {/* CTA below services on mobile (or when even number of services) */}
        {data.length % 2 === 0 && (
          <FadeIn delay={0.3}>
            <div className="mt-14 text-center">
              <p className="text-text-secondary mb-5">Have a project in mind?</p>
              <Button variant="primary" href="/contact">
                Let&apos;s Discuss Your Project
              </Button>
            </div>
          </FadeIn>
        )}
        {data.length % 2 !== 0 && (
          <div className="md:hidden mt-10 text-center">
            <p className="text-text-secondary mb-4">Have a project in mind?</p>
            <Button variant="primary" href="/contact">
              Let&apos;s Discuss Your Project
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
