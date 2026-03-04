import { createClient, Entry, EntrySkeletonType } from "contentful";

// Initialize Contentful client
const contentful = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// In-memory cache to avoid redundant Contentful API calls in dev mode.
// In production, Next.js static generation handles caching via revalidate.
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(contentType: string, options?: Record<string, unknown>): string {
  return `${contentType}:${JSON.stringify(options ?? {})}`;
}

// Type-safe fetch helpers
export async function getEntries<T extends EntrySkeletonType>(
  contentType: string,
  options?: {
    order?: string[];
    limit?: number;
    include?: number;
    [key: string]: unknown;
  }
) {
  const key = getCacheKey(contentType, options);
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now < cached.expiry) {
    return cached.data as Awaited<ReturnType<typeof contentful.getEntries<T>>>;
  }

  const response = await contentful.getEntries<T>({
    content_type: contentType,
    ...options,
  });

  cache.set(key, { data: response, expiry: now + CACHE_TTL_MS });
  return response;
}

// Specific content fetchers
export async function getHeroSection(page: string = "Home") {
  const response = await getEntries("heroSection", {
    "fields.page": page,
    order: ["sys.createdAt"],
    include: 2,
    limit: 1,
  });
  return response.items;
}

export async function getServices() {
  const response = await getEntries("ourServices", {
    order: ["sys.createdAt"],
    include: 2,
  });
  return response.items;
}

export async function getIndustries() {
  const response = await getEntries("industriesWeServe", {
    order: ["sys.createdAt"],
    include: 2,
  });
  return response.items;
}

export async function getCaseStudies() {
  const response = await getEntries("caseStudies", {
    order: ["sys.createdAt"],
    include: 2,
  });
  return response.items;
}

export async function getTechnologyStack() {
  const response = await getEntries("comprehensiveTechnologyStack", {
    order: ["sys.createdAt"],
  });
  return response.items;
}

export async function getMission(page: string = "Home") {
  const response = await getEntries("ourMission", {
    "fields.page": page,
    order: ["sys.createdAt"],
    limit: 1,
  });
  return response.items;
}

// Blog posts - using "blog" content type from old site
export async function getBlogPosts(options?: { featured?: boolean; limit?: number }) {
  const query: Record<string, unknown> = {
    order: ["-fields.publishDate", "-sys.createdAt"],
    include: 2,
  };

  if (options?.featured !== undefined) {
    query["fields.featured"] = options.featured;
  }
  if (options?.limit) {
    query.limit = options.limit;
  }

  const response = await getEntries("blog", query);
  return response;
}

export async function getBlogPostBySlug(slug: string) {
  // The slug is derived from the title in the old site
  const response = await getEntries("blog", {
    include: 2,
  });

  const decodedSlug = decodeURIComponent(slug);
  const post = response.items.find((item: Entry<EntrySkeletonType>) => {
    const title = (item.fields.title as string) || "";
    const itemSlug = title.trim().toLowerCase().replace(/\s+/g, "-");
    return itemSlug === decodedSlug;
  });

  return { post: post || null, includes: response.includes };
}

// Team members
export async function getTeamMembers() {
  const response = await getEntries("team", {
    order: ["fields.firstName"],
    include: 2,
  });
  return response.items;
}

// Core values
export async function getCoreValues() {
  const response = await getEntries("coreValues", {
    order: ["sys.createdAt"],
  });
  return response.items;
}

// Contact info
export async function getContactInfo() {
  const response = await getEntries("contact", {
    order: ["fields.contactLabel"],
  });
  return response.items;
}

// Privacy policy
export async function getPrivacyPolicy() {
  const response = await getEntries("privacyPolicy", {
    limit: 1,
  });
  return response.items;
}

// Footer content
export async function getFooterContent() {
  const response = await getEntries("footer", {
    limit: 1,
    include: 2,
  });
  return response.items;
}

export { contentful };
