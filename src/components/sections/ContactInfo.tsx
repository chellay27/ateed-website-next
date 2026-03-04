"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface ContactItem {
  fields: {
    contactLabel?: string;
    contactValue?: string;
  };
  sys: {
    id: string;
  };
}

interface ContactInfoProps {
  data: ContactItem[];
}

function formatContactValue(label?: string, value?: string): string {
  if (!value) return "";
  // If it looks like a phone field and doesn't already have a country code, prepend +1
  const isPhone = label?.toLowerCase().includes("call") || label?.toLowerCase().includes("phone");
  if (isPhone && !value.startsWith("+")) {
    return `+1 ${value}`;
  }
  return value;
}

export function ContactInfo({ data }: ContactInfoProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.children;
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardsRef}
      className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6 max-w-3xl mx-auto mb-16"
    >
      {data.map((contact) => (
        <div
          key={contact.sys.id}
          className="flex-1 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(59,141,214,0.08)",
            boxShadow: "0 2px 12px rgba(30,80,160,0.04)",
          }}
        >
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em] mb-2">
            {contact.fields.contactLabel}
          </p>
          <p className="font-serif text-lg text-text-primary">
            {formatContactValue(contact.fields.contactLabel, contact.fields.contactValue)}
          </p>
        </div>
      ))}
    </div>
  );
}
