import SmoothTab from "@/components/kokonutui/smooth-tab";
import { PACKAGES, PARTNER_STEPS } from "../content.js";
import { Arrow, SectionHead, band, wrap } from "./marks.jsx";

function Partner() {
  return (
    <div>
      <h3 className="display text-[clamp(1.6rem,2.6vw,2.4rem)]">A partner for the whole job</h3>
      <p className="mt-4 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink-soft">
        For established businesses we work as an ongoing digital contractor: we assess, plan the
        work in stages, build one fix at a time, and measure each one before moving on. You decide
        the pace and the budget for each stage.
      </p>
      <ol className="mt-9 grid border-t-2 border-ink sm:grid-cols-4">
        {PARTNER_STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 border-b border-ink/15 py-4 sm:border-b-0 sm:pr-4">
            <span className="figures text-sm font-bold text-contour-deep">{i + 1}</span>
            <span className="font-semibold">{s}</span>
          </li>
        ))}
      </ol>
      <a href="#assessment" className="btn-primary mt-9">
        Book a free Digital Readiness Assessment <Arrow />
      </a>
    </div>
  );
}

function Packages() {
  return (
    <div>
      <h3 className="display text-[clamp(1.6rem,2.6vw,2.4rem)]">Three ways to get started</h3>
      <p className="mt-4 max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink-soft">
        Start with what fits where you are today. Each step builds on the last, so you can add more
        as you grow.
      </p>
      <ul className="mt-9 grid border-t-2 border-ink md:grid-cols-3">
        {PACKAGES.map((p) => (
          <li key={p.name} className="flex flex-col border-b border-ink/15 py-7 md:border-b-0 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0">
            <p className="flex items-center gap-3">
              <span className="text-2xl font-extrabold" style={{ fontStretch: "112%" }}>{p.name}</span>
              {p.popular && <span className="map-label bg-contour px-1.5 py-0.5 text-night">Most chosen</span>}
            </p>
            <p className="mt-1 font-semibold">{p.tagline}</p>
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{p.body}</p>
            <a href="#assessment" className="mt-5 inline-flex items-center gap-2 font-semibold text-contour-deep hover:underline">
              Ask for a quote <Arrow />
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
