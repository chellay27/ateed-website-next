/**
 * Google Gemini 2.5 Flash Image generation utility.
 * Adapted from proposalring-website/src/lib/gemini.ts
 */

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-image";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }>;
    };
  }>;
  error?: { message: string; code: number };
}

/**
 * Generate an image using Gemini 2.5 Flash with an optional reference image.
 * Returns the generated image as base64.
 */
export async function generateImage(
  prompt: string,
  referenceImageBase64?: string,
  referenceImageMimeType?: string
): Promise<{ base64: string; mimeType: string }> {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  const parts: Array<Record<string, unknown>> = [];

  // Add reference image if provided
  if (referenceImageBase64 && referenceImageMimeType) {
    parts.push({
      inlineData: {
        mimeType: referenceImageMimeType,
        data: referenceImageBase64,
      },
    });
  }

  parts.push({ text: prompt });

  const response = await fetch(`${API_URL}?key=${GOOGLE_AI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ["image", "text"],
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data: GeminiResponse = await response.json();

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.code} - ${data.error.message}`);
  }

  const responseParts = data.candidates?.[0]?.content?.parts;
  if (!responseParts) {
    throw new Error("No content in Gemini response");
  }

  const imagePart = responseParts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData) {
    throw new Error(
      "No image generated. Response: " +
        responseParts.map((p) => (p.text ? `text: "${p.text.slice(0, 100)}"` : "unknown")).join(", ")
    );
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

/**
 * Pre-built prompts for generating cohesive Ateed Tech website imagery.
 * All prompts target the warm, Anthropic-inspired aesthetic.
 */
export const ATEED_PROMPTS = {
  heroOrb: `Generate an abstract, soft-focus decorative element: a warm gradient orb or sphere with burnt orange (#C2410C), amber (#F59E0B), and cream (#F5F0EB) tones blending together. Ethereal, minimal, clean background. No text. High resolution, 1024x1024. The feel should be warm, premium, and sophisticated — like a premium tech company's hero section decoration.`,

  industryHealthcare: `Generate a minimal, warm-toned abstract illustration representing healthcare technology. Use warm cream (#F5F0EB) background with subtle burnt orange (#C2410C) and warm stone (#78716C) accents. Abstract geometric shapes suggesting innovation and care. No text, no people. Clean, sophisticated, editorial style. 1024x768.`,

  industryFinance: `Generate a minimal, warm-toned abstract illustration representing financial technology. Use warm cream (#F5F0EB) background with subtle burnt orange (#C2410C) and warm dark (#1C1917) accents. Abstract geometric patterns suggesting security and growth. No text, no people. Clean, sophisticated, editorial style. 1024x768.`,

  industryEducation: `Generate a minimal, warm-toned abstract illustration representing education technology. Use warm cream (#F5F0EB) background with subtle burnt orange (#C2410C) and amber (#F59E0B) accents. Abstract shapes suggesting learning and connection. No text, no people. Clean, sophisticated, editorial style. 1024x768.`,

  industryRealEstate: `Generate a minimal, warm-toned abstract illustration representing real estate technology. Use warm cream (#F5F0EB) background with subtle burnt orange (#C2410C) and warm stone (#292524) accents. Abstract architectural forms. No text, no people. Clean, sophisticated, editorial style. 1024x768.`,

  ctaBackground: `Generate an abstract dark background with warm tones: near-black (#1C1917) base with subtle, soft-focus burnt orange (#C2410C) and amber gradient orbs scattered across. Ethereal, atmospheric, minimal. No text. High resolution 1440x600. Premium, sophisticated tech company aesthetic.`,

  serviceDeco: `Generate a small, minimal decorative element: abstract geometric lines and dots in burnt orange (#C2410C) on transparent/white background. Think of a subtle tech pattern — circuit-like but organic and warm. No text. 512x512. Clean, editorial.`,
} as const;

export type AteedPromptKey = keyof typeof ATEED_PROMPTS;
