"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/hooks/useGSAP";

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

function getImageUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

export function Hero({ data }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const heroImageUrl = getImageUrl(data?.fields?.heroImage?.fields?.file?.url);
  const heroImageAlt = data?.fields?.heroImage?.fields?.description || "Ateed Tech Hero";

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate hero elements
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image from Contentful */}
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
          alt={heroImageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Image
            src="/logo.png"
            alt="Ateed Tech"
            width={64}
            height={64}
            className="w-12 h-12 lg:w-16 lg:h-16"
          />
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            Ateed Tech
          </h1>
        </div>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
        >
          Custom Software to Empower Your Future.
        </p>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
