import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "../content.js";
import { MonsetMark } from "./Logo.jsx";
import MorphText from "@/components/ui/morph-text";
import { band, wrap } from "./marks.jsx";

const WORRIES = ["the cost", "disruption", "their staff", "monthly fees", "the payoff"];

// one exchange: the owner asks, Monset types, the answer lands. Plays once, when it scrolls in.
function Exchange({ q, a, i }) {
  const ref = useRef(null);
  const [step, setStep] = useState(0); // 0 nothing, 1 asked, 2 typing, 3 answered

  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(3);
      return;
    }
    const timers = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers.push(setTimeout(() => setStep(1), 0));
        timers.push(setTimeout(() => setStep(2), 380));
        timers.push(setTimeout(() => setStep(3), 380 + 650 + Math.min(a.length * 4, 500)));
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [a.length]);

  return (
    <li ref={ref} className="chat-exchange" data-step={step} style={{ "--i": i }}>
      <p className="chat-q ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-film px-4 py-3 text-[1.0625rem] font-semibold text-ink">
        {q}
      </p>
      <div className="mt-3 flex items-end gap-2.5">
        <span className="chat-avatar grid h-8 w-8 shrink-0 place-items-center rounded-full border border-film/20 bg-night-2">
          <MonsetMark className="h-4 w-4" />
        </span>
        <div className="relative max-w-[88%]">
          <span className="chat-typing absolute bottom-0 left-0 flex gap-1 rounded-2xl rounded-bl-sm bg-night-2 px-4 py-4" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-film/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-film/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-film/70" />
          </span>
          <p className="chat-a rounded-2xl rounded-bl-sm border border-film/10 bg-night-2 px-4 py-3 leading-relaxed text-film/90">{a}</p>
        </div>
      </div>
    </li>
  );
}

export default function Questions() {
  return (
    <section id="questions" className={`bg-night text-film ${band}`}>
      <div className={wrap}>
        <header className="max-w-[46rem]">
          <h2 className="display text-[clamp(2rem,3.6vw,3.4rem)]">
            What owners ask us about <MorphText words={WORRIES} className="min-w-[9ch] text-contour" />
          </h2>
          <p className="mt-5 text-[clamp(1.05rem,1.3vw,1.2rem)] leading-relaxed text-mist">
            The questions we hear before anyone says yes, answered the way we answer them on a call.
          </p>
        </header>

        <ol className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {QUESTIONS.map((item, i) => (
            <Exchange key={item.q} q={item.q} a={item.a} i={i % 2} />
          ))}
        </ol>
      </div>
    </section>
  );
}
