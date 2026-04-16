"use client";

import Link from "next/link";
import { useState, useRef, FormEvent } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      },
    );
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", Object.fromEntries(formData));
      setIsSubmitted(true);
    } catch {
      setError("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(59,141,214,0.1)",
          boxShadow:
            "0 8px 32px rgba(30,80,160,0.08), 0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-normal text-text-primary mb-4">
          Thank You!
        </h2>
        <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
          Your message has been sent successfully. We appreciate your interest
          and will get back to you as soon as possible.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-white px-8 py-3 rounded-full font-medium hover:bg-accent-hover transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const inputClasses =
    "w-full px-0 py-3 border-0 border-b border-border bg-transparent focus:border-accent focus:ring-0 outline-none transition-colors text-text-primary placeholder:text-text-tertiary";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 lg:p-10"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(59,141,214,0.1)",
        boxShadow:
          "0 8px 32px rgba(30,80,160,0.08), 0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <h2 className="font-serif heading-md font-normal text-text-primary mb-2">
        Let us hear from you
      </h2>
      <p className="text-text-secondary mb-8">
        Fill in the details below and we&apos;ll get back to you shortly.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className={inputClasses}
            placeholder="John"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className={inputClasses}
            placeholder="Doe"
          />
        </div>

        <div>
          <label
            htmlFor="organization"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Organization *
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            required
            className={inputClasses}
            placeholder="Acme Inc."
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className={inputClasses}
            placeholder="CTO"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={inputClasses}
            placeholder="john@acme.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={inputClasses}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="mb-8">
        <label
          htmlFor="message"
          className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={`${inputClasses} resize-none`}
          placeholder="Tell us about your project..."
        />
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
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
