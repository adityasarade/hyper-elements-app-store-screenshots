/**
 * Draws the Tidewise app's screens at the iPhone 6.9" size, 1320 by 2868, as the simulator would capture
 * them: the raw screenshots a store screenshot is made from, into designs/screens/.
 *
 *   npm run screens
 */
import { writeFile } from "node:fs/promises";
import { Canvas } from "@hyper-elements/react";
import { renderImage } from "@hyper-elements/react/image";
import type { ReactNode } from "react";
import { SCREENS } from "../app/screens.tsx";
import type { OS } from "../src/tidewise-app-store.tsx";
import { fontFiles } from "../app/fonts.ts";

const fonts = await fontFiles();
// An iPhone 6.9" capture is 1320 by 2868 (440 points at 3x); an Android one here is 1080 wide at the same shape.
const DEVICES = [
  { os: "ios", suffix: "", width: 1320, k: 3 },
  { os: "android", suffix: "-android", width: 1080, k: 1080 / 440 },
] as const;
for (const [name, screen] of Object.entries(SCREENS) as Array<[string, (k: number, os: OS) => ReactNode]>) {
  for (const d of DEVICES) {
    const height = Math.round(956 * d.k);
    const { image, diagnostics } = await renderImage(
      <Canvas width={d.width} height={height} title={`${name} screen`}>
        {screen(d.k, d.os)}
      </Canvas>,
      { fonts },
    );
    const file = `designs/screens/${name}${d.suffix}.png`;
    await writeFile(file, image);
    const bad = diagnostics.filter((x: { severity: string }) => x.severity !== "info");
    console.log(`${bad.length ? "✗" : "✓"} ${file} (${d.width} × ${height})`);
    for (const x of bad) console.log(`    ${x.severity} ${x.code}: ${x.message}`);
  }
}
