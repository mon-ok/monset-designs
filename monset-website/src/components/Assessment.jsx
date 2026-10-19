import { useEffect, useRef, useState } from "react";
import { CONTACT } from "../content.js";
import { SectionHead, band, wrap } from "./marks.jsx";

const GETS = [
  "Your top gaps, in plain language",
  "Where to start, and what can wait",
  "What we'd measure to prove it worked",
];

// Calendly themed to the page: film ground, ink text, Monset orange
const CALENDLY_URL = `${CONTACT.calendly}?hide_gdpr_banner=1&background_color=eef1ec&text_color=0b1a2e&primary_color=e8892f`;

// the survey flag planted at the summit: the pole draws up, then the flag unfurls
function SummitFlag() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" className="summit-flag shrink-0" aria-hidden="true">
      <path className="flag-pole" d="M3 25V2" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" fill="none" pathLength="1" />
      <path className="flag-cloth" d="M4 3h15l-4 4.5 4 4.5H4z" fill="var(--color-contour)" />
    </svg>
  );
}

export default function Assessment() {
  const ref = useRef(null);
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setReached(true), io.disconnect()), { rootMargin: "0px 0px -25% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <section ref={ref} id="assessment" data-reached={reached || undefined} className={`summit bg-film text-ink ${band}`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <SectionHead
            title="Start with a free Digital Readiness Assessment"
            note="In as little as 15 minutes we'll ask how customers find you, what happens after they enquire, and where your team's time goes. You leave with a clear picture of your biggest gaps, whether or not you work with us."
          />
          <h3 className="mt-10 text-lg font-bold">What you get</h3>
          <ul className="mt-3 border-t border-ink/15">
            {GETS.map((g, i) => (
              <li key={g} className="get flex items-center gap-3 border-b border-ink/15 py-3.5 text-[1.0625rem] font-semibold" style={{ "--i": i }}>
                <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0" aria-hidden="true">
                  <circle cx="9" cy="9" r="8" fill="none" stroke="var(--color-contour-deep)" strokeWidth="1.5" />
                  <path className="get-tick" d="M5 9.2l2.6 2.6L13 6.4" fill="none" stroke="var(--color-contour-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
                </svg>
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
              <SummitFlag />
              Summit · 1,013 m · pick a time that suits you
            </p>
            <div className="calendly-reveal calendly-inline-widget" data-url={CALENDLY_URL} style={{ minWidth: 300, height: 720 }} />
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
