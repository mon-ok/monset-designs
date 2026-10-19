import { QUESTIONS } from "../content.js";
import { SectionHead, band, wrap } from "./marks.jsx";

export default function Questions() {
  return (
    <section id="questions" className={`bg-night text-film ${band}`}>
      <div className={wrap}>
        <SectionHead dark title="What owners ask us before they say yes" />
        <dl className="mt-14 grid gap-x-14 md:grid-cols-2">
          {QUESTIONS.map((item) => (
            <div key={item.q} className="border-t border-film/15 py-7">
              <dt className="text-[1.1875rem] font-bold leading-snug" style={{ fontStretch: "104%" }}>
                <span className="text-contour">&ldquo;</span>
                {item.q}
                <span className="text-contour">&rdquo;</span>
              </dt>
              <dd className="mt-2.5 leading-relaxed text-mist">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
