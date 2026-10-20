# Ignite website

Static site, no build step and no backend.

- `/` main Ignite page
- `/build/` iBuild
- `/studios/` Ignite Studios (iCreate and iMedia)
- `/academy/` Ignite Academy
- `/assets/` shared logo, artwork, social preview images, `site.css`, `motion.js`, `contact.js`
- `404.html`, `sitemap.xml`, `robots.txt`, `vercel.json`

## Deploy on Vercel
1. Push this folder to a Git repo (or run `vercel` inside it).
2. Framework preset: **Other**. Build command: none. Output directory: `.`

## Before launch
1. **Set your domain** (needed for social previews, canonical links and the sitemap):
   `node set-domain.mjs https://yourdomain.com`
2. **Turn on Vercel Web Analytics** (Project > Analytics). Pages already include the script; it records page views and the events `inquiry_whatsapp`, `inquiry_email` and `contact_*` link clicks. No backend or cookies needed.
3. Optional: self-host the fonts (Outfit, Instrument Serif, DM Mono) with the `@fontsource` packages for faster loads, then remove the Google Fonts `<link>` tags.

## Inquiry forms
Forms open a WhatsApp or email draft for the visitor to review and send. Nothing is stored. Edit the number and email at the top of `assets/contact.js`.

## Subdomains
Add `build.`, `studios.` and `academy.` domains to the project, then add host rewrites to `vercel.json`, for example:

```json
"rewrites": [
  { "source": "/assets/(.*)", "destination": "/assets/$1" },
  { "source": "/(.*)", "has": [{ "type": "host", "value": "studios.yourdomain.com" }], "destination": "/studios/$1" }
]
```
(one host block per subdomain). Then set `ROOT_DOMAIN` in the `<script>` at the bottom of each page.

## Legal pages
`/privacy/`, `/terms/` and `/cookies/` are included. Have a lawyer review them and confirm the legal entity name before launch. If you use subdomains, add an exception rewrite for `/(privacy|terms|cookies)/(.*)` so these paths work on every subdomain.

## SEO
Done in this build: unique titles (50-60 chars) and descriptions (150-160 chars) per page, canonical and hreflang tags, Open Graph and Twitter cards with a 1200x630 image per page, Schema.org JSON-LD (Organization, WebSite, WebPage, BreadcrumbList, Service), visible breadcrumbs, one h1 per page, sitemap.xml and robots.txt, security headers, WebP images, lazy loading, non-blocking fonts, a 404 page, and a footer nav for internal links.

After you have a domain:
1. `node set-domain.mjs https://yourdomain.com` (updates canonicals, social images, schema, sitemap, robots).
2. Add the site to Google Search Console and submit `/sitemap.xml`.
3. Test pages with the Rich Results Test (search.google.com/test/rich-results) and validator.schema.org, and run Lighthouse on the live URL.

Notes: the `src/` folder holds readable copies of the CSS (the files in `assets/` are minified) and is excluded from deployment by `.vercelignore`. The analytics script path `/_vercel/insights/script.js` only exists once deployed on Vercel with Web Analytics turned on.
