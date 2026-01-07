"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface Industry {
  fields: {
    industryName?: string;
    description?: string;
    image?: {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
  sys: {
    id: string;
  };
}

interface IndustriesProps {
  data: Industry[];
}

export function Industries({ data }: IndustriesProps) {
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
    const cards = cardsRef.current?.querySelectorAll(".industry-card");
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [data]);

  const getImageUrl = (industry: Industry) => {
    const url = industry.fields.image?.fields?.file?.url;
    if (!url) return null;
    return url.startsWith("//") ? `https:${url}` : url;
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver tailored solutions across diverse industries, helping businesses transform and thrive.
          </p>
        </div>

        {/* Industry Cards */}
        <div ref={cardsRef} className="space-y-8">
          {data.map((industry, index) => {
            const imageUrl = getImageUrl(industry);
            const isEven = index % 2 === 0;

            return (
              <div
                key={industry.sys.id}
                className="industry-card bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Image */}
                  {imageUrl && (
                    <div className="md:w-1/2 relative h-64 md:h-80">
                      <Image
                        src={imageUrl}
                        alt={industry.fields.industryName || "Industry"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {industry.fields.industryName}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {industry.fields.description}
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
