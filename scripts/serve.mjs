import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.pdf':'application/pdf','.woff2':'font/woff2','.woff':'font/woff','.xml':'application/xml'};
http.createServer(async(req,res) => {
  try {
    const relative = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '');
    let target = path.resolve(root, relative || 'index.html');
    if (!target.startsWith(root)) { res.writeHead(403); res.end(); return; }
    let info = await stat(target).catch(() => null);
    if (!info && !path.extname(target)) { target += '.html'; info = await stat(target).catch(() => null); }
    if (info?.isDirectory()) target = path.join(target,'index.html');
    const body = await readFile(target);
    res.writeHead(200, {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
