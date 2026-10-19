// images go through Vite so their paths survive any hosting setup (and get cache-busting names)
import kaleaShot from "./assets/work/kalea.webp";
import lmsShot from "./assets/work/lms.webp";
import posShot from "./assets/work/pos.webp";
import pickleballShot from "./assets/work/pickleball.webp";
import kaleaClip from "./assets/work/kalea.mp4";
import lmsClip from "./assets/work/lms.mp4";
import posClip from "./assets/work/pos.mp4";
import pickleballClip from "./assets/work/pickleball.mp4";
import sheetsLogo from "./assets/logos/googlesheets.svg";
import ghlLogo from "./assets/logos/gohighlevel.png";
import paymongoLogo from "./assets/logos/paymongo.png";
import zapierLogo from "./assets/logos/zapier.svg";
import n8nLogo from "./assets/logos/n8n.svg";

// All site copy lives here (approved in SITE-COPY.md), so wording can change without touching layout.

export const CONTACT = {
  email: "info@monset.co",
  phone: "+63 917 337 7169",
  phoneHref: "tel:+639173377169",
  calendly: "https://calendly.com/bernard-monsetco",
};

export const PROBLEMS = {
  established: [
    {
      title: "Enquiries go cold because nobody followed up.",
      body: "A customer asks, your team is busy, and by the time someone replies they've bought elsewhere.",
    },
    {
      title: "Your people spend hours on work a system could do.",
      body: "Copying orders into spreadsheets, sending the same reminders, chasing the same updates.",
    },
    {
      title: "You find out about problems at month end.",
      body: "By the time the report lands, the slow week, the stock gap or the unhappy client has already cost you.",
    },
    {
      title: "Sales, stock and cash never quite match.",
      body: "Different records in different places, and nobody fully trusts the numbers.",
    },
    {
      title: "Growing means hiring more people for the same work.",
      body: "Every new branch or busy season adds headcount instead of output.",
    },
    {
      title: "Your website doesn't win business anymore.",
      body: "It's out of date, slow on phones, and a competitor shows up first on Google and in AI answers.",
    },
  ],
  starting: [
    {
      title: "People can't find you online.",
      body: "If you're not on Google, Maps and in AI answers, the customer finds someone else.",
    },
    {
      title: "Your website (or Facebook page) doesn't look like a real business.",
      body: "First impressions decide whether people message you at all.",
    },
    {
      title: "Orders and bookings live in chats and notebooks.",
      body: "Things get missed, double-booked or forgotten.",
    },
    {
      title: "You can't take payment online.",
      body: "Every “how do I pay?” message is a sale that might not happen.",
    },
    {
      title: "You're doing everything yourself.",
      body: "Reminders, follow-ups and records eat the hours you need for the actual work.",
    },
  ],
};

export const METHOD = [
  {
    short: "Understand",
    title: "We understand your business.",
    body: "Before we suggest anything, we learn how customers find you, how work moves through your team, and where you want to be in a year.",
  },
  {
    short: "Find the gaps",
    title: "We find your performance gaps.",
    body: "We show you, in plain terms, where you're losing customers, time or money, and roughly what it's costing you.",
  },
  {
    short: "Build the fix",
    title: "We build the right fix.",
    body: "Only what solves the gap, built around how your team already works. Often that means connecting tools you already pay for, not replacing them.",
  },
  {
    short: "Measure",
    title: "We measure the improvement.",
    body: "We agree on the numbers before we start, measure them before and after, and show you the difference.",
  },
];

// fixed furniture for every fix: outcome, what changes, what's included, what we measure, tech label
export const FIXES = [
  {
    title: "Never lose a customer to a slow reply.",
    body: "Every enquiry is recorded, assigned and followed up automatically, so nothing slips through when the team is busy.",
    included: "Customer records in one place, automatic follow-up reminders, enquiry tracking from first message to sale, and your team working from the same information.",
    measure: ["Time to first reply", "Enquiries followed up", "Enquiries that become sales"],
    tech: "CRM · automation",
    mock: "inbox",
  },
  {
    title: "Get hours back every week.",
    body: "The repetitive work (reminders, data entry, status updates, reports) runs on its own, so your staff do the work that needs a person.",
    included: "We map your repetitive tasks, automate the ones worth it, and connect the tools you already use so they work as one.",
    measure: ["Hours spent on manual tasks", "Errors from re-typing"],
    tech: "Workflow automation · Zapier · n8n",
    mock: "flow",
  },
  {
    title: "See your business clearly, before problems get expensive.",
    body: "Sales, customers and performance on one screen, updated as it happens, not at month end.",
    included: "A live dashboard built around the numbers you care about, readable on your phone.",
    measure: ["How soon you spot a problem", "Time spent building reports"],
    tech: "Dashboard · reporting",
    mock: "dashboard",
  },
  {
    title: "Sell faster, and know exactly what's in stock.",
    body: "A checkout built for your shop, with stock that updates itself and sales reports that write themselves.",
    included: "Custom point of sale, inventory tracking, automatic sales reports and staff training.",
    measure: ["Checkout time", "Stock mismatches", "Time to close the day"],
    tech: "POS",
    mock: "pos",
  },
  {
    title: "Run your rooms and bookings from one place.",
    body: "For hotels, resorts and anything booked by the night or the hour: rooms, rates, bookings and guests together, with no double bookings.",
    included: "A custom booking and property system, plus staff training.",
    measure: ["Double bookings", "Time spent managing bookings"],
    tech: "PMS · booking system",
    mock: "booking",
  },
  {
    title: "Be the business customers find first.",
    body: "A website that looks like you're serious, works on every phone, and shows up when people search on Google or ask ChatGPT.",
    included: "Website, Google Business Profile, search setup, AI answer setup and online payments.",
    measure: ["Enquiries from your website", "Where you rank for your key searches"],
    tech: "Website · SEO · AEO · PayMongo",
    mock: "search",
  },
  {
    title: "Keep it all running.",
    body: "We stay on after launch: updates, fixes, security and backups, so the system keeps working while you run the business.",
    included: "Ongoing maintenance and support.",
    measure: ["Uptime", "Time to fix an issue"],
    tech: "Maintenance",
    mock: "uptime",
  },
];

export const TOOLS = [
  { name: "Google Sheets", logo: sheetsLogo },
  { name: "GoHighLevel", logo: ghlLogo },
  { name: "PayMongo", logo: paymongoLogo },
  { name: "Zapier", logo: zapierLogo },
  { name: "n8n", logo: n8nLogo },
];

export const QUESTIONS = [
  {
    q: "Will it disrupt how we work?",
    a: "We build around how your team already works and roll changes out in stages. Your business keeps running while we build.",
  },
  {
    q: "Will my staff actually use it?",
    a: "We train your team on everything we set up, and design it to be simpler than what they do now. If it's harder, it's wrong.",
  },
  {
    q: "What if it doesn't pay off?",
    a: "That's why we start with the assessment and agree on the numbers before building. You'll see the before and after.",
  },
  {
    q: "Am I locked into monthly software fees?",
    a: "No. Custom systems we build are yours outright.",
  },
  {
    q: "Do I have to replace the tools I already use?",
    a: "Usually not. We'd rather connect what you have than sell you something new.",
  },
  {
    q: "How much will it cost?",
    a: "It depends on what we find. After the assessment you get a clear, fixed quote for each step, and you choose what to start with.",
  },
  {
    q: "Do I have to start with the biggest package?",
    a: "No. Start with what fits where you are today. Each step builds on the one before it, so you can add more as you grow.",
  },
  {
    q: "Where are you based?",
    a: "Cebu, Philippines. Calls happen online, so we can work with you wherever you are.",
  },
];

export const PARTNER_STEPS = ["Assessment", "Your plan, mapped", "Build in stages", "Measure and improve"];

export const PACKAGES = [
  {
    name: "Starter",
    tagline: "Get found online.",
    body: "A clean, professional website with the essentials, plus 3 months of updates and fixes handled for you.",
  },
  {
    name: "Business",
    tagline: "Start selling and running things digitally.",
    body: "A bigger website, point of sale, customer records and dashboard, automatic reminders and follow-ups, online payments, plus Google and AI search setup. 6 months of maintenance.",
    popular: true,
  },
  {
    name: "Premium",
    tagline: "The full setup.",
    body: "Everything in Business with a 10-page site, more automations, ongoing search work and a full year of maintenance.",
  },
];

// status + date stamps are honest: client work vs demo builds, checked when the screenshots were taken
export const WORK = [
  {
    name: "Kalea Heights",
    status: "Client work · in progress",
    client: true,
    body: "A property showcase for a real estate agent: project film, amenities, 360 tour and unit walkthrough, ending in a viewing booking. Built to turn browsers into booked viewings.",
    image: kaleaShot,
    clip: kaleaClip,
    url: "https://kalea-heights-monset.vercel.app",
  },
  {
    name: "Court booking",
    status: "Template",
    body: "A court booking site for a sports facility: schedules, courts and online reservations. Shows how bookings stop living in chat threads.",
    image: pickleballShot,
    clip: pickleballClip,
    url: "https://pickleball-template.vercel.app",
  },
  {
    name: "Sample POS",
    status: "Demo build",
    body: "A point of sale with sales, stock and expense tracking. Shows how a shop sees its money in one place instead of three.",
    image: posShot,
    clip: posClip,
    url: "https://monset-pos-sample.vercel.app/expenses",
  },
  {
    name: "Learning portal",
    status: "Demo build",
    body: "A learning center portal for students and teachers: courses, progress and a teacher dashboard. Shows how a school can run classes and track progress in one place.",
    image: lmsShot,
    clip: lmsClip,
    url: "https://learning-portal-monset.vercel.app",
  },
];
export const WORK_CHECKED = "Oct 2026";
