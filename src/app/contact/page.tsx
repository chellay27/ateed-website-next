import { Metadata } from "next";
import { getHeroSection, getContactInfo } from "@/lib/contentful";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Ateed Tech. We'd love to hear about your project and discuss how we can help bring your vision to life.",
};

export const dynamic = "force-static";
export const revalidate = 3600;

function getImageUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

export default async function ContactPage() {
  const [heroData, contactInfo] = await Promise.all([
    getHeroSection("Contact"),
    getContactInfo(),
  ]);

  const hero = heroData[0] as any;
  const heroImageUrl = hero?.fields?.heroImage?.fields?.file?.url as string | undefined;
  const backgroundImage = heroImageUrl ? getImageUrl(heroImageUrl) : undefined;

  return (
    <>
      <PageHero
        heading={hero?.fields?.heading || "Contact Us"}
        description={hero?.fields?.description || "We'd love to hear from you"}
        backgroundImage={backgroundImage}
      />

      {/* Contact Info Section */}
      {contactInfo && contactInfo.length > 0 && (
        <section className="py-12 bg-bg-primary border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
              {contactInfo.map((contact: any, index: number) => (
                <div key={contact.sys.id} className="text-center">
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase mb-2">
                    {contact.fields.contactLabel}
                  </h3>
                  <p className="text-xl font-medium text-text-primary">
                    {contact.fields.contactValue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12 bg-bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-xl font-normal text-text-primary mb-6">Connect with us</h2>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.facebook.com/AteedTech/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-bg-cream rounded-full flex items-center justify-center hover:bg-border transition-colors"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/ateedtech"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-bg-cream rounded-full flex items-center justify-center hover:bg-border transition-colors"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@AteedTech"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-bg-cream rounded-full flex items-center justify-center hover:bg-border transition-colors"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/ateedtech/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-bg-cream rounded-full flex items-center justify-center hover:bg-border transition-colors"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
