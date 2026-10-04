import { Plus, Check, CalendarX2 } from "lucide-react";
import { motion } from "motion/react";
import { useCart, slotId } from "../../context/CartContext.jsx";
import { useShowcase } from "../../context/ShowcaseContext.jsx";
import {
  getDay,
  getSport,
  priceFor,
  isPeak,
  STATUS,
} from "../../data/availability.js";
import { formatLongDate, formatRange, peso } from "../../utils/date.js";

/* Basic: plain toggle */
function BasicCourtButton({ name, inCart, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={inCart}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
        inCart
          ? "bg-primary text-on-primary"
          : "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/5"
      }`}
    >
      {inCart ? (
        <Check size={15} aria-hidden="true" />
      ) : (
        <Plus size={15} aria-hidden="true" />
      )}
      {name}
      <span className="sr-only">
        {inCart ? ", in cart. Select to remove" : ", add to cart"}
      </span>
    </button>
  );
}

/*
  Intermediate: hovering swipes colour into the right edge (about a quarter),
  adding to cart sweeps the colour across the whole button.
*/
function FxCourtButton({ name, inCart, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={inCart}
      onClick={onClick}
      className={`group relative inline-flex items-center overflow-hidden rounded-full border py-2 pl-4 pr-11 text-sm font-semibold transition-colors duration-300 ${
        inCart ? "border-primary" : "border-ink/25 hover:border-primary"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 bg-primary transition-[width] duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          inCart ? "w-full" : "w-0 group-hover:w-9"
        }`}
      />
      <span
        className={`relative z-10 transition-colors duration-300 ${inCart ? "text-on-primary delay-300" : "text-ink"}`}
      >
        {name}
      </span>
      <span
        className={`absolute right-3 z-10 flex transition-colors duration-300 ${
          inCart ? "text-on-primary" : "text-ink group-hover:text-on-primary"
        }`}
      >
        <motion.span
          key={inCart ? "check" : "plus"}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {inCart ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Plus size={15} aria-hidden="true" />
          )}
        </motion.span>
      </span>
      <span className="sr-only">
        {inCart ? ", in cart. Select to remove" : ", add to cart"}
      </span>
    </button>
  );
}

export default function SlotPanel({ sportId, dateKey }) {
  const { has, toggle } = useCart();
  const fx = useShowcase().tier === "intermediate";
  const sport = getSport(sportId);
  const CourtButton = fx ? FxCourtButton : BasicCourtButton;

  if (!dateKey) {
    return (
      <div className="p-6 text-sm text-ink/65">
        Select a date on the calendar to see open times.
      </div>
    );
  }

  const day = getDay(sportId, dateKey);
  const openSlots = day.slots.filter((s) => s.free.length > 0);
  const status = STATUS[day.status];
  const courtName = (id) => sport.courts.find((c) => c.id === id)?.name ?? id;

  // Intermediate: rows ease in whenever the date or sport changes
  const Row = fx ? motion.li : "li";
  const rowProps = (i) =>
    fx
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.45,
            delay: Math.min(i, 8) * 0.04,
            ease: [0.22, 1, 0.36, 1],
          },
        }
      : {};

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line p-6">
        <p className="text-sm text-ink/60">{sport.name}</p>
        <h2 className="display mt-1 text-2xl">{formatLongDate(dateKey)}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: status.color }}
            aria-hidden="true"
          />
          <span className="font-medium">{status.label}</span>
          <span className="text-ink/60">
            {day.freeCount} of {day.total} court hours open
          </span>
        </p>
      </div>

      {openSlots.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
          <CalendarX2 size={32} className="text-accent" aria-hidden="true" />
          <p className="mt-4 font-semibold">No open times on this date</p>
          <p className="mt-2 text-sm text-ink/65">
            Try a date marked green or yellow on the calendar.
          </p>
        </div>
      ) : (
        <ul
          key={`${sportId}-${dateKey}`}
          className="min-h-0 flex-1 divide-y divide-line overflow-y-auto px-6"
        >
          {openSlots.map(({ hour, free }, i) => {
            const price = priceFor(sport, dateKey, hour);
            return (
              <Row key={hour} className="py-4" {...rowProps(i)}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold tabular-nums">
                    {formatRange(hour)}
                  </p>
                  <p className="text-sm text-ink/60 tabular-nums">
                    {peso(price)}
                    {isPeak(dateKey, hour) && (
                      <span className="ml-1.5 text-xs">peak</span>
                    )}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {free.map((courtId) => {
                    const id = slotId({ sportId, dateKey, hour, courtId });
                    const name = courtName(courtId);
                    return (
                      <CourtButton
                        key={courtId}
                        name={name}
                        inCart={has(id)}
                        onClick={() =>
                          toggle({
                            id,
                            sportId,
                            dateKey,
                            hour,
                            courtId,
                            courtName: name,
                            price,
                          })
                        }
                      />
                    );
                  })}
                </div>
              </Row>
            );
          })}
        </ul>
      )}
    </div>
  );
}
