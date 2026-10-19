// What unanswered enquiries could be costing a month, from the visitor's own numbers.
// enquiries a week x weeks in a month x share left unanswered x share that would have bought x average sale
export const WEEKS_PER_MONTH = 52 / 12;

export function monthlyLeak({ perWeek, unansweredPct, closePct, avgSale }) {
  const missed = perWeek * WEEKS_PER_MONTH * (unansweredPct / 100);
  const lostSales = missed * (closePct / 100);
  return {
    missed: Math.round(missed),
    lostSales: Math.round(lostSales * 10) / 10,
    pesos: Math.round(lostSales * avgSale),
  };
}

export const peso = (n) => "₱" + Math.round(n).toLocaleString("en-PH");
