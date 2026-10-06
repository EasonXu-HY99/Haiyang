import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const imageTag = (media, eager = false) => '<img src="'+esc(media.src)+'" alt="'+esc(media.alt)+'" width="'+esc(media.width)+'" height="'+esc(media.height)+'" loading="'+(eager?'eager':'lazy')+'" decoding="async" referrerpolicy="no-referrer">';
const figure = (media, cover = false) => media ? '<figure class="news-image '+(cover?'article-cover':'story-image')+'">'+imageTag(media,cover)+'<figcaption>'+esc(media.caption)+' <span>Image: <a href="'+esc(media.source)+'">'+esc(media.credit)+'</a>.</span></figcaption></figure>' : '';
export async function buildJournal(root, out) {
  const posts = JSON.parse(await readFile(path.join(root, 'site/journal.json'), 'utf8')).sort((a,b) => b.date.localeCompare(a.date));
  const seen = new Set();
  const card = (post, visual = false) => `<article class="journal-entry${visual && post.cover ? ' journal-entry-visual' : ''}">${visual && post.cover ? '<a class="journal-image-link" href="/articles/'+esc(post.slug)+'.html">'+imageTag(post.cover)+'</a>' : ''}<div><p class="eyebrow"><time datetime="${esc(post.date)}">${esc(post.date)}</time> · AI briefing</p><h3><a href="/articles/${esc(post.slug)}.html">${esc(post.title)}</a></h3><p>${esc(post.summary)}</p><a class="text-link" href="/articles/${esc(post.slug)}.html">Read the briefing <span aria-hidden="true">↗</span></a></div></article>`;
  const shell = (title, description, url, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Haiyang Xu</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://haiyangxu.netlify.app${url}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/portfolio.css"><link rel="stylesheet" href="/assets/refinements.css"><link rel="stylesheet" href="/assets/journal.css"></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="/"><span class="monogram">hx<span>.</span></span><span>HAIYANG XU</span></a><a class="text-link" href="/ai.html">AI Blog</a><a class="text-link" href="/">Portfolio</a></header>${body}<footer class="wrap footer"><p>Haiyang Xu · AI & Machine Learning</p><a href="/ai.html">All articles</a><a href="/">Back to portfolio</a></footer></body></html>`;
  await mkdir(path.join(out,'articles'), {recursive:true});
  for (const post of posts) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(post.slug) || seen.has(post.date)) throw new Error('Invalid or duplicate journal date/slug');
    seen.add(post.date);
    for (const item of post.items) if (new URL(item.source).protocol !== 'https:') throw new Error('Journal sources must use HTTPS');

    for (const media of [post.cover,...post.items.map(item=>item.image)].filter(Boolean)) {
      if (new URL(media.src).protocol !== 'https:' || new URL(media.source).protocol !== 'https:' || !media.credit || !media.alt || !Number.isInteger(media.width) || !Number.isInteger(media.height)) throw new Error('Images require HTTPS, attribution, alt text and integer dimensions');
    }
    const words = [post.title,post.summary,post.intro,post.takeaway,...post.items.flatMap(item=>[item.news,item.analysis])].join(' ').split(/\s+/).length;
    const minutes = Math.max(1,Math.ceil(words/220));
    const toc = '<nav class="article-toc" aria-label="In this briefing"><h2>In this briefing</h2>'+post.items.map((item,i)=>'<a href="#story-'+(i+1)+'">'+esc(item.title)+'</a>').join('')+'<a class="toc-end" href="#takeaway">Today’s takeaway</a><a href="/ai.html">Browse the archive ↗</a></nav>';
    if (!post.cover && !post.items.some(item=>item.image) && !post.visual) throw new Error('Every briefing requires a source image or an editorial reading map: '+post.date);
    if (post.visual && (!post.visual.focus || !Array.isArray(post.visual.branches) || post.visual.branches.length !== post.items.length || post.visual.branches.some(branch=>!branch.label || !branch.detail))) throw new Error('Reading maps must explain every story: '+post.date);
    const map = post.visual ? '<figure class="reading-map" aria-labelledby="map-title"><figcaption><h2 id="map-title">The briefing at a glance</h2><p>Editorial reading map · based on the linked stories, not a publisher illustration.</p></figcaption><div class="map-root">'+esc(post.visual.focus)+'</div><div class="map-branches">'+post.visual.branches.map((branch,i)=>'<a class="map-branch" href="#story-'+(i+1)+'"><span class="map-label">'+esc(branch.label)+'</span><span>'+esc(branch.detail)+'</span><span class="map-read">Read the story ↗</span></a>').join('')+'</div></figure>' : '';
    const cover = figure(post.cover,true)+map;
    const stories = post.items.map((item,i)=>'<section id="story-'+(i+1)+'"><header class="story-header"><p class="eyebrow">'+esc(item.date)+'</p><h2>'+esc(item.title)+'</h2></header><p>'+esc(item.news)+'</p>'+figure(item.image)+'<aside class="analysis-note"><h3>Why it matters</h3><p><strong>Analysis.</strong> '+esc(item.analysis)+'</p></aside><p class="article-source">Original source · <a href="'+esc(item.source)+'">'+esc(item.sourceLabel)+'</a> ↗</p></section>').join('');
    const body = '<main id="main" class="wrap section article-page"><a class="text-link" href="/ai.html">← All briefings</a><header class="article-heading"><div class="article-meta"><time datetime="'+esc(post.date)+'">'+esc(post.date)+'</time><span>'+minutes+' min read · estimated</span><span>'+post.items.length+' stories</span></div><h1>'+esc(post.title)+'</h1><p class="article-deck">'+esc(post.summary)+'</p><p class="article-scope">'+esc(post.scope)+'</p><p>Haiyang Xu’s journal · AI-assisted research and writing.</p></header>'+cover+'<div class="article-layout">'+toc+'<div class="article-body"><p>'+esc(post.intro)+'</p>'+stories+'<aside class="article-takeaway" id="takeaway"><h2>Today’s takeaway</h2><p>'+esc(post.takeaway)+'</p></aside><a class="button primary" href="/ai.html">Explore the AI blog</a></div></div></main>';
    await writeFile(path.join(out,'articles',`${post.slug}.html`),shell(post.title,post.summary,`/articles/${post.slug}.html`,body));
  }
  const template = await readFile(path.join(root,'site/ai.html'),'utf8');
  await writeFile(path.join(out,'ai.html'),template.replace('{{articles}}',posts.map(post=>card(post,true)).join('\n')));
  return { latest: posts.slice(0,1).map(post=>card(post)).join(''), urls:posts.map(post=>`https://haiyangxu.netlify.app/articles/${post.slug}.html`) };
}
