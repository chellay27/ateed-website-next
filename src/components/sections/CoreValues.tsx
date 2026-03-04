"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface CoreValue {
  fields: {
    title?: string;
    description?: string;
    iconClass?: string;
    iconBackgroundColor?: string;
  };
  sys: {
    id: string;
  };
}

interface CoreValuesProps {
  data: CoreValue[];
}

export function CoreValues({ data }: CoreValuesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const cards = cardsRef.current?.querySelectorAll(".value-card");
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {data.map((value) => (
            <div
              key={value.sys.id}
              className="value-card flex items-start gap-5 p-6"
            >
              <div
                className="w-3 h-3 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: value.fields.iconBackgroundColor || "#C2410C" }}
              />
              <div>
                <h3 className="font-serif text-xl font-normal text-text-primary mb-2">
                  {value.fields.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {value.fields.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
