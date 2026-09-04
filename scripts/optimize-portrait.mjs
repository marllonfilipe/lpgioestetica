// Mechanical resizing only: preserve the full photo, aspect ratio and framing.
// Run with the sharp installation already supplied by the project's toolchain.
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = new URL("../public/images/gio/thassia-garcia-estetica.webp", import.meta.url);
for (const width of [640, 960, 1365]) {
  const target = new URL(`../public/images/gio/thassia-garcia-${width}-v1.webp`, import.meta.url);
  const info = await sharp(fileURLToPath(source))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(fileURLToPath(target));
  console.log(`${width}w: ${info.width}x${info.height}, ${info.size} bytes`);
}
