import { useRef } from "react";
import { animate } from "animejs/animation";
import { createTimeline } from "animejs/timeline";
import { createDrawable } from "animejs/svg";
import { stagger } from "animejs/utils";
import { useLoader } from "./useLoader.js";

// Loader 1, "The survey sets up": a crosshair draws, contour rings ripple out into the two peaks,
// the logo's strokes land as the ridgelines and the reading climbs to 1,013 m. Then the rings
// hand over to the hero map, which rises underneath as this fades.
const SUMMIT = 1013;

// rings around each peak, long axis along the logo's slant; the crosshair sits on the main summit
const PEAKS = [
  { cx: 200, cy: 140, radii: [14, 27, 40, 53, 67, 81, 96] },
  { cx: 228, cy: 180, radii: [11, 22, 33, 44] },
];

const metres = (m) => `${Math.round(m).toLocaleString("en-US")} m`;

function intro(el, reduce, done) {
  const reading = el.querySelector(".ld-reading");
  if (reduce) {
    el.querySelector(".ld-word").style.clipPath = "none";
    el.querySelector(".ld-tag").style.opacity = "1";
    reading.textContent = metres(SUMMIT);
    return [animate(el.querySelector(".ld-brand"), { opacity: [0, 1], duration: 300, onComplete: () => setTimeout(done, 350) })];
  }
  const count = { m: 0 };
  const tl = createTimeline({ defaults: { ease: "out(3)" }, onComplete: () => setTimeout(done, 120) })
    .add(createDrawable(el.querySelectorAll(".ld-cross-line")), { draw: ["0 0", "0 1"], duration: 420, delay: stagger(50) }, 0)
    .add(el.querySelector(".ld-cross"), { rotate: [-45, 0], duration: 600, ease: "out(4)" }, 0)
    .add(createDrawable(el.querySelectorAll(".ld-ring")), { draw: ["0 0", "0 1"], duration: 600, delay: stagger(32) }, 280)
    .add(el.querySelector(".ld-a"), { opacity: [0, 1], x: [-14, 0], y: [14, 0], duration: 520, ease: "out(4)" }, 520)
    .add(el.querySelector(".ld-b"), { opacity: [0, 1], x: [14, 0], y: [-14, 0], duration: 520, ease: "out(4)" }, 600)
    .add(count, { m: SUMMIT, duration: 800, ease: "out(4)", onUpdate: () => (reading.textContent = metres(count.m)) }, 330)
    .add(el.querySelector(".ld-word"), { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], duration: 380, ease: "inOut(3)" }, 820)
    .add(el.querySelector(".ld-tag"), { opacity: [0, 1], y: [6, 0], duration: 320 }, 960);
  return [tl];
}

// the survey hands over: rings spread and thin out while the sheet lifts away
function outro(el, reduce, onDone) {
  el.querySelector(".ld-reading").textContent = metres(SUMMIT);
  animate(el.querySelector(".ld-peaks"), { scale: 1.8, opacity: 0, duration: reduce ? 1 : 600, ease: "out(3)" });
  animate(el.querySelector(".ld-cross"), { scale: 0.6, opacity: 0, duration: reduce ? 1 : 380, ease: "out(3)" });
  animate(el, { opacity: 0, duration: reduce ? 250 : 480, delay: reduce ? 0 : 80, ease: "out(2)", onComplete: onDone });
}

export default function SurveyLoader({ onReveal, onDone }) {
  const root = useRef(null);
  useLoader(root, { intro, outro, onReveal, onDone });

  return (
    <div ref={root} className="fixed inset-0 z-[60] grid place-items-center bg-night text-film" aria-hidden="true">
      <div className="ld-brand flex flex-col items-center">
        <svg viewBox="80 40 240 220" className="h-auto w-[min(72vw,22rem)] overflow-visible">
          <g className="ld-peaks text-contour" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {PEAKS.map((p) => (
              <g key={p.cx} transform={`rotate(27 ${p.cx} ${p.cy})`}>
                {p.radii.map((r, i) => (
                  <ellipse key={r} className="ld-ring" cx={p.cx} cy={p.cy} rx={r * 0.62} ry={r} strokeOpacity={i % 4 === 3 ? 0.95 : 0.45} />
                ))}
              </g>
            ))}
          </g>
          {/* the logo's two strokes are the ridgelines (scaled from the traced mark) */}
          <g transform="translate(160 92) scale(0.105)">
            <polygon className="ld-a" fill="#e9eef5" points="301,390 362,505 159,948 90,830" />
            <polygon className="ld-b" fill="#6f98c4" points="565,122 625,230 432,627 368,505" />
          </g>
          {/* the surveyor's crosshair */}
          <g className="ld-cross" stroke="var(--color-film)" strokeWidth="1.4" fill="none" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle className="ld-cross-line" cx="200" cy="140" r="34" strokeOpacity=".7" />
            <path className="ld-cross-line" d="M200 92v26M200 162v26M152 140h26M222 140h26" />
          </g>
        </svg>
        <p className="ld-reading figures map-label mt-2 text-contour">0 m</p>
        <p className="ld-word mt-5 text-3xl font-extrabold tracking-[-0.02em]" style={{ fontStretch: "108%", clipPath: "inset(0 100% 0 0)" }}>
          Monset<span className="text-contour">.co</span>
        </p>
        <p className="ld-tag map-label mt-2 text-film/60" style={{ opacity: 0 }}>
          Your digital contractor
        </p>
      </div>
    </div>
  );
}
