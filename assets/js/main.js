/* Page startup: render shared components and wire Level 1 buttons. */
(function () {
  var c = window.FMC;
  document.getElementById("site-header").innerHTML = Components.header();
  document.getElementById("site-footer").innerHTML = Components.footer();

  // Every element marked data-join opens the enrollment form.
  document.querySelectorAll("[data-join]").forEach(function (a) {
    if (c.FORM_URL) { a.href = c.FORM_URL; a.target = "_blank"; a.rel = "noopener"; }
    else {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        Components.toast("Registration link will be added soon. Please WhatsApp " + c.CONTACT.phone + " to join.");
      });
    }
  });
})();
