"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { AuditScoreCircle } from "./AuditScoreCircle";
import { AuditCategoryCard } from "./AuditCategoryCard";
import type { AuditResult } from "@/lib/audit";

type Strategy = "mobile" | "desktop";

interface AuditResultsProps {
  results: AuditResult;
  onReset: () => void;
  activeStrategy: Strategy;
  onStrategyChange: (strategy: Strategy) => void;
  isLoadingStrategy: boolean;
}

export function AuditResults({
  results,
  onReset,
  activeStrategy,
  onStrategyChange,
  isLoadingStrategy,
}: AuditResultsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Fade in the overall score section
    gsap.fromTo(
      containerRef.current.querySelector(".audit-overall"),
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
    );

    // Fade in CTA
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 1.2,
          ease: "power2.out",
        }
      );
    }
  }, []);

  const { performance, seo, accessibility, security } = results.categories;

  return (
    <div ref={containerRef}>
      {/* Overall Score */}
      <div
        className="audit-overall rounded-2xl p-8 lg:p-10 text-center mb-8"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(59,141,214,0.1)",
          boxShadow:
            "0 8px 32px rgba(30,80,160,0.08), 0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {/* Strategy toggle */}
        <div className="flex items-center justify-center gap-1 mb-6 p-1 bg-gray-100 rounded-full max-w-xs mx-auto">
          <button
            onClick={() => onStrategyChange("mobile")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeStrategy === "mobile"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Mobile
          </button>
          <button
            onClick={() => onStrategyChange("desktop")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeStrategy === "desktop"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Desktop
          </button>
        </div>

        <p className="text-xs font-medium tracking-wider uppercase text-text-tertiary mb-4">
          Overall Score for
        </p>
        <p className="text-lg font-medium text-accent mb-6 break-all">
          {results.url}
        </p>

        {isLoadingStrategy ? (
          <div className="flex items-center justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="ml-3 text-text-secondary">
              Loading {activeStrategy} results...
            </span>
          </div>
        ) : (
          <AuditScoreCircle
            score={results.overallScore}
            size={160}
            strokeWidth={10}
            color={
              results.overallScore >= 90
                ? "#22c55e"
                : results.overallScore >= 70
                ? "#3b8dd6"
                : results.overallScore >= 50
                ? "#f59e0b"
                : "#ef4444"
            }
            label={
              results.overallScore >= 90
                ? "Excellent"
                : results.overallScore >= 70
                ? "Good"
                : results.overallScore >= 50
                ? "Needs Work"
                : "Poor"
            }
          />
        )}
      </div>

      {/* Category Cards — 2x2 grid */}
      {!isLoadingStrategy && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AuditCategoryCard category={performance} delay={0.2} />
          <AuditCategoryCard category={seo} delay={0.4} />
          <AuditCategoryCard category={accessibility} delay={0.6} />
          <AuditCategoryCard category={security} delay={0.8} />
        </div>
      )}

      {/* CTA Section */}
      <div
        ref={ctaRef}
        className="rounded-2xl p-8 lg:p-10 text-center opacity-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,141,214,0.08), rgba(59,141,214,0.15))",
          border: "1px solid rgba(59,141,214,0.15)",
        }}
      >
        <h3 className="font-serif text-2xl font-normal text-text-primary mb-3">
          Want us to fix these issues?
        </h3>
        <p className="text-text-secondary mb-6 max-w-lg mx-auto">
          Our team can implement every recommendation in this report — from
          performance optimization to security hardening. Let&apos;s discuss
          your results.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center bg-accent text-white px-8 py-3.5 rounded-full font-medium hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
          >
            Get in Touch
          </Link>
          <button
            onClick={onReset}
            className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
          >
            Audit Another Site
          </button>
        </div>
      </div>
    </div>
  );
}
