/* Ignite forms: no backend. Each form opens a WhatsApp or email draft for the visitor to review and send. */
(function () {
  var WA = "2347042929458", MAIL = "contact.superballack@gmail.com";
  function track(n) { try { window.va && window.va("event", { name: n }); } catch (e) {} }
  document.querySelectorAll("form[data-who]").forEach(function (f) {
    var who = f.dataset.who, ev = f.dataset.ev || "inquiry", msg = f.nextElementSibling;
    function text() {
      var lines = ["Hello " + who + ","];
      Array.prototype.forEach.call(f.elements, function (el) {
        if (!el.name) return;
        var l = el.closest("label"), t = l ? l.firstChild.textContent.replace(/\s*\(optional\)/, "").trim() : el.name;
        lines.push(t + ": " + (el.value || "-"));
      });
      return lines.join("\n");
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
