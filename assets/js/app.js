/* C'mon account area: sign up, login, profile, enrolment, progress.
   PROTOTYPE: data lives in this browser's localStorage and the OTP is simulated.
   Replace the functions in the "data layer" with real API calls when a backend exists. */
(function () {
  var C = window.FMC, app = document.getElementById("app"), dlg = document.getElementById("dlg");
  var S = { step: "form", data: {}, otp: "" }, R = {}, tab = "ongoing";

  /* ---------- data layer ---------- */
  var DB = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var users = function () { return DB.get("fmc_users", {}); };
  var me = function () { var e = DB.get("fmc_session", null); return e ? users()[e] : null; };
  var enrols = function () { var u = me(); return u ? (DB.get("fmc_enrol", {})[u.email] || []) : []; };
  var saveEnrols = function (l) { var a = DB.get("fmc_enrol", {}); a[me().email] = l; DB.set("fmc_enrol", a); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function hash(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dayNo(e) { return Math.round((new Date(ymd(new Date()) + "T00:00:00") - new Date(e.start + "T00:00:00")) / 864e5) + 1; }
  function count(e) { return Object.keys(e.subs).length; }
  function state(e) { return count(e) >= 21 ? "done" : dayNo(e) > 21 ? "failed" : "ongoing"; }
  function level(id) { return C.LEVELS.filter(function (l) { return l.id === +id; })[0]; }
  function passed(id) { return enrols().some(function (e) { return e.level === id && state(e) === "done"; }); }
  function blocked(id) { return enrols().some(function (e) { return e.level === id && state(e) !== "failed"; }); }

  /* ---------- helpers ---------- */
  function field(label, name, type, extra) { return '<label>' + label + '<input name="' + name + '" type="' + (type || "text") + '" ' + (extra || "required") + '></label>'; }
  function go(h) { location.hash = h; }
  function open(html) { dlg.innerHTML = html; dlg.showModal(); }

  /* ---------- views ---------- */
  function vLogin() {
    app.innerHTML = '<div class="auth card"><h2>Login</h2><form class="f" id="fl">' + field("Email ID", "email", "email") + field("Password", "pw", "password") +
      '<div class="err" id="e"></div><button class="btn gold">Login</button></form><p class="mute" style="margin-top:14px">New here? <a href="#/signup"><b>Sign up</b></a></p></div>';
    document.getElementById("fl").onsubmit = function (ev) {
      ev.preventDefault(); var f = new FormData(ev.target), u = users()[f.get("email").trim().toLowerCase()];
      hash(f.get("pw")).then(function (h) {
        if (!u || u.hash !== h) { document.getElementById("e").textContent = "Email or password is incorrect."; return; }
        DB.set("fmc_session", u.email); go("#/profile");
      });
    };
  }
  function vSignup() {
    var h = '<div class="auth card"><h2>Sign up</h2>';
    if (S.step === "form") {
      h += '<form class="f" id="fs">' + field("Full name", "name") + field("Email ID", "email", "email") + field("Phone", "phone", "tel", 'required pattern="[0-9+ ]{10,15}"') + field("Country", "country") +
        '<label>Which best describes you?<select name="role" required><option value="">Select</option><option>Student</option><option>Working professional</option></select></label>' +
        '<div class="err" id="e"></div><button class="btn gold">Sign up</button></form>';
    } else if (S.step === "otp") {
      h += '<div class="demo">Demo mode: no SMS or email is sent yet. Your OTP is <b>' + S.otp + '</b>.</div><form class="f" id="fo">' + field("Enter the 6-digit OTP", "otp", "text", 'required pattern="[0-9]{6}" inputmode="numeric"') + '<div class="err" id="e"></div><button class="btn gold">Verify OTP</button></form>';
    } else {
      h += '<form class="f" id="fp">' + field("Set password (min 8 characters)", "p1", "password", "required minlength=8") + field("Re-enter password", "p2", "password", "required minlength=8") + '<div class="err" id="e"></div><button class="btn gold">Confirm</button></form>';
    }
    app.innerHTML = h + '<p class="mute" style="margin-top:14px">Already registered? <a href="#/login"><b>Login</b></a></p></div>';
    var err = function (t) { document.getElementById("e").textContent = t; };
    var fs = document.getElementById("fs"), fo = document.getElementById("fo"), fp = document.getElementById("fp");
    if (fs) fs.onsubmit = function (ev) {
      ev.preventDefault(); var d = Object.fromEntries(new FormData(fs)); d.email = d.email.trim().toLowerCase();
      if (users()[d.email]) return err("This email is already registered. Please login.");
      S.data = d; S.otp = String(Math.floor(100000 + Math.random() * 900000)); S.step = "otp"; vSignup();
    };
    if (fo) fo.onsubmit = function (ev) { ev.preventDefault(); if (fo.otp.value !== S.otp) return err("OTP does not match."); S.step = "pw"; vSignup(); };
    if (fp) fp.onsubmit = function (ev) {
      ev.preventDefault(); if (fp.p1.value !== fp.p2.value) return err("Passwords do not match.");
      hash(fp.p1.value).then(function (h) {
        var u = users(); S.data.hash = h; u[S.data.email] = S.data; DB.set("fmc_users", u); DB.set("fmc_session", S.data.email);
        S = { step: "form", data: {}, otp: "" }; go("#/profile");
      });
    };
  }
  function vProfile() {
    var u = me();
    app.innerHTML = '<div class="card hero" style="padding:34px;border:0"><div class="pres">Welcome, ' + esc(u.name) + '</div><h2 style="color:#fff">Your little push starts here.</h2><p>FMC-21 takes you from daily audio, to video, to a live talk. Choose a level below.</p></div>' +
      '<h2 style="margin-top:34px">Programmes</h2>' + Components.levelCards("profile");
  }
  function details(id) {
    var l = level(id);
    open('<h3>FMC-21 · Level ' + id + ' (' + l.format + ')</h3><h4>Programme intro</h4><p class="mute">' + l.motive + ' ' + l.intro + '</p><h4>Rules &amp; regulations</h4><ul>' +
      C.RULES.map(function (r) { return "<li>" + r.replace(/^I (understand |will )?/, "") + "</li>"; }).join("") + '</ul><h4>Programme fee</h4><p><b>₹' + l.fee + '</b> (non-refundable)</p>' +
      '<form method="dialog"><button class="btn blue sm">Close</button></form>');
  }
  function apply(id) {
    var l = level(id), u = me();
    if (id > 1 && !passed(id - 1)) return Components.toast("Complete Level " + (id - 1) + " first to unlock Level " + id + ".");
    if (blocked(id)) return Components.toast("You are already enrolled in Level " + id + ".");
    var today = ymd(new Date());
    open('<h3>Apply: FMC-21 Level ' + id + '</h3><form class="f" id="fa">' + field("Full name", "name", "text", 'required value="' + esc(u.name) + '"') +
      field("Date of birth", "dob", "date", 'required max="' + today + '"') + field("Current city (optional)", "city", "text", "") +
      '<div class="demo" style="margin:0"><b>I have read and understood the FMC-21 rules:</b><ul style="margin:6px 0 0">' + C.RULES.map(function (r) { return "<li>" + r + "</li>"; }).join("") + '</ul></div>' +
      '<label class="chk"><input type="checkbox" name="agree" required> I agree to all of the above.</label><div class="err" id="e"></div>' +
      '<button class="btn gold" id="pay" disabled>Pay ' + l.fee + ' INR to complete</button><button class="btn ghost" type="button" onclick="document.getElementById(\'dlg\').close()" style="color:var(--ink)">Cancel</button>' +
      '<p class="mute" style="font-size:.85rem">Demo mode: payment is simulated. Razorpay will be connected later.</p></form>');
    var f = document.getElementById("fa");
    function ok() {
      var d = new Date(f.dob.value), age = (Date.now() - d) / 31557600000, good = f.name.value.trim() && f.dob.value && age >= 13 && age <= 100 && f.agree.checked;
      document.getElementById("e").textContent = f.dob.value && !(age >= 13 && age <= 100) ? "Enter a valid date of birth (age 13 to 100)." : "";
      document.getElementById("pay").disabled = !good;
    }
    f.oninput = f.onchange = ok;
    f.onsubmit = function (ev) {
      ev.preventDefault(); var l2 = enrols().filter(function (e) { return !(e.level === id && state(e) === "failed"); });
      l2 = enrols(); l2.push({ level: id, name: f.name.value.trim(), dob: f.dob.value, city: f.city.value.trim(), start: today, paid: level(id).fee, subs: {} });
      saveEnrols(l2); dlg.close(); Components.toast("Payment successful (demo). You are enrolled!"); tab = "ongoing"; go("#/progress");
    };
  }
  function vProgress(which) {
    if (which) tab = which;
    var all = enrols(), list = all.map(function (e, i) { e.i = i; return e; }).filter(function (e) { return tab === "ongoing" ? state(e) === "ongoing" : state(e) !== "ongoing"; });
    var h = '<div class="card"><h2>All activities</h2><div class="tabs"><button class="' + (tab === "ongoing" ? "act" : "") + '" data-tab="ongoing">Ongoing</button><button class="' + (tab === "completed" ? "act" : "") + '" data-tab="completed">Completed</button></div></div>';
    if (!list.length) h += '<div class="card empty" style="margin-top:20px"><h3>' + (tab === "ongoing" ? "No ongoing programmes yet" : "Nothing completed yet") + '</h3><p>Explore FMC-21 and enrol to start your 21 days.</p><a class="btn gold" href="#/profile">Explore programmes</a></div>';
    list.forEach(function (e) { h += block(e); });
    app.innerHTML = h;
  }
  function block(e) {
    var n = count(e), pct = Math.round(n / 21 * 100), st = state(e), today = dayNo(e), l = level(e.level), sub = e.subs[today];
    var dots = [0, 1, 2].map(function (r) {
      var d = ""; for (var k = 1; k <= 7; k++) { var day = r * 7 + k, c = e.subs[day] ? "ok" : (day < today || st === "failed") ? "miss" : ""; d += '<span class="dot ' + c + '">' + day + '</span>'; }
      return '<div class="line"><small>Days ' + (r * 7 + 1) + '–' + (r * 7 + 7) + '</small>' + d + '</div>';
    }).join("");
    var h = '<h3 style="margin:30px 0 12px">FMC-21 · Level ' + e.level + ' (' + l.format + ')' + (st === "ongoing" ? " · Day " + today + " of 21" : "") + '</h3><div class="two2"><div class="card"><div class="pct">' + pct + '%</div><div class="bar"><i style="width:' + pct + '%"></i></div><p>' + n + ' of 21 submissions complete</p></div><div class="card"><b>Milestones</b>' + dots + '</div></div>';
    if (st === "done") h += '<div class="card win" style="margin-top:18px"><h3>🎉 Congratulations!</h3><p>You completed all 21 days. Your FMC-21 certificate will be sent to your email (' + esc(me().email) + ').</p></div>';
    else if (st === "failed") h += '<div class="card sorry" style="margin-top:18px"><h3>So close, and we\'re sorry</h3><p>The 21 days have ended with ' + n + ' of 21 submissions. FMC-21 certification needs a submission on every day, so no certificate is awarded this round. You can enrol again in the next round and restart from Day 1.</p></div>';
    else {
      h += '<div class="card rec" style="margin-top:18px" data-i="' + e.i + '"><h3>Today\'s submission (Day ' + today + ')</h3>';
      if (sub) h += '<p>✅ Submitted for today. You can submit again after 12:00 AM.</p>';
      else if (e.level === 3) h += '<p class="mute">Level 3 is a live 5-minute talk. We will share the topic, date and venue with you by email and WhatsApp.</p>';
      else {
        var v = e.level === 2;
        h += '<p class="mute">One ' + (v ? "video" : "audio") + ' per day, 0–2 minutes, from 12:00 AM to 11:59 PM. Say the Day Number and Topic Name first. Submissions cannot be deleted.</p><div class="row" style="margin:0"><button class="btn gold sm" data-r="start">● Record</button><button class="btn ghost sm hid" data-r="stop" style="color:var(--ink)">■ Stop</button><button class="btn ghost sm hid" data-r="retake" style="color:var(--ink)">Retake</button><button class="btn blue sm hid" data-r="submit">Submit</button></div><' + (v ? "video" : "audio") + ' class="hid" controls playsinline></' + (v ? "video" : "audio") + '><div class="err"></div>';
      }
      h += '</div>';
    }
    var days = Object.keys(e.subs).map(Number).sort(function (a, b) { return b - a; }), show = e.more ? days : days.slice(0, 3);
    if (days.length) h += '<div class="card" style="margin-top:18px"><h3>Submissions</h3>' + show.map(function (d) { return '<div class="sub"><b>Day ' + d + '</b><span class="mute">' + new Date(e.subs[d].ts).toLocaleString() + ' · ' + e.subs[d].sec + 's</span></div>'; }).join("") +
      (days.length > 3 && !e.more ? '<button class="btn ghost sm" data-more="' + e.i + '" style="color:var(--ink);margin-top:12px">See more</button>' : "") + '</div>';
    return h;
  }

  /* ---------- recorder ---------- */
  function recClick(btn) {
    var card = btn.closest(".rec"), i = +card.dataset.i, e = enrols()[i], vid = e.level === 2, m = card.querySelector(vid ? "video" : "audio"), a = btn.dataset.r;
    var show = function (on) { ["start", "stop", "retake", "submit"].forEach(function (x) { card.querySelector('[data-r="' + x + '"]').classList.toggle("hid", on.indexOf(x) < 0); }); };
    var err = card.querySelector(".err");
    if (a === "start" || a === "retake") {
      navigator.mediaDevices.getUserMedia(vid ? { audio: true, video: true } : { audio: true }).then(function (stream) {
        var ch = []; R.mr = new MediaRecorder(stream); R.t0 = Date.now(); R.ok = false; err.textContent = "";
        R.mr.ondataavailable = function (x) { ch.push(x.data); };
        R.mr.onstop = function () { stream.getTracks().forEach(function (t) { t.stop(); }); R.sec = Math.round((Date.now() - R.t0) / 1000); m.src = URL.createObjectURL(new Blob(ch)); m.classList.remove("hid"); R.ok = true; show(["retake", "submit"]); };
        R.mr.start(); clearTimeout(R.t); R.t = setTimeout(function () { if (R.mr.state === "recording") R.mr.stop(); }, 120000); m.classList.add("hid"); show(["stop"]);
      }).catch(function () { err.textContent = "Please allow microphone" + (vid ? " and camera" : "") + " access."; });
    } else if (a === "stop") { clearTimeout(R.t); R.mr.stop(); }
    else if (a === "submit" && R.ok && R.sec > 0) {
      var list = enrols(), day = dayNo(list[i]); if (list[i].subs[day]) return;
      list[i].subs[day] = { ts: Date.now(), sec: R.sec }; saveEnrols(list); R.ok = false; Components.toast("Day " + day + " submitted. Great work!"); route();
    }
  }

  /* ---------- router and events ---------- */
  function route() {
    var h = location.hash || "#/login", u = me(), pub = h === "#/login" || h === "#/signup";
    if (h === "#/logout") { DB.set("fmc_session", null); return go("#/login"); }
    if (!u && !pub) return go("#/login");
    if (u && pub) return go("#/profile");
    document.getElementById("site-header").innerHTML = u ? Components.appHeader(u) : Components.header();
    document.getElementById("site-footer").innerHTML = Components.footer();
    ({ "#/login": vLogin, "#/signup": vSignup, "#/profile": vProfile, "#/progress": function () { vProgress("ongoing"); }, "#/completed": function () { vProgress("completed"); } }[h] || vProfile)();
    window.scrollTo(0, 0);
  }
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, a"); if (!t) return;
    if (t.dataset.apply) apply(+t.dataset.apply);
    else if (t.dataset.details) details(+t.dataset.details);
    else if (t.dataset.tab) vProgress(t.dataset.tab);
    else if (t.dataset.r) recClick(t);
    else if (t.dataset.more) { var l = enrols(); l[+t.dataset.more].more = true; saveEnrols(l); vProgress(); }
  });
  window.addEventListener("hashchange", route);
  route();
})();
