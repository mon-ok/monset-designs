import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WORK, WORK_CHECKED } from "../content.js";
import { setScrollLock } from "../lib/scroll.js";
import { External, SectionHead, band, wrap } from "./marks.jsx";

const SLATS = 8;
const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// The project screen: still by default, the recording plays on hover (or while on screen on phones),
// and it opens through louvre slats the first time it scrolls into view.
function Screen({ w, onOpen }) {
  const box = useRef(null);
  const video = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = box.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setOpen(true);
    // first time in view: open the louvre
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOpen(true), io.disconnect()));
    io.observe(el);

    // touch screens have no hover: play only while the card is mostly on screen,
    // checked against its real position after each scroll frame
    let raf = 0;
    const check = () => {
      raf = 0;
      const v = video.current;
      if (!v) return;
      const r = el.getBoundingClientRect();
      const shown = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      if (shown > r.height * 0.6) v.play().catch(() => {});
      else if (!v.paused) v.pause();
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(check));
    const touch = !fine() && !reduce;
    if (touch) {
      window.addEventListener("scroll", onScroll, { passive: true });
      check();
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (touch) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const play = () => fine() && video.current?.play().catch(() => {});
  const stop = () => {
    if (!fine() || !video.current) return;
    video.current.pause();
    video.current.currentTime = 0;
  };

  return (
    <motion.button
      ref={box}
      layoutId={`work-${w.name}`}
      type="button"
      onClick={onOpen}
      onPointerEnter={play}
      onPointerLeave={stop}
      className="work-screen group relative block aspect-[16/10] w-full overflow-hidden border border-film/15 bg-night-2 text-left"
      data-open={open || undefined}
      aria-label={`Watch a preview of ${w.name}`}
    >
      <img src={w.image} alt="" width="1200" height="750" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
      <video
        ref={video}
        src={w.clip}
        poster={w.image}
        muted
        loop
        playsInline
        preload="none"
        className="work-video absolute inset-0 h-full w-full object-cover object-top"
        onPlaying={(e) => e.currentTarget.setAttribute("data-playing", "")}
        onPause={(e) => e.currentTarget.removeAttribute("data-playing")}
      />
      {/* louvre slats that turn open on first view */}
      <span className="slats pointer-events-none absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: SLATS }, (_, i) => (
          <span key={i} className="slat h-full flex-1 bg-night-2" style={{ "--i": Math.abs(i - (SLATS - 1) / 2) }} />
        ))}
      </span>
      <span className="map-label absolute bottom-3 right-3 flex items-center gap-1.5 bg-night/85 px-2 py-1 text-film opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden="true"><path d="M0 0l9 5-9 5z" fill="currentColor" /></svg>
        Watch
      </span>
    </motion.button>
  );
}

// the expanded view grows out of the card it came from (shared layout)
function Viewer({ w, onClose }) {
  const close = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    setScrollLock(true);
    close.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLock(false);
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={w.name}>
      <motion.div
        className="absolute inset-0 bg-night/85 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl">
        <motion.div layoutId={`work-${w.name}`} className="overflow-hidden border border-film/20 bg-night-2" transition={{ type: "spring", duration: 0.5, bounce: 0.12 }}>
          <video src={w.clip} poster={w.image} autoPlay muted loop playsInline controls className="aspect-[16/10] w-full bg-night object-cover object-top" />
        </motion.div>
        <motion.div
          className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-film"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <h3 className="text-2xl font-bold" style={{ fontStretch: "106%" }}>{w.name}</h3>
          <span className={`map-label px-1.5 py-0.5 ${w.client ? "bg-contour text-night" : "border border-film/30 text-film/80"}`}>{w.status}</span>
          <a href={w.url} target="_blank" rel="noopener noreferrer" className="btn-primary ml-auto !py-2.5">
            Open the live site <External />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <button ref={close} type="button" onClick={onClose} className="grid h-11 w-11 place-items-center border border-film/25 hover:border-film/60" aria-label="Close preview">
            <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function Work() {
  const [viewing, setViewing] = useState(null);
  const current = WORK.find((w) => w.name === viewing);
  const close = useCallback(() => setViewing(null), []);

  return (
    <section id="work" className={`bg-night text-film ${band}`}>
      <div className={wrap}>
        <SectionHead
          dark
          title="Things we've built"
          note="Real client work and demonstration builds, clearly marked. Hover to watch a quick tour, open one up, or visit the live site and click around."
        />

        <ul className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {WORK.map((w) => (
            <li key={w.name}>
              <Screen w={w} onOpen={() => setViewing(w.name)} />
              <h3 className="mt-5 text-2xl font-bold" style={{ fontStretch: "106%" }}>{w.name}</h3>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={`map-label px-1.5 py-0.5 ${w.client ? "bg-contour text-night" : "border border-film/30 text-film/80"}`}>{w.status}</span>
                <span className="map-label text-film/45">Live · checked {WORK_CHECKED}</span>
              </p>
              <p className="mt-2 leading-relaxed text-mist">{w.body}</p>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-contour hover:underline">
                Open the live site <External />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>{current && <Viewer key={current.name} w={current} onClose={close} />}</AnimatePresence>
    </section>
  );
}
