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
import { fontFiles } from "../app/fonts.ts";

const fonts = await fontFiles();
for (const [name, screen] of Object.entries(SCREENS) as Array<[string, (k: number) => ReactNode]>) {
  const { image, diagnostics } = await renderImage(
    <Canvas width={1320} height={2868} title={`Tidewise, ${name}`}>
      {screen(3)}
    </Canvas>,
    { fonts },
  );
  await writeFile(`designs/screens/${name}.png`, image);
  const bad = diagnostics.filter((d: { severity: string }) => d.severity !== "info");
  console.log(`${bad.length ? "✗" : "✓"} designs/screens/${name}.png`);
  for (const d of bad) console.log(`    ${d.severity} ${d.code}: ${d.message}`);
}
