"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type GSAPCallback = (gsapInstance: typeof gsap, context: gsap.Context) => void | (() => void);

/**
 * Custom hook for GSAP animations with automatic cleanup
 */
export function useGSAP(callback: GSAPCallback, deps: React.DependencyList = []) {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Skip animations if user prefers reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    contextRef.current = gsap.context(() => {
      callback(gsap, contextRef.current!);
    });

    return () => {
      contextRef.current?.revert();
    };
  }, deps);

  return contextRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollTrigger(
  trigger: string | React.RefObject<HTMLElement | null>,
  animation: (element: Element) => gsap.core.Tween | gsap.core.Timeline,
  options?: ScrollTrigger.Vars
) {
  useGSAP(() => {
    const triggerElement = typeof trigger === "string"
      ? trigger
      : trigger.current;

    if (!triggerElement) return;

    const tween = animation(triggerElement as Element);

    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      end: "bottom 20%",
      ...options,
      animation: tween,
    });
  }, [trigger]);
}

/**
 * Hook for fade-in animations on scroll with direction support
 */
export function useFadeIn(
  ref: React.RefObject<HTMLElement | null>,
  options?: {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    start?: string;
    direction?: "up" | "down" | "left" | "right";
  }
) {
  const { duration = 0.8, delay = 0, start = "top 85%", direction = "up" } = options || {};

  const directionMap = {
    up: { y: options?.y ?? 40, x: 0 },
    down: { y: options?.y ?? -40, x: 0 },
    left: { y: 0, x: options?.x ?? 40 },
    right: { y: 0, x: options?.x ?? -40 },
  };

  const { y, x } = directionMap[direction];

  useGSAP(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y, x },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none none",
        },
      }
    );
  }, [ref]);
}

/**
 * Hook for text reveal animations (word-by-word)
 */
export function useTextReveal(
  ref: React.RefObject<HTMLElement | null>,
  options?: {
    stagger?: number;
    duration?: number;
    delay?: number;
    start?: string;
  }
) {
  const { stagger = 0.04, duration = 0.8, delay = 0, start = "top 85%" } = options || {};

  useGSAP(() => {
    if (!ref.current) return;

    const words = ref.current.querySelectorAll(".word-inner");
    if (words.length === 0) return;

    gsap.fromTo(
      words,
      { y: "100%" },
      {
        y: "0%",
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none none",
        },
      }
    );
  }, [ref]);
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.3
) {
  useGSAP(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: () => -speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [ref, speed]);
}

export { gsap, ScrollTrigger };
