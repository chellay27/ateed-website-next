"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap, ScrollTrigger } from "@/hooks/useGSAP";

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
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Animate heading
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate cards with stagger
    const cards = cardsRef.current?.querySelectorAll(".service-card");
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

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="flex items-center gap-3 mb-12">
          <Image
            src="/logo.png"
            alt="Ateed Tech"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Services
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((service) => (
            <div
              key={service.sys.id}
              className="service-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 group cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.fields.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-4">
                {service.fields.cardText}
              </p>
              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                More details →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
