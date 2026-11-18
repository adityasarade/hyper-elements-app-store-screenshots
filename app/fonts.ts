import { readFile } from "node:fs/promises";

/** The app's fonts as files, for drawing its screens and its store screenshots. */
export const fontFiles = async () => [
  { family: "Fraunces", src: await readFile("fonts/Fraunces-500.ttf"), weight: 500 },
  { family: "Fraunces", src: await readFile("fonts/Fraunces-600.ttf"), weight: 600 },
  { family: "Inter", src: await readFile("fonts/Inter-400.ttf"), weight: 400 },
  { family: "Inter", src: await readFile("fonts/Inter-600.ttf"), weight: 600 },
];
