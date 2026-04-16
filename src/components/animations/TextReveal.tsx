"use client";

import { useRef, useMemo } from "react";
import { useTextReveal } from "@/hooks/useGSAP";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  stagger?: number;
  delay?: number;
}

/**
 * Wraps text in span elements for word-by-word reveal animation.
 * Full text is in the DOM for SEO — only visual transform is animated.
 */
export function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
  stagger = 0.04,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useTextReveal(ref, { stagger, delay });

  const words = useMemo(() => children.split(" "), [children]);

  return (
    <Tag
      // Polymorphic ref: TypeScript can't unify across the as-union; double-cast is the
      // accepted escape hatch for polymorphic components.
      ref={ref as unknown as React.Ref<HTMLHeadingElement>}
      className={`word-reveal ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="word-inner inline-block">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
