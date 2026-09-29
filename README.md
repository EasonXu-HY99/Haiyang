# Haiyang Xu — Security Operations Portfolio

Responsive résumé website focused on SOC L2 investigation, incident response, and cloud security, with a fresh AI / Machine Learning journal.

## Run locally

Node.js 22 or later. No npm dependencies are required.

```sh
npm run build
npm test
npm run dev
```

Open http://127.0.0.1:4173.

## Maintain

- `site/content.json`: experience, education, certifications, and skills, based on the owner-provided résumé and confirmed responsibilities. Engineer remains the confirmed formal title; SOC L2 is the functional scope.
- `site/index.html`: homepage template.
- `site/assets/portrait.jpg`: owner-provided portrait, published without alteration.
- `site/resume.pdf`: owner-provided PDF, published byte-for-byte. Replace only with an owner-approved file; do not regenerate it from website content.
- `site/ai.html`: AI / ML journal. No new articles are published yet; topic cards describe future interests.
- `site/JOURNAL.md`: manual publishing workflow for future articles.
- `scripts/build.mjs`: cleans and rebuilds `dist/` from an explicit set of inputs, so removed pages cannot return through stale output or build caches.

The previous Quarto technical pages, dated news posts, old AI prompt collection, and legacy search index are retired. Their source remains recoverable in Git history. Removed URLs return 404. Earlier biographical URLs point to the current homepage sections.

## Deploy

The existing Netlify site is https://haiyangxu.netlify.app/. `netlify.toml` runs `npm run build` and publishes only `dist/`. Pushes to `main` trigger the existing deployment. GitHub Actions builds and tests the same output.

The site has no analytics, contact-form backend, or recurring content-generation job. Standard email and LinkedIn links handle contact. Core content and article links work without JavaScript; mobile navigation is progressively enhanced.
