// Small illustrative product screens, one per fix. Every value here is made-up demo data,
// and the window is labelled "Illustrative". Each mock shows its finished state by default;
// [data-on] on the window replays how it got there (CSS in index.css, .m-* classes).

const d = (ms) => ({ "--d": `${ms}ms` });

function Inbox() {
  const rows = [
    ["MS", "Maria S.", "Hi, is this still available?", "Replied · 2 min"],
    ["JR", "Jun R.", "Can I book for Saturday?", "Replied · 4 min"],
    ["BL", "Bea L.", "How much for 20 pax?", "Follow-up sent"],
    ["CM", "Carlo M.", "Do you deliver to Mandaue?", "Replied · 1 min"],
  ];
  return (
    <ul className="space-y-2">
      {rows.map(([ini, name, msg, status], i) => (
        <li key={name} className="m-in flex items-center gap-3 border border-film/10 bg-night px-3 py-2.5" style={d(i * 140)}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-film/10 text-[0.6875rem] font-bold">{ini}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.8125rem] font-semibold">{name}</span>
            <span className="block truncate text-[0.75rem] text-film/60">{msg}</span>
          </span>
          <span className="relative text-[0.6875rem] font-bold">
            <span className="m-swap-out absolute right-0 whitespace-nowrap bg-pin px-1.5 py-0.5 text-film" style={d(500 + i * 220)}>New</span>
            <span className="m-swap-in whitespace-nowrap bg-contour px-1.5 py-0.5 text-night" style={d(500 + i * 220)}>{status}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Flow() {
  const nodes = ["New enquiry", "Saved to your sheet", "Reminder sent", "Owner notified"];
  return (
    <div>
      <ol className="relative grid grid-cols-2 gap-3">
        {nodes.map((n, i) => (
          <li key={n} className="m-light border border-film/15 bg-night px-3 py-3" style={d(300 + i * 450)}>
            <span className="map-label text-contour">Step {i + 1}</span>
            <span className="mt-1 block text-[0.875rem] font-semibold">{n}</span>
          </li>
        ))}
      </ol>
      <div className="relative mt-4 h-1 bg-film/10">
        <span className="m-fill absolute inset-0 origin-left bg-contour" style={{ ...d(200), "--dur": "1900ms" }} />
      </div>
      <p className="mt-3 text-[0.8125rem] text-film/70">Runs on its own, day and night. Nobody copies anything by hand.</p>
    </div>
  );
}

function Dashboard() {
  const kpis = [["Sales today", "₱18,240"], ["Customers", "46"], ["Low stock", "3"]];
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {kpis.map(([k, v], i) => (
          <div key={k} className="m-in border border-film/10 bg-night px-3 py-2.5" style={d(i * 120)}>
            <span className="block text-[0.6875rem] text-film/60">{k}</span>
            <span className="figures mt-0.5 block text-lg font-bold">{v}</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 90" className="mt-4 w-full" aria-hidden="true">
        {[22, 45, 68].map((yy) => (
          <line key={yy} x1="0" x2="300" y1={yy} y2={yy} stroke="currentColor" strokeOpacity=".08" />
        ))}
        <path
          className="m-draw"
          style={d(350)}
          pathLength="1"
          d="M0 70 L30 64 L60 66 L90 52 L120 56 L150 40 L180 44 L210 30 L240 34 L270 18 L300 22"
          fill="none"
          stroke="var(--color-contour)"
          strokeWidth="2.5"
        />
      </svg>
      <p className="text-[0.8125rem] text-film/70">Updated as it happens, not at month end.</p>
    </div>
  );
}

function Pos() {
  const lines = [["Iced coffee ×2", "₱240"], ["Ensaymada", "₱65"], ["Chicken sandwich", "₱180"]];
  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="col-span-3 grid grid-cols-2 gap-2">
        {["Iced coffee", "Ensaymada", "Sandwich", "Juice"].map((p, i) => (
          <div key={p} className="m-in border border-film/10 bg-night px-2.5 py-2" style={d(i * 90)}>
            <span className="block text-[0.75rem] font-semibold">{p}</span>
            <span className={`mt-1 block text-[0.6875rem] ${i === 1 ? "text-pin" : "text-film/55"}`}>{i === 1 ? "Low · 3 left" : `${20 + i * 7} in stock`}</span>
          </div>
        ))}
      </div>
      <div className="col-span-2 border border-film/15 bg-night p-2.5">
        <span className="map-label text-film/60">Current sale</span>
        <ul className="mt-2 space-y-1.5">
          {lines.map(([n, v], i) => (
            <li key={n} className="m-in flex justify-between text-[0.75rem]" style={d(400 + i * 260)}>
              <span>{n}</span>
              <span className="figures">{v}</span>
            </li>
          ))}
        </ul>
        <p className="m-in figures mt-3 flex justify-between border-t border-film/15 pt-2 font-bold" style={d(1250)}>
          <span>Total</span>
          <span className="text-contour">₱485</span>
        </p>
      </div>
    </div>
  );
}

function Booking() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const rooms = ["Room 1", "Room 2", "Room 3"];
  const stays = [[0, 0, 3], [1, 2, 4], [2, 1, 2], [0, 4, 3]];
  return (
    <div>
      <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] gap-1 text-[0.625rem]">
        <span />
        {days.map((dd) => (
          <span key={dd} className="text-center text-film/55">{dd}</span>
        ))}
        {rooms.map((r, ri) => (
          <div key={r} className="contents">
            <span className="self-center text-film/70">{r}</span>
            {days.map((dd, di) => (
              <span key={dd} className="relative h-7 bg-film/5">
                {stays.map(([sr, start, len], si) =>
                  sr === ri && start === di ? (
                    <span
                      key={si}
                      className="m-grow absolute inset-y-0.5 left-0 z-10 origin-left bg-contour"
                      style={{ ...d(si * 220), width: `calc(${len * 100}% + ${(len - 1) * 4}px)` }}
                    />
                  ) : null
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="m-shake mt-3 inline-flex items-center gap-2 border border-pin/60 px-2 py-1 text-[0.75rem]" style={d(1100)}>
        <svg width="10" height="10" viewBox="0 0 10 10" stroke="var(--color-pin)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6" /></svg> Room 1, Wed is already booked. Double booking blocked.
      </p>
    </div>
  );
}

function Search() {
  return (
    <div>
      <div className="flex items-center gap-2 rounded-full border border-film/20 bg-night px-4 py-2 text-[0.8125rem]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" />
          <path d="M9.5 9.5L13 13" />
        </svg>
        <span className="m-type">best bakery near me cebu</span>
      </div>
      <ul className="mt-3 space-y-2">
        <li className="m-rise border border-contour/60 bg-night px-3 py-2.5" style={d(900)}>
          <span className="block text-[0.6875rem] text-film/55">yourbusiness.ph</span>
          <span className="block text-[0.875rem] font-semibold text-contour">Your Business · Bakery in Cebu City</span>
          <span className="block text-[0.6875rem] text-film/70">★ 4.9 · Open until 9 PM · Order online</span>
        </li>
        <li className="m-in border border-film/10 bg-night px-3 py-2 opacity-60" style={d(1100)}>
          <span className="block text-[0.8125rem]">Another bakery · Mandaue</span>
        </li>
      </ul>
      <p className="m-in mt-3 border-l-0 bg-film/5 px-3 py-2 text-[0.75rem] text-film/80" style={d(1500)}>
        <span className="map-label mr-2 text-contour">AI answer</span>
        Locals recommend Your Business for fresh ensaymada…
      </p>
    </div>
  );
}

function Uptime() {
  return (
    <div>
      <p className="flex items-center gap-2 text-[0.875rem] font-semibold">
        <span className="m-pulse h-2.5 w-2.5 rounded-full bg-contour" /> All systems running
      </p>
      <div className="mt-4 flex h-14 items-end gap-[3px]">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="m-bar flex-1 origin-bottom bg-contour/80" style={{ ...d(i * 30), height: `${70 + ((i * 37) % 30)}%` }} />
        ))}
      </div>
      <p className="mt-2 flex justify-between text-[0.6875rem] text-film/55">
        <span>30 days ago</span>
        <span>Today</span>
      </p>
      <p className="mt-3 text-[0.8125rem] text-film/70">Updated, secured and backed up · last backup today, 2:00 AM</p>
    </div>
  );
}

export const MOCKS = {
  inbox: { title: "Enquiries", Screen: Inbox },
  flow: { title: "Automation", Screen: Flow },
  dashboard: { title: "Dashboard", Screen: Dashboard },
  pos: { title: "Point of sale", Screen: Pos },
  booking: { title: "Bookings", Screen: Booking },
  search: { title: "Search", Screen: Search },
  uptime: { title: "Maintenance", Screen: Uptime },
};

// the app window every mock lives in
export function MockWindow({ id, on, className = "" }) {
  const { title, Screen } = MOCKS[id];
  return (
    <div data-on={on || undefined} className={`mock-window border border-ink/20 bg-night-2 text-film shadow-[0_18px_40px_-18px_rgb(11_26_46/0.45)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-film/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-film/25" />
        <span className="h-2 w-2 rounded-full bg-film/25" />
        <span className="ml-1 text-[0.75rem] font-semibold">{title}</span>
        <span className="map-label ml-auto text-film/45">Illustrative</span>
      </div>
      <div className="p-4">
        <Screen />
      </div>
    </div>
  );
}
