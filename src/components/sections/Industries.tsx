"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scrollRef.current) return;

    const cards = scrollRef.current.querySelectorAll(".industry-card");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scrollRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [data]);

  const getImageUrl = (industry: Industry) => {
    const url = industry.fields.image?.fields?.file?.url;
    if (!url) return null;
    return url.startsWith("//") ? `https:${url}` : url;
  };

  return (
    <section className="py-24 lg:py-32 bg-bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Industries">
            Sectors we serve
          </SectionHeading>
        </FadeIn>
      </div>

      {/* Horizontal scroll on desktop */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 px-4 lg:px-8 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {data.map((industry) => {
          const imageUrl = getImageUrl(industry);

          return (
            <div
              key={industry.sys.id}
              className="industry-card relative flex-shrink-0 w-72 md:w-80 h-96 rounded-2xl overflow-hidden group snap-start"
            >
              {/* Background image */}
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={industry.fields.industryName || "Industry"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="320px"
                />
              ) : (
                <div className="absolute inset-0 bg-bg-dark-secondary" />
              )}

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl font-normal text-white mb-2">
                  {industry.fields.industryName}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {industry.fields.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
