import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

export const dynamic = "force-static";
export const revalidate = 3600;

// Generate static params for all blog posts
export async function generateStaticParams() {
  const response = await getBlogPosts();
  return response.items.map((post: any) => ({
    slug: encodeURIComponent(post.fields.title.trim().toLowerCase().replace(/\s+/g, "-")),
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const postData = post as any;
  const imageUrl = postData.fields.heroImage?.fields?.file?.url;
  const ogImage = imageUrl ? (imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl) : undefined;

  return {
    title: postData.fields.title,
    description: postData.fields.excerpt,
    openGraph: {
      title: postData.fields.title,
      description: postData.fields.excerpt,
      type: "article",
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Rich text rendering options
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: any) => `<em>${text}</em>`,
    [MARKS.UNDERLINE]: (text: any) => `<u>${text}</u>`,
    [MARKS.CODE]: (text: any) => `<code class="bg-gray-100 px-1 rounded">${text}</code>`,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, next: any) => `<p class="mb-6 text-gray-700 leading-relaxed">${next(node.content)}</p>`,
    [BLOCKS.HEADING_1]: (node: any, next: any) => `<h1 class="text-4xl font-bold mb-6 mt-8">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: any, next: any) => `<h2 class="text-3xl font-bold mb-4 mt-8">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: any, next: any) => `<h3 class="text-2xl font-bold mb-4 mt-6">${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: any, next: any) => `<h4 class="text-xl font-bold mb-3 mt-4">${next(node.content)}</h4>`,
    [BLOCKS.HEADING_5]: (node: any, next: any) => `<h5 class="text-lg font-bold mb-2 mt-4">${next(node.content)}</h5>`,
    [BLOCKS.HEADING_6]: (node: any, next: any) => `<h6 class="text-base font-bold mb-2 mt-4">${next(node.content)}</h6>`,
    [BLOCKS.UL_LIST]: (node: any, next: any) => `<ul class="list-disc list-inside mb-6 space-y-2">${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: any, next: any) => `<ol class="list-decimal list-inside mb-6 space-y-2">${next(node.content)}</ol>`,
    [BLOCKS.LIST_ITEM]: (node: any, next: any) => `<li class="text-gray-700">${next(node.content)}</li>`,
    [BLOCKS.QUOTE]: (node: any, next: any) =>
      `<blockquote class="border-l-4 border-blue-500 pl-6 py-2 my-6 italic text-gray-600">${next(node.content)}</blockquote>`,
    [BLOCKS.HR]: () => `<hr class="my-8 border-gray-200" />`,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { title, description, file } = node.data?.target?.fields || {};
      const imageUrl = file?.url;
      if (!imageUrl) return "";
      const fullUrl = imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl;
      return `
        <figure class="my-8">
          <img src="${fullUrl}" alt="${description || title || "Blog image"}" class="rounded-lg w-full" />
          ${description ? `<figcaption class="text-center text-sm text-gray-500 mt-2">${description}</figcaption>` : ""}
        </figure>
      `;
    },
    [INLINES.HYPERLINK]: (node: any, next: any) => {
      const href = node.data.uri;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${next(node.content)}</a>`;
    },
  },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const options: Intl.DateTimeFormatOptions =
    date.getFullYear() === currentYear
      ? { month: "long", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function getImageUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function getSlug(title: string) {
  return encodeURIComponent(title.trim().toLowerCase().replace(/\s+/g, "-"));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post: rawPost, includes } = await getBlogPostBySlug(slug);

  if (!rawPost) {
    notFound();
  }

  const post = rawPost as any;

  // Get author from includes
  const authorId = post.fields.author?.sys?.id;
  const author = authorId && includes?.Entry
    ? (includes.Entry as any[]).find((entry: any) => entry.sys.id === authorId)
    : null;

  const authorName = author?.fields?.name || "Anonymous";
  const authorTitle = author?.fields?.jobTitle || "Author";
  const authorAvatar = getImageUrl(author?.fields?.profilePicture?.fields?.file?.url);
  const linkedInLink = author?.fields?.linkedInLink;

  const heroImageUrl = getImageUrl(post.fields.heroImage?.fields?.file?.url);
  const publishDate = formatDate(post.fields.publishDate || post.sys.createdAt);

  // Render rich text content
  let contentHtml = "";
  if (post.fields.content?.nodeType === "document") {
    contentHtml = documentToHtmlString(post.fields.content, richTextOptions);
  } else if (typeof post.fields.content === "string") {
    contentHtml = post.fields.content;
  }

  // Get related posts
  const allPostsResponse = await getBlogPosts({ limit: 4 });
  const relatedPosts = allPostsResponse.items
    .filter((p: any) => p.sys.id !== post.sys.id)
    .slice(0, 3);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.fields.title,
            description: post.fields.excerpt,
            image: heroImageUrl,
            datePublished: post.fields.publishDate || post.sys.createdAt,
            dateModified: post.sys.updatedAt,
            author: {
              "@type": "Person",
              name: authorName,
            },
            publisher: {
              "@type": "Organization",
              name: "Ateed Tech",
              logo: {
                "@type": "ImageObject",
                url: "https://www.ateedtech.com/logo.png",
              },
            },
          }),
        }}
      />

      <article className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <header className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {post.fields.title}
            </h1>

            {post.fields.excerpt && (
              <p className="text-xl text-gray-600 mb-8">
                {post.fields.excerpt}
              </p>
            )}

            <time className="text-gray-500 block mb-6">{publishDate}</time>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-4">
              {authorAvatar && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  {linkedInLink ? (
                    <a
                      href={linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {authorName}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900">{authorName}</span>
                  )}
                  {linkedInLink && (
                    <a href={linkedInLink} target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-500">{authorTitle}</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-sm text-gray-500">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.ateedtech.com/blog/${slug}`)}&text=${encodeURIComponent(post.fields.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.ateedtech.com/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://www.ateedtech.com/blog/${slug}`)}&title=${encodeURIComponent(post.fields.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </header>

          {/* Hero Image */}
          {heroImageUrl && (
            <figure className="max-w-4xl mx-auto mb-12">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={heroImageUrl}
                  alt={post.fields.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {post.fields.heroImage?.fields?.description && (
                <figcaption className="text-center text-sm text-gray-500 mt-3">
                  {post.fields.heroImage.fields.description}
                </figcaption>
              )}
            </figure>
          )}

          {/* Content */}
          <div
            className="max-w-3xl mx-auto prose prose-lg"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="max-w-6xl mx-auto mt-16 pt-12 border-t">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost: any) => {
                  const relatedAuthorId = relatedPost.fields.author?.sys?.id;
                  const relatedAuthor = relatedAuthorId && allPostsResponse.includes?.Entry
                    ? (allPostsResponse.includes.Entry as any[]).find((entry: any) => entry.sys.id === relatedAuthorId)
                    : null;
                  const relatedAuthorName = relatedAuthor?.fields?.name || "Anonymous";
                  const relatedAuthorAvatar = getImageUrl(relatedAuthor?.fields?.profilePicture?.fields?.file?.url as string | undefined);
                  const relatedImageUrl = getImageUrl(relatedPost.fields.heroImage?.fields?.file?.url);
                  const relatedDate = formatDate(relatedPost.fields.publishDate || relatedPost.sys.createdAt);

                  return (
                    <article key={relatedPost.sys.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      {relatedImageUrl && (
                        <Link href={`/blog/${getSlug(relatedPost.fields.title)}`} className="relative h-48 block">
                          <Image
                            src={relatedImageUrl}
                            alt={relatedPost.fields.title}
                            fill
                            className="object-cover"
                          />
                        </Link>
                      )}
                      <div className="p-6">
                        <Link href={`/blog/${getSlug(relatedPost.fields.title)}`}>
                          <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                            {relatedPost.fields.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {relatedPost.fields.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {relatedAuthorAvatar && (
                              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Image
                                  src={relatedAuthorAvatar}
                                  alt={relatedAuthorName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="text-gray-700">{relatedAuthorName}</span>
                          </div>
                          <time className="text-gray-500">{relatedDate}</time>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
