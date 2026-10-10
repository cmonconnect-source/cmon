/* Shared page pieces. Each function returns HTML for one component. */
var Components = {
  base: document.body.getAttribute("data-base") || "",
  user: function () {
    try { var e = JSON.parse(localStorage.getItem("fmc_session")); var u = JSON.parse(localStorage.getItem("fmc_users")) || {}; return e ? u[e] : null; } catch (x) { return null; }
  },
  logo: function () { return '<a class="logo" href="' + this.base + 'index.html#home"><img src="' + this.base + window.FMC.LOGO + '" alt="C\'mon"></a>'; },
  header: function () {
    var c = window.FMC, b = this.base, u = this.user();
    var links = c.NAV.map(function (n) { return '<a class="l" href="' + b + n.href + '">' + n.label + '</a>'; }).join("");
    var right = u ? '<a class="btn gold sm" href="' + b + 'app.html#/profile">My profile</a>'
      : '<a class="btn ghost sm" style="color:#fff" href="' + b + 'app.html#/login">Login</a><a class="btn gold sm" href="' + b + 'app.html#/signup">Sign up</a>';
    return '<header><div class="wrap nav">' + this.logo() + links + right + '</div></header>';
  },
  appHeader: function (u) {
    var b = this.base;
    return '<header><div class="wrap nav">' + this.logo() + '<details class="menu"><summary aria-label="Profile menu">👤 <span>' +
      (u.name.split(" ")[0]).replace(/[<>&"]/g, "") + '</span></summary><div><a href="#/profile">My profile</a><a href="#/progress">Enrolled</a>' +
      '<a href="#/completed">Completed</a><a href="#/logout">Log out</a></div></details></div></header>';
  },
  levelCards: function (mode) {
    var b = this.base;
    var cards = window.FMC.LEVELS.map(function (l) {
      var head = '<span class="badge ' + (l.id === 1 ? "on" : "off") + '">' + (l.id === 1 ? "Start here" : "Requires Level " + (l.id - 1)) + '</span>' +
        '<h3>FMC-21 · Level ' + l.id + ' (' + l.format + ')</h3><div class="meta">₹' + l.fee + ' · ' + (l.id === 3 ? "5-minute live talk" : l.days + " days · " + l.daily) + '</div>' +
        '<p><b>Motive:</b> ' + l.motive + '</p><p>' + l.intro + '</p>';
      if (mode === "landing") return '<a class="card lvl" href="' + b + 'app.html#/login">' + head + '<b class="go">Login to apply →</b></a>';
      return '<div class="card lvl">' + head + '<div class="row" style="margin-top:auto"><button class="btn gold sm" data-apply="' + l.id + '">Apply now</button>' +
        '<button class="btn ghost sm" data-details="' + l.id + '">Programme details</button></div></div>';
    }).join("");
    return '<div class="card parent"><div class="grid g3">' + cards + '</div></div>';
  },
  footer: function () {
    var c = window.FMC, b = this.base;
    var nav = c.NAV.map(function (n) { return '<a href="' + b + n.href + '">' + n.label + '</a>'; }).join("");
    var progs = c.PROGRAMMES.map(function (p) { return '<a href="' + b + p.href + '">' + p.label + '</a>'; }).join("");
    var soc = Object.keys(c.SOCIAL).map(function (k) { return c.SOCIAL[k] ? '<a href="' + c.SOCIAL[k] + '" target="_blank" rel="noopener">' + k + '</a>' : ""; }).join("");
    return '<footer><div class="fcta"><div class="wrap"><div><b>Ready for your little push?</b>Join FMC-21 Level 1 for ₹199.</div>' +
      '<a class="btn" href="' + b + 'app.html#/signup">Sign up</a></div></div>' +
      '<div class="wrap fgrid"><div><img src="' + b + c.LOGO + '" alt="C\'mon"><p>' + c.BRAND.motto + '</p></div>' +
      '<div><h4>Explore</h4>' + nav + '</div><div><h4>Programmes</h4>' + progs + '</div>' +
      '<div><h4>Contact</h4><a href="mailto:' + c.CONTACT.email + '">' + c.CONTACT.email + '</a>' +
      '<a href="https://wa.me/' + c.CONTACT.whatsapp + '">WhatsApp ' + c.CONTACT.phone + '</a>' + soc + '</div></div>' +
      '<div class="wrap fbot"><span>© C\'mon. All rights reserved.</span><a href="#">Back to top ↑</a></div></footer>';
  },
  reviews: function () {
    var list = window.FMC.REVIEWS || [];
    var cards = list.length ? list.map(function (r) {
      return '<div class="card rev"><blockquote>“' + r.text + '”</blockquote><b>' + r.name + '</b><span>' + (r.level || "") + '</span></div>';
    }).join("") : '<div class="card empty"><h3>Be the first to share your experience</h3><p>Took part in FMC-21? Tell us how it went.</p></div>';
    return '<section class="soft"><div class="wrap"><h2>Reviews &amp; feedback</h2><div class="grid g3">' + cards + '</div></div></section>';
  },
  toast: function (text) {
    var m = document.getElementById("msg");
    m.textContent = text; m.style.display = "block";
    setTimeout(function () { m.style.display = "none"; }, 4000);
  }
};
