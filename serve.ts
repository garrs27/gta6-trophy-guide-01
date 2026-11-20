import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('./app/',import.meta.url));
const types:Record<string,string>={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url||'/', 'http://localhost').pathname);const relativePath=normalize(pathname==='/'?'index.html':pathname.slice(1));const file=join(root,relativePath);if(!file.startsWith(root)||!statSync(file).isFile())throw Error();res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream'});res.end(readFileSync(file))}catch{res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Not found')}}).listen(8080,'127.0.0.1',()=>console.log('Preview at http://127.0.0.1:8080'));
