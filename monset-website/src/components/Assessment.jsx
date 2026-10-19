import { useEffect } from "react";
import { CONTACT } from "../content.js";
import { SectionHead, band, wrap } from "./marks.jsx";

const GETS = [
  "Your top gaps, in plain language",
  "Where to start, and what can wait",
  "What we'd measure to prove it worked",
];

// Calendly themed to the page: film ground, ink text, Monset orange
const CALENDLY_URL = `${CONTACT.calendly}?hide_gdpr_banner=1&background_color=eef1ec&text_color=0b1a2e&primary_color=e8892f`;

export default function Assessment() {
  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <section id="assessment" className={`bg-film text-ink ${band}`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <SectionHead
            title="Start with a free Digital Readiness Assessment"
            note="In as little as 15 minutes we'll ask how customers find you, what happens after they enquire, and where your team's time goes. You leave with a clear picture of your biggest gaps, whether or not you work with us."
          />
          <h3 className="mt-10 text-lg font-bold">What you get</h3>
          <ul className="mt-3 border-t border-ink/15">
            {GETS.map((g) => (
              <li key={g} className="border-b border-ink/15 py-3.5 text-[1.0625rem] font-semibold">
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-ink-soft">Or reach us directly:</p>
          <p className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-lg font-semibold">
            <a href={`mailto:${CONTACT.email}`} className="underline decoration-contour decoration-2 hover:text-contour-deep">{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="figures underline decoration-contour decoration-2 hover:text-contour-deep">{CONTACT.phone}</a>
          </p>
        </div>

        <div className="lg:col-span-7">
          <div>
            <p className="map-label figures flex items-center gap-2 border-b-2 border-ink pb-3 text-contour-deep">
              <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M7 0l7 12H0z" fill="currentColor" /></svg>
              Summit · 1,013 m · pick a time that suits you
            </p>
            <div className="calendly-inline-widget" data-url={CALENDLY_URL} style={{ minWidth: 300, height: 720 }} />
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            Calendar not loading?{" "}
            <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              Open the booking page
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
