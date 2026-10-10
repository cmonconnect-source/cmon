# C'mon: the little push

Static website for GitHub Pages. No build step needed.

## Structure

```
index.html              Landing: about, programmes, FAQs, connect us
  app.html                Login, sign up, profile, enrolment, progress (hash routes)
pages/
  fmc.html              Everything about FMC-21 (levels, journey, rules, certificate, FAQ)
  payment.html          Placeholder for online payments
  progress.html         Placeholder for progress reports
assets/
  img/logo.png          C'mon logo (transparent background)
  img/favicon-*.png, favicon.ico, apple-touch-icon.png   Browser tab and home-screen icons
  css/styles.css        All styling and colour tokens (:root)
  js/config.js          Form links, contact, nav, programmes, reviews, feature flags
  js/components.js      Shared header, footer, reviews section
  js/main.js            Startup for public pages
  js/app.js             Account area logic. Has a marked "data layer" to swap for a real backend
```

## Everyday changes

- **Social links:** fill `SOCIAL` in `assets/js/config.js`.
- **Levels, fees, rules:** edit `LEVELS` and `RULES` in `config.js`.
- **Add a review:** add `{ name, level, text }` to `REVIEWS` in `config.js`. Only add real reviews, with permission.
- **Add a new programme:** copy `pages/fmc.html` to `pages/<name>.html`, edit it, add a card in the "Our programmes" section of `index.html`, and add a line to `PROGRAMMES` in `config.js`.
- **Add a nav link or change contact details:** `NAV` and `CONTACT` in `config.js`.
- **Add a feature (payments, progress):** put its code in a new file in `assets/js/`, add a `<script>` tag on the page that needs it, and use `FEATURES` to switch it on or off.
- Pages inside `pages/` must keep `data-base="../"` on `<body>`.

## Publishing on GitHub Pages

Upload everything in this folder to the root of the repository (keep the folders and `.nojekyll`), commit to `main`, and the site updates in a minute or two.

## Prototype limits (read before launch)

Sign up, login, OTP, enrolment, payment and progress run in the visitor's own browser (localStorage). That means data is not shared between devices, anyone can edit it, recordings are not uploaded, and the OTP is shown on screen. Before real launch you need a backend for: user accounts, real OTP (SMS or email), Razorpay payments with server-side verification, private file storage for recordings, and certificate emails.
