"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface PageHeroProps {
  heading: string;
  description?: string;
  backgroundImage?: string;
}

export function PageHero({ heading, description, backgroundImage }: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pt-36 md:pt-40 pb-20 md:pb-28 bg-bg-cream overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div ref={contentRef} className={`${backgroundImage ? "lg:w-1/2" : "max-w-3xl mx-auto text-center"}`}>
            <h1 className="font-serif heading-xl font-normal text-text-primary mb-6">
              {heading}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {backgroundImage && (
            <div className="lg:w-1/2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                <Image
                  src={backgroundImage}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
