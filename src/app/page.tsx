import { getServices, getMission, getIndustries, getCaseStudies, getTechnologyStack, getHeroSection } from "@/lib/contentful";
import { Hero } from "@/components/sections/Hero";
import { Mission } from "@/components/sections/Mission";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { TechStack } from "@/components/sections/TechStack";
import { CaseStudies } from "@/components/sections/CaseStudies";

// Force static generation for optimal performance
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch all data in parallel for faster loading
  const [heroSection, mission, services, industries, caseStudies, techStack] = await Promise.all([
    getHeroSection("Home"),
    getMission("Home"),
    getServices(),
    getIndustries(),
    getCaseStudies(),
    getTechnologyStack(),
  ]);

  return (
    <>
      {/* Structured Data for SEO & LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Ateed Tech",
            url: "https://www.ateedtech.com",
            logo: "https://www.ateedtech.com/logo.png",
            description:
              "Custom software development company specializing in web applications, mobile apps, enterprise software, and AI solutions.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Boynton Beach",
              addressRegion: "FL",
              addressCountry: "US",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-561-462-8333",
              contactType: "sales",
            },
            sameAs: [
              "https://www.facebook.com/AteedTech/",
              "https://www.linkedin.com/company/ateedtech",
              "https://www.youtube.com/@AteedTech",
              "https://www.instagram.com/ateedtech/",
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Software Development Services",
              itemListElement: services.map((service: any, index: number) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: service.fields.title,
                  description: service.fields.cardText,
                },
                position: index + 1,
              })),
            },
          }),
        }}
      />

      <Hero data={heroSection[0]} />
      <Mission data={mission[0]} />
      <Services data={services} />
      <Industries data={industries} />
      <TechStack data={techStack} />
      <CaseStudies data={caseStudies} />
    </>
  );
}
