"use client";

import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";

interface MissionProps {
  data?: {
    fields: {
      heading?: string;
      description?: string;
    };
  };
}

export function Mission({ data }: MissionProps) {
  const heading = data?.fields?.heading || "Our Mission";
  const description =
    data?.fields?.description ||
    "At Ateed Tech, we're more than just a custom software development company – we are your dedicated technology partner, committed to bringing your unique vision to life.";

  return (
    <section className="py-24 lg:py-32 bg-bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-accent mb-6">
              Our Mission
            </span>
          </FadeIn>

          <TextReveal
            as="h2"
            className="font-serif heading-lg font-normal text-text-primary mb-8"
            stagger={0.03}
          >
            {heading}
          </TextReveal>

          <FadeIn delay={0.3}>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
