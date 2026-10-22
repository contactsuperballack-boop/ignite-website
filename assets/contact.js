/* Ignite forms: no backend. Each form opens a WhatsApp or email draft for the visitor to review and send. */
(function () {
  var WA = "2347042929458", MAIL = "contact.superballack@gmail.com";
  function track(n) { try { window.va && window.va("event", { name: n }); } catch (e) {} }
  document.querySelectorAll("form[data-who]").forEach(function (f) {
    var who = f.dataset.who, ev = f.dataset.ev || "inquiry", msg = f.nextElementSibling;
    function g(n) { var e = f.elements[n]; return e && e.value ? e.value.trim() : ""; }
    function end(t) { return /[.!?]$/.test(t) ? t : t + "."; }
    function text() {
      var name = g("name"), email = g("email"), org = g("org"), tm = g("time"), kind;
      kind = f.dataset.ev === "waitlist" ? "waitlist" : (/iBuild|Studios/.test(who) ? "project" : "inquiry");
      var out = ["Hi " + who + ","], first, contact;
      if (kind === "waitlist") {
        var area = g("area"), level = g("level"), phone = g("phone");
        first = "I’m " + name + " and I’d like to join the waitlist.";
        first += /^not sure/i.test(area) ? " I’m not sure yet which area interests me most." : " I’m most interested in " + area + ".";
        var lv = { "Just starting out": "I’m just starting out.", "Some experience": "I have some experience.", "Working professional": "I’m a working professional." };
        if (lv[level]) first += " " + lv[level];
        out.push("", first, "", "What I’d like to build or do: " + end(g("goal")));
        contact = "You can reach me at " + email + (phone ? " or on WhatsApp at " + phone : "") + ".";
      } else {
        var need = g("need"), unsure = /^not sure/i.test(need);
        first = "I’m " + name + (org ? ", from " + org : "") + ".";
        first += unsure ? " I’m not sure yet exactly what I need." : (kind === "project" ? " I need " : " I’m interested in ") + need + ".";
        if (tm) first += " My ideal timeframe is " + end(tm);
        out.push("", first, "", (kind === "project" ? "A little about the project: " : "A little more: ") + end(g("about")));
        contact = "You can reach me at " + email + ".";
      }
      out.push("", contact, "", "Thanks,", name);
      return out.join("\n");
    }
    function done(kind) {
      if (!msg) return;
      msg.textContent = "Your " + kind + " draft has opened. Review it and send it from there. This site does not store or send your details." +
        (kind === "WhatsApp" ? " You can also email us instead." : " You can also message us on WhatsApp instead.");
      msg.style.display = "block";
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault(); track(ev + "_whatsapp");
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text()), "_blank"); done("WhatsApp");
    });
    var em = f.querySelector("button[type=button]");
    if (em) em.addEventListener("click", function () {
      if (!f.reportValidity()) return; track(ev + "_email");
      window.location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(f.dataset.subject || who + " inquiry") + "&body=" + encodeURIComponent(text()); done("email");
    });
  });
  // "Ask about this" links preselect the matching option in the main inquiry form
  var main = document.getElementById("f");
  document.querySelectorAll("[data-need]").forEach(function (a) {
    a.addEventListener("click", function () {
      var s = main && main.elements.need; if (!s) return;
      Array.prototype.forEach.call(s.options, function (o) { if (o.text === a.dataset.need) s.value = o.value || o.text; });
    });
  });
  document.querySelectorAll('a[href^="https://wa.me"],a[href^="mailto:"],a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () { track("contact_" + a.href.split(":")[0].replace("https", "whatsapp")); });
  });
})();
