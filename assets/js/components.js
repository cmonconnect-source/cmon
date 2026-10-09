/* Shared page pieces. Each function returns HTML for one component. */
var Components = {
  base: document.body.getAttribute("data-base") || "",
  header: function () {
    var c = window.FMC, b = this.base;
    var links = c.NAV.map(function (n) { return '<a class="l" href="' + b + n.href + '">' + n.label + '</a>'; }).join("");
    return '<header><div class="wrap nav"><a class="logo" href="' + b + 'index.html#home"><img src="' + b + c.LOGO + '" alt="C\'mon"></a>' +
      links + '<a class="btn gold sm" href="' + b + 'pages/fmc.html#levels">Join FMC-21</a></div></header>';
  },
  footer: function () {
    var c = window.FMC, b = this.base;
    var nav = c.NAV.map(function (n) { return '<a href="' + b + n.href + '">' + n.label + '</a>'; }).join("");
    var progs = c.PROGRAMMES.map(function (p) { return '<a href="' + b + p.href + '">' + p.label + '</a>'; }).join("");
    return '<footer><div class="fcta"><div class="wrap"><div><b>Ready for your little push?</b>Join FMC-21 Level 1 for ₹199.</div>' +
      '<a class="btn" href="' + b + 'pages/fmc.html#levels">Join FMC-21</a></div></div>' +
      '<div class="wrap fgrid"><div><img src="' + b + c.LOGO + '" alt="C\'mon"><p>' + c.BRAND.motto + '</p></div>' +
      '<div><h4>Explore</h4>' + nav + '</div><div><h4>Programmes</h4>' + progs + '</div>' +
      '<div><h4>Contact</h4><a href="mailto:' + c.CONTACT.email + '">' + c.CONTACT.email + '</a>' +
      '<a href="https://wa.me/' + c.CONTACT.whatsapp + '">WhatsApp ' + c.CONTACT.phone + '</a></div></div>' +
      '<div class="wrap fbot"><span>© C\'mon. All rights reserved.</span><a href="#home">Back to top ↑</a></div></footer>';
  },
  reviews: function () {
    var c = window.FMC, list = c.REVIEWS || [];
    var cards = list.length ? list.map(function (r) {
      return '<div class="card rev"><blockquote>“' + r.text + '”</blockquote><b>' + r.name + '</b><span>' + (r.level || "") + '</span></div>';
    }).join("") : '<div class="card empty"><h3>Be the first to share your experience</h3><p>Took part in FMC-21? Tell us how it went. Your feedback helps the next participants.</p></div>';
    return '<section class="soft"><div class="wrap"><h2>Reviews &amp; feedback</h2><div class="grid g3">' + cards +
      '</div><div class="row"><a class="btn blue" data-feedback href="#">Share your feedback</a></div></div></section>';
  },
  toast: function (text) {
    var m = document.getElementById("msg");
    m.textContent = text; m.style.display = "block";
    setTimeout(function () { m.style.display = "none"; }, 4000);
  }
};
