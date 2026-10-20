// Usage: node set-domain.mjs https://yourdomain.com
// Replaces the placeholder domain in meta tags, sitemap and robots.txt.
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";
const d = process.argv[2];
if (!d) { console.log("Usage: node set-domain.mjs https://yourdomain.com"); process.exit(1); }
const base = d.replace(/\/$/, ""), ph = "https://YOUR-DOMAIN.com";
(function walk(p) {
  for (const f of readdirSync(p)) {
    if (f === "node_modules" || f === ".git") continue;
    const q = join(p, f);
    if (statSync(q).isDirectory()) walk(q);
    else if (/\.(html|xml|txt)$/.test(f)) { const s = readFileSync(q, "utf8"); if (s.includes(ph)) writeFileSync(q, s.split(ph).join(base)); }
  }
})(".");
console.log("Done. Domain set to " + base);
