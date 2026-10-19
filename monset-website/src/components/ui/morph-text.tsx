// Adapted from VengeanceUI morph-text (MIT, vengenceui.com): Archivo instead of a hosted
// Space Grotesk, left-aligned for a sentence, and a still first word under reduced motion.
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface MorphTextProps {
  words: string[];
  /** ms each word holds before the next morphs in */
  interval?: number;
  className?: string;
}

export function MorphText({ words, interval = 2600, className }: MorphTextProps) {
  // unique id so several instances never share a filter
  const filterId = `morph-threshold-${useId().replace(/:/g, "")}`;
  const total = (interval / 1000) * words.length;

  return (
    <span className={cn("morph-text relative inline-block align-bottom", className)}>
      <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          {/* the threshold makes neighbouring blurred letters melt into each other */}
          <filter id={filterId}>
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      {/* screen readers get the whole list once, not a word that keeps changing */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="morph-stage relative block" style={{ filter: `url(#${filterId})`, height: "1.1em" }}>
        {words.map((w, i) => (
          <span
            key={w}
            className="morph-word absolute left-0 top-0 whitespace-nowrap"
            style={{ animationDuration: `${total}s`, animationDelay: `${(i * interval) / 1000}s` }}
          >
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}

export default MorphText;
