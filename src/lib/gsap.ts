"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/dist/Flip";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

// Default ease for consistent animations
gsap.defaults({
  ease: "power2.out",
  duration: 0.8,
});

export { gsap, ScrollTrigger, Flip };
