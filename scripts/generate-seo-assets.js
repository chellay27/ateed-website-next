const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const LOGO_PATH = path.join(__dirname, "..", "public", "logo.png");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const APP_DIR = path.join(__dirname, "..", "src", "app");

async function generateAssets() {
  const meta = await sharp(LOGO_PATH).metadata();
  console.log(`Source logo: ${meta.width}x${meta.height}`);

  // 1. OG Image (1200x630) — logo on brand blue gradient with text
  console.log("Generating OG image...");
  const ogW = 1200;
  const ogH = 630;
  const logoSize = 180;

  const bgSvg = `<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1E50A0" />
        <stop offset="50%" style="stop-color:#3B8DD6" />
        <stop offset="100%" style="stop-color:#60A5FA" />
      </linearGradient>
    </defs>
    <rect width="${ogW}" height="${ogH}" fill="url(#bg)" />
    <text x="${ogW / 2}" y="${ogH / 2 + 70}" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="600" fill="white" text-anchor="middle" letter-spacing="3">Ateed Tech</text>
    <text x="${ogW / 2}" y="${ogH / 2 + 120}" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="rgba(255,255,255,0.75)" text-anchor="middle">Custom Software Development</text>
  </svg>`;

  const logoBuf = await sharp(LOGO_PATH)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(Buffer.from(bgSvg))
    .composite([
      {
        input: logoBuf,
        top: Math.round(ogH / 2 - logoSize / 2 - 55),
        left: Math.round(ogW / 2 - logoSize / 2),
      },
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, "og-image.png"));
  console.log("  ok public/og-image.png");

  // 2. Favicon ICO (32x32 PNG wrapped in ICO container)
  console.log("Generating favicon...");
  const favicon32 = await sharp(LOGO_PATH)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // ICO format: header (6 bytes) + entry (16 bytes) + PNG data
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: ICO
  icoHeader.writeUInt16LE(1, 4); // Image count

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0);                       // Width
  icoEntry.writeUInt8(32, 1);                       // Height
  icoEntry.writeUInt8(0, 2);                        // Color palette
  icoEntry.writeUInt8(0, 3);                        // Reserved
  icoEntry.writeUInt16LE(1, 4);                     // Color planes
  icoEntry.writeUInt16LE(32, 6);                    // Bits per pixel
  icoEntry.writeUInt32LE(favicon32.length, 8);      // PNG data size
  icoEntry.writeUInt32LE(22, 12);                   // Offset (6 + 16)

  fs.writeFileSync(
    path.join(APP_DIR, "favicon.ico"),
    Buffer.concat([icoHeader, icoEntry, favicon32])
  );
  console.log("  ok src/app/favicon.ico");

  // 3. App icon (192x192) — transparent background
  await sharp(LOGO_PATH)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(APP_DIR, "icon.png"));
  console.log("  ok src/app/icon.png");

  // 4. Apple touch icon (180x180) — white background
  await sharp(LOGO_PATH)
    .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(path.join(APP_DIR, "apple-icon.png"));
  console.log("  ok src/app/apple-icon.png");

  // 5. Manifest icon 192x192
  await sharp(LOGO_PATH)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-192.png"));
  console.log("  ok public/icon-192.png");

  // 6. Manifest icon 512x512
  await sharp(LOGO_PATH)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-512.png"));
  console.log("  ok public/icon-512.png");

  console.log("\nAll SEO assets generated.");
}

generateAssets().catch(console.error);
