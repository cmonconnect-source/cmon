/* Shared page pieces. Each function returns HTML for one component. */
var Components = {
  base: document.body.getAttribute("data-base") || "",
  header: function () {
    var c = window.FMC, b = this.base;
    var links = c.NAV.map(function (n) { return '<a class="l" href="' + b + n.href + '">' + n.label + '</a>'; }).join("");
    return '<header><div class="wrap nav"><a class="logo" href="' + b + 'index.html#home">C\'mon<i>.</i></a>' +
      links + '<a class="btn gold sm" href="' + b + 'index.html#levels">Join FMC-21</a></div></header>';
  },
  footer: function () {
    var c = window.FMC;
    return '<footer><div class="wrap"><b>' + c.BRAND.name + '</b><em>' + c.BRAND.tagline + '</em>' +
      '<p style="margin-top:14px">C\'mon presents ' + c.PROGRAMME + '<br>' +
      '<a href="mailto:' + c.CONTACT.email + '">' + c.CONTACT.email + '</a> · ' +
      '<a href="https://wa.me/' + c.CONTACT.whatsapp + '">' + c.CONTACT.phone + '</a></p>' +
      '<span>© C\'mon. All rights reserved.</span></div></footer>';
  },
  toast: function (text) {
    var m = document.getElementById("msg");
    m.textContent = text; m.style.display = "block";
    setTimeout(function () { m.style.display = "none"; }, 4000);
  }
};
