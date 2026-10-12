/* C'mon Admin Dashboard. PROTOTYPE: sample data + this browser's localStorage only.
   Demo logins are NOT secure. Replace the "data layer" with real API calls and server-side auth/permissions before launch. */
(function () {
  var C = window.FMC, root = document.getElementById("adm"), dlg = document.getElementById("dlg");
  var DB = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var DAY = 864e5, P = {}, PER = 8;

  /* ---------- roles ---------- */
  var ADMINS = [
    { email: "super@cmon.demo", name: "Asha (Super Admin)", role: "super" },
    { email: "prog@cmon.demo", name: "Ravi (Programme Admin)", role: "prog" },
    { email: "eval@cmon.demo", name: "Meera (Evaluator)", role: "eval" }
  ];
  var RN = { super: "Super Admin", prog: "Programme Admin", eval: "Evaluator" };
  var NAV = [["overview", "Overview", "super prog"], ["participants", "Participants", "super prog eval"], ["submissions", "Submissions", "super prog"],
    ["programmes", "Programmes", "super prog"], ["certificates", "Certificates", "super prog"], ["messages", "Messages", "super prog"],
    ["reports", "Reports", "super prog"], ["admins", "Admin users & audit", "super"]];
  var ACT = { disqualify: "super prog", cert: "super prog", reply: "super prog", export: "super prog", play: "super prog", config: "super", roles: "super" };
  var admin = function () { return DB.get("fmc_admin", null); };
  var can = function (a) { var u = admin(); return u && ACT[a].indexOf(u.role) > -1; };
  function audit(action, detail) { var l = DB.get("fmc_audit", []); l.unshift({ ts: Date.now(), who: admin().name, action: action, detail: detail }); DB.set("fmc_audit", l.slice(0, 200)); }

  /* ---------- sample data (clearly labelled as demo) ---------- */
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dayNo(start) { return Math.round((new Date(ymd(new Date()) + "T00:00:00") - new Date(start + "T00:00:00")) / DAY) + 1; }
  var NAMES = ["Aarav Sharma", "Diya Patel", "Rohan Gupta", "Ananya Singh", "Kabir Mehta", "Isha Verma", "Vihaan Nair", "Saanvi Rao", "Arjun Reddy", "Meera Iyer", "Aditya Joshi", "Kavya Menon", "Reyansh Das", "Tara Kapoor", "Yash Malhotra", "Riya Chopra", "Dev Bansal", "Naina Bose", "Karan Saxena", "Pooja Tiwari", "Harsh Yadav", "Sneha Mishra"];
  function sample() {
    var r = rng(21), out = [];
    NAMES.forEach(function (n, i) {
      var ago = Math.floor(r() * 30) + 1, start = ymd(new Date(Date.now() - ago * DAY)), t = ago + 1, miss = r() < .3 && t > 2 ? 1 + Math.floor(r() * (Math.min(t, 21) - 1)) : 0, subs = [];
      for (var d = 1; d <= Math.min(t, 21); d++) if (d !== miss && !(d === t && r() < .4)) subs.push(d);
      out.push({ id: "p" + (i + 1), name: n, email: n.split(" ")[0].toLowerCase() + "@example.com", phone: "98" + String(10000000 + Math.floor(r() * 89999999)), country: "India", role: r() < .5 ? "Student" : "Working professional", level: 1, start: start, subs: subs, paid: 199, sample: true });
    });
    var u = DB.get("fmc_users", {}), en = DB.get("fmc_enrol", {});
    Object.keys(en).forEach(function (em) { en[em].forEach(function (e, j) { var x = u[em] || {}; out.push({ id: "live-" + em + j, name: e.name, email: em, phone: x.phone || "", country: x.country || "", role: x.role || "", level: e.level, start: e.start, subs: Object.keys(e.subs).map(Number), paid: e.paid, sample: false }); }); });
    return out;
  }
  function info(p) {
    var f = DB.get("fmc_flags", {}), t = dayNo(p.start), n = p.subs.length, miss = 0;
    for (var d = 1; d < Math.min(t, 22); d++) if (p.subs.indexOf(d) < 0) miss++;
    var s = f[p.id] ? "Disqualified" : n >= 21 ? "Completed" : t > 21 ? "Not certified" : miss ? "At risk" : "On track";
    return { today: t, n: n, miss: miss, status: s };
  }
  var tone = { "Completed": "g", "On track": "b", "At risk": "y", "Not certified": "r", "Disqualified": "r", "Uploaded": "g", "Processing": "y", "Failed": "r", "Issued": "g", "Sent": "g", "Pending": "y", "Not eligible": "", "Open": "g", "Coming Soon": "y", "Resolved": "g" };
  var pill = function (s) { return '<span class="pill ' + (tone[s] || "") + '">' + s + '</span>'; };
  function subsOf(ps) {
    var out = []; ps.forEach(function (p) { p.subs.forEach(function (d) {
      var ts = new Date(p.start + "T00:00:00").getTime() + (d - 1) * DAY + (8 + (d * 7 + p.name.length) % 13) * 36e5, h = (d * 31 + p.name.length * 17) % 23;
      out.push({ p: p, day: d, ts: ts, sec: 35 + h * 5, status: h === 0 ? "Failed" : ymd(new Date(ts)) === ymd(new Date()) && h < 8 ? "Processing" : "Uploaded" });
    }); });
    return out.sort(function (a, b) { return b.ts - a.ts; });
  }
  var certs = function () { return DB.get("fmc_cert", {}); };
  function certOf(p, i) { var c = certs()[p.id]; if (c) return c; if (i.status !== "Completed") return { gen: "Not eligible", mail: "-" }; return p.sample && p.id.length % 2 ? { gen: "Issued", mail: p.name.length % 7 === 0 ? "Failed" : "Sent" } : { gen: "Pending", mail: "-" }; }
  var MSGS = [["Neha K.", "neha@example.com", "Can I switch from Level 1 later if I miss a day?", "Open"], ["Sameer R.", "sameer@example.com", "Payment deducted but I did not get confirmation.", "Open"], ["Priya L.", "priya@example.com", "When will Level 2 open?", "Resolved"], ["Imran A.", "imran@example.com", "Do you offer a group discount for a college?", "Open"], ["Julia T.", "julia@example.com", "Is the certificate shareable on LinkedIn?", "Resolved"], ["Vikram S.", "vikram@example.com", "My recording failed to upload on Day 6.", "Open"]];

  /* ---------- ui helpers ---------- */
  var toast = function (t) { var m = document.getElementById("msg"); m.textContent = t; m.style.display = "block"; setTimeout(function () { m.style.display = "none"; }, 3500); };
  function confirmBox(title, text, yes, danger, extra) {
    dlg.innerHTML = '<h3>' + title + '</h3><p class="mute">' + text + '</p>' + (extra || "") + '<div class="row"><button class="btn ' + (danger ? "blue" : "gold") + ' sm" id="cy">Confirm</button><button class="btn ghost sm" id="cn" style="color:var(--ink)">Cancel</button></div>';
    dlg.showModal(); document.getElementById("cn").onclick = function () { dlg.close(); };
    document.getElementById("cy").onclick = function () { var x = document.getElementById("cx"); dlg.close(); yes(x ? x.value : ""); };
  }
  function table(id, cols, rows, onclick) {
    var pg = P[id] || 0, pages = Math.max(1, Math.ceil(rows.length / PER)); if (pg >= pages) pg = P[id] = 0;
    if (!rows.length) return '<div class="card empty"><h3>Nothing to show</h3><p>No records match your filters.</p></div>';
    return '<div class="card tw"><table class="t"><tr>' + cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") + '</tr>' +
      rows.slice(pg * PER, pg * PER + PER).map(function (r) { return '<tr' + (r.go ? ' class="clk" data-go="' + r.go + '"' : "") + '>' + r.c.map(function (c) { return "<td>" + c + "</td>"; }).join("") + '</tr>'; }).join("") +
      '</table></div><div class="pg"><span>Page ' + (pg + 1) + ' of ' + pages + ' · ' + rows.length + ' records</span><button class="btn ghost sm" style="color:var(--ink)" data-pg="' + id + ':-1">Prev</button><button class="btn ghost sm" style="color:var(--ink)" data-pg="' + id + ':1">Next</button></div>';
  }
  var go = function (h) { location.hash = h; };
  var fmt = function (ts) { return new Date(ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); };

  /* ---------- screens ---------- */
  var S = {
    overview: function (ps) {
      var inf = ps.map(info), act = inf.filter(function (i) { return i.status === "On track" || i.status === "At risk"; }).length, subs = subsOf(ps), td = ymd(new Date());
      var today = subs.filter(function (s) { return ymd(new Date(s.ts)) === td; }).length, rev = ps.reduce(function (a, p) { return a + p.paid; }, 0), risk = inf.filter(function (i) { return i.status === "At risk"; }).length;
      var bars = []; for (var k = 13; k >= 0; k--) { var d = ymd(new Date(Date.now() - k * DAY)); bars.push(subs.filter(function (s) { return ymd(new Date(s.ts)) === d; }).length); }
      var mx = Math.max.apply(null, bars.concat(1));
      var kp = [["Participants", ps.length], ["Active", act], ["Completed", inf.filter(function (i) { return i.status === "Completed"; }).length], ["At risk", risk], ["Submissions today", today], ["Revenue (₹)", rev.toLocaleString("en-IN")], ["Failed uploads", subs.filter(function (s) { return s.status === "Failed"; }).length]];
      return '<div class="kpis">' + kp.map(function (x) { return '<div class="card kpi"><b>' + x[1] + '</b><span>' + x[0] + '</span></div>'; }).join("") + '</div><div class="cols"><div class="card"><h3>Daily submissions (14 days)</h3><div class="chart">' +
        bars.map(function (b) { return '<i title="' + b + '" style="height:' + Math.round(b / mx * 100) + '%"></i>'; }).join("") + '</div></div><div class="card"><h3>Recent activity</h3>' +
        subs.slice(0, 5).map(function (s) { return '<div class="sub"><span>' + esc(s.p.name) + ' · Day ' + s.day + '</span><span class="mute">' + fmt(s.ts) + '</span></div>'; }).join("") + '</div></div>';
    },
    participants: function (ps) {
      var u = admin(), q = (P.q || "").toLowerCase(), f = P.f || "";
      var base = u.role === "eval" ? ps.filter(function (p) { return p.level === 3; }) : ps;
      var rows = base.map(function (p) { return { p: p, i: info(p) }; }).filter(function (x) { return (!q || (x.p.name + x.p.email).toLowerCase().indexOf(q) > -1) && (!f || x.i.status === f); })
        .map(function (x) { return { go: "#/participant/" + x.p.id, c: [esc(x.p.name) + (x.p.sample ? "" : ' <span class="pill b">live</span>'), esc(x.p.email), "Level " + x.p.level, x.i.n + "/21", pill(x.i.status)] }; });
      return (u.role === "eval" ? '<div class="banner">Evaluator access: you only see participants assigned to you (Level 3 live assessments). None are assigned yet because Level 3 is Coming Soon.</div>' : '') +
        '<div class="tool"><input id="q" placeholder="Search name or email" value="' + esc(P.q || "") + '"><select id="f"><option value="">All statuses</option>' + ["On track", "At risk", "Completed", "Not certified", "Disqualified"].map(function (s) { return '<option' + (f === s ? " selected" : "") + '>' + s + '</option>'; }).join("") + '</select></div>' +
        table("part", ["Name", "Email", "Level", "Progress", "Status"], rows);
    },
    participant: function (ps, id) {
      var p = ps.filter(function (x) { return x.id === id; })[0]; if (!p) return '<div class="card empty"><h3>Participant not found</h3><a class="btn blue" href="#/participants">Back</a></div>';
      var i = info(p), c = certOf(p, i), dots = ""; for (var d = 1; d <= 21; d++) dots += '<span class="dot ' + (p.subs.indexOf(d) > -1 ? "ok" : d < i.today ? "miss" : "") + '" style="display:inline-grid;margin:3px">' + d + '</span>';
      var rows = subsOf([p]).map(function (s) { return { c: ["Day " + s.day, fmt(s.ts), s.sec + "s", pill(s.status)] }; });
      return '<a href="#/participants">← Participants</a><h2 style="margin:10px 0">' + esc(p.name) + ' ' + pill(i.status) + '</h2><div class="cols"><div class="card"><h3>Profile</h3><p>' + esc(p.email) + '<br>' + esc(p.phone) + ' · ' + esc(p.country) + '<br>' + esc(p.role) + '</p>' + (p.sample ? '<p class="mute">Sample data</p>' : "") + '</div>' +
        '<div class="card"><h3>Enrolment</h3><p>FMC-21 Level ' + p.level + ' (Audio)<br>Fee paid: ₹' + p.paid + '<br>Started ' + p.start + ' · Day ' + Math.min(i.today, 21) + ' of 21<br>Missed days: ' + i.miss + '</p></div></div>' +
        '<div class="card" style="margin-top:16px"><h3>21-day timeline</h3>' + dots + '</div><div class="card" style="margin-top:16px"><h3>Certificate</h3><p>' + pill(c.gen) + ' Email: ' + pill(c.mail === "-" ? "Not eligible" : c.mail) + '</p>' +
        (can("cert") && i.status === "Completed" && c.gen !== "Issued" ? '<button class="btn gold sm" data-cert="' + p.id + '">Generate &amp; email certificate</button>' : "") + '</div>' +
        '<h3 style="margin:20px 0 10px">Submission history</h3>' + table("hist", ["Day", "Submitted", "Length", "Upload"], rows) +
        (can("disqualify") && i.status !== "Disqualified" ? '<div style="margin-top:18px"><button class="btn blue sm" data-dq="' + p.id + '">Disqualify participant…</button></div>' : (can("disqualify") ? "" : '<p class="mute">Your role cannot change enrolment status.</p>'));
    },
    submissions: function (ps) {
      var f = P.sf || "", rows = subsOf(ps).filter(function (s) { return !f || s.status === f; }).map(function (s, k) { return { c: [esc(s.p.name), "Day " + s.day, fmt(s.ts), s.sec + "s", pill(s.status), '<button class="btn ghost sm" style="color:var(--ink)" data-ins="' + s.p.id + ":" + s.day + '">Inspect</button>'] }; });
      return '<div class="tool"><select id="sf"><option value="">All uploads</option>' + ["Uploaded", "Processing", "Failed"].map(function (s) { return '<option' + (f === s ? " selected" : "") + '>' + s + '</option>'; }).join("") + '</select></div>' + table("subs", ["Participant", "Day", "Submitted", "Length", "Upload", ""], rows);
    },
    programmes: function () {
      var cfg = DB.get("fmc_prog", {}), ro = can("config") ? "" : "disabled";
      return (ro ? '<div class="banner">Only a Super Admin can change programme settings. You can view them here.</div>' : "") + C.LEVELS.map(function (l) {
        var s = cfg[l.id] || { open: l.id === 1, fee: l.fee, start: "" };
        return '<div class="card" style="margin-bottom:16px"><h3>FMC-21 Level ' + l.id + ' (' + l.format + ') ' + pill(s.open ? "Open" : "Coming Soon") + '</h3><div class="f" data-lv="' + l.id + '"><div class="cols"><label>Fee (₹)<input type="number" min="0" name="fee" value="' + s.fee + '" ' + ro + '></label>' +
          '<label>Next challenge start date<input type="date" name="start" value="' + (s.start || "") + '" ' + ro + '></label></div><label class="chk"><input type="checkbox" name="open" ' + (s.open ? "checked" : "") + ' ' + ro + '> Open for registration (otherwise shown as Coming Soon)</label>' +
          (ro ? "" : '<button class="btn gold sm" data-save="' + l.id + '">Save changes…</button>') + '</div></div>';
      }).join("") + '<div class="card"><h3>Rules (shown to participants)</h3><ul class="mute">' + C.RULES.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul></div>';
    },
    certificates: function (ps) {
      var rows = ps.map(function (p) { return { p: p, i: info(p) }; }).filter(function (x) { return x.i.status === "Completed" || x.i.status === "Not certified" || x.i.status === "Disqualified"; }).map(function (x) {
        var c = certOf(x.p, x.i), why = x.i.status === "Completed" ? "21 of 21 days" : x.i.n + " of 21 days (no-miss rule)";
        return { c: [esc(x.p.name), why, pill(c.gen), pill(c.mail === "-" ? "Not eligible" : c.mail), can("cert") && x.i.status === "Completed" ? (c.gen !== "Issued" ? '<button class="btn gold sm" data-cert="' + x.p.id + '">Generate</button>' : c.mail === "Failed" ? '<button class="btn ghost sm" style="color:var(--ink)" data-cert="' + x.p.id + '">Resend email</button>' : "") : ""] };
      });
      return table("cert", ["Participant", "Eligibility", "Certificate", "Email", ""], rows);
    },
    messages: function () {
      var st = DB.get("fmc_msgs", {});
      return table("msg", ["From", "Message", "Status", ""], MSGS.map(function (m, k) { var s = st[k] || m[3]; return { c: [esc(m[0]) + '<br><span class="mute">' + m[1] + '</span>', esc(m[2]), pill(s), can("reply") && s === "Open" ? '<button class="btn ghost sm" style="color:var(--ink)" data-reply="' + k + '">Reply &amp; resolve</button>' : ""] }; }));
    },
    reports: function () {
      return '<div class="grid g3">' + [["participants", "Participants", "Names, contact, level, progress, status"], ["submissions", "Submissions", "Day, timestamp, length, upload status"], ["payments", "Payments", "Participant, level, fee paid"], ["certificates", "Certificates", "Eligibility, generation, email status"]].map(function (r) {
        return '<div class="card"><h3>' + r[1] + '</h3><p class="mute">' + r[2] + '</p>' + (can("export") ? '<button class="btn gold sm" data-exp="' + r[0] + '">Export CSV</button>' : '<p class="mute">Not permitted for your role.</p>') + '</div>'; }).join("") + '</div>';
    },
    admins: function () {
      var au = DB.get("fmc_audit", []), roles = DB.get("fmc_roles", {});
      return '<h3>Admin users &amp; role permissions</h3>' + table("adm", ["Name", "Email", "Role", "Access"], ADMINS.map(function (a) {
        var r = roles[a.email] || a.role; return { c: [esc(a.name), a.email, '<select data-role="' + a.email + '">' + Object.keys(RN).map(function (k) { return '<option value="' + k + '"' + (k === r ? " selected" : "") + '>' + RN[k] + '</option>'; }).join("") + '</select>', r === "super" ? "Everything" : r === "prog" ? "Participants, submissions, certificates, messages, reports" : "Assigned participants only"] }; })) +
        '<h3 style="margin:24px 0 10px">Audit log</h3>' + table("aud", ["When", "Admin", "Action", "Detail"], au.map(function (a) { return { c: [fmt(a.ts), esc(a.who), esc(a.action), esc(a.detail)] }; }));
    }
  };
  var TITLES = { overview: "Overview", participants: "Participants", participant: "Participant", submissions: "Submissions", programmes: "Programme management", certificates: "Certificates", messages: "Contact messages & support", reports: "Reports & exports", admins: "Admin users & audit log" };

  /* ---------- shell, routing ---------- */
  function login() {
    root.innerHTML = '<div class="wrap" style="max-width:460px;padding-top:60px"><div class="card"><img src="' + C.LOGO + '" alt="C\'mon" style="height:50px;background:#07122e;border-radius:10px;padding:6px"><h2 style="margin-top:14px">Admin login</h2><div class="demo">Demo only: not secure. Use any account below with password <b>demo1234</b>.<br>' +
      ADMINS.map(function (a) { return '<a href="#" data-fill="' + a.email + '">' + a.email + '</a>'; }).join(" · ") + '</div><form class="f" id="fl"><label>Email<input name="email" type="email" required></label><label>Password<input name="pw" type="password" required></label><div class="err" id="e"></div><button class="btn gold">Login</button></form></div></div>';
    document.getElementById("fl").onsubmit = function (ev) {
      ev.preventDefault(); var f = ev.target, a = ADMINS.filter(function (x) { return x.email === f.email.value.trim().toLowerCase(); })[0];
      if (!a || f.pw.value !== "demo1234") { document.getElementById("e").textContent = "Email or password is incorrect."; return; }
      a = { email: a.email, name: a.name, role: (DB.get("fmc_roles", {})[a.email]) || a.role }; DB.set("fmc_admin", a); audit("Login", RN[a.role]); go("#/overview");
    };
  }
  function route() {
    var u = admin(), h = (location.hash || "#/overview").split("/"), page = h[1] || "overview", arg = h[2];
    if (!u) return login();
    if (page === "logout") { audit("Logout", ""); DB.set("fmc_admin", null); return go("#/overview"); }
    var nav = NAV.filter(function (n) { return n[2].indexOf(u.role) > -1; }), cur = page === "participant" ? "participants" : page;
    if (!nav.some(function (n) { return n[0] === cur; })) return go("#/" + nav[0][0]);
    root.innerHTML = '<div class="shell"><aside class="side"><img src="' + C.LOGO + '" alt="C\'mon">' + nav.map(function (n) { return '<a class="' + (n[0] === cur ? "cur" : "") + '" href="#/' + n[0] + '">' + n[1] + '</a>'; }).join("") +
      '</aside><div><div class="top"><b>' + TITLES[page] + '</b><span>' + esc(u.name) + ' · ' + pill(RN[u.role]) + ' <a href="#/logout">Log out</a></span></div><div class="cont" id="cont"><div class="skel"></div><div class="skel"></div></div></div></div>';
    setTimeout(function () {
      var c = document.getElementById("cont"); if (!c) return;
      try { c.innerHTML = '<h1>' + TITLES[page] + '</h1>' + S[page](sampleData(), arg); }
      catch (e) { c.innerHTML = '<div class="card sorry"><h3>Something went wrong</h3><p>We could not load this page.</p><button class="btn blue sm" onclick="location.reload()">Retry</button></div>'; }
    }, 250);
  }
  var cache; function sampleData() { return sample(); }
  function csv(rows) { return rows.map(function (r) { return r.map(function (x) { return '"' + String(x).replace(/"/g, '""') + '"'; }).join(","); }).join("\n"); }

  /* ---------- events ---------- */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-go],[data-pg],[data-dq],[data-cert],[data-ins],[data-save],[data-reply],[data-exp],[data-fill]"); if (!t) return;
    var d = t.dataset, ps = sampleData();
    if (d.fill) { ev.preventDefault(); var f = document.getElementById("fl"); f.email.value = d.fill; f.pw.value = "demo1234"; }
    else if (d.go) go(d.go);
    else if (d.pg) { var a = d.pg.split(":"); P[a[0]] = (P[a[0]] || 0) + +a[1]; if (P[a[0]] < 0) P[a[0]] = 0; route(); }
    else if (d.dq) confirmBox("Disqualify participant?", "This ends their certification eligibility. The fee stays non-refundable. This is recorded in the audit log.", function (why) {
      var fl = DB.get("fmc_flags", {}); fl[d.dq] = true; DB.set("fmc_flags", fl); audit("Disqualified participant", d.dq + (why ? ": " + why : "")); toast("Participant disqualified."); route();
    }, true, '<label class="f">Reason (required for audit)<input id="cx"></label>');
    else if (d.cert) confirmBox("Generate and email certificate?", "The certificate will be generated and emailed to the participant.", function () {
      var c = certs(); c[d.cert] = { gen: "Issued", mail: "Sent" }; DB.set("fmc_cert", c); audit("Issued certificate", d.cert); toast("Certificate issued and email sent (demo)."); route();
    });
    else if (d.ins) {
      var k = d.ins.split(":"), s = subsOf(ps).filter(function (x) { return x.p.id === k[0] && x.day === +k[1]; })[0];
      dlg.innerHTML = '<h3>' + esc(s.p.name) + ' · Day ' + s.day + '</h3><p>Submitted ' + fmt(s.ts) + ' · ' + s.sec + 's · ' + pill(s.status) + '</p>' + (can("play") ? '<div class="demo">Recordings are private. When storage is connected, this player will use a short-lived signed link, and every play is logged.</div><audio controls disabled style="width:100%"></audio>' : '<p class="mute">Your role cannot play recordings.</p>') + '<div class="row"><button class="btn blue sm" id="cl">Close</button></div>';
      dlg.showModal(); document.getElementById("cl").onclick = function () { dlg.close(); if (can("play")) audit("Opened submission", s.p.name + " day " + s.day); };
    }
    else if (d.save) {
      var box = t.closest("[data-lv]"), cfg = DB.get("fmc_prog", {}), old = cfg[d.save] || { open: +d.save === 1, fee: level(+d.save).fee, start: "" }, nw = { fee: +box.querySelector('[name=fee]').value, start: box.querySelector('[name=start]').value, open: box.querySelector('[name=open]').checked };
      confirmBox("Save Level " + d.save + " changes?", (nw.open !== old.open ? "Registration will be " + (nw.open ? "OPEN" : "shown as Coming Soon") + ". " : "") + "Fee ₹" + old.fee + " → ₹" + nw.fee + ". This is recorded in the audit log.", function () {
        cfg[d.save] = nw; DB.set("fmc_prog", cfg); audit("Updated Level " + d.save, "open " + old.open + "→" + nw.open + ", fee " + old.fee + "→" + nw.fee); toast("Programme settings saved."); route();
      });
    }
    else if (d.reply) confirmBox("Reply and resolve?", "Mark this message as resolved. A reply email will be sent once email is connected.", function (x) { var s = DB.get("fmc_msgs", {}); s[d.reply] = "Resolved"; DB.set("fmc_msgs", s); audit("Resolved message", MSGS[d.reply][0]); toast("Message resolved."); route(); }, false, '<label class="f">Reply<textarea id="cx" rows="3"></textarea></label>');
    else if (d.exp) {
      var rows = { participants: [["Name", "Email", "Level", "Progress", "Status"]], submissions: [["Name", "Day", "Submitted", "Seconds", "Upload"]], payments: [["Name", "Level", "Fee"]], certificates: [["Name", "Certificate", "Email"]] }[d.exp];
      if (d.exp === "submissions") subsOf(ps).forEach(function (s) { rows.push([s.p.name, s.day, new Date(s.ts).toISOString(), s.sec, s.status]); });
      else ps.forEach(function (p) { var i = info(p), c = certOf(p, i); rows.push(d.exp === "participants" ? [p.name, p.email, p.level, i.n + "/21", i.status] : d.exp === "payments" ? [p.name, p.level, p.paid] : [p.name, c.gen, c.mail]); });
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv(rows)], { type: "text/csv" })); a.download = "fmc21-" + d.exp + ".csv"; a.click(); audit("Exported " + d.exp, rows.length - 1 + " rows"); toast("Export ready: " + d.exp + ".csv");
    }
  });
  function level(id) { return C.LEVELS.filter(function (l) { return l.id === id; })[0]; }
  document.addEventListener("input", function (ev) { if (ev.target.id === "q") { P.q = ev.target.value; P.part = 0; var s = ev.target.selectionStart; route(); setTimeout(function () { var q = document.getElementById("q"); if (q) { q.focus(); q.setSelectionRange(s, s); } }, 300); } });
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.id === "f") { P.f = t.value; P.part = 0; route(); } else if (t.id === "sf") { P.sf = t.value; P.subs = 0; route(); }
    else if (t.dataset.role) { var em = t.dataset.role, v = t.value; confirmBox("Change role?", em + " will become " + RN[v] + ". This is recorded in the audit log.", function () { var r = DB.get("fmc_roles", {}); r[em] = v; DB.set("fmc_roles", r); audit("Changed role", em + " → " + RN[v]); toast("Role updated."); route(); }); dlg.addEventListener("close", function () { route(); }, { once: true }); }
  });
  window.addEventListener("hashchange", route);
  route();
})();
