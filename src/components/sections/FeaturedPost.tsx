"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  slug: string;
  authorName: string;
  authorAvatar?: string;
  publishDate: string;
}

export function FeaturedPost({
  title,
  excerpt,
  imageUrl,
  slug,
  authorName,
  authorAvatar,
  publishDate,
}: FeaturedPostProps) {
  const cardRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <article
      ref={cardRef}
      className="bg-bg-primary rounded-2xl border border-border overflow-hidden hover:border-text-tertiary transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row-reverse">
        {/* Image */}
        {imageUrl && (
          <Link href={`/blog/${slug}`} className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </Link>
        )}

        {/* Content */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-bg-cream text-text-secondary text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
              Featured
            </span>

            <Link href={`/blog/${slug}`}>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-text-primary mb-4 hover:text-accent transition-colors">
                {title}
              </h2>
            </Link>

            <p className="text-text-secondary mb-6">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              {authorAvatar && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-text-primary uppercase">
                {authorName}
              </span>
            </div>

            <time className="text-sm text-text-tertiary">
              {publishDate}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}
