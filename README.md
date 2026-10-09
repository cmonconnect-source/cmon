# C'mon: the little push

Static website for GitHub Pages. No build step needed.

## Structure

```
index.html              C'mon home: programmes, about, reviews, contact
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
  js/main.js            Startup: renders components, wires form buttons
```

## Everyday changes

- **Enrollment form:** set `FORM_URL` in `assets/js/config.js`.
- **Feedback form:** set `FEEDBACK_FORM_URL` in `config.js`.
- **Add a review:** add `{ name, level, text }` to `REVIEWS` in `config.js`. Only add real reviews, with permission.
- **Add a new programme:** copy `pages/fmc.html` to `pages/<name>.html`, edit it, add a card in the "Our programmes" section of `index.html`, and add a line to `PROGRAMMES` in `config.js`.
- **Add a nav link or change contact details:** `NAV` and `CONTACT` in `config.js`.
- **Add a feature (payments, progress):** put its code in a new file in `assets/js/`, add a `<script>` tag on the page that needs it, and use `FEATURES` to switch it on or off.
- Pages inside `pages/` must keep `data-base="../"` on `<body>`.

## Publishing on GitHub Pages

Upload everything in this folder to the root of the repository (keep the folders and `.nojekyll`), commit to `main`, and the site updates in a minute or two.
