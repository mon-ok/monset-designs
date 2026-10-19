import Lenis from "lenis";
import "lenis/dist/lenis.css";

// One smooth-scroll instance for the page (tuned like the Kalea site).
// Skipped entirely for reduced motion, where native scrolling is the right answer.
let lenis = null;
const OFFSET = -72; // clear the fixed nav

export function startSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.75 });
  let raf = requestAnimationFrame(function tick(t) {
    lenis.raf(t);
    raf = requestAnimationFrame(tick);
  });

  // in-page links glide through Lenis instead of jumping
  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href") === "#") return;
    const el = document.querySelector(a.getAttribute("href"));
    if (!el) return;
    e.preventDefault();
    scrollToEl(el);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    cancelAnimationFrame(raf);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToEl(el) {
  if (lenis) lenis.scrollTo(el, { offset: OFFSET, duration: 1.2 });
  else el.scrollIntoView();
}
