"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

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
  const clustersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!clustersRef.current) return;

    const clusters = clustersRef.current.querySelectorAll(".tech-cluster");
    if (clusters.length === 0) return;

    gsap.fromTo(
      clusters,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: clustersRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [data]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-bg-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Technology" dark>
            Our stack
          </SectionHeading>
        </FadeIn>

        {/* Tech clusters as pill/tag groups */}
        <div ref={clustersRef} className="space-y-12">
          {data.map((techStack) => (
            <div key={techStack.sys.id} className="tech-cluster">
              <h3 className="font-serif heading-sm font-normal text-white mb-5">
                {techStack.fields.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {techStack.fields.stackList?.map((item, index) => (
                  <span
                    key={index}
                    className="inline-block rounded-full border border-border-dark px-4 py-2 text-sm text-text-tertiary transition-colors duration-300 hover:border-accent hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
