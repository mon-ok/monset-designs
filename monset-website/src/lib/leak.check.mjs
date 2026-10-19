// run: node src/lib/leak.check.mjs
import assert from "node:assert/strict";
import { monthlyLeak, peso } from "./leak.js";

// 30 a week, 20% unanswered, 25% would buy, ₱5,000 sale -> 26 missed, 6.5 lost sales, ₱32,500
assert.deepEqual(monthlyLeak({ perWeek: 30, unansweredPct: 20, closePct: 25, avgSale: 5000 }), {
  missed: 26,
  lostSales: 6.5,
  pesos: 32500,
});
assert.equal(monthlyLeak({ perWeek: 0, unansweredPct: 50, closePct: 50, avgSale: 9000 }).pesos, 0);
assert.equal(monthlyLeak({ perWeek: 40, unansweredPct: 0, closePct: 30, avgSale: 2000 }).pesos, 0);
assert.equal(peso(32500), "₱32,500");
console.log("leak.js ok");
