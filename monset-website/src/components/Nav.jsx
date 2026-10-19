import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { MonsetMark, Wordmark } from "./Logo.jsx";
import { useClimb } from "./ElevationRuler.jsx";

const LINKS = [
  { href: "#fixes", label: "What we fix" },
  { href: "#method", label: "How we work" },
  { href: "#work", label: "Our work" },
  { href: "#questions", label: "Questions" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const climb = useClimb();
  // tuck away while reading down, come back the moment you scroll up
  const [tucked, setTucked] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setTucked(y > prev && y > 240);
  });
  const hidden = tucked && !open && !reduce;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 border-b border-film/10 bg-night lg:left-16"
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: hidden ? 0.2 : 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="mx-auto flex h-16 max-w-[84rem] items-center gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Monset.co, back to top">
          <MonsetMark className="h-7 w-7" />
          <Wordmark className="text-lg" />
          <span className="map-label hidden border-l border-film/20 pl-2.5 text-film/60 xl:inline">
            Your digital contractor
          </span>
        </a>

        {/* phones have no room for the ruler: the reading rides in the bar instead */}
        <span className="map-label figures hidden whitespace-nowrap text-contour min-[400px]:inline lg:hidden" aria-hidden="true">
          {climb.reading.toLocaleString("en-US")} m <span className="text-film/55">· {climb.stage}</span>
        </span>

        <nav className="ml-auto hidden items-center gap-7 text-[0.9375rem] text-film/80 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors duration-200 hover:text-film">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#assessment" className="btn-primary ml-auto whitespace-nowrap !px-3.5 !py-2 text-sm sm:!px-4 sm:!py-2.5 sm:text-[0.9375rem] md:ml-0">
          <span className="sm:hidden">Free assessment</span>
          <span className="hidden sm:inline">Book a free assessment</span>
        </a>

        <button
          type="button"
          className="-mr-2 grid h-10 w-10 place-items-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 7h16M3 15h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-film/10 px-5 pb-5 md:hidden" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-film/10 py-3.5 text-lg"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </motion.header>
  );
}
