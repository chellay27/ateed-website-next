import { NextRequest, NextResponse } from "next/server";
import { generateImage, ATEED_PROMPTS, type AteedPromptKey } from "@/lib/imagen";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ADMIN_SECRET = process.env.IMAGE_GEN_SECRET || "ateed-imagen-2024";

export async function POST(request: NextRequest) {
  // Simple secret-based auth
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      prompt,
      presetKey,
      referenceImage,
      mimeType,
      saveAs,
    }: {
      prompt?: string;
      presetKey?: AteedPromptKey;
      referenceImage?: string;
      mimeType?: string;
      saveAs?: string;
    } = body;

    // Use preset prompt or custom prompt
    const finalPrompt = presetKey ? ATEED_PROMPTS[presetKey] : prompt;
    if (!finalPrompt) {
      return NextResponse.json(
        { error: "Either 'prompt' or 'presetKey' is required" },
        { status: 400 }
      );
    }

    const result = await generateImage(finalPrompt, referenceImage, mimeType);

    // Optionally save to public/generated/
    if (saveAs) {
      const generatedDir = path.join(process.cwd(), "public", "generated");
      await mkdir(generatedDir, { recursive: true });

      const ext = result.mimeType.includes("png") ? "png" : "webp";
      const filename = `${saveAs}.${ext}`;
      const filepath = path.join(generatedDir, filename);

      await writeFile(filepath, Buffer.from(result.base64, "base64"));

      return NextResponse.json({
        success: true,
        savedTo: `/generated/${filename}`,
        mimeType: result.mimeType,
      });
    }

    return NextResponse.json({
      success: true,
      imageBase64: result.base64,
      mimeType: result.mimeType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Image generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
