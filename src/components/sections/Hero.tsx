"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  data?: {
    fields?: {
      heroImage?: {
        fields?: {
          file?: {
            url?: string;
          };
          description?: string;
        };
      };
    };
  };
}

export function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!artRef.current) return;

    const orbs = artRef.current.querySelectorAll(".hero-orb");

    // Staggered entrance
    gsap.fromTo(
      orbs,
      { scale: 0.7, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        stagger: 0.18,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    // Slow floating drift
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: i % 2 === 0 ? -18 : 18,
        x: i % 3 === 0 ? 10 : -6,
        duration: 6 + i * 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Scroll indicator
    if (scrollRef.current) {
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.2, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-section relative min-h-[100svh] flex items-center overflow-hidden bg-bg-primary"
    >
      {/* Grain texture overlay */}
      <div className="hero-grain" />

      {/* Content grid */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 -mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-6 items-center">
          {/* Left: Text content */}
          <div>
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent">
                  Custom Software Development
                </span>
                <span className="h-px w-12 bg-accent/50" />
              </div>
            </FadeIn>

            <TextReveal
              as="h1"
              className="font-serif hero-heading font-normal text-text-primary mb-5"
              stagger={0.05}
              delay={0.2}
            >
              Software crafted to empower your future
            </TextReveal>

            <FadeIn delay={0.6}>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl mb-8">
                We are your dedicated technology partner, committed to bringing
                your unique vision to life through elegant, purposeful software.
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" href="/contact">
                  Start a Conversation
                </Button>
                <Button variant="secondary" href="#services">
                  Explore Services
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right: Bold warm gradient composition */}
          <div
            ref={artRef}
            className="relative h-[380px] lg:h-[440px] hidden lg:block"
            aria-hidden="true"
          >
            {/* Large primary orb - warm orange, the anchor */}
            <div
              className="hero-orb absolute rounded-full"
              style={{
                width: "380px",
                height: "380px",
                top: "5%",
                right: "0%",
                background:
                  "radial-gradient(circle at 40% 40%, rgba(194,65,12,0.45) 0%, rgba(245,158,11,0.2) 40%, rgba(245,158,11,0.05) 65%, transparent 80%)",
                filter: "blur(60px)",
              }}
            />

            {/* Deep burnt orb - overlapping from left for depth */}
            <div
              className="hero-orb absolute rounded-full"
              style={{
                width: "280px",
                height: "280px",
                top: "35%",
                right: "25%",
                background:
                  "radial-gradient(circle at 60% 50%, rgba(154,52,18,0.4) 0%, rgba(194,65,12,0.15) 40%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            {/* Amber glow - warm highlight where orbs meet */}
            <div
              className="hero-orb absolute rounded-full"
              style={{
                width: "200px",
                height: "200px",
                top: "20%",
                right: "15%",
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(251,191,36,0.1) 50%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Small bright accent - adds a hot spot */}
            <div
              className="hero-orb absolute rounded-full"
              style={{
                width: "120px",
                height: "120px",
                bottom: "18%",
                right: "40%",
                background:
                  "radial-gradient(circle, rgba(194,65,12,0.3) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
            />

            {/* Faint warm wash at bottom for grounding */}
            <div
              className="hero-orb absolute rounded-full"
              style={{
                width: "300px",
                height: "150px",
                bottom: "-5%",
                right: "10%",
                background:
                  "radial-gradient(ellipse, rgba(245,240,235,0.6) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-0"
      >
        <span className="text-[10px] text-text-tertiary tracking-[0.25em] uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-accent/40 to-transparent hero-scroll-line" />
      </div>
    </section>
  );
}
