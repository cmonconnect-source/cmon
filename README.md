# C'mon presents FMC-21

Static website for GitHub Pages. No build step needed.

## Structure

```
index.html              Home page (all main sections)
pages/
  payment.html          Placeholder for online payments
  progress.html         Placeholder for progress reports
assets/
  css/styles.css        All styling and colour tokens (:root)
  js/config.js          Form link, contact details, nav links, feature flags
  js/components.js      Shared header, footer and toast
  js/main.js            Startup: renders components, wires join buttons
```

## Everyday changes

- **Add the Google Form link:** set `FORM_URL` in `assets/js/config.js`.
- **Change contact details:** edit `CONTACT` in `config.js`.
- **Add a nav link:** add an entry to `NAV` in `config.js`.
- **Add a new page:** copy `pages/progress.html`, rename it, change the title and content. Keep `data-base="../"` on `<body>`.
- **Add a feature:** put its code in a new file in `assets/js/` (for example `payment.js`), then add a `<script>` tag to the page that needs it. Use the `FEATURES` flags in `config.js` to switch it on or off.

## Publishing on GitHub Pages

Upload everything in this folder to the root of the repository (including `.nojekyll` and the `assets` and `pages` folders), commit to `main`, and the site updates in a minute or two.
