/**
 * Makes a values file for one screenshot from a brief and a capture, for one store:
 *
 *   npm run new -- plan brief.json capture.png          designs/plan.values.json, App Store sizes (6.9" and 6.5")
 *   npm run new -- plan brief.json android.png --play   designs/plan-android.values.json, Google Play's size
 *
 * It runs `hyper-elements design new` (the template checks the brief and the capture) and keeps only that store's
 * formats in the file.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const [name, brief, capture, flag] = process.argv.slice(2);
if (!name || !brief || !capture) throw new Error("usage: npm run new -- <name> <brief.json> <capture.png> [--play]");
const play = flag === "--play";
const out = `designs/${name}${play ? "-android" : ""}.values.json`;
execFileSync("npx", ["hyper-elements", "design", "new", "templates/app-store-screenshot.tsx", "-o", out, "--values", brief, "--set", `screenshot=@${capture}`], { stdio: "inherit" });
const file = JSON.parse(readFileSync(out, "utf8"));
file.formats = play ? ["play"] : ["iphone69", "iphone65"];
writeFileSync(out, JSON.stringify(file, null, 2) + "\n");
console.log(`${out}: ${file.formats.join(", ")}. Render it with: npm run render -- ${out}`);
