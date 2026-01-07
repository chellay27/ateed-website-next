"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type GSAPCallback = (gsapInstance: typeof gsap, context: gsap.Context) => void | (() => void);

/**
 * Custom hook for GSAP animations with automatic cleanup
 * @param callback - Function that receives gsap instance and context
 * @param deps - Dependency array for re-running the animation
 */
export function useGSAP(callback: GSAPCallback, deps: React.DependencyList = []) {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Create a new GSAP context for scoped animations
    contextRef.current = gsap.context(() => {
      callback(gsap, contextRef.current!);
    });

    // Cleanup on unmount or deps change
    return () => {
      contextRef.current?.revert();
    };
  }, deps);

  return contextRef;
}

/**
 * Hook for scroll-triggered animations
 * @param trigger - CSS selector or ref for trigger element
 * @param animation - Animation callback
 * @param options - ScrollTrigger options
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
 * Hook for fade-in animations on scroll
 */
export function useFadeIn(
  ref: React.RefObject<HTMLElement | null>,
  options?: {
    y?: number;
    duration?: number;
    delay?: number;
    start?: string;
  }
) {
  const { y = 50, duration = 0.8, delay = 0, start = "top 80%" } = options || {};

  useGSAP(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none none",
        },
      }
    );
  }, [ref]);
}

export { gsap, ScrollTrigger };
