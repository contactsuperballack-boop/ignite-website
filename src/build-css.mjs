// Rebuilds assets/app.css (site + premium + chat) and assets/mood.css from the readable files in src/assets,
// then refreshes the ?v= cache-busting hashes on every CSS/JS reference in the HTML pages.
// Usage (from the site folder): node src/build-css.mjs
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
const min = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};,>])\s*/g, "$1").replace(/:\s+/g, ":").trim();
const rd = (n) => readFileSync(join("src/assets", n), "utf8");
writeFileSync("assets/app.css", min(rd("site.css") + "\n" + rd("premium.css") + "\n" + rd("chat.css")));
writeFileSync("assets/mood.css", min(rd("mood.css")));
const hash = (f) => createHash("md5").update(readFileSync(join("assets", f))).digest("hex").slice(0, 8);
(function walk(d) {
  for (const f of readdirSync(d)) {
    if (["node_modules", ".git", "src", "assets"].includes(f)) continue;
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) {
      const s = readFileSync(p, "utf8");
      const o = s.replace(/\/assets\/([a-z-]+\.(?:css|js))(\?v=[a-z0-9]+)?/g, (m, n) => (existsSync(join("assets", n)) ? `/assets/${n}?v=${hash(n)}` : m));
      if (o !== s) writeFileSync(p, o);
    }
  }
})(".");
console.log("CSS rebuilt and asset versions refreshed.");
