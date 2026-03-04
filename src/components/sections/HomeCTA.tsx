"use client";

import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";

export function HomeCTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-bg-dark overflow-hidden">
      {/* Gradient orb decorations */}
      <div
        className="gradient-orb gradient-orb-warm"
        style={{ width: "500px", height: "500px", top: "-20%", right: "-5%" }}
      />
      <div
        className="gradient-orb gradient-orb-cool"
        style={{ width: "350px", height: "350px", bottom: "-15%", left: "-3%" }}
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
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" href="/contact">
                Start a Conversation
              </Button>
              <Button variant="ghost" href="#services" className="text-white hover:text-accent">
                View Our Work
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
