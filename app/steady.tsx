/**
 * Steady, a second fictional app (a habit tracker), so the store screenshot template can be shown on an app that
 * isn't Tidewise: its own colors, a sans headline and no contour lines. Its Today screen, drawn in elements at
 * `k` pixels to the point, like the Tidewise screens.
 */
import { Circle, Column, Path, Rect, Row, Svg, Text } from "@hyper-elements/react";
import { GestureHandle, SANS, StatusBar, type OS } from "../src/tidewise-app-store.tsx";

export const VIOLET = "#4B32D9";
const LILAC = "#EEEAFE";
const INK = "#1D1A2F";
const MUTED = "#6D6880";
const LINE = "#E4DFF5";
const WHITE = "#FFFFFF";

/** Today's habits: what, how far along, and the unit. */
const HABITS: Array<{ name: string; done: number; goal: number; unit: string }> = [
  { name: "Read", done: 20, goal: 20, unit: "pages" },
  { name: "Walk", done: 6240, goal: 8000, unit: "steps" },
  { name: "Stretch", done: 10, goal: 10, unit: "minutes" },
  { name: "Phone away after 22:00", done: 0, goal: 1, unit: "" },
];

/** Six months of days, Monday to Sunday down each column: how many habits were kept, 0 to 4. A fixed pattern. */
const WEEKS = 26;
const kept = (week: number, day: number) => {
  const n = (week * 7 + day) * 2654435761;
  const base = ((n >>> 0) % 97) / 97;
  const growing = week / WEEKS;
  return Math.min(4, Math.floor((base * 0.6 + growing * 0.65) * 5));
};
const SHADES = ["#E9E5FB", "#C9BFFA", "#9E8CF3", "#7259E6", VIOLET];

const number = (n: number) => n.toLocaleString("en-GB");

export function SteadyScreen({ k, os = "ios" }: { k: number; os?: OS }) {
  const p = (n: number) => Math.round(n * k * 100) / 100;
  const done = HABITS.filter((h) => h.done >= h.goal).length;
  // The ring: how much of today is done, as an arc from the top, clockwise.
  const share = HABITS.reduce((sum, h) => sum + Math.min(1, h.done / h.goal), 0) / HABITS.length;
  const angle = share * 2 * Math.PI;
  const end = [50 + 40 * Math.sin(angle), 50 - 40 * Math.cos(angle)];
  const arc = `M50 10 A40 40 0 ${share > 0.5 ? 1 : 0} 1 ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;

  return (
    <Column style={{ width: p(440), height: p(956), backgroundColor: LILAC, color: INK, fontFamily: SANS, justifyContent: "space-between" }}>
      <Column style={{ gap: p(14) }}>
        <StatusBar k={k} time={7.25} color={INK} os={os} />
        <Column style={{ padding: [0, p(22)], gap: p(16) }}>
          <Column style={{ gap: p(2) }}>
            <Text style={{ fontSize: p(15), color: MUTED }}>Thursday 12 March</Text>
            <Text style={{ fontSize: p(34), fontWeight: 600, letterSpacing: p(-0.6) }}>Good morning, Ada</Text>
          </Column>

          {/* The streak and today's ring. */}
          <Row style={{ gap: p(16), alignItems: "center", padding: [p(18), p(20)], borderRadius: p(24), backgroundColor: VIOLET, color: WHITE }}>
            <Column style={{ width: p(214), gap: p(2) }}>
              <Text style={{ fontSize: p(13), fontWeight: 600, letterSpacing: p(0.6), textTransform: "uppercase", color: "#C9BFFA" }}>Streak</Text>
              <Text style={{ fontSize: p(56), fontWeight: 600, lineHeight: 1, letterSpacing: p(-2) }}>41 days</Text>
              <Text style={{ fontSize: p(14), color: "#DCD5FF" }}>Your longest yet. Keep it going.</Text>
            </Column>
            <Svg width={p(100)} height={p(100)} viewBox="0 0 100 100" title={`${done} of ${HABITS.length} habits done today`}>
              <Circle cx={50} cy={50} r={40} style={{ fill: "transparent", stroke: "#6C55E8", strokeWidth: 10 }} />
              <Path d={arc} style={{ fill: "transparent", stroke: WHITE, strokeWidth: 10 }} />
              <Circle cx={50} cy={10} r={5} style={{ fill: WHITE }} />
              <Circle cx={end[0]} cy={end[1]} r={5} style={{ fill: WHITE }} />
            </Svg>
          </Row>

          {/* Today's habits. */}
          <Column style={{ backgroundColor: WHITE, borderRadius: p(22), border: `${p(1)}px solid ${LINE}` }}>
            {HABITS.map((h, i) => {
              const complete = h.done >= h.goal;
              return (
                <Row key={h.name} style={{ gap: p(14), alignItems: "center", padding: [p(14), p(16)], border: i ? { top: `${p(1)}px solid ${LINE}` } : undefined }}>
                  <Svg width={p(30)} height={p(30)} viewBox="0 0 30 30" style={{ flex: "none" }}>
                    <Circle cx={15} cy={15} r={13.5} style={{ fill: complete ? VIOLET : WHITE, stroke: complete ? VIOLET : "#C8C1E6", strokeWidth: 2 }} />
                    {complete ? <Path d="M8.5 15.5 L13 20 L21.5 10.5" style={{ fill: "transparent", stroke: WHITE, strokeWidth: 2.6 }} /> : null}
                  </Svg>
                  <Column style={{ width: p(316), gap: p(6) }}>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Text style={{ flex: "none", fontSize: p(17), fontWeight: 600 }}>{h.name}</Text>
                      <Text style={{ flex: "none", fontSize: p(14), color: complete ? VIOLET : MUTED }}>
                        {h.unit ? `${number(h.done)} / ${number(h.goal)} ${h.unit}` : complete ? "Done" : "Tonight"}
                      </Text>
                    </Row>
                    {h.unit && !complete ? (
                      <Svg width={p(314)} height={p(6)} viewBox="0 0 316 6">
                        <Rect x={0} y={0} width={316} height={6} rx={3} style={{ fill: "#ECE8FB" }} />
                        <Rect x={0} y={0} width={(316 * h.done) / h.goal} height={6} rx={3} style={{ fill: VIOLET }} />
                      </Svg>
                    ) : null}
                  </Column>
                </Row>
              );
            })}
          </Column>

          {/* Six months, a square a day. */}
          <Column style={{ gap: p(10), padding: [p(16), p(16)], borderRadius: p(22), backgroundColor: WHITE, border: `${p(1)}px solid ${LINE}` }}>
            <Row style={{ justifyContent: "space-between" }}>
              <Text style={{ flex: "none", fontSize: p(13), fontWeight: 600, letterSpacing: p(0.6), textTransform: "uppercase", color: MUTED }}>Since September</Text>
              <Text style={{ flex: "none", fontSize: p(13), color: MUTED }}>Fewer → more kept</Text>
            </Row>
            <Svg width={p(358)} height={p(96)} viewBox={`0 0 ${WEEKS * 14} 98`} title="Each day since September, darker for more habits kept">
              {Array.from({ length: WEEKS * 7 }, (_, i) => {
                const week = Math.floor(i / 7);
                const day = i % 7;
                return <Rect key={i} x={week * 14} y={day * 14} width={11.5} height={11.5} rx={2.5} style={{ fill: SHADES[kept(week, day)] }} />;
              })}
            </Svg>
          </Column>

          {/* One thing it noticed. */}
          <Row style={{ gap: p(14), alignItems: "center", padding: [p(16), p(18)], borderRadius: p(22), backgroundColor: "#FFF4D8", border: `${p(1)}px solid #F3E2B0` }}>
            <Svg width={p(34)} height={p(34)} viewBox="0 0 34 34" style={{ flex: "none" }}>
              <Circle cx={17} cy={17} r={17} style={{ fill: "#F7C948" }} />
              <Path d="M17 8 L19.6 14.4 L26 17 L19.6 19.6 L17 26 L14.4 19.6 L8 17 L14.4 14.4 Z" style={{ fill: INK }} />
            </Svg>
            <Column style={{ width: p(300), gap: p(2) }}>
              <Text style={{ fontSize: p(16), fontWeight: 600 }}>You walk more on days you read</Text>
              <Text style={{ fontSize: p(14), lineHeight: 1.35, color: MUTED }}>1,900 more steps on average, across 41 days.</Text>
            </Column>
          </Row>
        </Column>
      </Column>

      {os === "android" ? <GestureHandle k={k} /> : (
        <Row style={{ justifyContent: "center", padding: [0, 0, p(10)] }}>
          <Svg width={p(140)} height={p(5)} viewBox="0 0 140 5" style={{ flex: "none" }}>
            <Rect x={0} y={0} width={140} height={5} rx={2.5} style={{ fill: INK }} />
          </Svg>
        </Row>
      )}
    </Column>
  );
}
