/**
 * The Tidewise app's screens, drawn in elements at any size: `k` pixels to the iPhone's point (440 wide).
 * scripts/screens.tsx draws them at k = 3, the size of a real 6.9" screenshot. They stand in for what a
 * developer would capture from the simulator; the store screenshot template takes either.
 */
import { Circle, Column, Layer, Line, Path, Polygon, Rect, Row, Svg, Text } from "@hyper-elements/react";
import type { ReactNode } from "react";
import {
  BUOY, DEEP, INK, MUTED, PAPER, RULE, SANS, SEA, SERIF, SHALLOW,
  StatusBar, TabBar, TodayScreen, clock, heightAt, type Tide,
} from "../src/tidewise-app-store.tsx";

const NOW = 9.68;

/** A beach nearby, its tide, and what the tide means for it now. */
type Beach = { name: string; km: number; tide: Tide; status: string; tone: "good" | "wait" | "pools"; note: string };

const tide = (high: number, amplitude: number): Tide => ({ place: "", day: "", mean: 2.35, amplitude, high, now: NOW, sun: [6.45, 18.2] });

const BEACHES: Beach[] = [
  { name: "Saltmere Bay", km: 1.2, tide: tide(11.87, 1.75), status: "Good now", tone: "good", note: "Sandy at every tide · lifeguards from 10:00" },
  { name: "Gullhaven Cove", km: 4.8, tide: tide(12.3, 1.9), status: "Good now", tone: "good", note: "Sheltered from the west wind" },
  { name: "Pellow Strand", km: 14.3, tide: tide(12.6, 1.8), status: "Good now", tone: "good", note: "Calm inside the bar until 14:00" },
  { name: "Lanterne Sands", km: 11.0, tide: tide(13.1, 1.6), status: "From 11:20", tone: "wait", note: "Shallow and long at low water: wait for the flood" },
  { name: "Wickmoor Sands", km: 12.6, tide: tide(13.4, 1.7), status: "From 11:45", tone: "wait", note: "Soft mud near the low-water mark" },
  { name: "Rook Point", km: 7.5, tide: tide(12.05, 2.1), status: "Pools at 17:40", tone: "pools", note: "Rock pools open two hours around low water" },
];

const TONES = {
  good: { fill: "#DDEFEA", text: "#155A52" },
  wait: { fill: "#F1ECE2", text: "#6B5B3E" },
  pools: { fill: "#FDE6DD", text: "#8A3418" },
};

export function BeachesScreen({ k }: { k: number }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  // Each beach's next 12 hours, as a line, with now at its left.
  const SW = 88;
  const SH = 34;
  const spark = (t: Tide) =>
    `M${Array.from({ length: 49 }, (_, i) => {
      const hour = NOW + i / 4;
      return `${(4 + (i / 48) * (SW - 4)).toFixed(1)},${(SH - 3 - ((heightAt(t, hour) - 0.3) / 4.6) * (SH - 6)).toFixed(1)}`;
    }).join(" L")}`;

  return (
    <Column style={{ width: p(440), height: p(956), backgroundColor: PAPER, color: INK, fontFamily: SANS, justifyContent: "space-between" }}>
      <Column style={{ gap: p(16) }}>
        <StatusBar k={k} time={NOW} />
        <Column style={{ padding: [0, p(22)], gap: p(16) }}>
          <Column style={{ gap: p(4) }}>
            <Text style={{ fontFamily: SERIF, fontSize: p(34), fontWeight: 600, letterSpacing: p(-0.4), lineHeight: 1.1 }}>Beaches</Text>
            <Text style={{ fontSize: p(15), color: MUTED }}>Within 15 km · sorted by the tide right now</Text>
          </Column>

          {/* Search. */}
          <Row style={{ gap: p(10), alignItems: "center", padding: [p(11), p(14)], borderRadius: p(14), backgroundColor: "#EFEAE0" }}>
            <Svg width={p(17)} height={p(17)} viewBox="0 0 18 18" style={{ flex: "none" }}>
              <Circle cx={7.5} cy={7.5} r={6} style={{ fill: "transparent", stroke: MUTED, strokeWidth: 2 }} />
              <Line x1={12} y1={12} x2={16.5} y2={16.5} style={{ stroke: MUTED, strokeWidth: 2.2 }} />
            </Svg>
            <Text style={{ fontSize: p(16), color: "#8A989B" }}>Search 1,400 beaches</Text>
          </Row>

          {/* What for. */}
          <Row style={{ gap: p(8) }}>
            {["Swim", "Surf", "Rock pools", "Walk"].map((label, i) => (
              <Text key={label} style={{ flex: "none", fontSize: p(14), fontWeight: 600, padding: [p(8), p(14)], borderRadius: p(99), backgroundColor: i === 0 ? INK : "#FFFFFF", color: i === 0 ? PAPER : INK, border: `${p(1)}px solid ${i === 0 ? INK : RULE}` }}>
                {label}
              </Text>
            ))}
          </Row>

          {/* The beaches. */}
          <Column style={{ backgroundColor: "#FFFFFF", borderRadius: p(20), border: `${p(1)}px solid ${RULE}` }}>
            {BEACHES.map((b, i) => (
              <Row key={b.name} style={{ gap: p(12), alignItems: "center", padding: [p(13), p(16)], border: i ? { top: `${p(1)}px solid ${RULE}` } : undefined }}>
                <Column style={{ width: p(232), gap: p(4) }}>
                  <Text style={{ fontSize: p(17), fontWeight: 600 }}>{b.name}</Text>
                  <Text style={{ fontSize: p(13), lineHeight: 1.35, color: MUTED }}>
                    {b.km.toFixed(1)} km · {b.note}
                  </Text>
                </Column>
                <Column style={{ width: p(110), gap: p(8), alignItems: "end" }}>
                  <Row style={{ justifyContent: "end" }}>
                    <Text style={{ flex: "none", fontSize: p(12), fontWeight: 600, padding: [p(4), p(9)], borderRadius: p(99), backgroundColor: TONES[b.tone].fill, color: TONES[b.tone].text }}>{b.status}</Text>
                  </Row>
                  <Svg width={p(SW)} height={p(SH)} viewBox={`0 0 ${SW} ${SH}`} title={`${b.name}'s tide over the next twelve hours`}>
                    <Path d={spark(b.tide)} style={{ fill: "transparent", stroke: SEA, strokeWidth: 1.8 }} />
                    <Circle cx={4} cy={SH - 3 - ((heightAt(b.tide, NOW) - 0.3) / 4.6) * (SH - 6)} r={3.2} style={{ fill: BUOY }} />
                  </Svg>
                </Column>
              </Row>
            ))}
          </Column>
        </Column>
      </Column>
      <TabBar k={k} active={1} />
    </Column>
  );
}

/** The lock screen at dusk, with the alert that slack water is near. */
export function AlertScreen({ k }: { k: number }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  const t = tide(11.87, 1.75);
  const now = 11.53;
  // The dusk: bands of sky, the sun on the horizon, the swell.
  const KEYS = ["#0F2C33", "#1A4148", "#2E5A5D", "#5B7A70", "#A39578", "#E3AD78"];
  // The sky in forty bands, each mixed between its two nearest key colors: a gradient drawn in Rects.
  const mix = (a: string, b: string, f: number) =>
    `#${[1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - f) + parseInt(b.slice(i, i + 2), 16) * f).toString(16).padStart(2, "0")).join("")}`;
  const SKY = Array.from({ length: 40 }, (_, i) => {
    const at = (i / 39) * (KEYS.length - 1);
    const lo = Math.min(Math.floor(at), KEYS.length - 2);
    return mix(KEYS[lo], KEYS[lo + 1], at - lo);
  });
  const W = 440;
  const H = 956;
  const HORIZON = 600;
  const swell = (row: number) => {
    const y0 = HORIZON + 14 + row * row * 3.2 + row * 12;
    return `M${Array.from({ length: 23 }, (_, j) => `${j * 20},${(y0 + (2 + row * 0.8) * Math.sin(j * 0.8 + row * 1.7)).toFixed(1)}`).join(" L")}`;
  };
  const white = "#FFFFFF";
  const card = { backgroundColor: "rgba(250, 247, 240, 0.86)", borderRadius: p(24), padding: [p(14), p(16)], gap: p(4) } as const;
  const icon = (
    <Svg width={p(38)} height={p(38)} viewBox="0 0 38 38" style={{ flex: "none" }}>
      <Rect x={0} y={0} width={38} height={38} rx={9} style={{ fill: DEEP }} />
      <Path d="M5 25 C10 18 14 18 19 25 C24 32 28 32 33 25 L33 38 L5 38 Z" style={{ fill: SEA }} />
      <Path d="M5 25 C10 18 14 18 19 25 C24 32 28 32 33 25" style={{ fill: "transparent", stroke: SHALLOW, strokeWidth: 2.4 }} />
      <Circle cx={27} cy={11} r={5} style={{ fill: BUOY }} />
    </Svg>
  );

  return (
    <Layer style={{ width: p(W), height: p(H) }}>
      <Svg width={p(W)} height={p(H)} viewBox={`0 0 ${W} ${H}`} title="The sea at dusk, the sun on the horizon">
        {SKY.map((c, i) => (
          <Rect key={i} x={0} y={i * (HORIZON / SKY.length)} width={W} height={HORIZON / SKY.length + 2} style={{ fill: c }} />
        ))}
        <Circle cx={318} cy={HORIZON} r={34} style={{ fill: "#F7CF97" }} />
        <Rect x={0} y={HORIZON} width={W} height={H - HORIZON} style={{ fill: "#163A41" }} />
        {/* The sun's path on the water: short strokes, wider and fainter toward the shore. */}
        {Array.from({ length: 16 }, (_, i) => {
          const y = HORIZON + 8 + i * i * 1.3 + i * 6;
          const w = 10 + i * 3.2;
          return <Rect key={i} x={318 - w / 2 + ((i * 37) % 11) - 5} y={y} width={w} height={1.6 + i * 0.12} rx={1} style={{ fill: "#F7CF97", opacity: 0.6 - i * 0.032 }} />;
        })}
        {Array.from({ length: 13 }, (_, row) => (
          <Path key={row} d={swell(row)} style={{ fill: "transparent", stroke: row < 4 ? "#F7CF97" : SHALLOW, strokeWidth: 1.2 + row * 0.12, opacity: row < 4 ? 0.5 - row * 0.08 : 0.22 }} />
        ))}
      </Svg>
      <Column style={{ width: p(W), height: p(H), justifyContent: "space-between", color: white, fontFamily: SANS }}>
        <Column style={{ gap: p(6), alignItems: "center" }}>
          <StatusBar k={k} time={now} color={white} label="Tidewise 5G" />
          <Text style={{ fontSize: p(21), fontWeight: 600, textAlign: "center", color: "#F4EBDD", padding: [p(10), 0, 0] }}>Thursday 12 March</Text>
          <Text style={{ fontFamily: SERIF, fontSize: p(104), fontWeight: 500, lineHeight: 1, letterSpacing: p(-2), textAlign: "center", color: "#FBF4E8" }}>
            {clock(now)}
          </Text>
        </Column>

        <Column style={{ padding: [0, p(14), p(26)], gap: p(10) }}>
          {/* The alert, and the one before it, stacked. */}
          <Row style={{ ...card, gap: p(12), alignItems: "start", color: INK }}>
            {icon}
            <Column style={{ width: p(330), gap: p(3) }}>
              <Row style={{ justifyContent: "space-between" }}>
                <Text style={{ flex: "none", fontSize: p(15), fontWeight: 600 }}>Slack water in 20 minutes</Text>
                <Text style={{ flex: "none", fontSize: p(13), color: MUTED }}>now</Text>
              </Row>
              <Text style={{ fontSize: p(15), lineHeight: 1.35 }}>
                Saltmere Bay is high at {clock(t.high)}. The calmest forty minutes to swim today start now.
              </Text>
            </Column>
          </Row>
          <Row style={{ ...card, gap: p(12), alignItems: "center", color: INK, backgroundColor: "rgba(250, 247, 240, 0.7)" }}>
            {icon}
            <Column style={{ width: p(330), gap: p(2) }}>
              <Row style={{ justifyContent: "space-between" }}>
                <Text style={{ flex: "none", fontSize: p(15), fontWeight: 600 }}>Gullhaven Cove</Text>
                <Text style={{ flex: "none", fontSize: p(13), color: MUTED }}>8:00</Text>
              </Row>
              <Text style={{ fontSize: p(15), lineHeight: 1.35 }}>Good for a swim until 13:30, sheltered from the wind.</Text>
            </Column>
          </Row>

          {/* The torch and the camera, and the home bar. */}
          <Row style={{ justifyContent: "space-between", alignItems: "center", padding: [p(22), p(32), p(6)] }}>
            {[0, 1].map((i) => (
              <Svg key={i} width={p(50)} height={p(50)} viewBox="0 0 50 50" style={{ flex: "none" }}>
                <Circle cx={25} cy={25} r={25} style={{ fill: "#000000", opacity: 0.35 }} />
                {i === 0 ? (
                  <Path d="M20 14 H30 V19 L27 24 V36 H23 V24 L20 19 Z" style={{ fill: white }} />
                ) : (
                  <>
                    <Rect x={14} y={18} width={22} height={16} rx={3} style={{ fill: white }} />
                    <Rect x={20} y={15} width={10} height={4} rx={1} style={{ fill: white }} />
                    <Circle cx={25} cy={26} r={4.5} style={{ fill: "#3A3A3A" }} />
                  </>
                )}
              </Svg>
            ))}
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <Svg width={p(140)} height={p(5)} viewBox="0 0 140 5" style={{ flex: "none" }}>
              <Rect x={0} y={0} width={140} height={5} rx={2.5} style={{ fill: white }} />
            </Svg>
          </Row>
        </Column>
      </Column>
    </Layer>
  );
}

export const SCREENS: Record<string, (k: number) => ReactNode> = {
  today: (k) => <TodayScreen k={k} />,
  beaches: (k) => <BeachesScreen k={k} />,
  alert: (k) => <AlertScreen k={k} />,
};
