/* Page startup: render shared components and wire form buttons. */
(function () {
  var c = window.FMC;
  document.getElementById("site-header").innerHTML = Components.header();
  document.getElementById("site-footer").innerHTML = Components.footer();
  var r = document.getElementById("reviews");
  if (r) r.innerHTML = Components.reviews();

  function wire(sel, url, note) {
    document.querySelectorAll(sel).forEach(function (a) {
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
      else a.addEventListener("click", function (e) { e.preventDefault(); Components.toast(note); });
    });
  }
  wire("[data-join]", c.FORM_URL, "Registration link will be added soon. Please WhatsApp " + c.CONTACT.phone + " to join.");
  wire("[data-feedback]", c.FEEDBACK_FORM_URL, "Feedback form coming soon. You can email " + c.CONTACT.email + " meanwhile.");
})();
