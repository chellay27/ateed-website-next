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
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((value) => (
            <div
              key={value.sys.id}
              className="value-card bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: value.fields.iconBackgroundColor || "#1689d1" }}
              >
                <i className={`${value.fields.iconClass} text-white text-2xl`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.fields.title}
              </h3>
              <p className="text-gray-600">
                {value.fields.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
