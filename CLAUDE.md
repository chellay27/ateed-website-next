# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principle: SEO & Discoverability First

**IMPORTANT: Every feature, component, and change must consider SEO and discoverability.**

Without visibility, even the best website is useless. Before implementing anything, ask:
- Does this improve or maintain our search ranking?
- Is this content accessible to Google, Bing, and AI crawlers (GPTBot, Claude)?
- Does this add meaningful structured data?
- Will this slow down page load (hurting Core Web Vitals)?

### SEO Checklist for Every Change
- [ ] Semantic HTML (proper heading hierarchy, landmarks)
- [ ] Meta tags updated if content changes
- [ ] Structured data (JSON-LD) for new content types
- [ ] Images have alt text and use next/image for optimization
- [ ] Internal linking where relevant
- [ ] Page loads fast (check Lighthouse score)
- [ ] Content is crawlable (no client-only rendering for important content)

### LLM Discoverability
- Keep `public/llms.txt` updated with current services and offerings
- Use clear, descriptive text that AI assistants can understand
- Structure content logically with proper headings

---

## Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Type checking
npm run lint
```

## Architecture Overview

This is a Next.js 14 website for Ateed Tech with:
- **Next.js App Router** for routing and layouts
- **GSAP** for premium animations (ScrollTrigger, SplitText)
- **Tailwind CSS** for styling
- **Contentful CMS** for dynamic content
- **TypeScript** for type safety

### Directory Structure

```
src/
├── app/                 # Pages and routes (App Router)
│   ├── layout.tsx       # Root layout with Navbar/Footer
│   ├── page.tsx         # Homepage
│   └── sitemap.ts       # Dynamic sitemap for SEO
├── components/
│   ├── animations/      # GSAP animation wrappers
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Page sections (Hero, Services, etc.)
│   └── ui/              # Reusable UI components
├── hooks/
│   └── useGSAP.ts       # Custom GSAP hooks for React
└── lib/
    ├── contentful.ts    # Contentful client and fetchers
    └── gsap.ts          # GSAP plugin registration
```

### Contentful Integration

Content is fetched server-side using `getStaticProps` pattern:
- Space ID: `750wikp5ao9z`
- Content types: `heroSection`, `ourMission`, `ourServices`, `caseStudies`, `industriesWeServe`, `comprehensiveTechnologyStack`, `blogPost`

### GSAP Usage

Always use the custom `useGSAP` hook for animations:
```tsx
import { useGSAP, gsap, ScrollTrigger } from "@/hooks/useGSAP";

// Animations are automatically cleaned up on unmount
useGSAP(() => {
  gsap.to(".element", { opacity: 1 });
}, []);
```

### Performance Requirements

Target Lighthouse scores:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

### SEO Files

- `public/robots.txt` - Crawler permissions (allows AI bots)
- `public/llms.txt` - AI assistant discoverability
- `src/app/sitemap.ts` - Dynamic sitemap generation
- Structured data in page components (JSON-LD)
