"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";

export function HomeCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (bgRef.current && sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.fromTo(
        bgRef.current,
        { scale: 0, opacity: 0, borderRadius: "50%" },
        {
          scale: 1,
          opacity: 1,
          borderRadius: "0%",
          duration: 1.8,
          ease: "power2.inOut",
        },
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-bg-blue overflow-hidden"
    >
      {/* Dark background that grows outward */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-bg-dark origin-center"
        style={{ borderRadius: "50%", transform: "scale(0)" }}
      />

      {/* Gradient orb — top right */}
      <div
        className="gradient-orb gradient-orb-warm"
        style={{ width: "500px", height: "500px", top: "-20%", right: "-5%" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <TextReveal
            as="h2"
            className="font-serif heading-lg font-normal text-white mb-6"
            stagger={0.04}
          >
            Ready to build something remarkable?
          </TextReveal>

          <FadeIn delay={0.3}>
            <p className="text-lg text-text-tertiary leading-relaxed mb-10 max-w-xl mx-auto">
              Let&apos;s discuss how we can turn your vision into software that
              makes a difference.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <Button variant="primary" href="/contact">
              Start a Conversation
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
