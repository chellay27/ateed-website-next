/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ateed-website",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage ?? ""),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-2",
        },
      },
    };
  },

  async run() {
    const contentfulSpaceId = new sst.Secret("ContentfulSpaceId");
    const contentfulAccessToken = new sst.Secret("ContentfulAccessToken");
    const openaiApiKey = new sst.Secret("OpenAiApiKey");
    const resendApiKey = new sst.Secret("ResendApiKey");
    const googlePsiApiKey = new sst.Secret("GooglePsiApiKey");
    const googleSheetWebhookUrl = new sst.Secret("GoogleSheetWebhookUrl");
    const imageGenSecret = new sst.Secret("ImageGenSecret");
    const googleAiApiKey = new sst.Secret("GoogleAiApiKey");
    const auditNotificationEmail = new sst.Secret(
      "AuditNotificationEmail",
      "sales@ateedtech.com",
    );

    const isProd = $app.stage === "production";
    const isStaging = $app.stage === "staging";

    // Domain stays undefined until Route 53 is configured.
    // First deploy runs against the default CloudFront URL.
    const domain = isProd
      ? {
          name: "www.ateedtech.com",
          redirects: ["ateedtech.com"],
        }
      : undefined;

    const siteUrl = isProd
      ? "https://www.ateedtech.com"
      : isStaging
        ? "https://staging.ateedtech.com"
        : "http://localhost:3000";

    new sst.aws.Nextjs("AteedWeb", {
      domain,
      environment: {
        CONTENTFUL_SPACE_ID: contentfulSpaceId.value,
        CONTENTFUL_ACCESS_TOKEN: contentfulAccessToken.value,
        OPENAI_API_KEY_TEST: openaiApiKey.value,
        RESEND_API_KEY: resendApiKey.value,
        GOOGLE_PSI_API_KEY: googlePsiApiKey.value,
        GOOGLE_SHEET_WEBHOOK_URL: googleSheetWebhookUrl.value,
        IMAGE_GEN_SECRET: imageGenSecret.value,
        GOOGLE_AI_API_KEY: googleAiApiKey.value,
        AUDIT_NOTIFICATION_EMAIL: auditNotificationEmail.value,
        NEXT_PUBLIC_SITE_URL: siteUrl,
      },
    });
  },
});
