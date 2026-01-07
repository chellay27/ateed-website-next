"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface CaseStudy {
  fields: {
    name?: string;
    description?: string;
    duration?: string;
    team?: string;
    clientFeedback?: string;
  };
  sys: {
    id: string;
  };
}

interface CaseStudiesProps {
  data: CaseStudy[];
}

export function CaseStudies({ data }: CaseStudiesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

    // Animate slider
    gsap.fromTo(
      sliderRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sliderRef.current,
          start: "top 80%",
        },
      }
    );
  }, [data]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  if (!data || data.length === 0) {
    return null;
  }

  const currentStudy = data[currentIndex];

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Case Studies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how we&apos;ve helped businesses achieve their goals through innovative solutions.
          </p>
        </div>

        {/* Case Study Slider */}
        <div ref={sliderRef} className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 relative">
            {/* Navigation Buttons */}
            {data.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Previous case study"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Next case study"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Content */}
            <div className="text-center px-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {currentStudy.fields.name}
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {currentStudy.fields.description}
              </p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row justify-center gap-8 mb-8">
                {currentStudy.fields.duration && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Duration</h4>
                    <p className="text-gray-700">{currentStudy.fields.duration}</p>
                  </div>
                )}
                {currentStudy.fields.team && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Team</h4>
                    <p className="text-gray-700">{currentStudy.fields.team}</p>
                  </div>
                )}
              </div>

              {/* Client Feedback */}
              {currentStudy.fields.clientFeedback && (
                <div className="border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Client Feedback</h4>
                  <p className="text-gray-600 italic">&ldquo;{currentStudy.fields.clientFeedback}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Dots */}
            {data.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {data.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
