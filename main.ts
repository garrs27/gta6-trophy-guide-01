import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const app = join(here, 'app');
const dataPath = join(app, 'data', 'trophies.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const fail = (message: string): never => { throw new Error(`Entry validation failed: ${message}`); };
const trophies = data.trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) fail('expected exactly 55 trophies');
const fields = ['id','name','grade','gamerscore','hidden','category','official_description','guide','missable','status','sources'];
const ids = new Set<string>();
for (const [index, trophy] of trophies.entries()) {
  for (const field of fields) if (!(field in trophy) || trophy[field] === null || trophy[field] === '' || (Array.isArray(trophy[field]) && !trophy[field].length)) fail(`trophy ${index + 1} missing ${field}`);
  if (ids.has(trophy.id)) fail(`duplicate id ${trophy.id}`); ids.add(trophy.id);
  if (typeof trophy.guide !== 'string' || trophy.guide.length < 80) fail(`guide too short for ${trophy.id}`);
  if (!['verified','reported','unconfirmed'].includes(trophy.status)) fail(`bad status for ${trophy.id}`);
  if (!Array.isArray(trophy.sources) || !trophy.sources.every((s: string) => ['PowerPyx','GTABase','GTA Zone','Output Lag'].includes(s))) fail(`bad sources for ${trophy.id}`);
}
const count = (fn: (t: any) => boolean) => trophies.filter(fn).length;
for (const [grade, n] of Object.entries({platinum:1,gold:2,silver:6,bronze:46})) if (count((t: any) => t.grade === grade) !== n) fail(`grade split ${grade}`);
if (count((t: any) => t.hidden) !== 28 || trophies.reduce((a: number,t: any) => a + t.gamerscore,0) !== 1000) fail('hidden count or gamerscore mismatch');
for (const [status, n] of Object.entries({verified:48,reported:2,unconfirmed:5})) if (count((t: any) => t.status === status) !== n) fail(`status count ${status}`);
if (count((t: any) => t.missable) !== 1 || trophies.find((t: any) => t.missable)?.id !== 'positive-mental-attitude') fail('missable trophy mismatch');
if (data.meta?.game !== 'Grand Theft Auto VI' || data.meta?.platform !== 'PS5') fail('meta game/platform mismatch');
if (data.meta?.trophy_count !== 55 || data.meta?.hidden_count !== 28 || data.meta?.visible_count !== 27 || data.meta?.gamerscore_total !== 1000 || data.meta?.missable_count !== 1) fail('meta totals mismatch');
if (JSON.stringify(data.meta?.grade_counts) !== JSON.stringify({platinum:1,gold:2,silver:6,bronze:46})) fail('meta grade counts mismatch');
const unconfirmedIds = ['in-the-beginning','capital-offense','bad-luck-i-guess','the-truth-is-out-there','ten-pin'];
if (unconfirmedIds.some(id => !trophies.some((t: any) => t.id === id && t.status === 'unconfirmed'))) fail('unconfirmed trophy ids mismatch');
function scan(dir: string): string[] { return readdirSync(dir).flatMap(name => { const p=join(dir,name); return statSync(p).isDirectory()?scan(p):[p]; }); }
const external = /https?:\/\/|url\(\s*\/\/|@import/i;
for (const file of scan(app)) if (external.test(readFileSync(file,'utf8'))) fail(`external reference in ${relative(here,file)}`);
if (statSync(join(app,'index.html')).size > 1048576) fail('index.html exceeds 1 MiB');
const appEntries = scan(app).length + (function dirs(dir:string):number{return readdirSync(dir).reduce((n,name)=>{const p=join(dir,name);return n+(statSync(p).isDirectory()?1+dirs(p):0)},0)})(app);
if (appEntries > 993) fail('app file/directory cap exceeded');
const generated = `window.TROPHIES = ${JSON.stringify(data)};\n`;
writeFileSync(join(app,'data','trophies-data.js'), generated);
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
cpSync(app, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
writeFileSync(join(out, 'dossier.json'), buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }));
console.log(`Validated ${trophies.length} trophies; generated ${join(app,'data','trophies-data.js')} and dossier at ${out}.`);
