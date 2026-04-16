"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP, gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useGSAP(() => {
    if (!navRef.current) return;

    // Fade in on load
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );

    // Scroll-triggered background change — trigger earlier on mobile
    const isMd = window.matchMedia("(min-width: 768px)").matches;
    const threshold = isMd ? 64 : 10;

    ScrollTrigger.create({
      start: `top -${threshold}`,
      onUpdate: (self) => {
        if (!navRef.current) return;
        if (self.scroll() > threshold) {
          navRef.current.classList.add("nav-scrolled");
        } else {
          navRef.current.classList.remove("nav-scrolled");
        }
      },
    });
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-[background-color,border-color,backdrop-filter] duration-300 border-b border-transparent [&.nav-scrolled]:bg-bg-primary/90 [&.nav-scrolled]:backdrop-blur-md [&.nav-scrolled]:border-border"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-with-name.png"
                alt="Ateed Tech"
                width={140}
                height={28}
                className="h-6 lg:h-7 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-200 py-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 ${
                      isActive(link.href)
                        ? "text-text-primary after:w-full"
                        : "text-text-secondary hover:text-text-primary after:w-0 hover:after:w-full"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right side: CTA + Mobile toggle */}
            <div className="flex items-center gap-4">
              {/* Temporarily hidden — restore when Google PageSpeed access returns */}
              {/* <div className="hidden md:block">
                <Button
                  href="/free-audit"
                  variant="secondary"
                  className="text-xs px-5 py-2.5"
                >
                  Free Audit
                </Button>
              </div> */}
              <Button
                href="/contact"
                variant="primary"
                className="inline-flex text-xs px-5 py-2.5"
              >
                Contact Us
              </Button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-text-primary"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <svg
                  className="w-6 h-6 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ transform: mobileOpen ? "rotate(90deg)" : "none" }}
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
