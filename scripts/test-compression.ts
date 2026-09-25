import sharp from "sharp";
import fs from "fs";
import path from "path";

async function testCompression() {
  const sampleImagePath = path.join(process.cwd(), "public", "images", "hero-lab.jpg");
  if (!fs.existsSync(sampleImagePath)) {
    console.log("Sample image not found:", sampleImagePath);
    return;
  }

  const rawBuffer = fs.readFileSync(sampleImagePath);
  const originalKb = Math.round(rawBuffer.length / 1024);

  // Compress using our pipeline
  const compressedBuffer = await sharp(rawBuffer)
    .rotate()
    .resize({
      width: 1600,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
      effort: 5,
    })
    .toBuffer();

  const compressedKb = Math.round(compressedBuffer.length / 1024);
  const metadata = await sharp(compressedBuffer).metadata();

  console.log("=== COMPRESSION BENCHMARK ===");
  console.log(`Original file size:   ${originalKb} KB`);
  console.log(`Compressed WebP size: ${compressedKb} KB`);
  console.log(`Reduction ratio:      ${Math.round((1 - compressedKb / originalKb) * 100)}% smaller!`);
  console.log(`Dimensions:           ${metadata.width}x${metadata.height} px`);
  console.log(`Format:               ${metadata.format}`);
  console.log("=============================");
}

testCompression().catch(console.error);
