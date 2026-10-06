# Daily AI journal

The daily 20:00 Asia/Shanghai task researches, writes, verifies and publishes a briefing. The user has authorized automatic GitHub updates.

1. Read original sources and verify dates. Prefer the past 24 hours; label retrospectives from the past week. Attribute vendor claims and distinguish analysis from facts. Never invent personal experiments or employer incidents.
2. Add one entry per local date to site/journal.json, following existing fields. Reuse the same entry on same-day retries; preserve previous entries.
3. Run npm run build. scripts/journal.mjs generates articles, the blog index, the homepage latest article and sitemap URLs. Do not hand-edit dist or duplicate index cards. site/ai.html is the index template.
4. Run npm test. Check references and mobile layout, commit relevant files, push main, then verify GitHub checks and the live Netlify article.
5. Report the article URL and commit. Do not report push success as deployment success, or publish when reliable sources cannot be verified.

Preserve the resume, portrait, biography and unrelated edits. The first manual run is dated 2026-09-29.

## Visual and archive standards

Use relevant images found on original news pages or official media resources. The user rejects AI-generated images and decorative homemade SVG covers. On 6 October 2026 the user explicitly authorized reading maps and requires meaningful visual content in every edition. Prefer official announcement/share artwork, product images and press photos; follow applicable reuse terms, preserve required attribution, and link the original page. Do not imply source attribution grants a reuse licence. If no suitable licensed image is available, add an editorial HTML/CSS reading map through post.visual: {focus, branches: [{label, detail}]}, with one branch per story. The renderer links branches to their sourced stories and labels the map as editorial synthesis. Never present it as publisher artwork. The build must reject editions without an image or reading map.

Set a post-level cover and optional item-level image with src (verified HTTPS image URL), alt, caption, credit, source (original page URL), width and height. Inspect the actual image for relevance and legibility; validate it loads in the deployed browser. Use the same cover for the archive thumbnail. Do not duplicate the cover inside the first story. Preserve full artwork without cropping important text. Shared typography, contents and source styling remain automatic.

Always append a new date to journal.json and preserve all earlier records and slugs. A same-day retry may update only that day's entry. Explicit user requests may enrich older entries visually while preserving their text, dates and slugs. Build regenerates every archived page; removing its JSON record would remove the page, so do not prune records. Use the existing latest-article, index and sitemap generation rather than editing HTML indexes by hand.
