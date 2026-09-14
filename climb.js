/* =====================================================================
   Monset — the climb (full 3D build)
   Content sections become "basecamps" that fade in as the first-person
   camera reaches each switchback. index.html remains the 2D fallback:
   devices without WebGL (or with reduced-motion) are sent there.
   ===================================================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function webglOK() {
    try {
      const c = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }
  // No WebGL or reduced motion → hand off to the lightweight 2D site.
  if (!window.THREE || !webglOK() || reduce) {
    if (location.pathname.indexOf("index.html") === -1) {
      try {
        location.replace("index.html");
        return;
      } catch (e) {}
    }
    document.body.classList.add("no3d");
    return;
  }

  const gid = (id) => document.getElementById(id);
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* =====================================================================
     CONTENT DATA (mirrors index.html)
     ===================================================================== */
  const svg = (p) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  const FRICTION = [
    {
      t: "Scattered tools that don't talk to each other",
      i: svg(
        '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a2 2 0 0 1 2 2V14M6.5 10v4a2 2 0 0 0 2 2H14"/>',
      ),
    },
    {
      t: "Decisions made on gut feel, not real numbers",
      i: svg('<path d="M3 3v18h18"/><path d="M7 15l3-3 3 2 4-5"/>'),
    },
    {
      t: "Leads and messages that slip through the cracks",
      i: svg(
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
      ),
    },
    {
      t: "Hours lost to manual admin every week",
      i: svg(
        '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/>',
      ),
    },
    {
      t: "No live view of profit or cash flow",
      i: svg(
        '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
      ),
    },
    {
      t: "Small billing mistakes that quietly cost you",
      i: svg(
        '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      ),
    },
  ];

  const COMPARISON = [
    {
      without: "Invisible online, or stuck with an outdated site",
      withUs: "A modern site that turns visitors into real enquiries",
    },
    {
      without: "Checking three spreadsheets to know if you're making money",
      withUs: "Profit and cash flow visible the moment they happen",
    },
    {
      without: "Decisions made on gut feel",
      withUs: "Clear answers about what's actually working",
    },
    {
      without: "Leads and messages slipping through the cracks",
      withUs: "Every customer followed up, automatically",
    },
  ];
  const compareXIcon = svg('<path d="M6 6l12 12M18 6L6 18"/>');
  const compareCheckIcon = svg('<path d="M5 12l5 5L19 7"/>');

  const SERVICES = [
    {
      t: "Websites & platforms",
      d: "Marketing sites, plus full CRM, POS, and dashboard platforms, all built around your real data.",
      i: svg(
        '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20M8 20h8M12 18v2"/>',
      ),
    },
    {
      t: "AI digital receptionist",
      d: "Answers, books, and follows up around the clock, so a lead at 11pm gets a reply in seconds, not the next morning.",
      i: svg(
        '<path d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3M12 3a7 7 0 0 1 7 7v4a3 3 0 0 1-3 3h-3"/><path d="M4 14v-2a2 2 0 0 1 2-2M20 14v-2a2 2 0 0 0-2-2"/>',
      ),
    },
    {
      t: "Workflow automation",
      d: "We connect your tools with automation, so work that used to take 4 hours can run in under 2 minutes.",
      i: svg(
        '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
      ),
    },
    {
      t: "Digital marketing",
      d: "Show up first when people search for your service nearby, on Google and in AI answers, not buried on page two.",
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
        "Resort marketing site and booking platform on a real Supabase backend: rooms, menu, gallery. Live booking writes are intentionally disabled.",
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
        "Editorial agency template with a layered hero where a photo overlaps a giant headline, heavy scroll animation throughout.",
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
     RENDER content into the basecamp panels
     ===================================================================== */
  gid("friction-grid").innerHTML = FRICTION.map(
    (f) =>
      `<li class="friction-item"><span class="friction-icon">${f.i}</span><p class="friction-text">${f.t}</p></li>`,
  ).join("");

  gid("svc-grid").innerHTML = SERVICES.map(
    (s) =>
      `<article class="svc-card"><span class="svc-icon">${s.i}</span><h3>${s.t}</h3><p>${s.d}</p></article>`,
  ).join("");

  gid("compare").innerHTML =
    `<p class="compare-label compare-label-without">Most businesses</p>` +
    `<p class="compare-label compare-label-with">With Monset</p>` +
    COMPARISON.map(
      (c) =>
        `<div class="compare-item compare-without"><span class="compare-icon">${compareXIcon}</span><p>${c.without}</p></div>` +
        `<div class="compare-item compare-with"><span class="compare-icon">${compareCheckIcon}</span><p>${c.withUs}</p></div>`,
    ).join("");

  const grid = gid("project-grid");
  PROJECTS.forEach((project) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      `<div class="thumb" style="background-image:url('${project.thumb}')"><span class="card-badge">Demo build</span></div>` +
      `<div class="body"><p class="tag">${project.tag}</p><h3>${project.name}</h3><p>${project.description}</p><p class="cta">Open live preview</p></div>`;
    card.addEventListener("click", () => openModal(project));
    grid.appendChild(card);
  });

  const marqueeItems = TOOLS.map((tool) => {
    const isImg = tool.icon && !tool.icon.trim().startsWith("<");
    const icon = isImg
      ? `<img class="tool-badge-img" src="${tool.icon}" alt="" aria-hidden="true" />`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"${tool.color ? ` style="--tool-color:${tool.color}"` : ""}>${tool.icon}</svg>`;
    return `<span class="tool-badge" title="${tool.name}">${icon}<span>${tool.name}</span></span>`;
  }).join("");
  gid("marquee-track").innerHTML = marqueeItems + marqueeItems;

  /* =====================================================================
     Form (chips + mailto) + work modal — same behaviour as the 2D site
     ===================================================================== */
  const CONTACT_EMAIL = "hello@monset.co";
  const selectedNeeds = new Set();
  document.querySelectorAll("#need-chips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const n = chip.dataset.need;
      if (selectedNeeds.has(n)) {
        selectedNeeds.delete(n);
        chip.classList.remove("is-on");
      } else {
        selectedNeeds.add(n);
        chip.classList.add("is-on");
      }
    });
  });
  const formNote = gid("form-note");
  const val = (id) => (gid(id).value || "").trim();
  gid("send-brief").addEventListener("click", () => {
    const business = val("f-business"),
      email = val("f-email"),
      message = val("f-message");
    const needs = [...selectedNeeds];
    if (!business && !email && !message && needs.length === 0) {
      if (formNote)
        formNote.textContent =
          "Add a couple of details first, then we'll open your email ready to send.";
      return;
    }
    const subject = `New enquiry${business ? ` — ${business}` : ""}`;
    const body = `Business: ${business || "—"}\nEmail: ${email || "—"}\nInterested in: ${needs.length ? needs.join(", ") : "—"}\n\n${message || ""}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (formNote)
      formNote.textContent = "Opening your email with everything filled in…";
  });
  gid("ask-question").addEventListener("click", () => {
    const email = val("f-email"),
      business = val("f-business");
    const subject = `Quick question${business ? ` — ${business}` : ""}`;
    const body = email ? `(Reply to: ${email})\n\n` : "";
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const modal = gid("modal"),
    modalFrame = gid("modal-frame"),
    modalTitle = gid("modal-title"),
    modalHint = gid("modal-hint"),
    modalNewTab = gid("modal-newtab"),
    modalClose = gid("modal-close");
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
    modal.addEventListener("transitionend", done);
  }
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  gid("year") && (gid("year").textContent = new Date().getFullYear());

  /* =====================================================================
     THE 3D CLIMB
     ===================================================================== */
  const EYE_HEIGHT = 3.0,
    LOOK_AHEAD = 0.02,
    BOB_STEPS = 22,
    BOB_AMPL = 0.08,
    SWAY_AMPL = 0.06,
    FOV = 72,
    SCROLL_EASE = 0.09;

  // the mountain the trail is carved into
  const PEAK_H = 34,
    MTN_R = 64,
    TRAIL_LIFT = 0.3;
  const PEAK = new THREE.Vector3(0, PEAK_H, -46);

  // switchback trail as (x, z); the height comes from the terrain so it sits on the slope
  const TRAIL_XZ = [
    [0, 8],
    [7, 2],
    [8.5, -3],
    [5, -8],
    [-6.5, -14],
    [-8.5, -19],
    [-5, -24],
    [6.5, -30],
    [7.5, -34],
    [3, -38.5],
    [0, -42.5],
  ];
  const STAGE_T = [0.08, 0.36, 0.64, 0.96];
  const SKY = [
    [0.0, [74, 116, 166], [150, 186, 216]],
    [0.5, [96, 140, 182], [196, 206, 214]],
    [0.8, [206, 168, 128], [240, 212, 172]],
    [1.0, [230, 190, 134], [250, 232, 196]],
  ];
  const lp = (a, b, t) => Math.round(lerp(a, b, t));
  function skyAt(p) {
    for (let i = 0; i < SKY.length - 1; i++) {
      const a = SKY[i],
        b = SKY[i + 1];
      if (p <= b[0]) {
        const k = (p - a[0]) / (b[0] - a[0] || 1);
        return {
          top: [
            lp(a[1][0], b[1][0], k),
            lp(a[1][1], b[1][1], k),
            lp(a[1][2], b[1][2], k),
          ],
          bot: [
            lp(a[2][0], b[2][0], k),
            lp(a[2][1], b[2][1], k),
            lp(a[2][2], b[2][2], k),
          ],
        };
      }
    }
    const l = SKY[SKY.length - 1];
    return { top: l[1], bot: l[2] };
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x203a54, 22, 130);
  const camera = new THREE.PerspectiveCamera(
    FOV,
    innerWidth / innerHeight,
    0.1,
    400,
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  gid("canvas-wrap").appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xcfe3fb, 0x5a5340, 1.05));
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.6);
  sun.position.set(-30, 62, 26);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, 0.16));

  function noise(x, z) {
    return (
      Math.sin(x * 0.28) * Math.cos(z * 0.32) * 1.6 +
      Math.sin(x * 0.13 + z * 0.19) * 1.1 +
      Math.cos(x * 0.07 - z * 0.11) * 0.7
    );
  }
  // the mountain: a cone rising to PEAK, with low-poly noise that calms near the summit
  function terrainH(x, z) {
    const dx = x - PEAK.x,
      dz = z - PEAK.z;
    const d = Math.sqrt(dx * dx + dz * dz);
    const u = Math.max(0, 1 - d / MTN_R);
    return PEAK_H * Math.pow(u, 1.5) + noise(x, z) * 1.3 * clamp01(d / 10);
  }
  // height gradient: deep navy base -> steel blue -> bronze peak (routed through a
  // warm dusk midtone so blue->bronze never turns muddy)
  const RAMP = [
    [0.0, [11, 31, 56]],
    [0.3, [30, 58, 90]],
    [0.52, [53, 80, 106]],
    [0.68, [92, 79, 86]],
    [0.82, [125, 67, 39]],
    [1.0, [156, 90, 47]],
  ];
  function heightColor(h, out) {
    const u = clamp01(h / PEAK_H);
    for (let i = 0; i < RAMP.length - 1; i++) {
      const a = RAMP[i],
        b = RAMP[i + 1];
      if (u <= b[0]) {
        const k = (u - a[0]) / (b[0] - a[0] || 1);
        out.setRGB(
          (a[1][0] + (b[1][0] - a[1][0]) * k) / 255,
          (a[1][1] + (b[1][1] - a[1][1]) * k) / 255,
          (a[1][2] + (b[1][2] - a[1][2]) * k) / 255,
        );
        return;
      }
    }
    const l = RAMP[RAMP.length - 1][1];
    out.setRGB(l[0] / 255, l[1] / 255, l[2] / 255);
  }
  const terGeo = new THREE.PlaneGeometry(240, 320, 110, 140);
  terGeo.rotateX(-Math.PI / 2);
  {
    const pos = terGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const y = terrainH(pos.getX(i), pos.getZ(i));
      pos.setY(i, y);
      heightColor(y, c);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    terGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    terGeo.computeVertexNormals();
  }
  const terrain = new THREE.Mesh(
    terGeo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 1,
    }),
  );
  scene.add(terrain);

  const points = TRAIL_XZ.map(
    (p) => new THREE.Vector3(p[0], terrainH(p[0], p[1]) + TRAIL_LIFT, p[1]),
  );
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);

  // flat low-poly ribbon path, conformed to the terrain surface (chunky facets)
  const PATH_W = 2.1,
    PATH_SAMPLES = 64,
    PATH_LIFT = 0.16;
  const _up = new THREE.Vector3(0, 1, 0),
    _side = new THREE.Vector3();
  const rV = [],
    rI = [];
  for (let i = 0; i <= PATH_SAMPLES; i++) {
    const u = i / PATH_SAMPLES;
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(u);
    tan.y = 0;
    tan.normalize();
    _side.crossVectors(tan, _up).normalize();
    const lx = p.x - (_side.x * PATH_W) / 2,
      lz = p.z - (_side.z * PATH_W) / 2;
    const rx = p.x + (_side.x * PATH_W) / 2,
      rz = p.z + (_side.z * PATH_W) / 2;
    rV.push(
      lx,
      terrainH(lx, lz) + PATH_LIFT,
      lz,
      rx,
      terrainH(rx, rz) + PATH_LIFT,
      rz,
    );
    if (i < PATH_SAMPLES) {
      const a = i * 2;
      rI.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const ribGeo = new THREE.BufferGeometry();
  ribGeo.setAttribute("position", new THREE.Float32BufferAttribute(rV, 3));
  ribGeo.setIndex(rI);
  ribGeo.computeVertexNormals();
  const trailMesh = new THREE.Mesh(
    ribGeo,
    new THREE.MeshStandardMaterial({
      color: 0x8a6b45,
      flatShading: true,
      roughness: 1,
    }),
  );
  scene.add(trailMesh);

  // signposts with the stage label painted onto the board
  const STAGE_LABELS = ["Unnoticed", "Seen", "Chosen", "Obvious choice"];
  function signTexture(num, label) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 240;
    const g = c.getContext("2d");
    g.fillStyle = "#6e4a2c";
    g.fillRect(0, 0, 512, 240);
    g.strokeStyle = "#43301c";
    g.lineWidth = 16;
    g.strokeRect(8, 8, 496, 224);
    g.fillStyle = "#f0d48f";
    g.beginPath();
    g.arc(74, 120, 42, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#2a1608";
    g.font = "bold 54px 'Sora', sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String(num), 74, 126);
    g.fillStyle = "#f7ead0";
    g.font = "bold 48px 'Sora', sans-serif";
    g.textAlign = "left";
    g.textBaseline = "middle";
    g.fillText(label, 132, 126);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }
  const _sside = new THREE.Vector3(),
    _face = new THREE.Vector3(),
    _wdir = new THREE.Vector3();
  const postGeo = new THREE.CylinderGeometry(0.07, 0.09, 2.2, 6);
  const postMat = new THREE.MeshStandardMaterial({
    color: 0x5b3d24,
    flatShading: true,
    roughness: 1,
  });
  STAGE_T.forEach((t, idx) => {
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    tan.y = 0;
    tan.normalize();
    _sside.crossVectors(tan, _up).normalize();
    const sgn = idx % 2 === 0 ? 1 : -1,
      off = PATH_W / 2 + 1.4;
    const sx = p.x + _sside.x * off * sgn,
      sz = p.z + _sside.z * off * sgn;
    const gy = terrainH(sx, sz);
    // two legs at the board's edges (clear of the text)
    _face.set(p.x - sx, 0, p.z - sz).normalize();
    _wdir.crossVectors(_up, _face).normalize();
    [-1, 1].forEach((s) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(
        sx + _wdir.x * 0.8 * s,
        gy + 1.1,
        sz + _wdir.z * 0.8 * s,
      );
      scene.add(post);
    });
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 0.98),
      new THREE.MeshStandardMaterial({
        map: signTexture(idx + 1, STAGE_LABELS[idx] || ""),
        roughness: 1,
        side: THREE.DoubleSide,
      }),
    );
    sign.position.set(sx, gy + 2.55, sz);
    sign.lookAt(p.x, gy + 2.55, p.z);
    scene.add(sign);
  });

  // ---- foliage from loaded low-poly models (OBJ + MTL), instanced across the mountain ----
  const dummy = new THREE.Object3D();
  function onMountain(x, z) {
    return Math.hypot(x - PEAK.x, z - PEAK.z) <= MTN_R * 0.98;
  }
  function nearTrail(x, z) {
    for (const p of TRAIL_XZ) {
      const dx = x - p[0],
        dz = z - p[1];
      if (dx * dx + dz * dz < 16) return true;
    }
    return false;
  }
  function pathEdge(count, minOff, maxOff, hMax) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const u = Math.random(),
        p = curve.getPointAt(u),
        tan = curve.getTangentAt(u);
      tan.y = 0;
      tan.normalize();
      _side.crossVectors(tan, _up).normalize();
      const sgn = Math.random() < 0.5 ? -1 : 1,
        off = PATH_W / 2 + minOff + Math.random() * (maxOff - minOff);
      const x = p.x + _side.x * off * sgn,
        z = p.z + _side.z * off * sgn;
      if (!onMountain(x, z)) continue;
      const h = terrainH(x, z);
      if (h < 1 || (hMax && h > hMax)) continue;
      out.push([x, h, z]);
    }
    return out;
  }
  function scatterLow(count, hMax) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 185,
        z = 34 - Math.random() * 165;
      if (!onMountain(x, z)) continue;
      const h = terrainH(x, z);
      if (h < 1 || h > hMax) continue;
      if (nearTrail(x, z) && Math.random() < 0.5) continue;
      out.push([x, h, z]);
    }
    return out;
  }

  // placement sets (computed now; instanced once the models finish loading)
  const treePos = [];
  for (let i = 0; i < 1700; i++) {
    const x = (Math.random() - 0.5) * 190,
      z = 34 - Math.random() * 172;
    if (!onMountain(x, z)) continue;
    const h = terrainH(x, z);
    if (h < 1.5 || h >= 17 || nearTrail(x, z)) continue;
    treePos.push([x, h, z]);
    if (treePos.length >= 430) break;
  }
  const rockPos = scatterLow(360, 32)
    .filter((p) => p[1] >= 16)
    .slice(0, 150);
  const bushPos = pathEdge(190, 0.2, 3.6, 15).concat(scatterLow(210, 15));
  const grassPos = pathEdge(260, 0.1, 3.0, 15).concat(scatterLow(230, 15));
  const flowerPos = pathEdge(120, 0.1, 3.0, 14).concat(scatterLow(90, 13));
  const plantPos = pathEdge(120, 0.2, 3.0, 15).concat(scatterLow(110, 15));
  const stumpPos = pathEdge(18, 0.6, 3.2, 14);

  // one shared material; each model's MTL colours are baked into its geometry as vertex colours
  const foliageMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 1,
  });
  const _grey = new THREE.Color(0x808080);
  const BRI = 1.35; // Quaternius Kd values are dark; lift them a touch

  // merge an OBJ group (possibly multi-material) into one vertex-coloured geometry
  function mergeToVertexColored(group) {
    group.updateMatrixWorld(true);
    const parts = [];
    group.traverse((o) => {
      if (!o.isMesh) return;
      let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      g.applyMatrix4(o.matrixWorld);
      const cnt = g.attributes.position.count;
      const col = new Float32Array(cnt * 3);
      const mats = Array.isArray(o.material) ? o.material : null;
      if (mats && g.groups && g.groups.length) {
        g.groups.forEach((grp) => {
          const mc =
            mats[grp.materialIndex] && mats[grp.materialIndex].color
              ? mats[grp.materialIndex].color
              : _grey;
          for (let k = grp.start; k < grp.start + grp.count; k++) {
            col[k * 3] = mc.r * BRI;
            col[k * 3 + 1] = mc.g * BRI;
            col[k * 3 + 2] = mc.b * BRI;
          }
        });
      } else {
        const mc = o.material && o.material.color ? o.material.color : _grey;
        for (let k = 0; k < cnt; k++) {
          col[k * 3] = mc.r * BRI;
          col[k * 3 + 1] = mc.g * BRI;
          col[k * 3 + 2] = mc.b * BRI;
        }
      }
      const keep = new THREE.BufferGeometry();
      keep.setAttribute("position", g.attributes.position.clone());
      keep.setAttribute("color", new THREE.BufferAttribute(col, 3));
      parts.push(keep);
    });
    let total = 0;
    parts.forEach((p) => (total += p.attributes.position.count));
    const pos = new Float32Array(total * 3),
      col = new Float32Array(total * 3);
    let off = 0;
    parts.forEach((p) => {
      pos.set(p.attributes.position.array, off * 3);
      col.set(p.attributes.color.array, off * 3);
      off += p.attributes.position.count;
    });
    const merged = new THREE.BufferGeometry();
    merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    merged.setAttribute("color", new THREE.BufferAttribute(col, 3));
    merged.computeVertexNormals();
    return merged;
  }

  const MODEL_PATH = "assets/models/";
  function loadModel(name) {
    return new Promise((res, rej) => {
      const mtl = new THREE.MTLLoader();
      mtl.setPath(MODEL_PATH);
      mtl.load(
        name + ".mtl",
        (mats) => {
          mats.preload();
          const ol = new THREE.OBJLoader();
          ol.setMaterials(mats);
          ol.setPath(MODEL_PATH);
          ol.load(
            name + ".obj",
            (grp) => res(mergeToVertexColored(grp)),
            undefined,
            rej,
          );
        },
        undefined,
        rej,
      );
    });
  }
  // spread a set of positions across the given model geometries, instancing each
  function buildCategory(geos, positions, o) {
    const buckets = geos.map(() => []);
    positions.forEach((p) =>
      buckets[(Math.random() * geos.length) | 0].push(p),
    );
    geos.forEach((geo, gi) => {
      const bp = buckets[gi];
      if (!bp.length) return;
      const m = new THREE.InstancedMesh(geo, foliageMat, bp.length);
      bp.forEach((p, i) => {
        const s = o.sMin + Math.random() * (o.sMax - o.sMin);
        dummy.position.set(p[0], p[1], p[2]);
        dummy.rotation.set(
          o.tilt ? (Math.random() - 0.5) * o.tilt : 0,
          Math.random() * Math.PI * 2,
          o.tilt ? (Math.random() - 0.5) * o.tilt : 0,
        );
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
      scene.add(m);
    });
  }

  if (window.THREE && THREE.OBJLoader && THREE.MTLLoader) {
    const load = (names) => Promise.all(names.map(loadModel));
    const fail = (what) => (e) =>
      console.warn(
        "[climb] " +
          what +
          " failed to load — check assets/models/ is present and served over http://",
        e,
      );
    load([
      "CommonTree_1",
      "CommonTree_3",
      "CommonTree_5",
      "PineTree_2",
      "PineTree_4",
      "PineTree_5",
    ])
      .then((g) => buildCategory(g, treePos, { sMin: 1.6, sMax: 2.6 }))
      .catch(fail("trees"));
    load(["Rock_1", "Rock_4", "Rock_5", "Rock_Moss_2", "Rock_Moss_4"])
      .then((g) =>
        buildCategory(g, rockPos, { sMin: 0.8, sMax: 2.2, tilt: 0.5 }),
      )
      .catch(fail("rocks"));
    load(["Bush_1", "Bush_2", "BushBerries_1"])
      .then((g) => buildCategory(g, bushPos, { sMin: 0.8, sMax: 1.8 }))
      .catch(fail("bushes"));
    load(["Grass", "Grass_Short"])
      .then((g) => buildCategory(g, grassPos, { sMin: 0.8, sMax: 1.7 }))
      .catch(fail("grass"));
    load(["Flowers"])
      .then((g) => buildCategory(g, flowerPos, { sMin: 0.9, sMax: 1.7 }))
      .catch(fail("flowers"));
    load(["Plant_1", "Plant_2"])
      .then((g) => buildCategory(g, plantPos, { sMin: 0.8, sMax: 1.6 }))
      .catch(fail("plants"));
    load(["TreeStump_Moss"])
      .then((g) =>
        buildCategory(g, stumpPos, { sMin: 1.0, sMax: 1.8, tilt: 0.3 }),
      )
      .catch(fail("stumps"));
  } else {
    console.warn(
      "[climb] OBJ/MTL loaders not available — the model <script> tags didn't load.",
    );
  }

  function cloudTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(0.5, "rgba(245,248,252,0.6)");
    grd.addColorStop(1, "rgba(245,248,252,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const cloudTex = cloudTexture();
  const clouds = [];
  for (let i = 0; i < 14; i++) {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: cloudTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    );
    const scl = 14 + Math.random() * 18;
    s.scale.set(scl, scl * 0.6, 1);
    s.position.set(
      (Math.random() - 0.5) * 120,
      10 + Math.random() * 26,
      -20 - Math.random() * 90,
    );
    s.userData.speed = 0.6 + Math.random() * 1.2;
    scene.add(s);
    clouds.push(s);
  }
  // a sea of clouds wrapping the peak, for the summit reveal (drifts past)
  for (let i = 0; i < 12; i++) {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: cloudTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.92,
      }),
    );
    const scl = 20 + Math.random() * 16;
    s.scale.set(scl, scl * 0.55, 1);
    const ang = Math.random() * Math.PI * 2,
      rad = 10 + Math.random() * 42;
    s.position.set(
      PEAK.x + Math.cos(ang) * rad,
      PEAK.y - 11 + Math.random() * 5,
      PEAK.z + Math.sin(ang) * rad,
    );
    s.userData.speed = 0.5 + Math.random() * 1.0;
    scene.add(s);
    clouds.push(s);
  }

  /* =====================================================================
     Scroll → camera + basecamp reveal
     ===================================================================== */
  const basecamps = [...document.querySelectorAll(".basecamp")].map((el) => ({
    el,
    t: parseFloat(el.dataset.t),
  }));
  const heroEl = gid("hero"),
    railFill = gid("rail-fill");
  const REVEAL_WIN = 0.09; // how wide (in scroll progress) each basecamp stays visible

  let target = 0,
    current = 0;
  function scrollProgress() {
    const max = document.body.scrollHeight - innerHeight;
    return max > 0 ? clamp01(window.scrollY / max) : 0;
  }
  addEventListener(
    "scroll",
    () => {
      target = scrollProgress();
    },
    { passive: true },
  );

  const _pos = new THREE.Vector3(),
    _look = new THREE.Vector3(),
    _vant = new THREE.Vector3();
  function updateScene(p) {
    const t = clamp01(p);
    const pos = curve.getPointAt(t);
    const ahead = curve.getPointAt(Math.min(t + LOOK_AHEAD, 1));

    // first-person walking pose (bob eases out over the last 10%)
    const end = clamp01((p - 0.9) / 0.1);
    const settle = 1 - end;
    const phase = t * BOB_STEPS * Math.PI * 2;
    const bobY = Math.sin(phase) * BOB_AMPL * settle;
    const swayX = Math.sin(phase * 0.5) * SWAY_AMPL * settle;
    _pos.set(pos.x + swayX, pos.y + EYE_HEIGHT + bobY, pos.z);
    _look.copy(ahead);
    _look.y += EYE_HEIGHT * 0.75;

    // grand summit reveal: pull up & back and turn to face the peak
    _vant.set(PEAK.x, PEAK.y + 7, PEAK.z + 30);
    _pos.lerp(_vant, end);
    _look.lerp(PEAK, end);

    camera.position.copy(_pos);
    camera.lookAt(_look);

    const s = skyAt(p);
    document.body.style.setProperty(
      "--sky-top",
      `rgb(${s.top[0]},${s.top[1]},${s.top[2]})`,
    );
    document.body.style.setProperty(
      "--sky-bot",
      `rgb(${s.bot[0]},${s.bot[1]},${s.bot[2]})`,
    );
    if (scene.fog)
      scene.fog.color.setRGB(s.bot[0] / 255, s.bot[1] / 255, s.bot[2] / 255);

    heroEl.style.opacity = String(1 - clamp01(p / 0.04));
    heroEl.style.pointerEvents = p < 0.02 ? "auto" : "none";
    railFill.style.height = (p * 100).toFixed(1) + "%";

    // basecamp reveal: fade/settle in as the camera arrives at each one
    basecamps.forEach((bc) => {
      const d = Math.abs(p - bc.t);
      const vis = clamp01(1 - d / REVEAL_WIN);
      bc.el.style.opacity = vis.toFixed(3);
      bc.el.style.transform = `translateY(${((1 - vis) * 26).toFixed(1)}px)`;
      bc.el.classList.toggle("is-live", vis > 0.5);
    });
  }

  function tick() {
    current += (target - current) * SCROLL_EASE;
    updateScene(current);
    clouds.forEach((c) => {
      c.position.x += c.userData.speed * 0.02;
      if (c.position.x > 70) c.position.x = -70;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  updateScene(0);
  tick();

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  /* =====================================================================
     Nav / CTA links → scroll to the matching basecamp's point on the trail
     ===================================================================== */
  const nav = gid("nav"),
    navToggle = gid("nav-toggle");
  function tForHash(hash) {
    if (hash === "#top") return 0;
    const bc = basecamps.find((b) => "#" + b.el.id === hash);
    return bc ? bc.t : null;
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    const hash = link.getAttribute("href");
    const t = tForHash(hash);
    if (t === null) return;
    e.preventDefault();
    const max = document.body.scrollHeight - innerHeight;
    window.scrollTo({ top: t * max, behavior: "smooth" });
    if (nav) nav.classList.remove("menu-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
  if (navToggle)
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  // nav solid-state on scroll
  let navTick = false;
  addEventListener(
    "scroll",
    () => {
      if (navTick) return;
      navTick = true;
      requestAnimationFrame(() => {
        nav.classList.toggle(
          "nav--scrolled",
          window.scrollY > innerHeight * 0.5 ||
            nav.classList.contains("menu-open"),
        );
        navTick = false;
      });
    },
    { passive: true },
  );
})();
