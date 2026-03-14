// Pure functions for formatting audit results, generating suggestions, and calculating scores

export interface AuditRequest {
  url: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface AuditCategoryResult {
  name: string;
  score: number; // 0-100
  rating: "Excellent" | "Good" | "Needs Work" | "Poor";
  color: string; // tailwind color class
  suggestions: string[];
  metrics?: Record<string, string | number>;
}

export interface AuditResult {
  url: string;
  overallScore: number;
  categories: {
    performance: AuditCategoryResult;
    seo: AuditCategoryResult;
    accessibility: AuditCategoryResult;
    security: AuditCategoryResult;
  };
  timestamp: string;
}

export function getRating(score: number): { rating: AuditCategoryResult["rating"]; color: string } {
  if (score >= 90) return { rating: "Excellent", color: "#22c55e" };
  if (score >= 70) return { rating: "Good", color: "#3b8dd6" };
  if (score >= 50) return { rating: "Needs Work", color: "#f59e0b" };
  return { rating: "Poor", color: "#ef4444" };
}

export function formatPSIResults(
  psiData: any,
  securityHeaders: Record<string, boolean>
): AuditResult {
  const categories = psiData.lighthouseResult?.categories || {};
  const audits = psiData.lighthouseResult?.audits || {};

  const perfScore = Math.round((categories.performance?.score ?? 0) * 100);
  const seoScore = Math.round((categories.seo?.score ?? 0) * 100);
  const a11yScore = Math.round((categories.accessibility?.score ?? 0) * 100);
  const bpScore = Math.round((categories["best-practices"]?.score ?? 0) * 100);

  // Calculate security score from headers
  const securityScore = calculateSecurityScore(securityHeaders);

  // Blend best-practices and security for a combined security category
  const combinedSecurityScore = Math.round(bpScore * 0.4 + securityScore * 0.6);

  const perfRating = getRating(perfScore);
  const seoRating = getRating(seoScore);
  const a11yRating = getRating(a11yScore);
  const secRating = getRating(combinedSecurityScore);

  const overallScore = Math.round(
    (perfScore + seoScore + a11yScore + combinedSecurityScore) / 4
  );

  return {
    url: psiData.id || "",
    overallScore,
    categories: {
      performance: {
        name: "Performance & Speed",
        score: perfScore,
        ...perfRating,
        suggestions: getPerformanceSuggestions(audits, perfScore),
        metrics: {
          FCP: audits["first-contentful-paint"]?.displayValue || "N/A",
          LCP: audits["largest-contentful-paint"]?.displayValue || "N/A",
          TBT: audits["total-blocking-time"]?.displayValue || "N/A",
          CLS: audits["cumulative-layout-shift"]?.displayValue || "N/A",
          "Speed Index": audits["speed-index"]?.displayValue || "N/A",
        },
      },
      seo: {
        name: "SEO & Discoverability",
        score: seoScore,
        ...seoRating,
        suggestions: getSEOSuggestions(audits, seoScore),
        metrics: {
          "Meta Description": audits["meta-description"]?.score === 1 ? "Present" : "Missing",
          "Document Title": audits["document-title"]?.score === 1 ? "Present" : "Missing",
          "Mobile Friendly": audits["viewport"]?.score === 1 ? "Yes" : "No",
          "Crawlable": audits["is-crawlable"]?.score === 1 ? "Yes" : "No",
        },
      },
      accessibility: {
        name: "Design & UX",
        score: a11yScore,
        ...a11yRating,
        suggestions: getAccessibilitySuggestions(audits, a11yScore),
        metrics: {
          "Accessibility Score": `${a11yScore}/100`,
          Viewport: audits["viewport"]?.score === 1 ? "Configured" : "Missing",
          "Font Sizes": audits["font-size"]?.score === 1 ? "Readable" : "Too Small",
        },
      },
      security: {
        name: "Security & Best Practices",
        score: combinedSecurityScore,
        ...secRating,
        suggestions: getSecuritySuggestions(securityHeaders, audits, combinedSecurityScore),
        metrics: {
          HTTPS: securityHeaders.https ? "Enabled" : "Missing",
          HSTS: securityHeaders.hsts ? "Enabled" : "Missing",
          CSP: securityHeaders.csp ? "Present" : "Missing",
          "X-Frame-Options": securityHeaders.xFrameOptions ? "Present" : "Missing",
        },
      },
    },
    timestamp: new Date().toISOString(),
  };
}

function calculateSecurityScore(headers: Record<string, boolean>): number {
  let score = 0;
  const weights: Record<string, number> = {
    https: 30,
    hsts: 20,
    csp: 20,
    xFrameOptions: 10,
    xContentTypeOptions: 10,
    referrerPolicy: 10,
  };

  for (const [key, weight] of Object.entries(weights)) {
    if (headers[key]) score += weight;
  }

  return score;
}

export function checkSecurityHeaders(headers: Headers, url: string): Record<string, boolean> {
  return {
    https: url.startsWith("https://"),
    hsts: !!headers.get("strict-transport-security"),
    csp: !!headers.get("content-security-policy"),
    xFrameOptions: !!headers.get("x-frame-options"),
    xContentTypeOptions: !!headers.get("x-content-type-options"),
    referrerPolicy: !!headers.get("referrer-policy"),
  };
}

function getPerformanceSuggestions(audits: any, score: number): string[] {
  const suggestions: string[] = [];

  if (audits["largest-contentful-paint"]?.numericValue > 2500) {
    suggestions.push("Largest Contentful Paint is slow — optimize your hero images and above-the-fold content");
  }
  if (audits["total-blocking-time"]?.numericValue > 200) {
    suggestions.push("High Total Blocking Time — reduce JavaScript execution and break up long tasks");
  }
  if (audits["cumulative-layout-shift"]?.numericValue > 0.1) {
    suggestions.push("Layout shifts detected — set explicit dimensions on images and embeds");
  }
  if (audits["render-blocking-resources"]?.details?.items?.length > 0) {
    suggestions.push("Render-blocking resources found — defer non-critical CSS and JavaScript");
  }
  if (audits["uses-optimized-images"]?.details?.items?.length > 0) {
    suggestions.push("Images can be compressed further — use modern formats like WebP or AVIF");
  }

  if (suggestions.length === 0) {
    suggestions.push(score >= 90
      ? "Great performance! Your site loads quickly"
      : "Consider auditing your JavaScript bundles and image sizes"
    );
  }

  return suggestions.slice(0, 5);
}

function getSEOSuggestions(audits: any, score: number): string[] {
  const suggestions: string[] = [];

  if (audits["meta-description"]?.score !== 1) {
    suggestions.push("Add a unique meta description to improve click-through rates from search results");
  }
  if (audits["document-title"]?.score !== 1) {
    suggestions.push("Add a descriptive page title — this is the #1 on-page SEO factor");
  }
  if (audits["link-text"]?.score !== 1) {
    suggestions.push("Use descriptive link text instead of generic 'click here' or 'learn more'");
  }
  if (audits["is-crawlable"]?.score !== 1) {
    suggestions.push("Page is blocked from crawling — check your robots.txt and meta robots tags");
  }
  if (audits["hreflang"]?.score !== 1 && audits["hreflang"]?.score !== undefined) {
    suggestions.push("Add hreflang tags if you serve content in multiple languages");
  }
  if (audits["structured-data"]?.score !== 1 && audits["structured-data"] !== undefined) {
    suggestions.push("Add structured data (JSON-LD) to enhance search result appearance");
  }

  if (suggestions.length === 0) {
    suggestions.push(score >= 90
      ? "Excellent SEO fundamentals! Keep your content fresh and relevant"
      : "Review your on-page SEO factors for improvement opportunities"
    );
  }

  return suggestions.slice(0, 5);
}

function getAccessibilitySuggestions(audits: any, score: number): string[] {
  const suggestions: string[] = [];

  if (audits["color-contrast"]?.score !== 1) {
    suggestions.push("Some text has insufficient color contrast — aim for WCAG AA (4.5:1 ratio)");
  }
  if (audits["image-alt"]?.score !== 1) {
    suggestions.push("Add descriptive alt text to all images for screen reader users");
  }
  if (audits["heading-order"]?.score !== 1) {
    suggestions.push("Fix heading hierarchy — headings should follow a logical order (h1 → h2 → h3)");
  }
  if (audits["tap-targets"]?.score !== 1) {
    suggestions.push("Some tap targets are too small — ensure buttons and links are at least 48x48px");
  }
  if (audits["font-size"]?.score !== 1) {
    suggestions.push("Some text is too small to read comfortably on mobile devices");
  }

  if (suggestions.length === 0) {
    suggestions.push(score >= 90
      ? "Strong accessibility! Your site is usable by a wide audience"
      : "Run a manual accessibility audit to catch issues automated tools miss"
    );
  }

  return suggestions.slice(0, 5);
}

function getSecuritySuggestions(
  headers: Record<string, boolean>,
  audits: any,
  score: number
): string[] {
  const suggestions: string[] = [];

  if (!headers.https) {
    suggestions.push("Enable HTTPS — this is essential for security and SEO ranking");
  }
  if (!headers.hsts) {
    suggestions.push("Add Strict-Transport-Security header to enforce HTTPS connections");
  }
  if (!headers.csp) {
    suggestions.push("Implement Content-Security-Policy to prevent XSS and injection attacks");
  }
  if (!headers.xFrameOptions) {
    suggestions.push("Add X-Frame-Options header to prevent clickjacking attacks");
  }
  if (!headers.xContentTypeOptions) {
    suggestions.push("Add X-Content-Type-Options: nosniff to prevent MIME-type sniffing");
  }
  if (!headers.referrerPolicy) {
    suggestions.push("Set a Referrer-Policy header to control information leakage");
  }
  if (audits["is-on-https"]?.score !== 1) {
    suggestions.push("Some resources are loaded over insecure HTTP — migrate all assets to HTTPS");
  }

  if (suggestions.length === 0) {
    suggestions.push(score >= 90
      ? "Solid security posture! Keep headers and certificates up to date"
      : "Review your server security headers for hardening opportunities"
    );
  }

  return suggestions.slice(0, 5);
}
