import { motion } from "motion/react";
import SmoothTab from "@/components/kokonutui/smooth-tab";
import { PROBLEMS } from "../content.js";
import { Benchmark, SectionHead, band, wrap } from "./marks.jsx";
import LeakMeter from "./LeakMeter.jsx";

// the leaks get pinned one after another when the list comes into view (or its tab slides in)
const list = { show: { transition: { staggerChildren: 0.07 } } };
const pin = {
  hidden: { opacity: 0, y: -10, scale: 0.6 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.5, bounce: 0.4 } },
};

function ProblemList({ items }) {
  return (
    <motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      {items.map((p) => (
        <li key={p.title} className="flex gap-4 border-t border-ink/15 py-6">
          <motion.span variants={pin} className="mt-1 shrink-0">
            <Benchmark className="block" />
          </motion.span>
          <div>
            <h3 className="text-[1.1875rem] font-bold leading-snug text-ink" style={{ fontStretch: "104%" }}>
              {p.title}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
          </div>
        </li>
      ))}
    </motion.ul>
  );
}

export default function Problems({ track, onTrack }) {
  return (
    <section id="problems" className={`bg-film text-ink ${band}`}>
      <div className={wrap}>
        <SectionHead
          title="Where businesses quietly lose money"
          note="Most of these never show up as one big problem. They show up as small leaks, every day."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
          <SmoothTab
            label="Your situation"
            value={track}
            onChange={onTrack}
            items={[
              { id: "established", title: "Established business", content: <ProblemList items={PROBLEMS.established} /> },
              { id: "starting", title: "Starting out", content: <ProblemList items={PROBLEMS.starting} /> },
            ]}
          />
          </div>
          {/* the meter stays in view while the leaks scroll past */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <LeakMeter />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
