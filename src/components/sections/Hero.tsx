"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";

// Code lines that "type" out in the editor
const CODE_LINES = [
  { indent: 0, text: 'function buildYourVision() {', color: '#60A5FA' },
  { indent: 1, text: 'const idea = getYourRequirements();', color: '#A5B4FC' },
  { indent: 1, text: 'const design = craftUI(idea);', color: '#A5B4FC' },
  { indent: 1, text: 'const app = develop(design);', color: '#A5B4FC' },
  { indent: 1, text: 'return deploy(app);', color: '#34D399' },
  { indent: 0, text: '}', color: '#60A5FA' },
];

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
  const editorRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse-tracking 3D tilt
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!perspectiveRef.current || !editorRef.current) return;

    const rect = perspectiveRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse distance from center
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 5;

    gsap.to(editorRef.current, {
      rotateY,
      rotateX,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!editorRef.current) return;
    gsap.to(editorRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const el = perspectiveRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  useGSAP(() => {
    // Breathing orbs
    if (artRef.current) {
      const orbs = artRef.current.querySelectorAll(".hero-orb");
      orbs.forEach((orb, i) => {
        gsap.set(orb, { scale: 0.5, opacity: 0.4 });
        gsap.to(orb, {
          scale: 1.3,
          opacity: 1,
          duration: 5 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.6,
        });
        gsap.to(orb, {
          y: i % 2 === 0 ? -18 : 18,
          x: i % 3 === 0 ? 10 : -6,
          duration: 6 + i * 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }

    // Editor entrance
    if (editorRef.current) {
      gsap.fromTo(
        editorRef.current,
        { y: 40, opacity: 0, rotateX: 10 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power3.out", delay: 0.6 }
      );
    }

    // Typing animation — each line types in with stagger
    const masterTl = gsap.timeline({ delay: 1.2 });

    linesRef.current.forEach((lineEl, i) => {
      if (!lineEl) return;
      const textSpan = lineEl.querySelector(".code-text") as HTMLElement;
      if (!textSpan) return;

      const fullText = textSpan.dataset.text || "";
      textSpan.textContent = "";

      masterTl.to(textSpan, {
        duration: fullText.length * 0.04,
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          const chars = Math.floor(progress * fullText.length);
          textSpan.textContent = fullText.substring(0, chars);
        },
      }, i === 0 ? ">" : ">-0.1");
    });

    // Blinking cursor
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
        delay: 1.2,
      });
    }

    // After typing completes, pause then restart
    masterTl.to({}, { duration: 3 }); // hold
    masterTl.call(() => {
      // Fade out lines, then re-type
      linesRef.current.forEach((lineEl) => {
        if (!lineEl) return;
        const textSpan = lineEl.querySelector(".code-text") as HTMLElement;
        if (textSpan) textSpan.textContent = "";
      });
      // Re-run the typing after a beat
      setTimeout(() => masterTl.restart(), 800);
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

      {/* Gradient orbs — breathing background */}
      <div
        ref={artRef}
        className="absolute inset-0 z-[2] pointer-events-none"
        aria-hidden="true"
      >
        {/* Large primary orb — top right corner */}
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "clamp(280px, 35vw, 480px)",
            height: "clamp(280px, 35vw, 480px)",
            top: "-10%",
            right: "-8%",
            background:
              "radial-gradient(circle at 40% 40%, rgba(59,141,214,0.7) 0%, rgba(100,170,230,0.35) 40%, rgba(100,170,230,0.1) 65%, transparent 80%)",
            filter: "blur(50px)",
          }}
        />

        {/* Deep navy orb — top right area */}
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "clamp(200px, 26vw, 340px)",
            height: "clamp(200px, 26vw, 340px)",
            top: "5%",
            right: "5%",
            background:
              "radial-gradient(circle at 60% 50%, rgba(30,80,160,0.6) 0%, rgba(59,141,214,0.25) 40%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />

        {/* Sky blue glow — supporting top right */}
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "clamp(160px, 20vw, 260px)",
            height: "clamp(160px, 20vw, 260px)",
            top: "15%",
            right: "12%",
            background:
              "radial-gradient(circle, rgba(100,180,240,0.55) 0%, rgba(140,200,250,0.2) 50%, transparent 70%)",
            filter: "blur(35px)",
          }}
        />

        {/* Small blue accent — bridging right side */}
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "clamp(100px, 14vw, 160px)",
            height: "clamp(100px, 14vw, 160px)",
            top: "45%",
            right: "18%",
            background:
              "radial-gradient(circle, rgba(59,141,214,0.5) 0%, transparent 65%)",
            filter: "blur(25px)",
          }}
        />

        {/* Large orange orb — bottom left corner */}
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "clamp(200px, 26vw, 360px)",
            height: "clamp(200px, 26vw, 360px)",
            bottom: "-8%",
            left: "-6%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(232,118,45,0.55) 0%, rgba(232,118,45,0.22) 40%, rgba(232,118,45,0.05) 65%, transparent 80%)",
            filter: "blur(50px)",
          }}
        />

        {/* Small warm orange — supporting bottom left */}
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "clamp(100px, 14vw, 180px)",
            height: "clamp(100px, 14vw, 180px)",
            bottom: "10%",
            left: "5%",
            background:
              "radial-gradient(circle, rgba(232,118,45,0.4) 0%, rgba(232,118,45,0.12) 50%, transparent 70%)",
            filter: "blur(35px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 -mt-14">
        <div className="flex items-center justify-between gap-8 lg:gap-16">
          {/* Left: text */}
          <div className="max-w-xl flex-1">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-accent/50" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent">
                  Custom Software Development
                </span>
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

          {/* Right: 3D interactive code editor */}
          <div
            ref={perspectiveRef}
            className="hidden md:block flex-shrink-0"
            style={{
              perspective: "1200px",
              width: "clamp(320px, 32vw, 480px)",
            }}
          >
            <div
              ref={editorRef}
              className="opacity-0"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* Editor window */}
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/20 border border-white/10">
                {/* Title bar */}
                <div className="bg-[#1E1E2E] px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                  </div>
                  <span className="text-[11px] text-white/30 ml-3 font-mono">
                    your-project.ts
                  </span>
                </div>

                {/* Code area */}
                <div className="bg-[#1E1E2E] px-5 py-4 font-mono text-sm leading-relaxed min-h-[220px]">
                  {CODE_LINES.map((line, i) => (
                    <div
                      key={i}
                      ref={(el) => { linesRef.current[i] = el; }}
                      className="flex"
                      style={{ paddingLeft: `${line.indent * 20}px` }}
                    >
                      <span className="text-white/20 select-none w-6 text-right mr-4 text-xs leading-relaxed">
                        {i + 1}
                      </span>
                      <span
                        className="code-text"
                        data-text={line.text}
                        style={{ color: line.color }}
                      />
                    </div>
                  ))}
                  {/* Blinking cursor */}
                  <div ref={cursorRef} className="inline-block w-[2px] h-4 bg-accent ml-[44px] mt-1" />
                </div>

                {/* Bottom bar */}
                <div className="bg-[#181825] px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/25 font-mono">TypeScript</span>
                    <span className="text-[10px] text-white/25 font-mono">UTF-8</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
                    <span className="text-[10px] text-white/25 font-mono">Ready</span>
                  </div>
                </div>
              </div>
            </div>
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
