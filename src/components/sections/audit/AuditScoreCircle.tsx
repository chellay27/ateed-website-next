"use client";

import { useRef, useEffect } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface AuditScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label?: string;
  delay?: number;
  animate?: boolean;
}

export function AuditScoreCircle({
  score,
  size = 120,
  strokeWidth = 8,
  color,
  label,
  delay = 0,
  animate = true,
}: AuditScoreCircleProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useGSAP(() => {
    if (!animate || !circleRef.current || !textRef.current) return;

    // Animate stroke from full offset (empty) to target offset
    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: offset,
        duration: 1.2,
        delay,
        ease: "power2.out",
      }
    );

    // Animate counter from 0 to score
    const counter = { value: 0 };
    gsap.to(counter, {
      value: score,
      duration: 1.2,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (textRef.current) {
          textRef.current.textContent = String(Math.round(counter.value));
        }
      },
    });
  }, [score, animate]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        {/* Score circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
        />
        {/* Score text */}
        <text
          ref={textRef}
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-primary font-semibold"
          style={{
            fontSize: size * 0.28,
            transform: "rotate(90deg)",
            transformOrigin: "center",
          }}
        >
          {animate ? "0" : score}
        </text>
      </svg>
      {label && (
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
