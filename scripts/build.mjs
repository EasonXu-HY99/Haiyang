import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const content = JSON.parse(await readFile(path.join(root, 'site/content.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const tags = items => `<div class="tags">${items.map(item => `<span class="tag">${escape(item)}</span>`).join('')}</div>`;
const bullets = items => `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
await mkdir(out, { recursive: true });
// Preserve the existing published Quarto library and its working URLs.
await cp(path.join(root, '_site'), out, { recursive: true });
await mkdir(path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'site/assets'), path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'profile.jpg'), path.join(out, 'assets/profile.jpg'));
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

// An unobtrusive return path connects retained articles to the new résumé.
async function connectArchive(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'site_libs' && entry.name !== 'assets') await connectArchive(file);
    else if (entry.isFile() && entry.name.endsWith('.html') && file !== path.join(out, 'index.html')) {
      let page = await readFile(file, 'utf8');
      if (!page.includes('id="portfolio-return"')) page = page.replace(/<body([^>]*)>/i, `<body$1><a id="portfolio-return" href="/" style="position:fixed;bottom:18px;right:18px;z-index:10000;background:#102c36;color:white;padding:11px 17px;border-radius:5px;font:13px Arial,sans-serif;box-shadow:0 4px 15px #0003;text-decoration:none">← Haiyang’s résumé</a>`);
      await writeFile(file, page);
    }
  }
}
await connectArchive(out);
// Replace stale biographical pages with stable links to the current content.
for (const [file, anchor] of [['projects.html','experience'],['contact.html','contact'],['about.html','about']]) {
  await writeFile(path.join(out, file), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/#${anchor}"><link rel="canonical" href="https://haiyangxu.netlify.app/#${anchor}"><title>Haiyang Xu</title></head><body><a href="/#${anchor}">Continue to Haiyang Xu’s ${anchor}</a></body></html>`);
}
// Quarto search excludes the obsolete home / employment / contact summaries.
const searchPath = path.join(out, 'search.json');
const search = JSON.parse(await readFile(searchPath, 'utf8'));
await writeFile(searchPath, JSON.stringify(search.filter(item => !/^(index|projects|contact|about)\.html(?:#|$)/.test(item.href || ''))));
await writeFile(path.join(out, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Haiyang Xu</title><link rel="stylesheet" href="/assets/portfolio.css"></head><body><main class="wrap section"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>This page has moved.</h1><p>Find my experience and technical notes on the homepage.</p><a class="button primary" href="/">Back to Haiyang’s résumé ↗</a></main></body></html>');
console.log(`Built résumé website and preserved technical library in ${out}`);
