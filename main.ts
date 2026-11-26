// Entry point for the news-image-20261126b entry.
//
// Copies the front page image (entry.png, next to this file) to the
// output directory and checks it really is an image first. Standard
// library only, no network, deterministic output.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const here = resolve(import.meta.dirname);
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

if (!existsSync(src)) {
  console.error("entry.png not found next to main.ts: " + src);
  process.exit(1);
}

const head = readFileSync(src).subarray(0, 8);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e &&
  head[3] === 0x47 && head[4] === 0x0d && head[5] === 0x0a &&
  head[6] === 0x1a && head[7] === 0x0a;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
const kind = isPng ? "PNG" : isJpeg ? "JPEG" : "unknown";
if (!isPng && !isJpeg) {
  console.error("entry.png is not a PNG or JPEG image");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
const bytes = statSync(dst).size;
console.log("wrote " + dst + " (" + kind + ", " + bytes + " bytes)");
