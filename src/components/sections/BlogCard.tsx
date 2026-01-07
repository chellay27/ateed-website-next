"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  slug: string;
  authorName: string;
  authorAvatar?: string;
  publishDate: string;
  featured?: boolean;
}

export function BlogCard({
  title,
  excerpt,
  imageUrl,
  slug,
  authorName,
  authorAvatar,
  publishDate,
  featured,
}: BlogCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {imageUrl && (
        <Link href={`/blog/${slug}`} className="relative h-52 block overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <span className="absolute top-3 right-3 bg-white/90 text-xs font-semibold uppercase px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </Link>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {authorAvatar && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 uppercase">
              {authorName}
            </span>
          </div>

          <time className="text-sm text-gray-500">
            {publishDate}
          </time>
        </div>
      </div>
    </article>
  );
}
