# Project memory

## Product intent & audience

- Bakery and pizza shop e-commerce site ("The Cake Factory", Butwal, Nepal).
- Customers browse/customize baked goods and pizzas, then submit orders via WhatsApp.
- Local storage-based auth (no backend); no persistent server sessions.

## Brand personality & voice

- Warm, appetizing, locally relevant (Nepal context); production-quality and trustworthy, not generic/template-feeling.

## Visual design & UX direction

- Fully responsive across mobile/tablet/desktop.
- React + Vite + Tailwind + Lucide icons; `@/` path alias → `src/`.
- Aesthetic: polished, "beautiful not cookie cutter" production look (see `.bolt/prompt`).
- E-commerce patterns: product listing, product customization, cart, WhatsApp checkout.

## Decisions, constraints & rationale

- `public/sitemap.xml` and `public/robots.txt` placed in Vite `public/` root so they are served at `/sitemap.xml` and `/robots.txt`.
- `robots.txt` updated to reference sitemap URL: `https://thecakefactorybutwal.vercel.app/sitemap.xml`.
- Homepage URL included: `https://thecakefactorybutwal.vercel.app/`.
- Static/public files only change on Vercel after redeploy; verifying live URL before redeploy will still 404.
- Must not alter existing design, products, content, or functionality when adding SEO/static files.

## Open questions & assumptions

- Exact set of public page routes to include in sitemap assumed from standard e-commerce pages (home, products, categories, cart, auth); confirm complete route list if more exist (e.g. about/contact/product detail).
- Auth-gated/cart routes may not be SEO-relevant; decide whether to include or `noindex` them.
- Vercel redeploy status pending user action; live verification to be re-run post-deploy.