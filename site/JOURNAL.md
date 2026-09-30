# Daily AI journal

The daily 20:00 Asia/Shanghai task researches, writes, verifies and publishes a briefing. The user has authorized automatic GitHub updates.

1. Read original sources and verify dates. Prefer the past 24 hours; label retrospectives from the past week. Attribute vendor claims and distinguish analysis from facts. Never invent personal experiments or employer incidents.
2. Add one entry per local date to site/journal.json, following existing fields. Reuse the same entry on same-day retries; preserve previous entries.
3. Run npm run build. scripts/journal.mjs generates articles, the blog index, the homepage latest article and sitemap URLs. Do not hand-edit dist or duplicate index cards. site/ai.html is the index template.
4. Run npm test. Check references and mobile layout, commit relevant files, push main, then verify GitHub checks and the live Netlify article.
5. Report the article URL and commit. Do not report push success as deployment success, or publish when reliable sources cannot be verified.

Preserve the resume, portrait, biography and unrelated edits. The first manual run is dated 2026-09-29.

## Visual and archive standards

Use relevant images found on original news pages or official media resources. The user explicitly rejects AI-generated images, homemade SVG covers, and self-made illustrative diagrams. Never generate an image as a fallback. Prefer official announcement/share artwork, product images and press photos; follow applicable reuse terms, preserve required attribution, and link the original page. Do not imply source attribution grants a reuse licence. If no suitable image is available, publish a clean text layout instead.

Set a post-level cover and optional item-level image with src (verified HTTPS image URL), alt, caption, credit, source (original page URL), width and height. Inspect the actual image for relevance and legibility; validate it loads in the deployed browser. Use the same cover for the archive thumbnail. Do not duplicate the cover inside the first story. Preserve full artwork without cropping important text. Shared typography, contents and source styling remain automatic.

Always append a new date to journal.json and preserve all earlier records and slugs. A same-day retry may update only that day's entry. Build regenerates every archived page; removing its JSON record would remove the page, so do not prune records. Use the existing latest-article, index and sitemap generation rather than editing HTML indexes by hand.
