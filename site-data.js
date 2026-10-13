/* =====================================================================
   SITE DATA: the one place for contact details, booking link, packages,
   individual services and prices. script.js renders all of it, so edit
   values here and nowhere else.
   Copy source: Monset Packages Brochure + Pamphlet.
   ===================================================================== */
window.SITE = {
  contact: {
    email: "sales@monset.co",
    phone: "+63 917 337 7169",
    phoneHref: "+639173377169",
    website: "monset.co",
    websiteUrl: "https://monset.co",
    bookingUrl: "https://calendly.com/bernard-monsetco",
  },

  packages: [
    {
      name: "Starter",
      price: 30000,
      fee: "One time fee",
      tagline: "For businesses that need to be found online.",
      items: [
        ["3 page website", "A clean, simple site with the essentials."],
        ["3 months maintenance", "Updates, fixes and security, handled."],
      ],
      callout: {
        title: "Want to add more?",
        text: "Add any of our individual services, or move up a package anytime.",
      },
    },
    {
      name: "Business",
      price: 60000,
      fee: "One time fee",
      featured: true,
      tagline: "For shops ready to sell and run things digitally.",
      items: [
        ["Website, up to 5 pages", "Room to show your products and services."],
        ["6 months maintenance", "Updates, fixes and security, handled."],
        ["Digital POS, CRM and dashboard", "Sell, track customers and see your numbers in one place."],
        ["Automation", "Reminders and follow ups that run on their own."],
        ["Online payments", "Customers can pay you online."],
        ["SEO", "Get found when people search on Google."],
        ["AEO", "Get mentioned in AI answers like ChatGPT."],
      ],
    },
    {
      name: "Premium",
      price: 100000,
      fee: "One time fee",
      tagline: "For established businesses that want the full setup.",
      items: [
        ["10 page website", "Space for your full story, menu or catalog."],
        ["12 months maintenance", "A full year of updates, fixes and security."],
        ["POS, CRM and dashboard", "Sell, track customers and see your numbers in one place."],
        ["Automation", "Reminders and follow ups that run on their own."],
        ["Online payments", "Customers can pay you online."],
        ["SEO", "Get found when people search on Google."],
        ["AEO", "Get mentioned in AI answers like ChatGPT."],
      ],
    },
  ],

  // fromPrice: null shows "Ask us for a quote."; a number shows "from ₱X".
  services: [
    { name: "Website", text: "Your business online, open 24/7.", fromPrice: null },
    { name: "Maintenance", text: "We keep your site updated, secure and running.", fromPrice: null },
    { name: "POS", text: "A digital cash register for sales and receipts.", fromPrice: null },
    { name: "CRM and dashboard", text: "Keep track of your customers and see your numbers at a glance.", fromPrice: null },
    { name: "PMS", text: "Bookings, rooms and guests in one system, for hotels and resorts.", fromPrice: null },
    { name: "Automation", text: "Repetitive tasks like reminders and follow ups, done for you.", fromPrice: null },
    { name: "SEO", text: "Show up when people search on Google.", fromPrice: null },
    { name: "AEO", text: "Show up in AI answers like ChatGPT and Google AI.", fromPrice: null },
  ],
};
