/* Startup for the public pages (landing, FMC info). */
(function () {
  var c = window.FMC, b = Components.base;
  var h = document.getElementById("site-header"); if (h) h.innerHTML = Components.header();
  var f = document.getElementById("site-footer"); if (f) f.innerHTML = Components.footer();
  var r = document.getElementById("reviews"); if (r) r.innerHTML = Components.reviews();
  var l = document.getElementById("levels-mount"); if (l) l.innerHTML = Components.levelCards("landing");
  document.querySelectorAll("[data-join]").forEach(function (a) { a.href = b + "app.html#/signup"; });
  var form = document.getElementById("contact-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    location.href = "mailto:" + c.CONTACT.email + "?subject=" + encodeURIComponent("Message from " + d.get("name")) +
      "&body=" + encodeURIComponent(d.get("message") + "\n\nFrom: " + d.get("name") + " (" + d.get("email") + ")");
  });
})();
