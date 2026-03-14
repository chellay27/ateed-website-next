"use client";

import { useState, useRef, FormEvent } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import type { AuditRequest } from "@/lib/audit";

interface AuditFormProps {
  onSubmit: (data: AuditRequest) => void;
}

export function AuditForm({ onSubmit }: AuditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useGSAP(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: AuditRequest = {
      url: (formData.get("url") as string).trim(),
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string)?.trim() || undefined,
      company: (formData.get("company") as string)?.trim() || undefined,
    };

    if (!data.url || !data.name || !data.email) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    onSubmit(data);
  };

  const inputClasses =
    "w-full px-0 py-3 border-0 border-b border-border bg-transparent focus:border-accent focus:ring-0 outline-none transition-colors text-text-primary placeholder:text-text-tertiary";

  const glassmorphicStyle = {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(59,141,214,0.1)",
    boxShadow:
      "0 8px 32px rgba(30,80,160,0.08), 0 1px 3px rgba(0,0,0,0.03)",
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 lg:p-10"
      style={glassmorphicStyle}
    >
      <h2 className="font-serif heading-md font-normal text-text-primary mb-2">
        Audit your website
      </h2>
      <p className="text-text-secondary mb-8">
        Enter your website URL and contact details. We&apos;ll analyze your
        site&apos;s performance, SEO, accessibility, and security in seconds.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* URL field — prominent, full width */}
      <div className="mb-6">
        <label
          htmlFor="audit-url"
          className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
        >
          Website URL *
        </label>
        <input
          type="text"
          id="audit-url"
          name="url"
          required
          className={`${inputClasses} text-lg`}
          placeholder="www.example.com"
          autoComplete="url"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        <div>
          <label
            htmlFor="audit-name"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Name *
          </label>
          <input
            type="text"
            id="audit-name"
            name="name"
            required
            className={inputClasses}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="audit-email"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="audit-email"
            name="email"
            required
            className={inputClasses}
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label
            htmlFor="audit-phone"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="audit-phone"
            name="phone"
            className={inputClasses}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label
            htmlFor="audit-company"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Company
          </label>
          <input
            type="text"
            id="audit-company"
            name="company"
            className={inputClasses}
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-white py-3.5 px-6 rounded-full font-medium hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-lg hover:shadow-accent/20"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Starting Audit...
          </>
        ) : (
          "Run Free Audit"
        )}
      </button>
    </form>
  );
}
