/* Prop an Agent: a guided chat. No backend, no storage. It collects a few answers, then opens a WhatsApp or email draft.
   Set BOOKING_URL to a Cal.com / Calendly link to let visitors book a slot directly. */
(function () {
  var WA = "2347042929458", MAIL = "contact.superballack@gmail.com";
  var BOOKING_URL = "";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BUILD = ["Websites and web apps", "Mobile apps and SaaS", "MCPs, Skills and internal tools", "SI assistants and agents", "Knowledge and RAG systems", "Product design and strategy"];
  var STUDIOS = ["Motion Graphics", "UI/UX & Graphic Designs", "Scripting & Strategy", "Image & Video Production", "Sound & Voice", "Branding", "Sales & Affiliate Marketing", "Automated Systems & Agents"];
  var AREAS = ["AI and technology (models, prompting, agents)", "Web and app development", "Motion graphics, 3D and design", "Data analytics and data science", "UI/UX and product", "Digital marketing", "Content creation and social media", "Not sure yet"];
  var s = {}, started = false, onText = null;

  var launcher = document.createElement("button");
  launcher.type = "button"; launcher.className = "agent-btn";
  launcher.setAttribute("aria-haspopup", "dialog"); launcher.setAttribute("aria-expanded", "false"); launcher.setAttribute("aria-controls", "agent");
  launcher.setAttribute("aria-label", "Prop an Agent");
  launcher.innerHTML = '<svg class="i-chat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg><svg class="i-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var panel = document.createElement("div");
  panel.id = "agent"; panel.className = "agent"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Prop an Agent");
  panel.innerHTML = '<div class="agent-h"><div><b>Prop an Agent</b><span>Short chat · book an appointment</span></div><button type="button" class="agent-x" aria-label="Close chat">&times;</button></div>' +
    '<div class="agent-log" aria-live="polite"></div><div class="agent-chips"></div>' +
    '<form class="agent-in" hidden><input type="text" maxlength="400" autocomplete="off" aria-label="Your reply"><button type="submit" aria-label="Send reply">&rarr;</button></form>' +
    '<p class="agent-note">Nothing is stored. Your details leave this page only when you send a draft.</p>';
  document.body.appendChild(panel); document.body.appendChild(launcher);
  var log = panel.querySelector(".agent-log"), cbox = panel.querySelector(".agent-chips"), form = panel.querySelector(".agent-in"), input = form.querySelector("input");

  function track(n) { try { window.va && window.va("event", { name: n }); } catch (e) {} }
  function add(c, t) { var d = document.createElement("div"); d.className = "msg " + c; d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function bot(t, next) {
    if (reduce) { add("bot", t); if (next) next(); return; }
    var d = add("bot typing", ""); d.innerHTML = "<i></i><i></i><i></i>";
    setTimeout(function () { d.className = "msg bot"; d.textContent = t; log.scrollTop = log.scrollHeight; if (next) next(); }, Math.min(700, 300 + t.length * 6));
  }
  function chips(items) {
    cbox.innerHTML = ""; form.hidden = true; onText = null;
    items.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = it.t;
      b.addEventListener("click", function () { cbox.innerHTML = ""; add("me", it.t); if (it.href) { window.location.href = it.href; return; } if (it.go) it.go(it.t); });
      cbox.appendChild(b);
    });
    var f = cbox.querySelector("button"); if (f && panel.classList.contains("open")) f.focus();
    log.scrollTop = log.scrollHeight;
  }
  function ask(list, cb) { chips(list.map(function (t) { return { t: t, go: function () { cb(t); } }; })); }
  function asktext(ph, type, valid, cb, skip) {
    cbox.innerHTML = ""; form.hidden = false; input.type = type; input.placeholder = ph; input.value = "";
    if (skip) { var b = document.createElement("button"); b.type = "button"; b.textContent = skip; b.addEventListener("click", function () { form.hidden = true; cbox.innerHTML = ""; add("me", skip); cb(""); }); cbox.appendChild(b); }
    onText = function (v) {
      if (!v && !skip) return;
      if (valid && v && !valid(v)) { bot("That doesn’t look right. Please check it and try again."); return; }
      form.hidden = true; cbox.innerHTML = ""; add("me", v); cb(v);
    };
    if (panel.classList.contains("open")) input.focus();
    log.scrollTop = log.scrollHeight;
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); if (onText) onText(input.value.trim()); });
  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  var end = function (t) { return /[.!?]$/.test(t) ? t : t + "."; };

  function person(next) {
    bot("What’s your name?", function () {
      asktext("Your name", "text", null, function (n) {
        s.name = n;
        bot("And your email address?", function () { asktext("you@example.com", "email", isEmail, function (e) { s.email = e; next(); }); });
      });
    });
  }
  function compose() {
    var n = s.name, out = ["Hi " + (s.who || "Ignite") + ",", ""];
    if (s.kind === "waitlist") {
      var f = "I’m " + n + " and I’d like to join the waitlist.";
      f += /^not sure/i.test(s.area) ? " I’m not sure yet which area interests me most." : " I’m most interested in " + s.area + ".";
      var lv = { "Just starting out": "I’m just starting out.", "Some experience": "I have some experience.", "Working professional": "I’m a working professional." };
      if (lv[s.level]) f += " " + lv[s.level];
      out.push(f, "", "What I’d like to build or do: " + end(s.goal));
    } else if (s.kind === "appt") {
      out.push("I’m " + n + ". I’d like to book a call about " + s.topic + ". My preferred time is " + end(s.when));
    } else {
      var p = "I’m " + n + ".";
      p += /^not sure/i.test(s.need) ? " I’m not sure yet exactly what I need." : " I need " + s.need + ".";
      if (s.time === "Just exploring") p += " I’m just exploring for now."; else if (s.time) p += " My ideal timeframe is " + end(s.time.charAt(0).toLowerCase() + s.time.slice(1));
      out.push(p);
      if (s.about) out.push("", "A little about the project: " + end(s.about));
    }
    out.push("", "You can reach me at " + s.email + ".", "", "Thanks,", n);
    return out.join("\n");
  }
  function sendWA(m) { track("chat_whatsapp"); window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(m), "_blank"); after("WhatsApp"); }
  function sendMail(m, sub) { track("chat_email"); window.location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(sub) + "&body=" + encodeURIComponent(m); after("email"); }
  function after(k) { bot("Your " + k + " draft has opened. Review it and send it from there.", function () { chips([{ t: "Start over", go: menu }, { t: "Close chat", go: close }]); }); }
  function finish() {
    var m = compose(), k = s.kind;
    var sub = k === "waitlist" ? "Ignite Academy waitlist" : k === "appt" ? "Appointment request" : (s.who || "Ignite") + " inquiry";
    var wl = k === "waitlist" ? "Join on WhatsApp" : k === "appt" ? "Request on WhatsApp" : "Send on WhatsApp";
    var el = k === "waitlist" ? "Join by email" : k === "appt" ? "Request by email" : "Send by email";
    var items = [{ t: wl, go: function () { sendWA(m); } }, { t: el, go: function () { sendMail(m, sub); } }, { t: "Start over", go: menu }];
    if (k === "appt" && BOOKING_URL) items.unshift({ t: "Open the booking page", go: function () { track("chat_booking"); window.open(BOOKING_URL, "_blank"); bot("Once you’ve picked a slot, send us a quick note so we can match it to you.", function () { chips(items.slice(1)); }); } });
    bot("Thanks, " + s.name + ". I’ve written your message. Choose how to send it. You can edit it before it goes.", function () { chips(items); });
  }

  function project() {
    bot("Great. Which side of Ignite fits best?", function () {
      ask(["iBuild: products and systems", "iStudios: creative and media", "Not sure yet"], function (t) {
        s.kind = "project";
        if (/^iBuild/.test(t)) { s.who = "Ignite iBuild"; needs(BUILD); }
        else if (/^iStudios/.test(t)) { s.who = "Ignite Studios"; needs(STUDIOS); }
        else { s.who = "Ignite"; s.need = "Not sure yet"; time(); }
      });
    });
  }
  function needs(list) { bot("What do you need?", function () { ask(list.concat("Not sure yet"), function (n) { s.need = n; time(); }); }); }
  function time() { bot("What’s your ideal timeframe?", function () { ask(["As soon as possible", "Within a month", "In 1 to 3 months", "Just exploring"], function (t) { s.time = t; about(); }); }); }
  function about() { bot("Tell me a little about the project, in a sentence or two.", function () { asktext("Type here", "text", null, function (v) { s.about = v; person(finish); }, "Skip"); }); }
  function academy() {
    s = { kind: "waitlist", who: "Ignite Academy" };
    bot("Lovely. No dates or fees are announced yet, but I can add you to the waitlist. Which area interests you most?", function () {
      ask(AREAS, function (a) { s.area = a;
        bot("And your experience level?", function () {
          ask(["Just starting out", "Some experience", "Working professional"], function (l) { s.level = l;
            bot("What would you like to build or be able to do?", function () { asktext("Type here", "text", null, function (g) { s.goal = g; person(finish); }); });
          });
        });
      });
    });
  }
  function appt() {
    s = { kind: "appt", who: "Ignite" };
    bot("Happy to set that up. What would you like to talk about?", function () {
      ask(["A project with iBuild", "Creative work with iStudios", "The Academy", "Something else"], function (t) {
        s.topic = { "A project with iBuild": "a project with iBuild", "Creative work with iStudios": "creative work with Ignite Studios", "The Academy": "Ignite Academy", "Something else": "something else" }[t];
        bot("Which time suits you best?", function () {
          ask(["Today", "Tomorrow", "This week", "Next week", "Another time"], function (w) {
            if (w === "Another time") bot("Tell me the day and time that works, and your time zone.", function () { asktext("For example: Friday, 3pm WAT", "text", null, function (v) { s.when = v; person(finish); }); });
            else { s.when = w.toLowerCase(); person(finish); }
          });
        });
      });
    });
  }
  function services() {
    var back = { t: "Back to menu", go: menu };
    bot("Which would you like to know about?", function () {
      ask(["iBuild", "iStudios", "Ignite Academy", "The six services"], function (t) {
        var txt, link;
        if (t === "iBuild") { txt = "iBuild is the build engine of Ignite. It builds websites, web and mobile apps, SaaS, MCPs, skills, internal tools and AI assistants."; link = { t: "Open iBuild", href: "/build/" }; }
        else if (t === "iStudios") { txt = "Ignite Studios is the creative engine of Ignite: motion graphics, branding, design, video and sound, for businesses, creators and public-sector teams across Nigeria."; link = { t: "Open iStudios", href: "/studios/" }; }
        else if (t === "Ignite Academy") { txt = "Ignite Academy trains SI-native experts in AI, agents, vibe coding, security, cloud, design, data and marketing. No dates or fees are announced yet, but you can join the waitlist."; link = { t: "Open the Academy", href: "/academy/" }; }
        else { txt = "Ignite provides SI Products, Data, Experts, Evaluation, Benchmark and Intelligence, each delivered as a service."; link = { t: "See the services", href: "/#services" }; }
        bot(txt, function () { chips([link, { t: "Start a project", go: project }, back]); });
      });
    });
  }
  function menu() {
    s = {};
    bot("Hi, I’m Ignite’s guide. What would you like to do?", function () {
      ask(["Start a project", "Ask about our services", "Join the Academy waitlist", "Book an appointment"], function (t) {
        if (/project/.test(t)) project(); else if (/services/.test(t)) services(); else if (/Academy/.test(t)) academy(); else appt();
      });
    });
  }

  function open() {
    panel.classList.add("open"); document.body.classList.add("agent-open"); launcher.setAttribute("aria-expanded", "true"); launcher.classList.add("is-open"); track("chat_open");
    if (!started) { started = true; menu(); } else { var f = !form.hidden ? input : cbox.querySelector("button"); if (f) f.focus(); }
  }
  function close() { panel.classList.remove("open"); document.body.classList.remove("agent-open"); launcher.setAttribute("aria-expanded", "false"); launcher.classList.remove("is-open"); launcher.focus(); }
  launcher.addEventListener("click", function () { panel.classList.contains("open") ? close() : open(); });
  panel.querySelector(".agent-x").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) close(); });
})();
