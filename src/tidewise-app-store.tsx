/**
 * Tidewise (a fictional tide-times app for swimmers, surfers and anyone who walks a beach at low water)
 * needs its App Store screenshots: 1320 by 2868, the iPhone size App Store Connect asks for first,
 * written as a PNG by @hyper-elements/react/image.
 *
 * A headline in Fraunces, fitted to three lines whatever its length, over the phone, which is drawn in
 * elements rather than pasted in: its screen is the app's Today view built from Rows, Columns and Svg
 * shapes. Behind it, the depth lines of a chart of the bay. One tide model gives the curve, the height
 * now, and the times of high and low water, so the numbers on the screen agree with each other.
 */
import { Canvas, Circle, Column, Heading, Layer, Line, Path, Polygon, Rect, Row, Svg, Text } from "@hyper-elements/react";
import type { ComponentProps, ReactNode } from "react";

export const meta = {
  title: "Tidewise App Store screenshot",
  description: "An App Store screenshot, 1320 by 2868: a fitted headline over a phone drawn in Svg, its screen a tide chart built from elements.",
  root: "Canvas",
};

export const DEEP = "#0C2A31";
export const SEA = "#1D6A73";
export const SHALLOW = "#9FCFC7";
export const FOAM = "#F4EFE6";
export const PAPER = "#FBF8F2";
export const INK = "#10262C";
export const MUTED = "#61777C";
export const RULE = "#E3DDD1";
export const BUOY = "#F0603A";
export const NIGHT = "#E9E5DC";
export const GRAPHITE = "#2B3438";
export const GLASS = "#05090B";

export const SERIF = "Fraunces, Georgia, serif";
export const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";

/** The size App Store Connect asks for first: iPhone 6.9", portrait. */
const WIDTH = 1320;
const HEIGHT = 2868;

// ---------------------------------------------------------------------------------------------
// The tide: a semidiurnal tide (two highs and two lows a day, 12 h 25 min apart) for Saltmere Bay.
// ---------------------------------------------------------------------------------------------

export type Tide = {
  /** The place, as the app's title shows it. */
  place: string;
  /** The day, as the app writes it. */
  day: string;
  /** Height of the mean sea level above chart datum, in metres. */
  mean: number;
  /** Half the tide's range, in metres. */
  amplitude: number;
  /** The hour of a high water that day (11.87 is 11:52). */
  high: number;
  /** The hour it is now, on the phone's clock. */
  now: number;
  /** Sunrise and sunset, in hours. */
  sun: [number, number];
};

const PERIOD = 12.42;

export const SALTMERE: Tide = { place: "Saltmere Bay", day: "Thursday 12 March", mean: 2.35, amplitude: 1.75, high: 11.87, now: 9.68, sun: [6.45, 18.2] };

export const heightAt = (t: Tide, hour: number) => t.mean + t.amplitude * Math.cos((2 * Math.PI * (hour - t.high)) / PERIOD);

/** Every high and low water between midnight and midnight, in order. */
export const turns = (t: Tide) => {
  const out: Array<{ kind: "High" | "Low"; hour: number; height: number }> = [];
  for (let n = -2; n <= 2; n++) {
    for (const [kind, hour] of [["High", t.high + n * PERIOD], ["Low", t.high + n * PERIOD + PERIOD / 2]] as const) {
      if (hour >= 0 && hour < 24) out.push({ kind, hour, height: heightAt(t, hour) });
    }
  }
  return out.sort((a, b) => a.hour - b.hour);
};

export const clock = (hour: number, step = 1) => {
  const m = Math.round((hour * 60) / step) * step;
  return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
export const metres = (h: number) => `${h.toFixed(1)} m`;
const WEEK = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

// ---------------------------------------------------------------------------------------------
// The app's Today view, drawn at any width: `k` pixels to the iPhone's point (440 pt wide).
// At k = 3 it's a real 1320 by 2868 screenshot; in the frame below it's drawn smaller.
// ---------------------------------------------------------------------------------------------

export function TodayScreen({ k, tide = SALTMERE, os = "ios" }: { k: number; tide?: Tide; os?: OS }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  const now = heightAt(tide, tide.now);
  const rising = heightAt(tide, tide.now + 0.1) > now;
  const day = turns(tide);
  const next = day.find((x) => x.hour > tide.now)!;
  // The swim window: the two and a half hours around the high water after now.
  const swim = day.find((x) => x.kind === "High" && x.hour > tide.now)!;

  // The chart, in points: 24 hours across, 0 to 5 m up.
  const CW = 358;
  const CH = 136;
  const x = (hour: number) => (hour / 24) * CW;
  const y = (h: number) => CH - (h / 5) * CH;
  const curve = Array.from({ length: 97 }, (_, i) => i / 4).map((hour) => `${x(hour).toFixed(1)},${y(heightAt(tide, hour)).toFixed(1)}`);

  const label = { fontSize: p(13), fontWeight: 600, letterSpacing: p(0.6), textTransform: "uppercase", color: MUTED } as const;

  return (
    <Column style={{ width: p(440), height: p(956), backgroundColor: PAPER, color: INK, fontFamily: SANS, justifyContent: "space-between" }}>
      <Column style={{ gap: p(18) }}>
        <StatusBar k={k} time={tide.now} os={os} />

        <Column style={{ padding: [0, p(22)], gap: p(16) }}>
          {/* Where and when. */}
          <Column style={{ gap: p(4) }}>
            <Row style={{ gap: p(8), alignItems: "center" }}>
              <Text style={{ flex: "none", fontFamily: SERIF, fontSize: p(34), fontWeight: 600, letterSpacing: p(-0.4), lineHeight: 1.1 }}>{tide.place}</Text>
              <Svg width={p(15)} height={p(15)} viewBox="0 0 16 16" style={{ flex: "none" }}>
                <Polygon points="1,7.5 15,1 8.5,15 7.2,8.8" style={{ fill: BUOY }} />
              </Svg>
            </Row>
            <Text style={{ fontSize: p(15), color: MUTED }}>{tide.day} · Springs</Text>
          </Column>

          {/* The height now. */}
          <Row style={{ alignItems: "end", gap: p(14) }}>
            <Text style={{ flex: "none", fontFamily: SERIF, fontSize: p(84), fontWeight: 500, lineHeight: 0.9, letterSpacing: p(-2) }}>{now.toFixed(1)}</Text>
            <Column style={{ width: p(230), gap: p(3), padding: [0, 0, p(6), 0] }}>
              <Text style={{ fontSize: p(20), fontWeight: 600 }}>metres, {rising ? "rising" : "falling"}</Text>
              <Text style={{ fontSize: p(15), color: MUTED }}>
                {next.kind} water at {clock(next.hour)}
              </Text>
            </Column>
          </Row>

          {/* The day's curve: night shaded, the water filled, now marked. */}
          <Column style={{ backgroundColor: "#FFFFFF", borderRadius: p(22), padding: [p(18), p(18), p(14)], gap: p(10), border: `${p(1)}px solid ${RULE}` }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ ...label, flex: "none" }}>Today</Text>
              <Text style={{ ...label, flex: "none", color: SEA }}>Range {metres(tide.amplitude * 2)}</Text>
            </Row>
            <Svg width={p(CW)} height={p(CH + 6)} viewBox={`0 -3 ${CW} ${CH + 6}`} title={`The tide at ${tide.place} today: high and low water, and the height now.`}>
              <Rect x={0} y={-3} width={x(tide.sun[0])} height={CH + 6} style={{ fill: NIGHT }} />
              <Rect x={x(tide.sun[1])} y={-3} width={CW - x(tide.sun[1])} height={CH + 6} style={{ fill: NIGHT }} />
              {[1, 2, 3, 4].map((m) => (
                <Line key={m} x1={0} y1={y(m)} x2={CW} y2={y(m)} style={{ stroke: RULE, strokeWidth: 0.8 }} />
              ))}
              <Polygon points={`0,${CH} ${curve.join(" ")} ${CW},${CH}`} style={{ fill: SHALLOW, opacity: 0.55 }} />
              <Path d={`M${curve.join(" L")}`} style={{ fill: "transparent", stroke: SEA, strokeWidth: 2.4 }} />
              {/* The swim window, along the bottom. */}
              <Rect x={x(swim.hour - 1.25)} y={CH - 4} width={x(2.5)} height={4} rx={2} style={{ fill: BUOY }} />
              <Line x1={x(tide.now)} y1={-3} x2={x(tide.now)} y2={CH} style={{ stroke: INK, strokeWidth: 1.2 }} />
              <Circle cx={x(tide.now)} cy={y(now)} r={6} style={{ fill: BUOY, stroke: "#FFFFFF", strokeWidth: 2.5 }} />
            </Svg>
            <Row style={{ justifyContent: "space-between" }}>
              {["00", "06", "12", "18", "24"].map((h) => (
                <Text key={h} style={{ flex: "none", fontSize: p(12), color: MUTED }}>{h}</Text>
              ))}
            </Row>
          </Column>

          {/* The day's turns. */}
          <Row style={{ gap: p(10) }}>
            {day.map((turn) => (
              <Column key={turn.hour} style={{ gap: p(3), padding: [p(12), p(12)], borderRadius: p(16), backgroundColor: turn === next ? INK : "#FFFFFF", color: turn === next ? PAPER : INK, border: `${p(1)}px solid ${turn === next ? INK : RULE}` }}>
                <Text style={{ fontSize: p(12), fontWeight: 600, letterSpacing: p(0.5), textTransform: "uppercase", color: turn === next ? SHALLOW : MUTED }}>{turn.kind}</Text>
                <Text style={{ fontSize: p(19), fontWeight: 600 }}>{clock(turn.hour)}</Text>
                <Text style={{ fontSize: p(13), color: turn === next ? SHALLOW : MUTED }}>{metres(turn.height)}</Text>
              </Column>
            ))}
          </Row>

          {/* The best of it. */}
          <Row style={{ gap: p(12), alignItems: "center", padding: [p(14), p(16)], borderRadius: p(16), backgroundColor: "#FDE6DD" }}>
            <Svg width={p(26)} height={p(26)} viewBox="0 0 26 26" style={{ flex: "none" }}>
              <Circle cx={13} cy={13} r={5.5} style={{ fill: BUOY }} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                const r = (a * Math.PI) / 180;
                return <Line key={a} x1={13 + Math.cos(r) * 8.5} y1={13 + Math.sin(r) * 8.5} x2={13 + Math.cos(r) * 11.5} y2={13 + Math.sin(r) * 11.5} style={{ stroke: BUOY, strokeWidth: 2 }} />;
              })}
            </Svg>
            <Column style={{ gap: p(2) }}>
              <Text style={{ fontSize: p(16), fontWeight: 600, color: "#7A2810" }}>
                Best swim {clock(swim.hour - 1.25, 5)} to {clock(swim.hour + 1.25, 5)}
              </Text>
              <Text style={{ fontSize: p(14), color: "#9A4A31" }}>Around high water, in daylight</Text>
            </Column>
          </Row>

          {/* The week: each day's range, springs to neaps, under its moon. */}
          <Column style={{ gap: p(10) }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ ...label, flex: "none" }}>This week</Text>
              <Text style={{ flex: "none", fontSize: p(13), color: MUTED }}>Springs, easing to neaps</Text>
            </Row>
            <Row style={{ justifyContent: "space-between" }}>
              {WEEK.map((d, i) => {
                const range = tide.amplitude * 2 * (1 - 0.42 * Math.sin((i / 7) * Math.PI * 0.5) ** 1.4);
                const bar = Math.round((range / (tide.amplitude * 2)) * 44);
                return (
                  <Column key={d} style={{ flex: "none", width: p(46), alignItems: "center", gap: p(6), padding: [p(8), 0], borderRadius: p(14), backgroundColor: i === 0 ? "#FFFFFF" : PAPER, border: `${p(1)}px solid ${i === 0 ? RULE : PAPER}` }}>
                    <Text style={{ fontSize: p(12), fontWeight: 600, color: i === 0 ? INK : MUTED, textAlign: "center" }}>{d}</Text>
                    <Svg width={p(16)} height={p(16)} viewBox="0 0 16 16">
                      <Circle cx={8} cy={8} r={7} style={{ fill: INK }} />
                      {/* Full at springs, waning to the last quarter at neaps: the lit left half, and the terminator as half an ellipse. */}
                      <Path d={`M8,1 A7,7 0 0,0 8,15 A${(7 * (1 - i / 7)).toFixed(2)},7 0 0,0 8,1 Z`} style={{ fill: SHALLOW }} />
                    </Svg>
                    <Svg width={p(10)} height={p(40)} viewBox="0 0 10 48">
                      <Rect x={0} y={0} width={10} height={48} rx={5} style={{ fill: NIGHT }} />
                      <Rect x={0} y={48 - bar} width={10} height={bar} rx={5} style={{ fill: i === 0 ? SEA : SHALLOW }} />
                    </Svg>
                    <Text style={{ fontSize: p(11), color: MUTED, textAlign: "center" }}>{range.toFixed(1)}</Text>
                  </Column>
                );
              })}
            </Row>
          </Column>
        </Column>
      </Column>

      <TabBar k={k} active={0} os={os} />
    </Column>
  );
}

export type OS = "ios" | "android";

/** The status bar: the time (or a carrier), room for the island or the camera, then signal, wifi and battery. */
export function StatusBar({ k, time, color = INK, label, os = "ios" }: { k: number; time: number; color?: string; label?: string; os?: OS }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  const text = label ?? clock(time).replace(/^0/, "");
  if (os === "android") {
    return (
      <Row style={{ padding: [p(14), p(26), 0, p(28)], height: p(44), alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ flex: "none", fontSize: p(15), fontWeight: 600, color }}>{text}</Text>
        <Svg width={p(62)} height={p(16)} viewBox="0 0 62 16" title="Wifi, full signal and a charged battery">
          <Path d="M1 5.2 A12.5 12.5 0 0 1 21 5.2 L11 15 Z" style={{ fill: color }} />
          <Polygon points="26,15 40,15 40,1" style={{ fill: color }} />
          <Rect x={49} y={1} width={9} height={14} rx={2} style={{ fill: color }} />
          <Rect x={51.5} y={0} width={4} height={2} rx={0.6} style={{ fill: color }} />
        </Svg>
      </Row>
    );
  }
  return (
    <Row style={{ padding: [p(19), p(34), 0, p(44)], height: p(54), alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ flex: "none", fontSize: p(17), fontWeight: 600, color }}>{text}</Text>
      <Svg width={p(78)} height={p(14)} viewBox="0 0 78 14" title="Full signal, wifi and a charged battery">
        <Rect x={0} y={9} width={3.2} height={4.5} rx={1} style={{ fill: color }} />
        <Rect x={5} y={6.5} width={3.2} height={7} rx={1} style={{ fill: color }} />
        <Rect x={10} y={4} width={3.2} height={9.5} rx={1} style={{ fill: color }} />
        <Rect x={15} y={1.5} width={3.2} height={12} rx={1} style={{ fill: color }} />
        <Path d="M24.5 4.6 A11 11 0 0 1 39.5 4.6 L37.9 6.3 A8.7 8.7 0 0 0 26.1 6.3 Z" style={{ fill: color }} />
        <Path d="M27.4 7.7 A7 7 0 0 1 36.6 7.7 L35 9.4 A4.7 4.7 0 0 0 29 9.4 Z" style={{ fill: color }} />
        <Path d="M30.3 10.8 A3 3 0 0 1 33.7 10.8 L32 12.6 Z" style={{ fill: color }} />
        <Rect x={47} y={1} width={26} height={12.5} rx={3.8} style={{ fill: "transparent", stroke: color, strokeWidth: 1.1, opacity: 0.45 }} />
        <Rect x={49} y={3} width={19} height={8.5} rx={2.2} style={{ fill: color }} />
        <Rect x={74.5} y={5} width={1.6} height={4.5} rx={0.8} style={{ fill: color, opacity: 0.45 }} />
      </Svg>
    </Row>
  );
}

/** The gesture handle at the foot of an Android screen. */
export function GestureHandle({ k, color = INK }: { k: number; color?: string }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  return (
    <Row style={{ justifyContent: "center", padding: [p(6), 0, p(10)] }}>
      <Svg width={p(108)} height={p(4)} viewBox="0 0 108 4" style={{ flex: "none" }}>
        <Rect x={0} y={0} width={108} height={4} rx={2} style={{ fill: color, opacity: 0.8 }} />
      </Svg>
    </Row>
  );
}

/** The tab bar, with one tab current: iOS's, or Android's navigation bar with its pill and the gesture handle. */
export function TabBar({ k, active, os = "ios" }: { k: number; active: number; os?: OS }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  const tabs = ["Today", "Beaches", "Alerts", "Tables"] as const;
  if (os === "android") {
    return (
      <Column style={{ backgroundColor: "#FFFFFF", border: { top: `${p(1)}px solid ${RULE}` } }}>
        <Row style={{ padding: [p(12), p(16), p(4)], justifyContent: "space-between" }}>
          {tabs.map((tab, i) => (
            <Column key={tab} style={{ flex: "none", alignItems: "center", gap: p(4), width: p(92) }}>
              <Column style={{ padding: [p(3), p(19)], borderRadius: p(16), backgroundColor: i === active ? "#D7ECE8" : "#FFFFFF" }}>
                <Svg width={p(26)} height={p(26)} viewBox="0 0 26 26">{TAB_ICONS[i](i === active ? SEA : "#7E8C8F")}</Svg>
              </Column>
              <Text style={{ fontSize: p(12), fontWeight: 600, color: i === active ? INK : "#6E7C7F", textAlign: "center" }}>{tab}</Text>
            </Column>
          ))}
        </Row>
        <GestureHandle k={k} />
      </Column>
    );
  }
  return (
    <Row style={{ padding: [p(10), p(30), p(30)], justifyContent: "space-between", border: { top: `${p(1)}px solid ${RULE}` }, backgroundColor: "#FFFFFF" }}>
      {tabs.map((tab, i) => (
        <Column key={tab} style={{ flex: "none", alignItems: "center", gap: p(4), width: p(76) }}>
          <Svg width={p(26)} height={p(26)} viewBox="0 0 26 26">{TAB_ICONS[i](i === active ? SEA : "#9AA8AB")}</Svg>
          <Text style={{ fontSize: p(11), fontWeight: 600, color: i === active ? SEA : "#8A989B", textAlign: "center" }}>{tab}</Text>
        </Column>
      ))}
    </Row>
  );
}

const TAB_ICONS: Array<(c: string) => ReactNode> = [
  (c) => <Path d="M2 15 C6 9 9 9 13 15 C17 21 20 21 24 15 L24 24 L2 24 Z" style={{ fill: c }} />,
  (c) => (
    <>
      <Path d="M13 2 C8 2 5 5.6 5 9.6 C5 15 13 24 13 24 C13 24 21 15 21 9.6 C21 5.6 18 2 13 2 Z" style={{ fill: "transparent", stroke: c, strokeWidth: 2.2 }} />
      <Circle cx={13} cy={10} r={3} style={{ fill: c }} />
    </>
  ),
  (c) => (
    <>
      <Path d="M6 18 L6 11 C6 6.5 9 4 13 4 C17 4 20 6.5 20 11 L20 18 L22 20.5 L4 20.5 Z" style={{ fill: "transparent", stroke: c, strokeWidth: 2.2 }} />
      <Path d="M10.5 22.5 C11 24 15 24 15.5 22.5" style={{ fill: "transparent", stroke: c, strokeWidth: 2.2 }} />
    </>
  ),
  (c) => (
    <>
      <Rect x={3} y={4} width={20} height={18} rx={3} style={{ fill: "transparent", stroke: c, strokeWidth: 2.2 }} />
      <Line x1={3} y1={10} x2={23} y2={10} style={{ stroke: c, strokeWidth: 2.2 }} />
      <Line x1={10} y1={10} x2={10} y2={22} style={{ stroke: c, strokeWidth: 2.2 }} />
    </>
  ),
];

// ---------------------------------------------------------------------------------------------
// The phone, drawn around whatever screen it's given.
// ---------------------------------------------------------------------------------------------

/** The screen's shape: a 6.9" iPhone's, 1320 by 2868. A screenshot of another phone is cropped a little to it. */
export const SCREEN_ASPECT = WIDTH / HEIGHT;

/**
 * An iPhone (rounded, with the Dynamic Island) or an Android phone (squarer, with a punch-hole camera),
 * `screenWidth` px across its screen. The screen is the first child of a Layer, so a screenshot given as an
 * Image fills it, cropped from the center; the island or the camera is drawn over it.
 */
export function Phone({ screenWidth, device = "iphone", children }: { screenWidth: number; device?: "iphone" | "android"; children: ReactNode }) {
  const u = screenWidth / 860;
  const screenHeight = Math.round(screenWidth / SCREEN_ASPECT);
  const iphone = device === "iphone";
  const [outer, inner, screen] = iphone ? [136, 129, 114].map((r) => r * u) : [92, 86, 70].map((r) => r * u);
  return (
    <Column style={{ width: screenWidth + 44 * u, backgroundColor: GRAPHITE, borderRadius: outer, padding: 7 * u }}>
      <Column style={{ width: screenWidth + 30 * u, backgroundColor: GLASS, borderRadius: inner, padding: 15 * u }}>
        <Layer style={{ width: screenWidth, height: screenHeight, borderRadius: screen, justifyItems: "center", alignItems: "start" }}>
          {children}
          <Column style={{ padding: [(iphone ? 22 : 30) * u, 0, 0, 0] }}>
            {iphone ? (
              <Svg width={254 * u} height={74 * u} viewBox="0 0 254 74" title="The Dynamic Island">
                <Rect x={0} y={0} width={254} height={74} rx={37} style={{ fill: GLASS }} />
              </Svg>
            ) : (
              <Svg width={44 * u} height={44 * u} viewBox="0 0 44 44" title="The front camera">
                <Circle cx={22} cy={22} r={22} style={{ fill: GLASS }} />
              </Svg>
            )}
          </Column>
        </Layer>
      </Column>
    </Column>
  );
}

// ---------------------------------------------------------------------------------------------
// The backdrop: depth contours, as on a chart of the bay, or nothing but the color.
// ---------------------------------------------------------------------------------------------

export type Backdrop = "deep" | "foam" | "sea";
export type Pattern = "contours" | "none";
export type Colors = { background: string; headline: string; subhead: string; lines: string };

/** Each backdrop's background, headline, subhead and contour colors. */
export const BACKDROPS: Record<Backdrop, Colors> = {
  deep: { background: DEEP, headline: FOAM, subhead: SHALLOW, lines: SHALLOW },
  foam: { background: FOAM, headline: INK, subhead: SEA, lines: SEA },
  sea: { background: SEA, headline: "#FFFFFF", subhead: "#D7EEEA", lines: "#FFFFFF" },
};

/** Contour lines across the lower part of the image, each a Path through two sine waves. */
export function Depths({ width, height, color }: { width: number; height: number; color: string }) {
  const u = width / WIDTH;
  const top = height * 0.43;
  const spacing = 118 * u;
  const lines = Math.ceil((height - top) / spacing) + 1;
  const contour = (i: number) => {
    const points = Array.from({ length: 23 }, (_, j) => {
      const x = j * 60;
      const y = 46 * Math.sin(x / 230 + i * 0.7) + 22 * Math.sin(x / 97 + i * 1.9);
      return `${(x * u).toFixed(1)},${(top + i * spacing + y * u).toFixed(1)}`;
    });
    return `M${points.join(" L")}`;
  };
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: lines }, (_, i) => (
        // Every fourth line is heavier, as index contours are on a chart; they fade toward the bottom.
        <Path key={i} d={contour(i)} style={{ fill: "transparent", stroke: color, strokeWidth: (i % 4 === 0 ? 3 : 1.6) * u, opacity: Math.max(0.06, 0.2 - i * 0.008) }} />
      ))}
    </Svg>
  );
}

// ---------------------------------------------------------------------------------------------
// The screenshot.
// ---------------------------------------------------------------------------------------------

/**
 * The sizes the stores ask for, and how the phone sits in each: its screen's width, the headline's sizes, the
 * width (measure) and height in px of the box above the phone for the words, and the margin below the phone. The phone is always the same distance from the bottom, so a listing's
 * screenshots line up side by side whatever their headlines.
 */
export const SIZES = {
  /** App Store Connect, iPhone 6.9" (required). */
  iphone69: { width: 1320, height: 2868, device: "iphone", screenWidth: 860, headline: [128, 116, 104, 96], maxLines: 3, subhead: 42, measure: 1100, words: 640, bottom: 150 },
  /** App Store Connect, iPhone 6.5". */
  iphone65: { width: 1284, height: 2778, device: "iphone", screenWidth: 836, headline: [124, 112, 100, 92], maxLines: 3, subhead: 41, measure: 1070, words: 600, bottom: 144 },
  /** Google Play, phone, 9:16. */
  play: { width: 1080, height: 1920, device: "android", screenWidth: 580, headline: [92, 84, 76, 68], maxLines: 2, subhead: 34, measure: 800, words: 440, bottom: 90 },
} as const;
export type Size = keyof typeof SIZES;

/** The fonts as the gallery gives them: one variable file a family. */
export const FONTS: ComponentProps<typeof Canvas>["fonts"] = [
  { family: "Fraunces", src: "https://fonts.gstatic.com/s/fraunces/v38/6NUu8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib14c7qv8oRcTn.woff2", format: "woff2", weight: "400 700" },
  { family: "Inter", src: "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2", format: "woff2", weight: "400 700" },
];

export type ScreenshotProps = {
  /** The headline: drawn as large as fits in the room above the phone, on three lines at most. */
  headline: string;
  /** A line or two under it. */
  subhead: string;
  /** What's on the phone's screen: an Image of a screenshot, or a screen drawn in elements. */
  screen: ReactNode;
  /** A preset: its background, words and lines. */
  backdrop?: Backdrop;
  /** Colors of your own, over the preset's. */
  colors?: Partial<Colors>;
  pattern?: Pattern;
  /** The headline's face: Fraunces, or Inter for a plainer listing. */
  headlineFont?: "serif" | "sans";
  size?: Size;
  /** The app's name, over the headline. */
  app?: string;
  fonts?: ComponentProps<typeof Canvas>["fonts"];
};

/** One screenshot. Call it as a function where the Canvas must be what's returned. */
export function Screenshot({ headline, subhead, screen, backdrop = "deep", colors, pattern = "contours", headlineFont = "serif", size = "iphone69", app = "Tidewise", fonts = FONTS }: ScreenshotProps) {
  const s = SIZES[size];
  // Your colors over the preset's: only those you give.
  const c = { ...BACKDROPS[backdrop], ...Object.fromEntries(Object.entries(colors ?? {}).filter(([, value]) => value)) };
  const u = s.width / WIDTH;
  const serif = headlineFont === "serif";
  return (
    <Canvas width={s.width} height={s.height} lang="en" title={`${app}: ${headline}`} fonts={fonts} style={{ backgroundColor: c.background, color: c.headline, fontFamily: SANS }}>
      <Layer style={{ width: s.width, height: s.height }}>
        {pattern === "contours" ? <Depths width={s.width} height={s.height} color={c.lines} /> : <Column style={{ width: s.width, height: s.height }} />}
        <Column style={{ width: s.width, height: s.height, padding: [0, 110 * u, s.bottom * u], alignItems: "center", justifyContent: "end" }}>
          {/* The words, centered in a box of their own: a longer headline is drawn smaller, never over the phone. */}
          <Column style={{ width: s.measure, height: s.words, gap: (size === "play" ? 26 : 38) * u, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 30 * u, fontWeight: 600, letterSpacing: 7 * u, textTransform: "uppercase", textAlign: "center", color: c.subhead }}>{app}</Text>
            <Heading level={1} field="headline" fit={{ sizes: [...s.headline], maxLines: s.maxLines }} style={{ fontFamily: serif ? SERIF : SANS, fontWeight: serif ? 500 : 600, lineHeight: serif ? 1.02 : 1.04, letterSpacing: (serif ? -2.5 : -3.5) * u, textAlign: "center", color: c.headline }}>
              {headline}
            </Heading>
            <Column style={{ width: 800 * u }}>
              <Text field="subhead" fit={{ sizes: [s.subhead, s.subhead - 4], maxLines: 2 }} style={{ lineHeight: 1.35, textAlign: "center", color: c.subhead }}>{subhead}</Text>
            </Column>
          </Column>
          <Column style={{ height: (size === "play" ? 56 : 88) * u }} />
          <Phone screenWidth={s.screenWidth} device={s.device}>{screen}</Phone>
        </Column>
      </Layer>
    </Canvas>
  );
}

export default function TidewiseAppStore() {
  // Called, not rendered as <Screenshot />, so the Canvas is what this returns: the gallery reads its fonts.
  return Screenshot({
    headline: "Know the tide before you leave.",
    subhead: "High and low water for 1,400 beaches, to the minute.",
    screen: <TodayScreen k={SIZES.iphone69.screenWidth / 440} />,
  });
}
