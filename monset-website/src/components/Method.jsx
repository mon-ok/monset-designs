import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { METHOD } from "../content.js";
import { SectionHead, band, wrap } from "./marks.jsx";

// each step is a station on the climb (relative heights; the ruler owns the real metres)
const ELEVATIONS = [250, 500, 750, 1013];
const SUMMIT = 1013;
const X = [125, 375, 625, 875];
const y = (m) => 190 - (m / SUMMIT) * 165;

// the slope between stations, roughened so it reads as ground, not a chart
const PROFILE = [
  [0, 196], [40, 192], [80, y(160)], [X[0], y(ELEVATIONS[0])], [180, y(300)], [230, y(340)], [290, y(420)],
  [X[1], y(ELEVATIONS[1])], [430, y(560)], [480, y(540)], [550, y(660)], [X[2], y(ELEVATIONS[2])],
  [690, y(820)], [740, y(800)], [800, y(930)], [X[3], y(ELEVATIONS[3])], [930, y(940)], [1000, y(860)],
];
const POINTS = PROFILE.map((p) => p.join(",")).join(" ");
// the climb ends at the summit station; the far slope is scenery only
const CLIMB = PROFILE.filter(([x]) => x <= X[3]);
const PATH = "M" + CLIMB.map((p) => p.join(" ")).join("L");

// light over the climb: night, dusk, first light, summit ember (all keep cream text legible)
const SKY = ["#0b1a2e", "#1a1c3a", "#33203a", "#45230f"];

function Head() {
  return (
    <SectionHead
      dark
      title="How a good contractor works"
      note="You wouldn't hire a builder who starts pouring concrete before seeing the site. We work the same way."
    />
  );
}

// reduced motion: the whole route at once, nothing pinned
function StaticMethod() {
  return (
    <section id="method" className={`bg-night text-film ${band}`}>
      <div className={wrap}>
        <Head />
        <svg viewBox="0 0 1000 200" className="mt-10 h-auto w-full md:mt-14" aria-hidden="true">
          <polygon points={`${POINTS} 1000,200 0,200`} fill="var(--color-night-2)" />
          <polyline points={POINTS} fill="none" stroke="var(--color-contour)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {X.map((x, i) => (
            <circle key={x} cx={x} cy={y(ELEVATIONS[i])} r="6" fill="var(--color-contour)" />
          ))}
        </svg>
        <ol className="grid gap-x-8 md:grid-cols-4">
          {METHOD.map((step, i) => (
            <li key={step.title} className="border-t border-film/15 pt-6 max-md:mt-8 md:border-t-0 md:pt-5">
              <h3 className="text-[1.3rem] font-bold leading-snug" style={{ fontStretch: "106%" }}>
                <span className="figures text-contour">{i + 1}.</span> {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-mist">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PinnedMethod() {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const climberRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const sky = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], SKY);
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const [nudge, setNudge] = useState(false);
  const nudges = useRef(0);
  const idle = useRef(0);

  // the climber walks the real slope: its position comes from the path itself
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const path = pathRef.current;
    if (path && climberRef.current) {
      const pt = path.getPointAtLength(path.getTotalLength() * p);
      climberRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      const n = X.filter((x) => pt.x >= x - 2).length;
      setReached(n);
      // the step on screen is the last station reached (step 1 until the first one)
      setActive(Math.max(0, n - 1));
    }
    // a visitor parked mid-climb gets a quiet "keep scrolling" (at most 3 times, like Kalea)
    setNudge(false);
    clearTimeout(idle.current);
    if (p > 0.02 && p < 0.97 && nudges.current < 3) {
      idle.current = setTimeout(() => {
        nudges.current += 1;
        setNudge(true);
      }, 5000);
    }
  });
  useEffect(() => () => clearTimeout(idle.current), []);

  return (
    <section ref={ref} id="method" className="relative text-film" style={{ height: "420vh" }}>
      <motion.div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden" style={{ backgroundColor: sky }}>
        <div className={`${wrap} pt-16`}>
          <Head />

          <svg viewBox="0 0 1000 200" className="mt-6 h-auto max-h-[26vh] w-full md:mt-10" aria-hidden="true">
            <polygon points={`${POINTS} 1000,200 0,200`} fill="rgb(255 255 255 / 0.04)" />
            <polyline points={POINTS} fill="none" stroke="var(--color-film)" strokeOpacity=".18" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <motion.path
              ref={pathRef}
              d={PATH}
              fill="none"
              stroke="var(--color-contour)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              style={{ pathLength: scrollYProgress }}
            />
            {X.map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={y(ELEVATIONS[i])}
                r="7"
                className="station"
                data-on={i < reached || undefined}
                stroke="var(--color-contour)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* the climber: you, on the route */}
            <g ref={climberRef} transform={`translate(0 196)`}>
              <circle r="16" fill="var(--color-contour)" opacity=".18" className="climber-halo" />
              <circle r="6.5" fill="var(--color-film)" stroke="var(--color-contour)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          {/* station stamps: each lands when the climber reaches it */}
          <ol className="mt-5 grid grid-cols-4 gap-2 md:gap-8" aria-hidden="true">
            {METHOD.map((s, i) => (
              <li key={s.short} className="stamp map-label figures" data-on={i < reached || undefined}>
                <span className="hidden sm:inline">
                  <span className="text-contour">{i + 1}</span> {s.short}
                </span>
              </li>
            ))}
          </ol>

          {/* the step being read: one at a time, crossfaded with a little blur */}
          <div className="relative mt-8 min-h-[13rem] md:mt-10 md:min-h-[10rem]" aria-hidden="true">
            {METHOD.map((step, i) => (
              <div key={step.title} className="step-panel absolute inset-x-0 top-0 max-w-[46rem]" data-active={i === active || undefined}>
                <h3 className="display text-[clamp(1.6rem,2.8vw,2.4rem)]">
                  <span className="figures text-contour">{i + 1}.</span> {step.title}
                </h3>
                <p className="mt-3 text-[clamp(1.05rem,1.3vw,1.2rem)] leading-relaxed text-mist">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="map-label pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-film/70 transition-opacity duration-500" style={{ opacity: nudge ? 1 : 0 }} aria-hidden="true">
          Keep scrolling to climb
        </p>
      </motion.div>

      {/* every step in reading order for assistive tech; the pinned panel above is visual */}
      <ol className="sr-only">
        {METHOD.map((step) => (
          <li key={step.title}>
            {step.title} {step.body}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Method() {
  return useReducedMotion() ? <StaticMethod /> : <PinnedMethod />;
}
