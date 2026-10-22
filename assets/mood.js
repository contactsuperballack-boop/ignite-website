/* Mood toggle (Ignite page): black and off-white -> iBuild -> iStudios -> Academy -> repeat. Not stored anywhere. */
(function () {
  var M = [{ k: "mono", n: "Black and off-white" }, { k: "build", n: "iBuild" }, { k: "studios", n: "iStudios" }, { k: "academy", n: "Academy" }], i = 0;
  var b = document.getElementById("mood"), n = document.getElementById("moodname");
  if (!b) return;
  var pips = b.querySelectorAll(".pips i");
  function apply() {
    document.body.setAttribute("data-mood", M[i].k);
    pips.forEach(function (p, j) { p.classList.toggle("on", j === i); });
    b.setAttribute("aria-label", "Change colour mood. Current: " + M[i].n + ". Next: " + M[(i + 1) % M.length].n);
  }
  b.addEventListener("click", function () {
    i = (i + 1) % M.length; apply();
    if (n) n.textContent = "Mood: " + M[i].n;
  });
  apply();
})();
