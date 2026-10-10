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
    { label: "About", href: "index.html#about" },
    { label: "Programme", href: "index.html#programmes" },
    { label: "FAQs", href: "index.html#faq" },
    { label: "Connect us", href: "index.html#connect" }
  ],
  SOCIAL: { Instagram: "", Facebook: "", LinkedIn: "" },   // paste your profile links
  LEVELS: [
    { id: 1, format: "Audio", fee: 199, days: 21, daily: "30 sec–2 min daily",
      motive: "Build a daily speaking habit and lose the hesitation.",
      intro: "Record a fresh audio clip on any topic every day for 21 days." },
    { id: 2, format: "Video", fee: 299, days: 21, daily: "30 sec–2 min daily",
      motive: "Gain confidence on camera: body language and expression.",
      intro: "Same daily habit, now on video. Open to Level 1 certificate holders." },
    { id: 3, format: "Live", fee: 499, days: 1, daily: "5-minute live talk",
      motive: "Speak spontaneously and clearly under real pressure.",
      intro: "A face-to-face talk on a topic we assign. Open to Level 2 certificate holders." }
  ],
  RULES: [
    "I understand FMC-21 follows a strict no-miss rule.",
    "I understand missing one submission can disqualify me from certification.",
    "I understand the registration fee is non-refundable after registration.",
    "I will submit my recording within the daily submission window.",
    "I will submit original content recorded that day.",
    "I will state the Day Number and Topic Name at the start of my recording.",
    "I understand the challenge is conducted in English only.",
    "I understand the eligibility requirements for Level 2 progression to Level 3."
  ]
};
