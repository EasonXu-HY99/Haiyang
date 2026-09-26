# AI / Machine Learning publishing notes

The public journal is `site/ai.html`. It intentionally starts with no articles. The earlier Quarto content is not copied into deployments.

For each new article:

1. Create an HTML page under `site/articles/` using the portfolio stylesheet and a return link to `/ai.html`.
2. Include a meaningful title, author, actual publication date, optional update date, summary, sources, and a distinction between experiments and verified outcomes.
3. Add a descriptive link and short summary to `site/ai.html`. Replace its empty-state message when the first article is published.
4. Add the article URL to the generated sitemap in `scripts/build.mjs`.
5. Run `npm run build` and `npm test`, check mobile layout and references, then publish through the existing GitHub / Netlify workflow.

Ideas are not published posts. Do not assign future articles fabricated dates, results, or reading-time claims. No recurring publishing automation is configured.
