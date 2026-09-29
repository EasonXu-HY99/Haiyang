import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root,'dist/index.html'),'utf8');
test('all local landing-page assets, downloads, notes, and anchors resolve', async () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(link)) continue;
    if(link.startsWith('#')) assert.ok(ids.has(link.slice(1)),`Missing anchor ${link}`);
    else await access(path.join(root,'dist',link));
  }
});
test('current role and scope are accurate; excluded projects remain absent', () => {
  assert.match(html,/Engineer/); assert.match(html,/Jun 2025 – Present/);
  assert.match(html,/BlueVoyant/); assert.match(html,/Microsoft Defender/);
  assert.doesNotMatch(html,/IntelliPath|Intellipipe|Finance Calendar|\{\{\w+\}\}/i);
});
test('previous experience and contact URLs lead to the current résumé', async () => {
  for(const [file,anchor] of [['projects.html','experience'],['contact.html','contact']]){
    const page=await readFile(path.join(root,'dist',file),'utf8');
    assert.ok(page.includes(`url=/#${anchor}`));
  }
});
test('PDF download is a nonempty PDF document', async()=>{
  const pdf=await readFile(path.join(root,'dist/resume.pdf'));
  assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.ok(pdf.length>3000);
});
test('retired content is excluded from deployment and discovery',async()=>{
  for(const retired of ['cybersecurity.html','tools.html','cloud.html','cyberArk.html','coding.html','github.html','posts','cybertools','search.json']) {
    await assert.rejects(access(path.join(root,'dist',retired)), {code:'ENOENT'});
  }
  const sitemap=await readFile(path.join(root,'dist/sitemap.xml'),'utf8');
  assert.doesNotMatch(sitemap,/\/(?:cloud|coding|cybertools|posts)(?:[/.<])/);
  const journal=await readFile(path.join(root,'dist/ai.html'),'utf8');
  assert.match(journal,/no new articles published yet/);
  assert.doesNotMatch(journal,/20 Useful ChatGPT|CVE-2025-184XX/);
});
test('uploaded resume and photo are published byte-for-byte',async()=>{
  for(const [source,dest] of [['site/resume.pdf','dist/resume.pdf'],['site/assets/portrait.jpg','dist/assets/portrait.jpg']]) {
    assert.deepEqual(await readFile(path.join(root,source)),await readFile(path.join(root,dest)));
  }
  assert.match(html,/assets\/portrait\.jpg/);
});
