/* =====================================================================
   Monset.co — the climb
   Scroll = ascent: base camp -> lower slopes -> the ascent -> the trail
   -> into the clouds -> above the clouds -> the summit funnel.
   Scene is driven by GSAP ScrollTrigger (scrub) + Lenis smooth scroll,
   with a plain-rAF fallback if the CDN libs don't load.
   ===================================================================== */

/* =====================================================================
   Theme toggle — default is LIGHT; choice persists across visits.
   ===================================================================== */
(function () {
  const root = document.documentElement;
  let saved = null;
  try {
    saved = localStorage.getItem("monset-theme");
  } catch (e) {}
  if (saved === "dark") root.setAttribute("data-theme", "dark");

  function wire() {
    const btn = document.getElementById("theme-toggle");
    if (!btn || btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", () => {
      const dark = root.getAttribute("data-theme") === "dark";
      if (dark) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("monset-theme", dark ? "light" : "dark");
      } catch (e) {}
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();

const svg = (p) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

/* =====================================================================
   CONTENT DATA
   ===================================================================== */
const PROJECTS = [
  {
    name: "Hunahuna Beach Resort",
    tag: "React + Vite + Supabase",
    description:
      "Resort marketing site and booking platform on a real Supabase backend: rooms, menu, gallery. Live booking writes are intentionally disabled.",
    thumb: "assets/hunahuna.png",
    live: "https://hunahuna-site.vercel.app/",
  },
  {
    name: "Restaurant Concept",
    tag: "React + Vite + Framer Motion",
    description:
      "Single page restaurant site with an interactive 3D coverflow hero and staggered scroll animation.",
    thumb: "assets/restaurant.png",
    live: "https://showcase-restaurant-mu.vercel.app/",
  },
  {
    name: "Roost",
    tag: "Next.js + React",
    description:
      "Airbnb style marketing site for unique stays: hero, featured stays, and guest stories.",
    thumb: "assets/airbnb.png",
    live: "https://showcase-hospitality-one.vercel.app/",
  },
  {
    name: "Agency Template",
    tag: "Static HTML / CSS / JS",
    description:
      "Editorial agency template with a layered hero where a photo overlaps a giant headline, heavy scroll animation throughout.",
    thumb: "assets/agency.png",
    live: "https://showcase-agency.vercel.app/",
  },
];

// "Works with the tools you already use" strip, in brochure order
const TOOLS = [
  {
    name: "Google Sheets",
    color: "#0F9D58",
    icon: '<path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z"/>',
  },
  { name: "GoHighLevel", icon: "assets/logos/gohighlevel.png" },
  { name: "PayMongo", icon: "assets/logos/paymongo.png" },
  {
    name: "Zapier",
    color: "#FF4A00",
    icon: '<path d="M15.34 12a5 5 0 0 1-.34 1.82 5 5 0 0 1-1.82.34h-.36a5 5 0 0 1-1.82-.34A5 5 0 0 1 10.66 12a5 5 0 0 1 .34-1.82A5 5 0 0 1 12.82 9.84h.36a5 5 0 0 1 1.82.34A5 5 0 0 1 15.34 12zM24 10.2h-7.03l4.97-4.97-1.7-1.7L15.27 8.5V1.46h-2.4V8.5L7.9 3.53l-1.7 1.7 4.97 4.97H4.14v2.4h7.03L6.2 17.57l1.7 1.7 4.97-4.97v7.04h2.4v-7.04l4.97 4.97 1.7-1.7-4.97-4.97H24z"/>',
  },
  {
    name: "n8n",
    color: "#EA4B71",
    icon: '<path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/>',
  },
];

/* =====================================================================
   RENDER
   ===================================================================== */
const grid = document.getElementById("project-grid");
PROJECTS.forEach((project) => {
  // a real link: keyboard, middle-click and "open in new tab" all still work;
  // a plain click opens the in-page preview instead
  const card = document.createElement("a");
  card.className = "card";
  card.href = project.live;
  card.target = "_blank";
  card.rel = "noopener";
  card.innerHTML = `
    <div class="thumb">
      <img src="${project.thumb}" alt="${project.name} homepage" loading="lazy" width="1280" height="800" />
      <span class="card-badge">Demo build</span>
    </div>
    <div class="body">
      <p class="tag">${project.tag}</p>
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <p class="cta">Open live preview${svg('<path d="M7 17 17 7M8 7h9v9"/>')}</p>
    </div>`;
  card.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    openModal(project);
  });
  grid.appendChild(card);
});

document.getElementById("tools-row").innerHTML = TOOLS.map((tool) => {
  const isImagePath = tool.icon && !tool.icon.trim().startsWith("<");
  const iconHtml = isImagePath
    ? `<img class="tool-badge-img" src="${tool.icon}" alt="" aria-hidden="true" />`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"${tool.color ? ` style="--tool-color:${tool.color}"` : ""}>${tool.icon}</svg>`;
  return `<span class="tool-badge">${iconHtml}<span>${tool.name}</span></span>`;
}).join("");

/* ---- packages, services and contact details: all from site-data.js ---- */
const SITE = window.SITE;
const peso = (n) => `\u20B1${n.toLocaleString("en-PH")}`;
const check = svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>');

document.getElementById("pkg-grid").innerHTML = SITE.packages
  .map(
    (pkg) => `
  <article class="pkg-card${pkg.featured ? " pkg-card--featured" : ""}">
    <p class="pkg-name">${pkg.name}</p>
    <p class="pkg-price">${peso(pkg.price)}</p>
    <p class="pkg-fee">${pkg.fee}</p>
    <p class="pkg-for">${pkg.tagline}</p>
    <p class="pkg-included">What&rsquo;s included</p>
    <ul class="pkg-list">
      ${pkg.items
        .map(([title, desc]) => `<li>${check}<span><strong>${title}</strong>${desc}</span></li>`)
        .join("")}
    </ul>
    ${
      pkg.callout
        ? `<div class="pkg-callout"><p class="pkg-callout-title">${pkg.callout.title}</p><p>${pkg.callout.text}</p></div>`
        : ""
    }
    <a class="pkg-cta" href="#basin">Get started<svg class="pkg-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
  </article>`,
  )
  .join("");

document.getElementById("svc-grid").innerHTML = SITE.services
  .map(
    (svc) => `
  <div class="svc-item">
    <p class="svc-name">${svc.name}</p>
    <p class="svc-text">${svc.text}</p>
    <p class="svc-price">${svc.fromPrice ? `from ${peso(svc.fromPrice)}` : "Ask us for a quote."}</p>
  </div>`,
  )
  .join("");

const contactLinks = {
  email: [`mailto:${SITE.contact.email}`, SITE.contact.email],
  phone: [`tel:${SITE.contact.phoneHref}`, SITE.contact.phone],
  website: [SITE.contact.websiteUrl, SITE.contact.website],
};
document.querySelectorAll("[data-contact]").forEach((a) => {
  const [href, text] = contactLinks[a.dataset.contact];
  a.href = href;
  a.textContent = text;
});

// Calendly reads data-url when its script loads, so set it first
document.querySelector(".calendly-inline-widget").dataset.url =
  SITE.contact.bookingUrl;
const calendlyScript = document.createElement("script");
calendlyScript.src = "https://assets.calendly.com/assets/external/widget.js";
calendlyScript.async = true;
document.body.appendChild(calendlyScript);

/* =====================================================================
   Reveals
   - section titles: words rise out of a mask
   - cards / steps: arrive as a list with a short stagger
   ===================================================================== */
document.querySelectorAll(".section-title").forEach((title) => {
  const words = title.textContent.trim().split(/\s+/);
  title.setAttribute("aria-label", words.join(" "));
  title.innerHTML = words
    .map(
      (w, i) =>
        `<span class="tw" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`,
    )
    .join(" ");
});

const revealGroups = [
  ".solve-grid > .solve-col",
  ".route-steps > .route-step",
  ".pkg-grid > .pkg-card",
  ".svc-grid > .svc-item",
  ".work-grid > .card",
  ".faq-list",
  ".basin-card",
];
revealGroups.forEach((sel) =>
  document.querySelectorAll(sel).forEach((node, i) => {
    node.setAttribute("data-reveal", "");
    node.style.setProperty("--rd", i);
  }),
);

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(
        e.target.hasAttribute("data-reveal") ? "is-in" : "is-visible",
      );
      revealObserver.unobserve(e.target);
    }),
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
);
document
  .querySelectorAll(".section-head, [data-reveal]")
  .forEach((node) => revealObserver.observe(node));

/* hero headline: index each word for the post-loader stagger */
document
  .querySelectorAll("#hero-headline .w")
  .forEach((w, i) => w.style.setProperty("--i", i));

/* package cards: spotlight follows the cursor (fine pointers only) */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".pkg-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* =====================================================================
   THE CLIMB — setScene(progress). Tune the ascent by editing the
   band() ranges below (each is a [start, end] window in 0..1 scroll).
   ===================================================================== */
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const band = (p, a, b) => clamp01((p - a) / (b - a)); // 0 before a, 1 after b

const gid = (id) => document.getElementById(id);
const el = {
  blue: gid("sky-blue"),
  dusk: gid("sky-dusk"),
  gold: gid("sky-gold"),
  sun: gid("sun"),
  peak: gid("peak"),
  sea: gid("cloud-sea"),
  field: gid("cloud-field"),
  far: gid("far-ridge"),
  marker: gid("trail-marker"),
  mobileFill: gid("mobile-progress-fill"),
};

function setScene(p) {
  const vh = window.innerHeight;
  if (el.mobileFill) el.mobileFill.style.transform = `scaleX(${p.toFixed(4)})`;

  // --- sky cross-fade: blue -> dusk -> gold (altitude) ---
  el.blue.style.opacity = 1 - band(p, 0.42, 0.72);
  el.dusk.style.opacity = band(p, 0.22, 0.5) * (1 - 0.85 * band(p, 0.8, 1));
  el.gold.style.opacity = band(p, 0.66, 1);

  // --- distant range at the horizon sinks a touch as you climb above it ---
  if (el.far) {
    el.far.style.transform = `translateY(${(p * vh * 0.4).toFixed(1)}px) scale(${lerp(1, 0.9, p).toFixed(3)})`;
    el.far.style.opacity = (1 - band(p, 0.5, 0.78)).toFixed(3);
  }

  // --- solitary peak ahead: grows as you approach, camera eases at the top ---
  el.peak.style.opacity = band(p, 0.05, 0.3);
  let pk = lerp(0.6, 1.45, band(p, 0.05, 0.86));
  pk = lerp(pk, 1.35, band(p, 0.86, 1));
  const pky = lerp(0.12, -0.04, band(p, 0.05, 0.95));
  el.peak.style.transform = `translate(-50%, ${(pky * vh).toFixed(1)}px) scale(${pk.toFixed(4)})`;

  // --- puffy clouds: you rise UP into them mid-climb, then above them ---
  const cf = band(p, 0.3, 0.5) * (1 - 0.55 * band(p, 0.72, 0.92));
  el.field.style.opacity = cf.toFixed(3);
  const cfScale = lerp(0.85, 1.7, band(p, 0.3, 0.8));
  const cfY = band(p, 0.3, 0.95) * vh * 0.55;
  el.field.style.transform = `translateY(${cfY.toFixed(1)}px) scale(${cfScale.toFixed(4)})`;

  // --- golden sun glow rises near the top ---
  const glow = band(p, 0.7, 1);
  el.sun.style.opacity = glow * 0.85;
  el.sun.style.top = `${82 - glow * 24}%`;

  // --- puffy sea of clouds swallows the bottom of the screen at the summit ---
  const sea = band(p, 0.6, 0.9);
  el.sea.style.opacity = sea.toFixed(3);
  el.sea.style.transform = `translateY(${(1 - sea) * 55}px) scale(${1 + sea * 0.1})`;

  // --- trail marker climbs UP as you scroll down ---
  if (el.marker) el.marker.style.top = `${(1 - p) * 100}%`;
}

/* the route up: the path draws itself between the first and last step as the
   section crosses the viewport, and each waypoint lights as the line reaches it */
const routeSteps = gid("route-steps");
const routeLive = gid("route-live");
const routeBase = gid("route-base");
const routeItems = routeSteps ? [...routeSteps.children] : [];
let routeLen = 0;
function layoutRoute() {
  if (!routeLive) return;
  // offset* ignore transforms, so the reveal/momentum motion can't skew this
  const ox = routeSteps.offsetLeft;
  const oy = routeSteps.offsetTop;
  const pts = routeItems
    .map((li) => {
      // the node sits centred at the top of the step's content box
      const n = li.querySelector(".route-node");
      const cs = getComputedStyle(n);
      const x = ox + li.offsetLeft + li.offsetWidth / 2;
      const y =
        oy +
        li.offsetTop +
        parseFloat(getComputedStyle(li).paddingTop) +
        parseFloat(cs.marginTop) +
        n.offsetHeight / 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  routeLive.setAttribute("points", pts);
  routeBase.setAttribute("points", pts);
  routeLen = routeLive.getTotalLength();
  routeLive.style.strokeDasharray = `${routeLen} ${routeLen}`;
}
function updateRoute() {
  if (!routeSteps) return;
  const r = routeSteps.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.3));
  if (routeLive)
    routeLive.style.strokeDashoffset = (routeLen * (1 - p)).toFixed(1);
  routeSteps.style.setProperty("--route-off", (1 - p).toFixed(4));
  routeItems.forEach((li, i) =>
    li.classList.toggle("is-lit", p >= (i / 3) * 0.98),
  );
}

/* momentum: while you scroll, the content boxes (columns, cards, CTAs) drag in
   the scroll direction and glide back to rest when you stop. Word-groups
   (headings) sit inside those boxes but counter-move slightly, so they end up
   travelling ~30% less than their box — a layered lag. Velocity-driven, so it
   only shows during actual movement. */
function setupMomentum() {
  const boxSel =
    ".section-head, .solve-grid, .route-wrap, .pkg-grid, .svc-grid, .svc-help, .tools-strip, .contact-list, .work-grid, .faq-list, .mid-cta";
  const wordSel = ".section-title, .section-note, .solve-q, .pkg-name";
  const boxes = [];
  const words = [];
  document.querySelectorAll(".act:not(.hero)").forEach((act) => {
    act.querySelectorAll(boxSel).forEach((b) => boxes.push(b));
    act.querySelectorAll(wordSel).forEach((w) => words.push(w));
  });
  if (!boxes.length) return;

  let applied = 0;
  let lastY = window.scrollY;

  function tick() {
    let vel;
    if (lenis && typeof lenis.velocity === "number") {
      vel = lenis.velocity;
    } else {
      vel = window.scrollY - lastY;
      lastY = window.scrollY;
    }
    // velocity -> pixel drag, clamped; positive scroll pushes content down (lag)
    const target = Math.max(-90, Math.min(90, vel * 5));
    applied += (target - applied) * 0.11; // ease toward target; decays to 0 = settle
    if (Math.abs(applied) < 0.03 && Math.abs(target) < 0.03) applied = 0;
    const boxT = `translateY(${applied.toFixed(2)}px)`; // boxes move the full amount
    const wordT = `translateY(${(applied * -0.3).toFixed(2)}px)`; // headings lag 30%
    for (let i = 0; i < boxes.length; i++) boxes[i].style.transform = boxT;
    for (let i = 0; i < words.length; i++) words[i].style.transform = wordT;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* =====================================================================
   DRIVER — Lenis smooth scroll + GSAP ScrollTrigger scrub,
   with a plain rAF fallback.
   ===================================================================== */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = !!(window.gsap && window.ScrollTrigger);
function pageProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? clamp01(window.scrollY / max) : 0;
}

let lenis = null;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
  lenis.stop(); // held still under the loader; released when it breaks open
  const raf = (t) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

if (!reduce) {
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => setScene(self.progress),
    });
    setupMomentum();
    ScrollTrigger.refresh();
  } else {
    let ticking = false;
    const loop = () => {
      setScene(pageProgress());
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(loop);
          ticking = true;
        }
      },
      { passive: true },
    );
    setupMomentum();
  }
  setScene(pageProgress());

  let routeTick = false;
  const routeLoop = () => {
    updateRoute();
    routeTick = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!routeTick) {
        requestAnimationFrame(routeLoop);
        routeTick = true;
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    layoutRoute();
    updateRoute();
  });
  layoutRoute();
  updateRoute();
  // fonts change step heights, so re-measure once they land
  if (document.fonts)
    document.fonts.ready.then(() => {
      layoutRoute();
      updateRoute();
    });
} else {
  layoutRoute();
  routeItems.forEach((li) => li.classList.add("is-lit"));
}

/* smooth-scroll anchor links (nav, trail, CTAs) — one delegated listener so it
   can't be missed, and Lenis scrolls to the element directly (never fights it). */
const NAV_OFFSET = 80;
function goTo(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(target, { offset: -NAV_OFFSET, duration: 1.1 });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
}
document.addEventListener("click", (e) => {
  const link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
  if (!link) return;
  const hash = link.getAttribute("href");
  if (!hash || hash.length < 2) return;
  e.preventDefault();
  goTo(hash);
  const navEl = document.getElementById("nav");
  const toggleEl = document.getElementById("nav-toggle");
  if (navEl) navEl.classList.remove("menu-open");
  if (toggleEl) toggleEl.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
});

/* active trail dot by section in view */
const trailDots = [...document.querySelectorAll(".trail-dot")];
const sections = ["top", "friction", "packages", "work", "basin"].map((id) =>
  document.getElementById(id),
);
const sectionObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = sections.indexOf(e.target);
        trailDots.forEach((d, i) => d.classList.toggle("is-here", i === idx));
      }
    }),
  { threshold: 0.5 },
);
sections.forEach((s) => s && sectionObserver.observe(s));

/* =====================================================================
   Nav scrolled state + mobile menu
   ===================================================================== */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");
const heroEl = document.getElementById("top");
let navTick = false;
let lastNavY = window.scrollY;
function updateNav() {
  const y = window.scrollY;
  const past = y > heroEl.offsetHeight - 90;
  nav.classList.toggle(
    "nav--scrolled",
    past || nav.classList.contains("menu-open"),
  );
  // fade out on scroll down (past the hero), bring back on scroll up
  const goingDown = y > lastNavY;
  const hide = goingDown && y > 140 && !nav.classList.contains("menu-open");
  nav.classList.toggle("nav--hidden", hide);
  lastNavY = y;
  navTick = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!navTick) {
      requestAnimationFrame(updateNav);
      navTick = true;
    }
  },
  { passive: true },
);
updateNav();

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  updateNav();
});

/* =====================================================================
   Loader
   ===================================================================== */
const loader = document.getElementById("loader");
// the light builds for BUILD_MS (matches --build in CSS), holds at full
// intensity if the page is still loading, then climaxes and breaks open
const BUILD_MS = 1900;
const MAX_WAIT_MS = 4500; // never hold visitors hostage to a slow embed
const loaderStart = performance.now();
let loaderDone = false;
function hideLoader() {
  if (loaderDone) return;
  loaderDone = true;
  const wait = reduce
    ? 0
    : Math.max(0, BUILD_MS - (performance.now() - loaderStart));
  setTimeout(() => {
    loader.classList.add("loader--done");
    // release the hero as the flash peaks, so it is revealed by the light
    setTimeout(
      () => {
        document.body.classList.remove("is-loading");
        if (lenis) lenis.start();
        document.getElementById("hero-headline").classList.add("is-visible");
        if (hasGSAP) ScrollTrigger.refresh(); // recalc after layout settles
      },
      reduce ? 0 : 220,
    );
    setTimeout(() => loader.remove(), reduce ? 400 : 1300);
  }, wait);
}
setTimeout(hideLoader, MAX_WAIT_MS);
if (document.readyState === "complete") hideLoader();
else window.addEventListener("load", hideLoader);

/* =====================================================================
   Contact is a Calendly inline widget now (see #basin in the HTML), so the
   old mailto-form handlers were removed — they referenced elements that no
   longer exist and were throwing before the rest of this file could run.
   ===================================================================== */

document.getElementById("year").textContent = new Date().getFullYear();

/* =====================================================================
   Work preview modal
   ===================================================================== */
const modal = document.getElementById("modal");
const modalFrame = document.getElementById("modal-frame");
const modalTitle = document.getElementById("modal-title");
const modalHint = document.getElementById("modal-hint");
const modalNewTab = document.getElementById("modal-newtab");
const modalClose = document.getElementById("modal-close");
function openModal(project) {
  modalTitle.textContent = project.name;
  modalNewTab.href = project.live;
  modalHint.textContent =
    "Live preview. If it doesn't load, the host may block embedding, so open it in a new tab instead.";
  modalFrame.src = project.live;
  modal.hidden = false;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => modal.classList.add("modal--open")),
  );
}
function closeModal() {
  modal.classList.remove("modal--open");
  const done = () => {
    modal.hidden = true;
    modalFrame.src = "about:blank";
    modal.removeEventListener("transitionend", done);
  };
  if (reduce) done();
  else modal.addEventListener("transitionend", done);
}
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});
