/* =====================================================================
   Monset.co — the climb
   Scroll = ascent: base camp -> lower slopes -> the ascent -> the trail
   -> into the clouds -> above the clouds -> the summit funnel.
   Scene is driven by GSAP ScrollTrigger (scrub) + Lenis smooth scroll,
   with a plain-rAF fallback if the CDN libs don't load.
   ===================================================================== */

const CONTACT_EMAIL = "hello@monset.co"; // <-- replace with your real inbox

const svg = (p) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

/* =====================================================================
   CONTENT DATA
   ===================================================================== */
const FRICTION = [
  {
    t: "Manual, inefficient logs",
    d: "Notebooks and chat threads instead of a source of truth.",
    i: svg(
      '<path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 11h6M8 15h4"/>',
    ),
  },
  {
    t: "Lacking data",
    d: "Decisions made on gut feel because the numbers aren't there.",
    i: svg('<path d="M3 3v18h18"/><path d="M7 15l3-3 3 2 4-5"/>'),
  },
  {
    t: "Inventory problems",
    d: "Stock-outs, over-orders, and mystery shrinkage nobody catches.",
    i: svg(
      '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    ),
  },
  {
    t: "Administration backlogs",
    d: "Paperwork and follow-ups piling up behind day-to-day fires.",
    i: svg(
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/>',
    ),
  },
  {
    t: "Report delays & accuracy",
    d: "By the time the report lands, the moment to act has passed.",
    i: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  },
  {
    t: "Blind business tracking",
    d: "No live view of profit, gross, or where the money actually goes.",
    i: svg(
      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
    ),
  },
  {
    t: "Disconnected tools",
    d: "Five apps that don't talk, so the same data gets keyed in twice.",
    i: svg(
      '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a2 2 0 0 1 2 2V14M6.5 10v4a2 2 0 0 0 2 2H14"/>',
    ),
  },
  {
    t: "Missed customer follow-up",
    d: "Leads and repeat guests slip through an inbox nobody owns.",
    i: svg(
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
    ),
  },
  {
    t: "Revenue leaks",
    d: "Small unbilled extras and discounts that quietly add up.",
    i: svg(
      '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    ),
  },
  {
    t: "Double-bookings & clashes",
    d: "Two guests, one room — scheduling errors you find out about late.",
    i: svg(
      '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/>',
    ),
  },
];

const PILLARS = [
  {
    t: "Website",
    d: "Get seen. A fast, modern site pulls in attention and turns quiet interest into real enquiries.",
    i: svg(
      '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20M6 18v2M18 18v2M8 20h8"/>',
    ),
    stats: [
      "<b>75%</b> judge credibility on design*",
      "<b>2×</b> more reach than social alone*",
    ],
  },
  {
    t: "Admin dashboard",
    d: "See profit, gross, and expenses the moment they happen — and decide your next move with real ground under you.",
    i: svg(
      '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
    ),
  },
  {
    t: "Data analysis & synthesis",
    d: "We turn your numbers into a read on how the business is doing — and surface the growth hiding inside them.",
    i: svg(
      '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11l2 2 3-4"/>',
    ),
  },
  {
    t: "CRM",
    d: "One seamless thread for every customer, from first hello to repeat booking. Nothing slips.",
    i: svg(
      '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 7.5a3 3 0 0 1 0 5M18 20a6 6 0 0 0-3-5.2"/>',
    ),
  },
];

/* What we do — the concrete services (the "kit") */
const SERVICES = [
  {
    t: "Websites & platforms",
    d: "Fast marketing sites, plus full CRM, POS and dashboard platforms built on your real data.",
    i: svg(
      '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20M8 20h8M12 18v2"/>',
    ),
  },
  {
    t: "AI digital receptionist",
    d: "An always-on assistant that answers, books, and follows up across chat and Messenger.",
    i: svg(
      '<path d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3M12 3a7 7 0 0 1 7 7v4a3 3 0 0 1-3 3h-3"/><path d="M4 14v-2a2 2 0 0 1 2-2M20 14v-2a2 2 0 0 0-2-2"/>',
    ),
  },
  {
    t: "Workflow automation",
    d: "We wire your tools together with n8n and AI so the repetitive busywork runs itself.",
    i: svg(
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    ),
  },
  {
    t: "Digital marketing",
    d: "Get found and fill the pipeline — search, social, and campaigns built to convert.",
    i: svg(
      '<path d="M3 11l16-6v14L3 13v-2z"/><path d="M7 12v5a2 2 0 0 0 4 0"/><path d="M19 8a3 3 0 0 1 0 6"/>',
    ),
  },
];

const PROJECTS = [
  {
    name: "Hunahuna Beach Resort",
    tag: "React + Vite + Supabase",
    description:
      "Resort marketing site and booking platform on a real Supabase backend — rooms, menu, gallery. Live booking writes are intentionally disabled.",
    thumb: "assets/hunahuna.png",
    live: "https://hunahuna-site.vercel.app/",
  },
  {
    name: "Restaurant Concept",
    tag: "React + Vite + Framer Motion",
    description:
      "Single-page restaurant site with an interactive 3D coverflow hero and staggered scroll animation.",
    thumb: "assets/restaurant.png",
    live: "https://showcase-restaurant-mu.vercel.app/",
  },
  {
    name: "Roost",
    tag: "Next.js + React",
    description:
      "Airbnb-style marketing site for unique stays: hero, featured stays, and guest stories.",
    thumb: "assets/airbnb.png",
    live: "https://showcase-hospitality-one.vercel.app/",
  },
  {
    name: "Agency Template",
    tag: "Static HTML / CSS / JS",
    description:
      "Editorial agency template — layered hero where a photo overlaps a giant headline, heavy scroll animation throughout.",
    thumb: "assets/agency.png",
    live: "https://showcase-agency.vercel.app/",
  },
];

const TOOLS = [
  {
    name: "React",
    color: "#61DAFB",
    icon: '<path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>',
  },
  {
    name: "JavaScript",
    color: "#F7DF1E",
    icon: '<path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>',
  },
  {
    name: "Claude",
    color: "#D97757",
    icon: '<path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>',
  },
  {
    name: "ChatGPT",
    color: "#10A37F",
    icon: '<path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>',
  },
  {
    name: "Gemini",
    color: "#4285F4",
    icon: '<path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/>',
  },
  { name: "GoHighLevel", icon: "assets/logos/gohighlevel.png" },
  { name: "PayMongo", icon: "assets/logos/paymongo.png" },
  {
    name: "Supabase",
    color: "#3ECF8E",
    icon: '<path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z"/>',
  },
  {
    name: "Python",
    color: "#3776AB",
    icon: '<path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>',
  },
  {
    name: "n8n",
    color: "#EA4B71",
    icon: '<path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/>',
  },
  {
    name: "Zapier",
    color: "#FF4A00",
    icon: '<path d="M15.34 12a5 5 0 0 1-.34 1.82 5 5 0 0 1-1.82.34h-.36a5 5 0 0 1-1.82-.34A5 5 0 0 1 10.66 12a5 5 0 0 1 .34-1.82A5 5 0 0 1 12.82 9.84h.36a5 5 0 0 1 1.82.34A5 5 0 0 1 15.34 12zM24 10.2h-7.03l4.97-4.97-1.7-1.7L15.27 8.5V1.46h-2.4V8.5L7.9 3.53l-1.7 1.7 4.97 4.97H4.14v2.4h7.03L6.2 17.57l1.7 1.7 4.97-4.97v7.04h2.4v-7.04l4.97 4.97 1.7-1.7-4.97-4.97H24z"/>',
  },
  {
    name: "Vercel",
    color: "#FFFFFF",
    icon: '<path d="m12 1.608 12 20.784H0Z"/>',
  },
  {
    name: "Google Sheets",
    color: "#0F9D58",
    icon: '<path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z"/>',
  },
  {
    name: "Trello",
    color: "#0052CC",
    icon: '<path d="M21.147 0H2.853A2.86 2.86 0 000 2.853v18.294A2.86 2.86 0 002.853 24h18.294A2.86 2.86 0 0024 21.147V2.853A2.86 2.86 0 0021.147 0zM10.34 17.287a.953.953 0 01-.953.953h-4a.954.954 0 01-.954-.953V5.38a.953.953 0 01.954-.953h4a.954.954 0 01.953.953zm9.233-5.467a.944.944 0 01-.953.947h-4a.947.947 0 01-.953-.947V5.38a.953.953 0 01.953-.953h4a.954.954 0 01.953.953z"/>',
  },
];

/* =====================================================================
   RENDER
   ===================================================================== */
document.getElementById("friction-grid").innerHTML = FRICTION.map(
  (f) => `
  <li class="friction-item">
    <span class="friction-icon">${f.i}</span>
    <div class="friction-text"><h3>${f.t}</h3><p>${f.d}</p></div>
  </li>`,
).join("");

document.getElementById("svc-grid").innerHTML = SERVICES.map(
  (s) => `
  <article class="svc-card">
    <span class="svc-icon">${s.i}</span>
    <h3>${s.t}</h3>
    <p>${s.d}</p>
  </article>`,
).join("");

document.getElementById("grow-grid").innerHTML = PILLARS.map(
  (p, i) => `
  <article class="grow-card" style="transition-delay:${i * 70}ms">
    <p class="grow-num">Foothold ${i + 1}</p>
    <span class="grow-icon">${p.i}</span>
    <h3>${p.t}</h3>
    <p>${p.d}</p>
    ${p.stats ? `<div class="grow-stats">${p.stats.map((s) => `<span class="grow-stat">${s}</span>`).join("")}</div>` : ""}
  </article>`,
).join("");

const grid = document.getElementById("project-grid");
PROJECTS.forEach((project, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.transitionDelay = `${i * 80}ms`;
  card.innerHTML = `
    <div class="thumb" style="background-image:url('${project.thumb}')"></div>
    <div class="body">
      <p class="tag">${project.tag}</p>
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <p class="cta">Open live preview</p>
    </div>`;
  card.addEventListener("click", () => openModal(project));
  grid.appendChild(card);
});

const marqueeItemsHtml = TOOLS.map((tool) => {
  const isImagePath = tool.icon && !tool.icon.trim().startsWith("<");
  const iconHtml = isImagePath
    ? `<img class="tool-badge-img" src="${tool.icon}" alt="" aria-hidden="true" />`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"${tool.color ? ` style="--tool-color:${tool.color}"` : ""}>${tool.icon}</svg>`;
  return `<span class="tool-badge" title="${tool.name}">${iconHtml}<span>${tool.name}</span></span>`;
}).join("");
document.getElementById("marquee-track").innerHTML =
  marqueeItemsHtml + marqueeItemsHtml;

/* =====================================================================
   Scroll reveal
   ===================================================================== */
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    }),
  { threshold: 0.14, rootMargin: "0px 0px -60px 0px" },
);
document
  .querySelectorAll("[data-animate]")
  .forEach((el) => revealObserver.observe(el));

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
  mid: gid("mid-slope"),
  near: gid("near-slope"),
  marker: gid("trail-marker"),
};

// move a range down and slightly back as you rise above it
function sink(elm, y, scale, opacity) {
  if (!elm) return;
  elm.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
  elm.style.opacity = opacity.toFixed(3);
}

function setScene(p) {
  const vh = window.innerHeight;

  // --- sky cross-fade: blue -> dusk -> gold ---
  el.blue.style.opacity = 1 - band(p, 0.42, 0.72);
  el.dusk.style.opacity = band(p, 0.22, 0.5) * (1 - 0.85 * band(p, 0.8, 1));
  el.gold.style.opacity = band(p, 0.66, 1);

  // --- ranges SINK below you: you gain height and rise above them ---
  // near = the base ground you start on, falls away first & fastest.
  sink(el.near, p * vh * 1.35, 1, 1 - band(p, 0.18, 0.46));
  sink(el.mid, p * vh * 0.95, lerp(1, 0.92, p), 1 - band(p, 0.32, 0.6));
  sink(el.far, p * vh * 0.55, lerp(1, 0.86, p), 1 - band(p, 0.46, 0.74));

  // --- solitary peak: distant at the base, dollies toward you as you approach ---
  el.peak.style.opacity = band(p, 0.05, 0.3);
  let pk = lerp(0.6, 1.5, band(p, 0.05, 0.86));
  pk = lerp(pk, 1.42, band(p, 0.86, 1)); // camera eases at the summit
  const pky = lerp(0.1, -0.05, band(p, 0.05, 0.95)); // rises toward your eye line
  el.peak.style.transform = `translate(-50%, ${pky * vh}px) scale(${pk.toFixed(4)})`;

  // --- real puffy clouds: you rise UP into them mid-climb, then above them ---
  const cf = band(p, 0.3, 0.5) * (1 - 0.55 * band(p, 0.72, 0.92));
  el.field.style.opacity = cf.toFixed(3);
  const cfScale = lerp(0.85, 1.7, band(p, 0.3, 0.8)); // they swell as you enter them
  const cfY = band(p, 0.3, 0.95) * vh * 0.55; // and drift down below you
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

/* per-section depth camera: content rises from the distance, holds still to
   read, then scales up + lifts + blurs + fades as it passes the camera. */
function setupActCameras() {
  document.querySelectorAll(".act").forEach((act) => {
    const stage = act.querySelector(".stage");
    if (!stage) return;
    const cam = act.dataset.cam || "hold";
    const fly = cam === "fly" || cam === "hero";
    const exitScale = fly ? 1.55 : 1.18;
    const blurMax = fly ? 10 : 4;
    const noEnter = cam === "hero";
    ScrollTrigger.create({
      trigger: act,
      start: noEnter ? "top top" : "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const prog = self.progress;
        const enter = noEnter ? 1 : band(prog, 0.02, 0.3);
        const exit = band(prog, 0.64, 1.0);
        const scale = exit > 0 ? lerp(1, exitScale, exit) : lerp(0.9, 1, enter);
        const opacity = clamp01(enter) * clamp01(1 - exit);
        const y = lerp(0, -window.innerHeight * 0.06, exit);
        const blur = exit * blurMax;
        stage.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
        stage.style.opacity = opacity.toFixed(3);
        stage.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
      },
    });
  });
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
    setupActCameras();
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
  }
  setScene(pageProgress());
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
const sections = ["top", "friction", "grow", "services", "work", "basin"].map(
  (id) => document.getElementById(id),
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
function updateNav() {
  const past = window.scrollY > heroEl.offsetHeight - 90;
  nav.classList.toggle(
    "nav--scrolled",
    past || nav.classList.contains("menu-open"),
  );
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
const MIN_LOADER_MS = 650;
const loaderStart = performance.now();
function hideLoader() {
  const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - loaderStart));
  setTimeout(() => {
    loader.classList.add("loader--done");
    document.body.classList.remove("is-loading");
    document.getElementById("hero-headline").classList.add("is-visible");
    setTimeout(() => loader.remove(), 550);
    if (hasGSAP) ScrollTrigger.refresh(); // recalc after layout settles
  }, wait);
}
if (document.readyState === "complete") hideLoader();
else window.addEventListener("load", hideLoader);

/* =====================================================================
   Basin funnel — chips + mailto (zero backend). Swap sendBrief() later
   for an n8n webhook POST or a Supabase insert.
   ===================================================================== */
const selectedNeeds = new Set();
document.querySelectorAll("#need-chips .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const need = chip.dataset.need;
    if (selectedNeeds.has(need)) {
      selectedNeeds.delete(need);
      chip.classList.remove("is-on");
    } else {
      selectedNeeds.add(need);
      chip.classList.add("is-on");
    }
  });
});
const formNote = document.getElementById("form-note");
const flash = (m) => {
  if (formNote) formNote.textContent = m;
};
const val = (id) => (document.getElementById(id).value || "").trim();

document.getElementById("send-brief").addEventListener("click", () => {
  const business = val("f-business"),
    email = val("f-email"),
    message = val("f-message");
  const needs = [...selectedNeeds];
  if (!business && !email && !message && needs.length === 0) {
    flash(
      "Add a couple of details first, then we'll open your email ready to send.",
    );
    return;
  }
  const subject = `New enquiry${business ? ` — ${business}` : ""}`;
  const body =
    `Business: ${business || "—"}\n` +
    `Email: ${email || "—"}\n` +
    `Interested in: ${needs.length ? needs.join(", ") : "—"}\n\n${message || ""}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  flash("Opening your email with everything filled in…");
});
document.getElementById("ask-question").addEventListener("click", () => {
  const email = val("f-email"),
    business = val("f-business");
  const subject = `Quick question${business ? ` — ${business}` : ""}`;
  const body = email ? `(Reply to: ${email})\n\n` : "";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

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
    "Live preview. If it doesn't load, the host may block embedding — open it in a new tab instead.";
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
