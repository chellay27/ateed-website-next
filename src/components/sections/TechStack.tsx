"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface TechStackItem {
  fields: {
    title?: string;
    stackList?: string[];
  };
  sys: {
    id: string;
  };
}

interface TechStackProps {
  data: TechStackItem[];
}

export function TechStack({ data }: TechStackProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Animate heading
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate cards with stagger
    const cards = cardsRef.current?.querySelectorAll(".tech-card");
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [data]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comprehensive Technology Stack
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We provide a complete suite of technologies to bring your vision to life.
          </p>
        </div>

        {/* Tech Stack Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((techStack) => (
            <div
              key={techStack.sys.id}
              className="tech-card bg-slate-800 border border-slate-700 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {techStack.fields.title}
              </h3>
              <div className="space-y-3">
                {techStack.fields.stackList?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
