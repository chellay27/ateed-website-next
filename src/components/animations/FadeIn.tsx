"use client";

import React, { useRef, ReactNode, ElementType } from "react";
import { useFadeIn } from "@/hooks/useGSAP";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: ElementType;
}

/**
 * Wrapper component for fade-in animations on scroll
 */
export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 50,
  duration = 0.8,
  as: Component = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useFadeIn(ref, { y, duration, delay });

  return (
    <Component ref={ref as any} className={className}>
      {children}
    </Component>
  );
}

/**
 * Staggered fade-in for lists of items
 */
export function FadeInStagger({
  children,
  className = "",
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={className} data-stagger={stagger}>
      {children}
    </div>
  );
}
