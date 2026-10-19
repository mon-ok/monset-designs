import { WORK, WORK_CHECKED } from "../content.js";
import { External, SectionHead, band, wrap } from "./marks.jsx";

export default function Work() {
  return (
    <section id="work" className={`bg-night text-film ${band}`}>
      <div className={wrap}>
        <SectionHead
          dark
          title="Things we've built"
          note="Real client work and demonstration builds, clearly marked. Open any of them and click around. They're live."
        />

        <ul className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {WORK.map((w) => (
            <li key={w.name}>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="overflow-hidden border border-film/15 bg-night-2">
                  <img
                    src={w.image}
                    alt={`Screenshot of ${w.name}`}
                    width="1200"
                    height="750"
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-5 text-2xl font-bold" style={{ fontStretch: "106%" }}>{w.name}</h3>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={`map-label px-1.5 py-0.5 ${w.client ? "bg-contour text-night" : "border border-film/30 text-film/80"}`}>
                    {w.status}
                  </span>
                  <span className="map-label text-film/45">Live · checked {WORK_CHECKED}</span>
                </p>
                <p className="mt-2 leading-relaxed text-mist">{w.body}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-contour group-hover:underline">
                  Open the live site <External />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
