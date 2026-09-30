# Daily AI journal

The daily 20:00 Asia/Shanghai task researches, writes, verifies and publishes a briefing. The user has authorized automatic GitHub updates.

1. Read original sources and verify dates. Prefer the past 24 hours; label retrospectives from the past week. Attribute vendor claims and distinguish analysis from facts. Never invent personal experiments or employer incidents.
2. Add one entry per local date to site/journal.json, following existing fields. Reuse the same entry on same-day retries; preserve previous entries.
3. Run npm run build. scripts/journal.mjs generates articles, the blog index, the homepage latest article and sitemap URLs. Do not hand-edit dist or duplicate index cards. site/ai.html is the index template.
4. Run npm test. Check references and mobile layout, commit relevant files, push main, then verify GitHub checks and the live Netlify article.
5. Report the article URL and commit. Do not report push success as deployment success, or publish when reliable sources cannot be verified.

Preserve the resume, portrait, biography and unrelated edits. The first manual run is dated 2026-09-29.

## Visual and archive standards

Every edition uses the shared editorial cover, readable article layout, linked contents, estimated reading time and archive navigation automatically. Add a topic-specific `visual` object to relevant news items: `title`, three `steps` with `label` and `detail`, and a `caption`. Use diagrams to explain a real relationship, process or date conversion; explicitly label conceptual analysis. Never invent quantitative charts, product screenshots or benchmark data. If a diagram would add no value, omit it. The shared cover is a conceptual illustration, not news evidence.

Always append a new date to journal.json and preserve all earlier records and slugs. A same-day retry may update only that day's entry. Build regenerates every archived page; removing its JSON record would remove the page, so do not prune records. Use the existing latest-article, index and sitemap generation rather than editing HTML indexes by hand.
