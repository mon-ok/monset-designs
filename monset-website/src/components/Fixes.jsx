import { useEffect, useRef, useState } from "react";
import { FIXES, TOOLS } from "../content.js";
import { MockWindow } from "./FixMocks.jsx";
import LogoMarquee from "./LogoMarquee.jsx";
import { SectionHead, band, wrap } from "./marks.jsx";

const STAGES = [
  ["Baseline", "where you are today"],
  ["After", "measured once it's live"],
  ["Review", "checked again later"],
];

// each measure gets three chips that fill in order when its fix is being read
function MeasureRow({ name, on }) {
  return (
    <li className="measure flex items-center justify-between gap-4 border-t border-ink/10 py-2" data-on={on || undefined}>
      <span className="text-[0.9375rem]">{name}</span>
      <span className="flex shrink-0 gap-1" aria-hidden="true">
        {STAGES.map(([s], i) => (
          <span key={s} className={`chip chip-${i} h-2.5 w-7`} style={{ "--d": `${150 + i * 180}ms` }} />
        ))}
      </span>
    </li>
  );
}

export default function Fixes() {
  const [active, setActive] = useState(0);
  const items = useRef([]);

  // the fix crossing the middle of the screen is the one being read
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="fixes" className={`bg-film text-ink ${band}`}>
      <div className={wrap}>
        <SectionHead
          title="What we fix"
          note="Every fix is built for your business, set up by us, and looked after once it's live. Each one comes with the numbers we'll measure it by."
        />

        {/* one legend for every measure below */}
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.875rem] text-ink-soft" aria-label="How we measure">
          {STAGES.map(([s, note], i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={`chip chip-${i} h-2.5 w-7`} />
              <strong className="text-ink">{s}</strong> {note}
            </li>
          ))}
        </ul>

        <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-14">
          <ol className="lg:col-span-6">
            {FIXES.map((f, i) => {
              const on = i === active;
              return (
                <li
                  key={f.title}
                  ref={(el) => (items.current[i] = el)}
                  data-i={i}
                  data-on={on || undefined}
                  className="fix-item relative flex flex-col justify-center border-t border-ink/15 py-10 lg:min-h-[78vh]"
                >
                  {/* leader line out to the screen it describes */}
                  <span className="leader absolute right-[-3.5rem] top-1/2 hidden h-px w-[3.5rem] origin-left bg-contour lg:block" aria-hidden="true" />
                  <h3 className="fix-title display text-[clamp(1.6rem,2.4vw,2.2rem)]">{f.title}</h3>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed">{f.body}</p>
                  <details className="group mt-4">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-semibold text-contour-deep [&::-webkit-details-marker]:hidden">
                      What's included
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="transition-transform duration-200 group-open:rotate-45">
                        <path d="M6 1v10M1 6h10" />
                      </svg>
                    </summary>
                    <p className="mt-2 leading-relaxed text-ink-soft">{f.included}</p>
                  </details>
                  <ul className="mt-6" aria-label="What we measure">
                    {f.measure.map((m) => (
                      <MeasureRow key={m} name={m} on={on} />
                    ))}
                  </ul>
                  <p className="mt-3 text-[0.8125rem] text-ink-soft/80">{f.tech}</p>
                  {/* phones: the screen sits right under its fix */}
                  <MockWindow id={f.mock} on={on} className="mt-6 lg:hidden" />
                </li>
              );
            })}
          </ol>

          {/* desktop: one window stays in view and becomes each fix in turn */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(50vh-11rem)]">
              <div className="relative">
                {FIXES.map((f, i) => (
                  <div key={f.mock} className="mock-slot" data-active={i === active || undefined} aria-hidden="true">
                    <MockWindow id={f.mock} on={i === active} />
                  </div>
                ))}
              </div>
              <p className="map-label figures mt-4 text-ink-soft">
                {String(active + 1).padStart(2, "0")} / {String(FIXES.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t-2 border-ink pt-9 lg:grid-cols-12">
          <p className="text-xl font-bold leading-snug lg:col-span-6" style={{ fontStretch: "104%" }}>
            You own what we build. Our custom systems are yours outright, with no per-month licence fees
            like most POS and booking software.
          </p>
          {/* min-w-0: the marquee's long track must not widen the grid column on phones */}
          <div className="min-w-0 lg:col-span-6">
            <p className="map-label text-ink-soft">Works with the tools you already use</p>
            <div className="mt-3">
              <LogoMarquee items={TOOLS} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
