import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Browse our services, blog, or contact us.",
};

export default function NotFound() {
  return (
    <section className="pt-36 md:pt-44 pb-20 md:pb-28 bg-bg-cream">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h1 className="font-serif heading-xl font-normal text-text-primary mb-6">
          Page Not Found
        </h1>
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg mx-auto mb-12">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has
          been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-hover transition-colors duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-primary rounded-full hover:border-accent hover:text-accent transition-colors duration-300"
          >
            Read Our Blog
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-primary rounded-full hover:border-accent hover:text-accent transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
