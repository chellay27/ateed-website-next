import { Metadata } from "next";
import { getPrivacyPolicy } from "@/lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read Ateed Tech's privacy policy to understand how we collect, use, and protect your personal information.",
};

export const dynamic = "force-static";
export const revalidate = 3600;

// Rich text rendering options
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => `<strong>${text}</strong>`,
    [MARKS.ITALIC]: (text: any) => `<em>${text}</em>`,
    [MARKS.UNDERLINE]: (text: any) => `<u>${text}</u>`,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, next: any) => `<p class="mb-4 text-[#78716C]">${next(node.content)}</p>`,
    [BLOCKS.HEADING_1]: (node: any, next: any) => `<h1 class="font-serif text-3xl font-normal mb-4 mt-8 text-[#1C1917]">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: any, next: any) => `<h2 class="font-serif text-2xl font-normal mb-3 mt-6 text-[#1C1917]">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: any, next: any) => `<h3 class="font-serif text-xl font-normal mb-3 mt-4 text-[#1C1917]">${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: any, next: any) => `<h4 class="font-serif text-lg font-normal mb-2 mt-4 text-[#1C1917]">${next(node.content)}</h4>`,
    [BLOCKS.UL_LIST]: (node: any, next: any) => `<ul class="list-disc list-inside mb-4 space-y-1">${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: any, next: any) => `<ol class="list-decimal list-inside mb-4 space-y-1">${next(node.content)}</ol>`,
    [BLOCKS.LIST_ITEM]: (node: any, next: any) => `<li class="text-[#78716C]">${next(node.content)}</li>`,
    [BLOCKS.HR]: () => `<hr class="my-6 border-[#E7E5E4]" />`,
    [INLINES.HYPERLINK]: (node: any, next: any) => {
      const href = node.data.uri;
      return `<a href="${href}" class="text-[#C2410C] hover:text-[#9A3412] hover:underline">${next(node.content)}</a>`;
    },
  },
};

export default async function PrivacyPolicyPage() {
  const privacyData = await getPrivacyPolicy();
  const privacy = privacyData[0] as any;

  // Get content from Contentful or use default
  let contentHtml = "";
  if (privacy?.fields?.content?.nodeType === "document") {
    contentHtml = documentToHtmlString(privacy.fields.content, richTextOptions);
  } else if (typeof privacy?.fields?.content === "string") {
    contentHtml = privacy.fields.content;
  }

  return (
    <article className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif heading-xl font-normal text-text-primary mb-8">
            Privacy Policy
          </h1>

          {contentHtml ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary mb-4">
                At Ateed Tech, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>

              <h2 className="font-serif text-2xl font-normal mb-3 mt-6 text-text-primary">Information We Collect</h2>
              <p className="text-text-secondary mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1 text-text-secondary">
                <li>Personal Data: Name, email address, phone number, and other contact information you voluntarily provide when contacting us.</li>
                <li>Usage Data: Information about how you use our website, including pages visited and time spent.</li>
              </ul>

              <h2 className="font-serif text-2xl font-normal mb-3 mt-6 text-text-primary">How We Use Your Information</h2>
              <p className="text-text-secondary mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1 text-text-secondary">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-serif text-2xl font-normal mb-3 mt-6 text-text-primary">Contact Us</h2>
              <p className="text-text-secondary mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-text-secondary">
                <strong>Ateed Tech</strong><br />
                Boynton Beach, FL, USA<br />
                Email: sales@ateedtech.com<br />
                Phone: +1-561-462-8333
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
