import { useEffect, useRef, useState } from "react";
import SmoothTab from "@/components/kokonutui/smooth-tab";
import { PACKAGES, PARTNER_STEPS } from "../content.js";
import { Arrow, SectionHead, band, wrap } from "./marks.jsx";

// true once the element has scrolled into view (stays true)
function useSeen(margin = "0px 0px -20% 0px") {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: margin });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen];
}

function Partner() {
  const [ref, seen] = useSeen();
  return (
    <div ref={ref}>
      <h3 className="display text-[clamp(1.6rem,2.6vw,2.4rem)]">A partner for the whole job</h3>
      <p className="mt-4 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink-soft">
        For established businesses we work as an ongoing digital contractor: we assess, plan the
        work in stages, build one fix at a time, and measure each one before moving on. You decide
        the pace and the budget for each stage.
      </p>
      {/* the route card: each stage stamps in like an inspector's mark */}
      <ol className="route-card mt-9 grid gap-3 sm:grid-cols-4" data-seen={seen || undefined}>
        {PARTNER_STEPS.map((s, i) => (
          <li key={s} className="route-stamp flex items-center gap-3 border-2 border-ink px-4 py-4" style={{ "--i": i }}>
            <span className="figures grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-contour-deep text-sm font-bold text-contour-deep">
              {i + 1}
            </span>
            <span className="font-semibold leading-snug">{s}</span>
          </li>
        ))}
      </ol>
      <a href="#assessment" className="btn-primary group mt-9">
        Book a free Digital Readiness Assessment
        <Arrow className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function Packages() {
  const [ref, seen] = useSeen();
  return (
    <div ref={ref}>
      <h3 className="display text-[clamp(1.6rem,2.6vw,2.4rem)]">Three ways to get started</h3>
      <p className="mt-4 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink-soft">
        Start with what fits where you are today. Each step builds on the last, so you can add more
        as you grow.
      </p>
      {/* packages as tear-off tickets: the stub is the action */}
      <ul className="tickets mt-12 grid gap-12 md:grid-cols-3 md:gap-6" data-seen={seen || undefined}>
        {PACKAGES.map((p, i) => (
          <li key={p.name} className="ticket relative flex flex-col" style={{ "--i": i }} data-popular={p.popular || undefined}>
            {p.popular && (
              <span className="best-seller" aria-label="Best seller">
                Best
                <br />
                seller
              </span>
            )}
            <div className="ticket-body flex flex-1 flex-col px-6 pb-6 pt-6">
              <p className="flex items-center gap-3">
                <span className="text-2xl font-extrabold" style={{ fontStretch: "112%" }}>{p.name}</span>

              </p>
              <p className="mt-1 font-semibold">{p.tagline}</p>
              <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{p.body}</p>
            </div>
            <a href="#assessment" className="ticket-stub group flex items-center justify-between px-6 py-4 font-semibold">
              Ask for a quote
              <Arrow className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-ink-soft">
        <strong className="text-ink">Need just one thing?</strong> Every service is available on its
        own. <a href="#assessment" className="font-semibold text-contour-deep underline">Tell us what you need.</a>
      </p>
    </div>
  );
}

export default function Start({ track, onTrack }) {
  return (
    <section id="start" className={`bg-film text-ink ${band}`}>
      <div className={wrap}>
        <SectionHead title="Where to start" />
        <div className="mt-10">
          <SmoothTab
            label="Your situation"
            value={track}
            onChange={onTrack}
            items={[
              { id: "established", title: "Established business", content: <Partner /> },
              { id: "starting", title: "Starting out", content: <Packages /> },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
