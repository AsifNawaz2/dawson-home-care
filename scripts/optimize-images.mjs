// Copies design/placeholder images into /public/images, re-encoded without visible quality loss.
// Usage: node scripts/optimize-images.mjs [sourceDir] [destDir]
// Filenames never change, so real photos can replace placeholders later with no code edits.
import { readdir, mkdir, stat, copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2] ?? "docs/design/images";
const dest = process.argv[3] ?? "public/images";
await mkdir(dest, { recursive: true });

for (const name of await readdir(src)) {
  const from = path.join(src, name);
  const to = path.join(dest, name);
  const ext = path.extname(name).toLowerCase();
  const before = (await stat(from)).size;
  if (ext === ".jpg" || ext === ".jpeg") {
    await sharp(from).rotate().jpeg({ quality: 86, mozjpeg: true, progressive: true }).toFile(to);
  } else if (ext === ".png") {
    await sharp(from).png({ compressionLevel: 9, effort: 10, palette: false }).toFile(to);
  } else {
    await copyFile(from, to);
  }
  let after = (await stat(to)).size;
  if (after >= before) {
    await copyFile(from, to); // never ship a bigger file
    after = before;
  }
  console.log(`${name}: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
}
