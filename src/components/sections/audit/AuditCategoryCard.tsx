"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { AuditScoreCircle } from "./AuditScoreCircle";
import type { AuditCategoryResult } from "@/lib/audit";

interface AuditCategoryCardProps {
  category: AuditCategoryResult;
  delay?: number;
}

export function AuditCategoryCard({ category, delay = 0 }: AuditCategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-6 lg:p-8 opacity-0"
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start gap-5 mb-5">
        <AuditScoreCircle
          score={category.score}
          size={80}
          strokeWidth={6}
          color={category.color}
          delay={delay + 0.2}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-medium text-text-primary mb-1">
            {category.name}
          </h3>
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              color: category.color,
              background: `${category.color}14`,
            }}
          >
            {category.rating}
          </span>
        </div>
      </div>

      {/* Key metrics */}
      {category.metrics && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 pb-5 border-b border-gray-100">
          {Object.entries(category.metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between items-baseline">
              <span className="text-xs text-text-tertiary truncate mr-2">{key}</span>
              <span className="text-sm font-medium text-text-primary whitespace-nowrap">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <ul className="space-y-2.5">
        {category.suggestions.map((suggestion, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: category.color }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
