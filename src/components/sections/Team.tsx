"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface TeamMember {
  fields: {
    firstName?: string;
    jobTitle?: string;
    picture?: {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
  sys: {
    id: string;
  };
}

interface TeamProps {
  data: TeamMember[];
}

export function Team({ data }: TeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

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

    const cards = cardsRef.current?.querySelectorAll(".team-card");
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

  const getImageUrl = (member: TeamMember) => {
    const url = member.fields.picture?.fields?.file?.url;
    if (!url) return null;
    return url.startsWith("//") ? `https:${url}` : url;
  };

  // Sort team members: CEO and CTO first, then by firstName
  const sortedMembers = [...data].sort((a, b) => {
    const titleA = (a.fields.jobTitle || "").toLowerCase();
    const titleB = (b.fields.jobTitle || "").toLowerCase();

    if (titleA.includes("ceo")) return -1;
    if (titleB.includes("ceo")) return 1;
    if (titleA.includes("cto")) return -1;
    if (titleB.includes("cto")) return 1;

    return (a.fields.firstName || "").localeCompare(b.fields.firstName || "");
  });

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="font-serif heading-lg font-normal text-text-primary mb-4">
            Our Team
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Meet the talented people behind Ateed Tech.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sortedMembers.map((member) => {
            const imageUrl = getImageUrl(member);

            return (
              <div
                key={member.sys.id}
                className="team-card bg-bg-primary rounded-2xl border border-border overflow-hidden hover:border-text-tertiary transition-colors duration-300"
              >
                {imageUrl && (
                  <div className="relative h-72">
                    <Image
                      src={imageUrl}
                      alt={member.fields.firstName || "Team member"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4 text-center">
                  <h3 className="font-serif text-lg font-normal text-text-primary">
                    {member.fields.firstName}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {member.fields.jobTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
