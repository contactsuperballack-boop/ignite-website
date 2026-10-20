/* Logo loading screen. Shows once per browser session; never traps the visitor. */
(function () {
  var l = document.getElementById("loader"), d = document.documentElement;
  if (!l) return;
  if (d.classList.contains("noload")) { window.__igReady = true; l.remove(); return; }
  var t0 = performance.now(), loaded = document.readyState === "complete", fin = false;
  var wait = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 300 : 1600;
  function finish() {
    if (fin) return; fin = true;
    l.classList.add("done"); d.classList.remove("loading");
    window.__igReady = true; document.dispatchEvent(new Event("ignite:ready"));
    try { sessionStorage.setItem("ig", "1"); } catch (e) {}
    setTimeout(function () { l.remove(); }, 1100);
  }
  function check() { if (loaded) setTimeout(finish, Math.max(0, wait - (performance.now() - t0))); }
  if (loaded) check(); else window.addEventListener("load", function () { loaded = true; check(); });
  setTimeout(finish, 6000);
})();
