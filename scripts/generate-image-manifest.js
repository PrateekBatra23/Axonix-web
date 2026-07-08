const fs = require("fs");
const path = require("path");

const CATEGORIES = ["hardware", "software", "research", "enterprise", "network", "general"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const techPhotosDir = path.join(process.cwd(), "public", "tech-photos");
const outputPath = path.join(process.cwd(), "src", "data", "imageManifest.json");

const manifest = {};

for (const category of CATEGORIES) {
  const categoryDir = path.join(techPhotosDir, category);

  if (!fs.existsSync(categoryDir)) {
    manifest[category] = [];
    continue;
  }

  const files = fs
    .readdirSync(categoryDir)
    .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .sort();

  manifest[category] = files;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

console.log("Image manifest generated:");
for (const [category, files] of Object.entries(manifest)) {
  console.log(`  ${category}: ${files.length} images`);
}