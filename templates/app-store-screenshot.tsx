/**
 * A store screenshot as a template: the layout, the phones and the fonts are locked; the words, the colors and
 * the app's own captures are open. One set of values gives every size the stores ask for: App Store Connect's
 * iPhone 6.9" and 6.5", and Google Play's phone. For Google Play, a values file gives the Android capture and
 * lists only the play format.
 *
 *   npx hyper-elements describe templates/app-store-screenshot.tsx
 *   npx hyper-elements design new templates/app-store-screenshot.tsx -o designs/my-screen.values.json \
 *     --values brief.json --set screenshot=@path/to/simulator-capture.png
 *   npx hyper-elements render designs/my-screen.values.json
 */
import { Image, prop } from "@hyper-elements/react";
import { field, template } from "@hyper-elements/react/template";
import { SIZES, Screenshot } from "../src/tidewise-app-store.tsx";

/** The fonts as files beside the template, so the command line draws the image with them. */
const FONTS = [
  { family: "Fraunces", src: "../fonts/Fraunces-500.ttf", weight: 500 },
  { family: "Fraunces", src: "../fonts/Fraunces-600.ttf", weight: 600 },
  { family: "Inter", src: "../fonts/Inter-400.ttf", weight: 400 },
  { family: "Inter", src: "../fonts/Inter-600.ttf", weight: 600 },
];

export default template({
  id: "store.Screenshot",
  version: "1.0.0",
  label: "Store screenshot",
  guidance:
    "One screenshot in an app's store listing. The headline is what the app does for the person, the subhead the proof, and the phone shows the screen that proves it. Sentence case, no exclamation marks, no prices or rankings (the stores refuse them). Make each screenshot of a listing with the same colors, pattern and font.",
  root: "Canvas",
  formats: {
    iphone69: { width: SIZES.iphone69.width, height: SIZES.iphone69.height },
    iphone65: { width: SIZES.iphone65.width, height: SIZES.iphone65.height },
    play: { width: SIZES.play.width, height: SIZES.play.height },
  },
  fields: {
    app: prop.text({ label: "App name", required: true, maxLength: 24 }),
    headline: prop.text({
      label: "Headline",
      required: true,
      maxLength: 48,
      guidance: "Five to eight words, ending with a full stop. It's drawn as large as fits above the phone, on three lines at most (two on Google Play); two lines read best.",
    }),
    subhead: prop.text({ label: "Subhead", required: true, maxLength: 72, guidance: "One concrete line of proof: a number, a place, a time." }),
    screenshot: field.image({
      label: "Screenshot",
      required: true,
      accepts: ["png", "jpeg"],
      aspect: { min: 0.44, max: 0.48 },
      minWidth: 1080,
      fit: "cover",
      maxCrop: 0.05,
      guidance: "A full-screen capture, status bar included: from an iPhone 16 Pro Max or 17 Pro Max simulator (1320 by 2868) for the iPhone sizes, and from an Android phone for Google Play (make a values file for it with only the play format). Another tall phone works, cropped by at most 5% a side.",
    }),
    backdrop: prop.choice(["deep", "foam", "sea"], {
      label: "Backdrop",
      default: "deep",
      guidance: "A preset: deep sea green, foam white or sea blue. Alternate them along the listing, so each screenshot reads as its own card.",
    }),
    colors: prop.object(
      {
        background: prop.color({ label: "Background" }),
        headline: prop.color({ label: "Headline" }),
        subhead: prop.color({ label: "App name and subhead" }),
        lines: prop.color({ label: "Contour lines" }),
      },
      { label: "Colors", guidance: "Your brand's colors, over the backdrop's. Keep the headline at a contrast of at least 4.5:1 with the background." },
    ),
    pattern: prop.choice(["contours", "none"], { label: "Pattern", default: "contours", guidance: "Contour lines under the phone, or the background color alone." }),
    headlineFont: prop.choice(["serif", "sans"], { label: "Headline font", default: "serif", guidance: "Fraunces, or Inter for a plainer listing." }),
  },
  // What only drawing the image decides has to hold: nothing past the Canvas, a font for every character,
  // and a headline and subhead that fit.
  rules: { require: { core: ["image/overflow", "image/glyph", "image/fit"] } },
  example: {
    app: "Tidewise",
    headline: "Know the tide before you leave.",
    subhead: "High and low water for 1,400 beaches, to the minute.",
    screenshot: { src: "../designs/screens/today.png", width: 1320, height: 2868 },
    backdrop: "deep",
  },
  render(v, { format }) {
    return Screenshot({
      app: v.app,
      headline: v.headline,
      subhead: v.subhead,
      backdrop: v.backdrop,
      colors: v.colors,
      pattern: v.pattern,
      headlineFont: v.headlineFont,
      size: format,
      fonts: FONTS,
      screen: <Image field="screenshot" src={v.screenshot} alt={`${v.app}: ${v.headline}`} />,
    });
  },
});
