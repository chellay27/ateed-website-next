"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!overlayRef.current || !linksRef.current) return;

    const links = linksRef.current.querySelectorAll("li");

    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Create entrance timeline
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      ).fromTo(
        links,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.1"
      );
    } else {
      document.body.style.overflow = "";

      if (tlRef.current) {
        tlRef.current.kill();
      }

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    return () => {
      document.body.style.overflow = "";
      tlRef.current?.kill();
    };
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-40 bg-bg-dark flex flex-col items-center justify-center transition-[visibility] ${
        isOpen ? "visible" : "invisible"
      }`}
      style={{ opacity: isOpen ? undefined : 0 }}
      aria-hidden={!isOpen}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-4 p-2 text-white"
        aria-label="Close menu"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <nav aria-label="Mobile navigation">
        <ul ref={linksRef} className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="font-serif text-3xl text-white hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
