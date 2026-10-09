/* Site settings. Change values here, not in the HTML. Paths are relative to the site root. */
window.FMC = {
  FORM_URL: "",            // Google Form for FMC-21 Level 1 enrollment
  FEEDBACK_FORM_URL: "",   // Google Form for reviews and feedback
  CONTACT: { email: "cmon.connect@gmail.com", phone: "8948600298", whatsapp: "918948600298" },
  BRAND: { name: "C'mon", tagline: "The little push", motto: "Learning. Growing. Communicating." },
  LOGO: "assets/img/logo.png",
  // Add real participant reviews here, for example:
  // { name: "Asha", level: "FMC-21 Level 1", text: "I stopped dreading speaking." }
  REVIEWS: [],
  // Programmes shown in the footer. Add one line per new programme.
  PROGRAMMES: [ { label: "FMC-21", href: "pages/fmc.html" } ],
  FEATURES: { payments: false, progress: false },
  NAV: [
    { label: "Home", href: "index.html#home" },
    { label: "About", href: "index.html#about" },
    { label: "Programmes", href: "index.html#programmes" },
    { label: "Reviews", href: "index.html#reviews" },
    { label: "Contact", href: "index.html#contact" }
  ]
};
