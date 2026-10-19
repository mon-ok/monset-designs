import { useEffect, useRef } from "react";

// What every loader shares: wait (briefly) for the wordmark font, play the intro,
// let any intent to use the page skip it, and never hold anyone past a hard ceiling.
const FONT_WAIT = 1200;
const HARD_STOP = 4500;

// intro(el, done) plays the sequence and calls done() at its end; returns animations to pause.
// outro(el, reduce, onDone) lifts the loader away and calls onDone when it is gone.
export function useLoader(root, { intro, outro, onReveal, onDone }) {
  const ended = useRef(false);

  useEffect(() => {
    const el = root.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let anims = [];

    const finish = () => {
      if (ended.current) return;
      ended.current = true;
      anims.forEach((a) => a.pause());
      onReveal();
      outro(el, reduce, onDone);
    };

    const skip = () => finish();
    const events = ["pointerdown", "keydown", "wheel", "touchmove"];
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));

    let started = false;
    const run = () => {
      if (started || ended.current) return;
      started = true;
      anims = intro(el, reduce, finish) ?? [];
    };
    const cap = setTimeout(run, FONT_WAIT);
    document.fonts.load('800 32px "Archivo Variable"').finally(() => {
      clearTimeout(cap);
      run();
    });
    const hardStop = setTimeout(finish, HARD_STOP);

    return () => {
      clearTimeout(cap);
      clearTimeout(hardStop);
      events.forEach((e) => window.removeEventListener(e, skip));
      anims.forEach((a) => a.pause());
    };
  }, [root, intro, outro, onReveal, onDone]);
}
