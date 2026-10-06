import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "public/images";
const OUTPUT = "public/images-thumb";
const WIDTH = 900;
const QUALITY = 72;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const files = walk(SOURCE).filter((file) => /\.webp$/i.test(file));

let originalBytes = 0;
let thumbBytes = 0;
let made = 0;
const sizes = [];

for (const file of files) {
  const relative = path.relative(SOURCE, file);
  const output = path.join(OUTPUT, relative);

  fs.mkdirSync(path.dirname(output), { recursive: true });

  const originalSize = fs.statSync(file).size;

  originalBytes += originalSize;
  sizes.push({ file: relative, kb: Math.round(originalSize / 1024) });

  const upToDate =
    fs.existsSync(output) &&
    fs.statSync(output).mtimeMs >= fs.statSync(file).mtimeMs;

  if (!upToDate) {
    await sharp(file)
      .rotate()
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(output);

    made += 1;
  }

  thumbBytes += fs.statSync(output).size;
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

console.log(`Photos found: ${files.length}`);
console.log(`New thumbnails made: ${made}`);
console.log(`Originals total: ${mb(originalBytes)} MB`);
console.log(`Thumbnails total: ${mb(thumbBytes)} MB`);
console.log("Five biggest originals:");

sizes
  .sort((a, b) => b.kb - a.kb)
  .slice(0, 5)
  .forEach((item) => console.log(`  ${item.file}: ${item.kb} KB`));