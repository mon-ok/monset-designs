import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";

// Scroll is the climb: base camp at 0 m, Osmeña Peak (Cebu's summit, 1,013 m) at the booking.
const TICKS = 20; // 0..1000 m in 50 m steps
const TICK_PX = 44;
const SUMMIT = 1013;

// the reading names where you are on the route (borrowed from Kokonut's scroll-index idea)
const STAGES = [
  ["top", "Base"],
  ["problems", "Leaks"],
  ["method", "Method"],
  ["fixes", "Fixes"],
  ["questions", "Questions"],
  ["start", "Start"],
  ["work", "Work"],
  ["assessment", "Summit"],
];

// where the visitor is on the climb: snapped tick, metres and section name
export function useClimb() {
  const { scrollYProgress } = useScroll();
  const [tick, setTick] = useState(0);
  const [atSummit, setAtSummit] = useState(false);
  const [stage, setStage] = useState("Base");

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setTick(Math.round(p * TICKS));
    setAtSummit(p > 0.985);
    const line = window.innerHeight * 0.5;
    let name = STAGES[0][1];
    for (const [id, label] of STAGES) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) name = label;
    }
    setStage(name);
  });

  return { tick, atSummit, stage, reading: atSummit ? SUMMIT : tick * 50 };
}

export default function ElevationRuler() {
  const { tick, atSummit, stage, reading } = useClimb();
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed inset-y-0 left-0 z-30 hidden w-16 overflow-hidden border-r border-film/10 bg-night lg:block"
      aria-hidden="true"
    >
      {/* the tape: whole ticks, snapped with one small overshoot */}
      <motion.div
        className="absolute left-0 right-0 top-1/2"
        animate={{ y: tick * TICK_PX - TICK_PX / 2 }}
        initial={false}
        transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0.3 }}
        style={{ marginTop: -TICKS * TICK_PX }}
      >
        {Array.from({ length: TICKS + 1 }, (_, i) => {
          const m = (TICKS - i) * 50;
          const major = m % 100 === 0;
          return (
            <div key={m} className="relative flex items-center" style={{ height: TICK_PX }}>
              <span className={`absolute right-0 h-px ${major ? "w-4 bg-film/60" : "w-2 bg-film/30"}`} />
              {major && (
                <span className="figures absolute left-2 text-[0.625rem] font-semibold text-film/45">{m}</span>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* fixed reading: an opaque plate over the tape, so the tick labels pass under it */}
      <div
        className={`absolute inset-x-0 top-1/2 flex h-12 -translate-y-1/2 flex-col justify-center border-y-2 border-contour px-2 transition-colors duration-300 ${
          atSummit ? "bg-contour" : "bg-night"
        }`}
      >
        <div
          className={`figures text-[0.75rem] font-bold leading-none ${atSummit ? "text-night" : "text-contour"}`}
          style={{ fontStretch: "90%" }}
        >
          {reading.toLocaleString("en-US")} m
        </div>
        <div className={`map-label mt-1 !text-[0.5rem] !tracking-[0.04em] leading-none ${atSummit ? "text-night" : "text-film/60"}`} style={{ fontStretch: "88%" }}>
          {stage}
        </div>
      </div>
    </div>
  );
}
