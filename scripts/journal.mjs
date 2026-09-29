import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export async function buildJournal(root, out) {
  const posts = JSON.parse(await readFile(path.join(root, 'site/journal.json'), 'utf8')).sort((a,b) => b.date.localeCompare(a.date));
  const seen = new Set();
  const card = post => `<article class="journal-entry"><p class="eyebrow"><time datetime="${esc(post.date)}">${esc(post.date)}</time> · AI briefing</p><h3><a href="/articles/${esc(post.slug)}.html">${esc(post.title)}</a></h3><p>${esc(post.summary)}</p><a class="text-link" href="/articles/${esc(post.slug)}.html">Read the briefing <span aria-hidden="true">↗</span></a></article>`;
  const shell = (title, description, url, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Haiyang Xu</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://haiyangxu.netlify.app${url}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/portfolio.css"><link rel="stylesheet" href="/assets/refinements.css"></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="/"><span class="monogram">hx<span>.</span></span><span>HAIYANG XU</span></a><a class="text-link" href="/ai.html">AI Blog</a><a class="text-link" href="/">Portfolio</a></header>${body}<footer class="wrap footer"><p>Haiyang Xu · AI & Machine Learning</p><a href="/ai.html">All articles</a><a href="/">Back to portfolio</a></footer></body></html>`;
  await mkdir(path.join(out,'articles'), {recursive:true});
  for (const post of posts) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(post.slug) || seen.has(post.date)) throw new Error('Invalid or duplicate journal date/slug');
    seen.add(post.date);
    for (const item of post.items) if (new URL(item.source).protocol !== 'https:') throw new Error('Journal sources must use HTTPS');
    const body = `<main id="main" class="wrap section article-page"><a class="text-link" href="/ai.html">← All briefings</a><header class="article-heading"><p class="eyebrow"><time datetime="${esc(post.date)}">${esc(post.date)}</time> · AI-assisted news digest</p><h1>${esc(post.title)}</h1><p class="article-deck">${esc(post.summary)}</p><p class="article-scope">${esc(post.scope)}</p><p>Published on Haiyang Xu’s journal · AI-assisted research and writing.</p></header><div class="article-body"><p>${esc(post.intro)}</p>${post.items.map(item=>`<section><p class="eyebrow">${esc(item.date)}</p><h2>${esc(item.title)}</h2><p>${esc(item.news)}</p><p><strong>Why it matters · Analysis.</strong> ${esc(item.analysis)}</p><p class="article-source">Source: <a href="${esc(item.source)}">${esc(item.sourceLabel)}</a></p></section>`).join('')}<aside class="article-takeaway"><h2>Today’s takeaway</h2><p>${esc(post.takeaway)}</p></aside><a class="button primary" href="/ai.html">Explore the AI blog</a></div></main>`;
    await writeFile(path.join(out,'articles',`${post.slug}.html`),shell(post.title,post.summary,`/articles/${post.slug}.html`,body));
  }
  const template = await readFile(path.join(root,'site/ai.html'),'utf8');
  await writeFile(path.join(out,'ai.html'),template.replace('{{articles}}',posts.map(card).join('\n')));
  return { latest: posts.slice(0,1).map(card).join(''), urls:posts.map(post=>`https://haiyangxu.netlify.app/articles/${post.slug}.html`) };
}
