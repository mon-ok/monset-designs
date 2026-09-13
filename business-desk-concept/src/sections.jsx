import React from "react";

// The three destinations reached from the monitor. Swap copy / icons freely —
// or wire `body` to real content later.
const Grid = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...p}
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const Layers = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...p}
  >
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
);
const Signal = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...p}
  >
    <path d="M4 18v-2M9 18v-5M14 18v-8M19 18V7" strokeLinecap="round" />
  </svg>
);

export const SECTIONS = [
  {
    id: "overview",
    name: "Overview",
    Icon: Grid,
    title: "Overview",
    lede: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    stats: [
      { k: "Founded", v: "20XX" },
      { k: "People", v: "48" },
      { k: "Markets", v: "6" },
    ],
  },
  {
    id: "services",
    name: "Services",
    Icon: Layers,
    title: "Services",
    lede: "Duis aute irure dolor in reprehenderit in voluptate velit.",
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus at porttitor.",
    stats: [
      { k: "Strategy", v: "—" },
      { k: "Build", v: "—" },
      { k: "Support", v: "—" },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    Icon: Signal,
    title: "Contact",
    lede: "Nulla facilisi. Praesent commodo cursus magna vel scelerisque.",
    body: "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Reach the team and we will get back to you within one working day.",
    stats: [
      { k: "Email", v: "hello@" },
      { k: "Phone", v: "+00" },
      { k: "Hours", v: "9–5" },
    ],
  },
];
