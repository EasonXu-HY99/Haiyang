import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const content = JSON.parse(await readFile(path.join(root, 'site/content.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const tags = items => `<div class="tags">${items.map(item => `<span class="tag">${escape(item)}</span>`).join('')}</div>`;
const bullets = items => `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
// A clean, allowlisted build prevents retired pages resurfacing on redeploy.
if (path.dirname(out) !== path.resolve(root) || path.basename(out) !== 'dist') throw new Error('Unsafe output directory');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await mkdir(path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'site/assets'), path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'site/resume.pdf'), path.join(out, 'resume.pdf'));

const replacements = {
  experience: content.experience.map(job => `<article class="job">
    <div class="job-date"><span>${escape(job.period)}</span>${job.current ? '<span class="current-badge">CURRENT ROLE</span>' : ''}</div>
    <div><div class="job-heading"><h3>${escape(job.company)}</h3></div><p class="job-role">${escape(job.role)}</p><p class="job-focus">${escape(job.focus)}</p>
    ${job.current ? bullets(job.bullets) : `<details><summary>Responsibilities</summary>${bullets(job.bullets)}</details>`}${tags(job.tags)}</div></article>`).join('\n'),
  toolkit: content.toolkit.map(group => `<div class="tool-group"><h4>${escape(group.title)}</h4>${bullets(group.items)}</div>`).join('\n'),
  education: content.education.map(item => `<article class="education-item"><p class="period">${escape(item.period)}</p><h3>${escape(item.school)}</h3><p>${escape(item.degree)}</p><small>${escape(item.detail)}</small></article>`).join('\n'),
  certifications: content.certifications.map(item => `<div class="credential"><span>${escape(item)}</span><span aria-hidden="true">↗</span></div>`).join('\n'),
  notes: content.notes.map(note => `<article class="note" data-category="${escape(note.category)}"><div class="note-meta"><span>${escape(note.category)}</span><span>${note.number}</span></div><h3>${escape(note.title)}</h3><p>${escape(note.description)}</p><a class="note-link" href="${escape(note.href)}" aria-label="Read ${escape(note.title)} notes">Read notes <span aria-hidden="true">↗</span></a></article>`).join('\n'),
  email: content.email, linkedin: content.linkedin, github: content.github, year: new Date().getFullYear()
};
let html = await readFile(path.join(root, 'site/index.html'), 'utf8');
html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Missing template value: ${key}`);
  return replacements[key];
});
await writeFile(path.join(out, 'index.html'), html);

await cp(path.join(root, 'site/ai.html'), path.join(out, 'ai.html'));
// Optional future articles; the journal can launch without placeholder posts.
try { await cp(path.join(root, 'site/articles'), path.join(out, 'articles'), { recursive: true }); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
// Replace stale biographical pages with stable links to the current content.
for (const [file, anchor] of [['projects.html','experience'],['contact.html','contact'],['about.html','about']]) {
  await writeFile(path.join(out, file), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/#${anchor}"><link rel="canonical" href="https://haiyangxu.netlify.app/#${anchor}"><title>Haiyang Xu</title></head><body><a href="/#${anchor}">Continue to Haiyang Xu’s ${anchor}</a></body></html>`);
}
await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://haiyangxu.netlify.app/sitemap.xml\n');
await writeFile(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://haiyangxu.netlify.app/</loc></url><url><loc>https://haiyangxu.netlify.app/ai.html</loc></url></urlset>');
await writeFile(path.join(out, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Haiyang Xu</title><link rel="stylesheet" href="/assets/portfolio.css"></head><body><main class="wrap section"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>This page has moved.</h1><p>Find my experience and technical notes on the homepage.</p><a class="button primary" href="/">Back to Haiyang’s résumé ↗</a></main></body></html>');
console.log(`Built résumé website and AI / ML journal in ${out}`);
