# Haiyang Xu — Security Operations Portfolio

A responsive résumé website focused on SOC L2 investigations, incident response, and cloud security. The existing Quarto technical library remains available at its original URLs.

## Run locally

Requires Node.js 22 or later; no npm dependencies are needed.

```sh
npm run build
npm test
npm run dev
```

Open http://127.0.0.1:4173.

## Maintain the site

- `site/content.json`: employment, education, certifications, skills, and note links. Formal title: Engineer; SOC L2 is the functional scope.
- `site/index.html`: homepage template and introductory copy.
- `site/assets/`: responsive styles, progressive-enhancement interactions, and favicon.
- `site/resume.pdf`: current downloadable résumé. Regenerate after changing résumé content with `python scripts/build_resume.py` (requires ReportLab). Review the rendered PDF before committing it.
- `scripts/build.mjs`: assembles the site into `dist/`, preserving the existing `_site/` technical library, adding return links, and replacing stale biographical routes.
- `*.qmd`, `cybertools/`, and `_site/`: retained Quarto sources and published article snapshot. To update articles, use Quarto to regenerate `_site/`, then run the Node build. The Node build always supplies the résumé homepage.

The homepage works without JavaScript. JavaScript adds the mobile menu, note filters, and active-section navigation. Reduced-motion preferences and keyboard navigation are supported. No analytics, account login, tracking pixels, or contact-form backend is added.

## Deploy

The existing destination is Netlify: https://haiyangxu.netlify.app/. `netlify.toml` configures `npm run build` with publish directory `dist`. Connect this repository to the existing site or upload `dist/` as a manual deployment. Do not publish the repository root: it contains source and editor files.

The 2026 content refresh uses owner-confirmed Seatrium scope and dates, plus earlier biography content from this repository. It does not assert new performance metrics, certification validity dates, or production outcomes. Historical technical notes are retained as learning material, not newly validated guidance.
