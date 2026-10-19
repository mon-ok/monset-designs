import { useRef } from "react";
import { animate } from "animejs/animation";
import { createTimeline } from "animejs/timeline";
import { createDrawable } from "animejs/svg";
import { splitText } from "animejs/text";
import { stagger } from "animejs/utils";
import { useLoader } from "./useLoader.js";

// Loader 3, "Two strokes, one mountain": the logo's two strokes slide in along their own slant
// from opposite corners and lock into the mark, a sunrise sweeps up behind it (the same light as
// the Method climb), the wordmark rises, then the whole screen wipes upward onto the hero.

// the strokes travel along the logo's slant, in the mark's own units
const SLANT = { x: -0.43, y: 0.9 };
const TRAVEL = 520;

function intro(el, reduce, done) {
  if (reduce) {
    el.querySelector(".ls-tag").style.opacity = "1";
    el.querySelector(".ls-word").style.opacity = "1";
    return [animate(el.querySelector(".ls-brand"), { opacity: [0, 1], duration: 300, onComplete: () => setTimeout(done, 350) })];
  }
  const { chars } = splitText(el.querySelector(".ls-word"), { chars: { wrap: "clip" } });
  const tl = createTimeline({ defaults: { ease: "out(4)" }, onComplete: () => setTimeout(done, 160) })
    // the strokes arrive from opposite corners, one just after the other
    .add(el.querySelector(".ls-a"), { x: [SLANT.x * TRAVEL, 0], y: [SLANT.y * TRAVEL, 0], opacity: [0, 1], duration: 720 }, 0)
    .add(el.querySelector(".ls-b"), { x: [-SLANT.x * TRAVEL, 0], y: [-SLANT.y * TRAVEL, 0], opacity: [0, 1], duration: 720 }, 90)
    // the lock: a single small click as they meet
    .add(el.querySelector(".ls-mark"), { scale: [1, 1.035, 1], duration: 260, ease: "inOut(2)" }, 760)
    .add(createDrawable(el.querySelectorAll(".ls-line")), { draw: ["0 0", "0 1"], duration: 420, delay: stagger(80) }, 760)
    // sunrise behind the mark: night to ember, the Method sky in one breath
    .add(el, { backgroundColor: ["#0b1a2e", "#33203a", "#45230f"], duration: 1100, ease: "inOut(2)" }, 250)
    .add(el.querySelector(".ls-sun"), { opacity: [0, 1], y: ["-8%", "-44%"], duration: 1200, ease: "out(3)" }, 200)
    .add(el.querySelector(".ls-word"), { opacity: [0, 1], duration: 1 }, 880)
    .add(chars, { y: ["105%", "0%"], duration: 520, delay: stagger(28) }, 880)
    .add(el.querySelector(".ls-tag"), { opacity: [0, 1], y: [6, 0], duration: 320, ease: "out(3)" }, 1180);
  return [tl];
}

// the screen lifts like a blind, uncovering the hero from the bottom up
function outro(el, reduce, onDone) {
  if (reduce) {
    animate(el, { opacity: 0, duration: 250, onComplete: onDone });
    return;
  }
  animate(el, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"], duration: 720, ease: "inOut(3)", onComplete: onDone });
  animate(el.querySelector(".ls-brand"), { y: -40, opacity: 0, duration: 420, ease: "in(2)" });
}

export default function StrokesLoader({ onReveal, onDone }) {
  const root = useRef(null);
  useLoader(root, { intro, outro, onReveal, onDone });

  return (
    <div ref={root} className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-night text-film" aria-hidden="true">
      {/* the rising sun: a soft light low behind the mark */}
      <div
        className="ls-sun pointer-events-none absolute left-1/2 top-1/2 h-[110vmax] w-[110vmax] rounded-full opacity-0"
        style={{ marginLeft: "-55vmax", background: "radial-gradient(circle, rgb(240 150 70 / 0.7) 0%, rgb(232 137 47 / 0.22) 28%, transparent 58%)" }}
      />
      <div className="ls-brand relative flex flex-col items-center">
        <svg viewBox="80 95 945 875" className="ls-mark h-[min(34vh,18rem)] w-auto overflow-visible">
          <path className="ls-line" d="M298 380 637 955" stroke="rgb(233 238 245 / 0.42)" strokeWidth="10" fill="none" />
          <path className="ls-line" d="M587 107l426 853" stroke="rgb(233 238 245 / 0.42)" strokeWidth="10" fill="none" />
          <polygon className="ls-a" fill="#e9eef5" points="301,390 362,505 159,948 90,830" style={{ opacity: 0 }} />
          <polygon className="ls-b" fill="#6f98c4" points="565,122 625,230 432,627 368,505" style={{ opacity: 0 }} />
        </svg>
        <p className="ls-word mt-8 text-4xl font-extrabold tracking-[-0.02em]" style={{ fontStretch: "108%", opacity: 0 }}>
          Monset<span className="text-contour">.co</span>
        </p>
        <p className="ls-tag map-label mt-3 text-film/70" style={{ opacity: 0 }}>
          Your digital contractor
        </p>
      </div>
    </div>
  );
}
