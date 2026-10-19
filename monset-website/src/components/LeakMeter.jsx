import { useEffect, useId, useRef, useState } from "react";
import { animate } from "animejs/animation";
import { monthlyLeak, peso } from "../lib/leak.js";
import { Arrow } from "./marks.jsx";

// average sale moves in sensible steps rather than one peso at a time
const SALES = [300, 500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 25000, 50000, 100000, 250000];

function Slider({ label, value, display, min, max, step, onChange, hint }) {
  const id = useId();
  return (
    <div className="border-t border-ink/15 py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.9375rem] font-semibold">{label}</label>
        <output htmlFor={id} className="figures text-[1.0625rem] font-bold text-contour-deep">{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="leak-range mt-2.5 w-full"
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && <p id={`${id}-hint`} className="mt-1 text-[0.8125rem] text-ink-soft">{hint}</p>}
    </div>
  );
}

// the figure rolls to its new value instead of snapping, so cause and effect stay visible
function RollingPeso({ value }) {
  const ref = useRef(null);
  const shown = useRef({ v: value });
  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current.v = value;
      el.textContent = peso(value);
      return;
    }
    const a = animate(shown.current, {
      v: value,
      duration: 520,
      ease: "out(4)",
      onUpdate: () => (el.textContent = peso(shown.current.v)),
    });
    return () => a.pause();
  }, [value]);
  return <span ref={ref}>{peso(value)}</span>;
}

// a nice round end for the tape: 10k, 25k, 50k, 100k, 250k ...
function tapeEnd(n) {
  const steps = [10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000];
  return steps.find((s) => s >= n) ?? n;
}

export default function LeakMeter() {
  const [perWeek, setPerWeek] = useState(30);
  const [unansweredPct, setUnanswered] = useState(20);
  const [closePct, setClose] = useState(25);
  const [saleIdx, setSaleIdx] = useState(5);
  const avgSale = SALES[saleIdx];
  const { missed, lostSales, pesos } = monthlyLeak({ perWeek, unansweredPct, closePct, avgSale });
  const end = tapeEnd(pesos);

  return (
    <div className="border-t-2 border-ink pt-5">
      <h3 className="text-xl font-bold" style={{ fontStretch: "106%" }}>What slow replies could be costing you</h3>
      <p className="mt-1 text-[0.9375rem] text-ink-soft">Move the sliders to match your business.</p>

      <div className="mt-6" aria-live="polite">
        <p className="figures display text-[clamp(2.4rem,4.2vw,3.6rem)] text-pin">
          <RollingPeso value={pesos} />
          <span className="ml-2 text-base font-semibold tracking-normal text-ink-soft">a month</span>
        </p>
        {/* the measured length of the leak on a survey tape */}
        <div className="relative mt-4 h-3 bg-film-2" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 w-full origin-left bg-pin transition-transform duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
            style={{ transform: `scaleX(${end ? pesos / end : 0})` }}
          />
          {[...Array(11)].map((_, i) => (
            <span key={i} className="absolute -bottom-1.5 h-1.5 w-px bg-ink/40" style={{ left: `${i * 10}%` }} />
          ))}
        </div>
        <p className="figures mt-2.5 flex justify-between text-[0.75rem] text-ink-soft">
          <span>₱0</span>
          <span>{peso(end)}</span>
        </p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed">
          About <strong className="figures">{missed}</strong> enquiries a month go unanswered or too late. If{" "}
          <strong className="figures">{closePct}%</strong> would have bought, that is about{" "}
          <strong className="figures">{lostSales}</strong> sales a month going to someone else.
        </p>
      </div>

      <div className="mt-5">
        <Slider label="Enquiries a week" value={perWeek} display={perWeek} min={5} max={300} step={5} onChange={setPerWeek} />
        <Slider label="Left unanswered or answered late" value={unansweredPct} display={`${unansweredPct}%`} min={0} max={80} step={5} onChange={setUnanswered} />
        <Slider label="Would usually buy" value={closePct} display={`${closePct}%`} min={5} max={80} step={5} onChange={setClose} />
        <Slider label="Average sale" value={saleIdx} display={peso(avgSale)} min={0} max={SALES.length - 1} step={1} onChange={setSaleIdx} />
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-soft">
        An estimate from your own numbers, not a promise. The free assessment finds your real figure.
      </p>
      <a href="#assessment" className="btn-primary group mt-5">
        Find my real number
        <Arrow className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
