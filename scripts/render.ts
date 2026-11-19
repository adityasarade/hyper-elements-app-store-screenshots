/**
 * Renders store screenshots with the Hyper Elements command line, then rewrites each PNG without its alpha
 * channel: App Store Connect and Google Play take screenshots with no transparency (RGB, not RGBA).
 *
 *   npm run render                                   every values file in designs/
 *   npm run render -- designs/plan.values.json       one
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const started = Date.now();
execFileSync("npx", ["hyper-elements", "render", ...(args.length ? args : ["designs"]), "--out", "out"], { stdio: "inherit" });

const dir = join("out", "designs");
for (const name of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
  const file = join(dir, name);
  if (statSync(file).mtimeMs < started) continue;
  const png = PNG.sync.read(readFileSync(file));
  // Every pixel the template draws is opaque; dropping the channel loses nothing.
  writeFileSync(file, PNG.sync.write(png, { colorType: 2, inputHasAlpha: true }));
  console.log(`  ${file}: ${png.width} × ${png.height}, RGB`);
}
