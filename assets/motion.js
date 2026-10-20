/* Ignite motion (GSAP + ScrollTrigger). Everything is progressive enhancement:
   no JS, reduced motion or data-saver = a plain, fully visible page. No pinning or scroll-jacking. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (navigator.connection && navigator.connection.saveData) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Hold animations until the loading screen lifts */
  if (document.getElementById("loader") && !window.__igReady) {
    gsap.globalTimeline.pause();
    document.addEventListener("ignite:ready", function () { gsap.globalTimeline.resume(); }, { once: true });
  }

  var st = document.createElement("style");
  st.textContent =
    "html,body{overflow-x:clip}" +
    ".orb{position:absolute;border:1px solid var(--line);border-radius:50%;pointer-events:none;z-index:-1}" +
    ".orb.fill{border:0;background:var(--ember);opacity:.07}" +
    "#prog{position:fixed;left:0;right:0;top:0;height:2px;background:var(--ember);transform:scaleX(0);transform-origin:0 50%;z-index:40;pointer-events:none}" +
    ".w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .08em .14em 0;margin:0 -.08em -.14em 0}.wi{display:inline-block}" +
    "header{transition:transform .35s cubic-bezier(.16,1,.3,1)}header.tuck{transform:translateY(-100%)}";
  document.head.appendChild(st);

  /* Scroll progress line */
  var bar = document.createElement("div");
  bar.id = "prog";
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* Headline: words rise into place */
  function split(el) {
    var words = [];
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"), i = document.createElement("span");
            w.className = "w"; i.className = "wi"; i.textContent = p; w.appendChild(i); frag.appendChild(w); words.push(i);
          });
          n.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(el);
    return words;
  }
  var h1 = document.querySelector("h1");
  if (h1) {
    var words = split(h1);
    gsap.set(words, { yPercent: 118 });
    gsap.to(words, { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.08, delay: 0.1 });
  }

  /* Reveals: fade + rise, staggered per batch, once */
  var sel = ".meta,h2,.lead,.sub,.cta,.arm,.svc>div,.bandtxt p,.feature>.info,.svcd>div,.abt>div,.abt>dl,.princ>div,.stats>div,.quotes>blockquote,.wk,.marks>div,.grid3>div,.rows>div,.steps>div,.slot,.aud,.contact,form,.flow,.marquee";
  var items = gsap.utils.toArray(sel).filter(function (el) { return !el.closest("header") && !el.closest("footer"); });
  gsap.set(items, { opacity: 0, y: 28 });
  ScrollTrigger.batch(items, {
    start: "top 90%", once: true,
    onEnter: function (els) {
      gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true, clearProps: "transform" });
    }
  });

  /* Counters */
  document.querySelectorAll(".stats b").forEach(function (b) {
    var m = b.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var end = parseFloat(m[1]), suf = m[2], o = { v: 0 };
    b.textContent = "0" + suf;
    ScrollTrigger.create({ trigger: b, start: "top 92%", once: true, onEnter: function () {
      gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", onUpdate: function () { b.textContent = Math.round(o.v) + suf; } });
    } });
  });

  /* Hero illustrations draw themselves, then fills fade in */
  gsap.utils.toArray(".art svg").forEach(function (svg) {
    var tl = gsap.timeline({ delay: 0.3 }), i = 0;
    svg.querySelectorAll("path[stroke],rect[stroke],circle[stroke]").forEach(function (el) {
      if (el.closest("pattern") || el.getAttribute("stroke-dasharray") || !el.getTotalLength) return;
      var L = el.getTotalLength();
      gsap.set(el, { strokeDasharray: L, strokeDashoffset: L });
      tl.to(el, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" }, (i++) * 0.05);
    });
    var fills = svg.querySelectorAll('[fill="var(--ember)"]');
    gsap.set(fills, { opacity: 0 });
    tl.to(fills, { opacity: 1, duration: 0.6, stagger: 0.1 }, 0.8);
  });

  /* Parallax: hero artwork inside its square frame */
  gsap.utils.toArray(".frame img").forEach(function (img) {
    gsap.set(img, { scale: 1.18 });
    gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: "none",
      scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Parallax: full-width photo band */
  gsap.utils.toArray(".band img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none",
      scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Parallax: layers inside illustrated art (data-p = travel in px) */
  gsap.utils.toArray(".art [data-p]").forEach(function (el) {
    var p = parseFloat(el.getAttribute("data-p")) || 0;
    gsap.fromTo(el, { y: -p }, { y: p, ease: "none",
      scrollTrigger: { trigger: el.closest(".frame"), start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Parallax: decorative rings and hero copy */
  var top = document.getElementById("top");
  if (top) {
    top.style.position = "relative";
    [
      { cls: "orb", size: 360, css: "right:-90px;top:-30px", dy: -140 },
      { cls: "orb fill", size: 120, css: "left:38%;bottom:10px", dy: 90 },
      { cls: "orb", size: 190, css: "left:-70px;bottom:-40px", dy: -70 }
    ].forEach(function (o) {
      var d = document.createElement("div");
      d.className = o.cls;
      d.style.cssText = "width:" + o.size + "px;height:" + o.size + "px;" + o.css;
      top.appendChild(d);
      gsap.to(d, { y: o.dy, ease: "none", scrollTrigger: { trigger: top, start: "top top", end: "bottom top", scrub: true } });
    });
    var copy = top.firstElementChild;
    if (copy) gsap.to(copy, { y: -36, ease: "none", scrollTrigger: { trigger: top, start: "top top", end: "bottom top", scrub: true } });
  }

  /* Section headings drift gently */
  gsap.utils.toArray("section h2").forEach(function (h) {
    gsap.fromTo(h, { x: 0 }, { x: -18, ease: "none",
      scrollTrigger: { trigger: h, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Magnetic buttons (mouse only) */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      var xt = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3" }), yt = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3" });
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        xt((e.clientX - r.left - r.width / 2) * 0.22); yt((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener("mouseleave", function () { xt(0); yt(0); });
    });
  }

  /* Header tucks away on scroll down, returns on scroll up */
  var hdr = document.querySelector("header"), nav = document.getElementById("nav");
  if (hdr) ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (s) {
    var y = s.scroll();
    if (y > 160 && s.direction === 1 && !(nav && nav.classList.contains("open"))) hdr.classList.add("tuck");
    else if (s.direction === -1 || y <= 160) hdr.classList.remove("tuck");
  } });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
