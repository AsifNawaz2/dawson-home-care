// Builds the Home intro assets from the owner's logo animation (needs ffmpeg on the PATH).
// Usage: node scripts/intro-video.mjs [source.mp4]
//   public/videos/intro-animation.mp4  web version: H.264 High, no audio, faststart, CRF 26 (SSIM ≥ 0.998)
//   public/images/intro-end-frame.jpg  the last frame: poster under the video + reduced-motion still
//   public/images/intro-logo.png       the last frame's logo cut out of the white (1837×1002, placed
//                                      at 42,39 in the 1920×1080 frame) — the one that flies into
//                                      the header (components/home/HomeIntro.tsx)
// Filenames never change, so a newer animation only needs this script re-run.
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2] ?? "docs/new_intro_logo_animation.mp4";
const video = "public/videos/intro-animation.mp4";
const endFrame = "public/images/intro-end-frame.jpg";
const flyLogo = "public/images/intro-logo.png";
// Where the logo sits in the last frame; HomeIntro.tsx uses the same numbers.
const LOGO = { left: 42, top: 39, width: 1837, height: 1002 };

const ffmpeg = (...args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);
const kb = async (f) => `${Math.round((await stat(f)).size / 1024)} KB`;

ffmpeg(
  ...["-i", src, "-an", "-map_metadata", "-1", "-c:v", "libx264", "-preset", "veryslow"],
  ...["-tune", "animation", "-crf", "26", "-profile:v", "high", "-pix_fmt", "yuv420p"],
  ...["-movflags", "+faststart", video],
);
console.log(`${video}: ${await kb(src)} -> ${await kb(video)}`);

// The last frame, from the source (not the re-encode) so the still is as sharp as possible.
const tmp = await mkdtemp(path.join(tmpdir(), "intro-"));
const last = path.join(tmp, "last.png");
ffmpeg("-sseof", "-1", "-i", src, "-update", "1", last); // overwritten by each frame: keeps the last
const frame = sharp(last).removeAlpha();
const { width, height } = await frame.metadata();
if (width !== 1920 || height !== 1080)
  throw new Error(`Expected 1920×1080, got ${width}×${height}`);

await frame.clone().jpeg({ quality: 86, mozjpeg: true, progressive: true }).toFile(endFrame);
console.log(`${endFrame}: ${await kb(endFrame)}`);

// Un-composite from white: the least alpha that gives the same pixel on a white page, so the
// flying logo matches the video frame exactly. Near-white compression noise becomes transparent.
const rgb = await frame.clone().extract(LOGO).raw().toBuffer();
const rgba = Buffer.alloc(LOGO.width * LOGO.height * 4);
for (let i = 0, o = 0; i < rgb.length; i += 3, o += 4) {
  const min = Math.min(rgb[i], rgb[i + 1], rgb[i + 2]);
  const a = min >= 248 ? 0 : (255 - min) / 255;
  if (a === 0) continue;
  for (let c = 0; c < 3; c++) rgba[o + c] = Math.round((rgb[i + c] - 255 * (1 - a)) / a);
  rgba[o + 3] = Math.round(a * 255);
}
await sharp(rgba, { raw: { width: LOGO.width, height: LOGO.height, channels: 4 } })
  .png({ compressionLevel: 9, effort: 10, palette: false })
  .toFile(flyLogo);
console.log(`${flyLogo}: ${await kb(flyLogo)}`);
await rm(tmp, { recursive: true });
