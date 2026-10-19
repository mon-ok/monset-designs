import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { animate } from "animejs/animation";
import { createScope } from "animejs/scope";
import { splitText } from "animejs/text";
import { stagger } from "animejs/utils";
import SurveyMap from "@/components/kokonutui/survey-map";
import { Arrow } from "./marks.jsx";

// benchmarks: where money leaks, pinned on the survey (design-frame coords, 0..1)
const PINS = [
  { x: 0.56, y: 0.5, label: "Enquiries left unanswered" },
  { x: 0.77, y: 0.22, label: "Hours of copy-paste work" },
  { x: 0.93, y: 0.64, label: "Problems found at month end", flip: true },
];

export const ROUTES = [
  {
    id: "established",
    marker: "A",
    title: "I run an established business.",
    body: "Sales, staff and customers are already moving. You want it running tighter, with less waste and better visibility.",
    cta: "Show me how you help",
    // trail from this card up the west ridge to the summit (hero %, desktop)
    trail: "M24 80 C 30 70, 38 66, 44 60 S 52 50, 55 46 S 62 40, 66 34",
  },
  {
    id: "starting",
    marker: "B",
    title: "I'm starting or growing a small business.",
    body: "You need to be found online and start selling or taking bookings properly.",
    cta: "Show me where to start",
    trail: "M70 80 C 74 72, 80 70, 82 62 S 76 52, 74 47 S 69 39, 66 34",
  },
];

// Draws the dashed trail of the hovered or chosen route up to the summit.
function Trails({ active }) {
  const reduce = useReducedMotion();
  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        {ROUTES.map((r) => (
          <mask key={r.id} id={`trail-${r.id}`} maskUnits="userSpaceOnUse">
            <motion.path
              d={r.trail}
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ pathLength: active === r.id ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: active === r.id ? 0.9 : 0.25, ease: [0.23, 1, 0.32, 1] }}
            />
          </mask>
        ))}
      </defs>
      {ROUTES.map((r) => (
        <path
          key={r.id}
          d={r.trail}
          mask={`url(#trail-${r.id})`}
          fill="none"
          stroke="var(--color-film)"
          strokeWidth="2"
          strokeDasharray="2 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export default function Hero({ track, picked, onPick, ready = true }) {
  const root = useRef(null);
  const [hovered, setHovered] = useState(null);
  const activeTrail = hovered ?? (picked ? track : null);

  // the one authored sequence: peaks rise (in the map), headline words climb out of their line,
  // then the supporting copy and the two routes settle in
  useLayoutEffect(() => {
    if (!ready) return;
    const scope = createScope({ root, mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" } }).add((self) => {
      if (self.matches.reduce) return;
      const { words } = splitText(".hero-headline", { words: { wrap: "clip" } });
      animate(words, { y: ["110%", "0%"], duration: 750, delay: stagger(45, { start: 250 }), ease: "out(4)" });
      animate(".hero-follow", { opacity: [0, 1], y: [14, 0], duration: 600, delay: stagger(90, { start: 750 }), ease: "out(4)" });
    });
    return () => scope.revert();
  }, [ready]);

  return (
    <section ref={root} id="top" data-ready={ready || undefined} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night pt-16">
      <SurveyMap pins={PINS} rising={ready} />
      <Trails active={activeTrail} />

      <div className="pointer-events-none relative mx-auto flex w-full max-w-[84rem] flex-1 flex-col px-5 sm:px-8">
        <div data-map-avoid className="pointer-events-auto max-w-[46rem] pt-[clamp(2rem,7vh,5rem)]">
          <h1 className="hero-headline display text-[clamp(2.3rem,4.4vw,4.4rem)] text-film">
            Find where your business is leaking time and money.{" "}
            <span className="text-contour">Then fix it.</span>
          </h1>
          <p className="hero-follow mt-7 max-w-[34rem] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-mist">
            We look at how your business actually runs, find the gaps that cost you customers and
            hours, build the right fix, and show you the improvement in numbers.
          </p>
          <div className="hero-follow mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#assessment" className="btn-primary group text-[1.0625rem]">
              Book a free Digital Readiness Assessment
              <Arrow className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
            </a>
            <p className="text-sm text-mist">
              As quick as 15 minutes, online.
              <br />
              No jargon, no pressure, no obligation.
            </p>
          </div>
        </div>

        {/* two routes up the same mountain */}
        <div data-map-avoid className="hero-follow pointer-events-auto mt-auto pb-10 pt-10">
          <h2 className="mb-4 text-lg font-bold text-film" style={{ fontStretch: "104%" }}>Which sounds like you?</h2>
          <div className="grid gap-3 md:grid-cols-2 md:gap-5">
            {ROUTES.map((r) => {
              const active = picked && track === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onPick(r.id)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(r.id)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(r.id)}
                  onBlur={() => setHovered(null)}
                  aria-pressed={active}
                  className={`group relative flex gap-4 border-t-2 border-dashed bg-night/85 px-1 pb-2 pt-4 text-left transition-[border-color,transform] duration-200 active:scale-[0.99] ${
                    active ? "border-contour" : "border-film/30 hover:border-contour/70"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 font-bold transition-colors duration-200 ${
                      active ? "border-contour bg-contour text-night" : "border-contour text-contour group-hover:bg-contour/15"
                    }`}
                    style={{ fontStretch: "120%" }}
                  >
                    {r.marker}
                  </span>
                  <span>
                    <span className="block text-lg font-bold leading-snug text-film" style={{ fontStretch: "105%" }}>
                      {r.title}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-mist">{r.body}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-contour">
                      {r.cta}
                      <Arrow down className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-0.5" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p data-map-avoid className="map-label absolute bottom-3 right-5 hidden text-film/40 sm:right-8 lg:block">
        Survey of the Monset peaks · contour interval 50 m
      </p>
    </section>
  );
}
