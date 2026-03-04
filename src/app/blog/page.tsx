import { Metadata } from "next";
import { getHeroSection, getBlogPosts } from "@/lib/contentful";
import { PageHero } from "@/components/sections/PageHero";
import { FeaturedPost } from "@/components/sections/FeaturedPost";
import { BlogCard } from "@/components/sections/BlogCard";
import { BlogGrid } from "@/components/sections/BlogGrid";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest insights, tutorials, and updates from Ateed Tech on software development, technology trends, and digital innovation.",
};

export const dynamic = "force-static";
export const revalidate = 3600;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const options: Intl.DateTimeFormatOptions =
    date.getFullYear() === currentYear
      ? { month: "long", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function getSlug(title: string) {
  return encodeURIComponent(title.trim().toLowerCase().replace(/\s+/g, "-"));
}

function getImageUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

export default async function BlogPage() {
  const [heroData, blogResponse] = await Promise.all([
    getHeroSection("Blog"),
    getBlogPosts(),
  ]);

  const hero = heroData[0] as any;
  const heroImageUrl = hero?.fields?.heroImage?.fields?.file?.url as string | undefined;
  const backgroundImage = heroImageUrl
    ? getImageUrl(heroImageUrl)
    : undefined;

  const posts = blogResponse.items;
  const includes = blogResponse.includes;

  // Find featured post
  const featuredPost = posts.find((post: any) => post.fields.featured) as any;
  const regularPosts = posts as any[];

  // Helper to get author from includes
  const getAuthor = (post: any): any => {
    const authorId = post.fields.author?.sys?.id;
    if (!authorId || !includes?.Entry) return null;
    return (includes.Entry as any[]).find((entry: any) => entry.sys.id === authorId);
  };

  return (
    <>
      <PageHero
        heading={hero?.fields?.heading || "Blog"}
        description={hero?.fields?.description || "Latest stories and insights from Ateed Tech"}
        backgroundImage={backgroundImage}
      />

      <section className="py-20 lg:py-28 bg-bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px w-8 bg-accent/50" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent">
                  Featured
                </span>
              </div>
              {(() => {
                const author = getAuthor(featuredPost);
                const authorName = author?.fields?.name || "Anonymous";
                const authorAvatar = getImageUrl(author?.fields?.profilePicture?.fields?.file?.url);
                const imageUrl = getImageUrl(featuredPost.fields.heroImage?.fields?.file?.url);
                const publishDate = formatDate(featuredPost.fields.publishDate || featuredPost.sys.createdAt);

                return (
                  <FeaturedPost
                    title={featuredPost.fields.title}
                    excerpt={featuredPost.fields.excerpt || ""}
                    imageUrl={imageUrl}
                    slug={getSlug(featuredPost.fields.title)}
                    authorName={authorName}
                    authorAvatar={authorAvatar}
                    publishDate={publishDate}
                  />
                );
              })()}
            </div>
          )}

          {/* Latest Stories */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-accent/50" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-accent">
                All Posts
              </span>
            </div>
            <h2 className="font-serif heading-md font-normal text-text-primary mb-8">
              Latest Stories
            </h2>

            <BlogGrid>
              {regularPosts.map((post: any) => {
                const author = getAuthor(post);
                const authorName = author?.fields?.name || "Anonymous";
                const authorAvatar = getImageUrl(author?.fields?.profilePicture?.fields?.file?.url);
                const imageUrl = getImageUrl(post.fields.heroImage?.fields?.file?.url);
                const publishDate = formatDate(post.fields.publishDate || post.sys.createdAt);

                return (
                  <BlogCard
                    key={post.sys.id}
                    title={post.fields.title}
                    excerpt={post.fields.excerpt || ""}
                    imageUrl={imageUrl}
                    slug={getSlug(post.fields.title)}
                    authorName={authorName}
                    authorAvatar={authorAvatar}
                    publishDate={publishDate}
                    featured={post.fields.featured}
                  />
                );
              })}
            </BlogGrid>

            {posts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-tertiary text-lg">No blog posts found. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
