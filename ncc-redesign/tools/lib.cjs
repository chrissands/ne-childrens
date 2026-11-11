// Shared helpers: parse legacy NCC pages, build Sower (EDS) markup.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const LIVE = 'https://childrens.nebraska.gov/';
const SOWER = 'https://main--stateofnebraska-aem--ociostateofnebraska.aem.page';
const PAGES = { '': 'index.html', 'index.html': 'index.html', 'publications.html': 'publications.html',
  'legislative.html': 'Legislative.html', 'about.html': 'about.html', 'activesubgroups.html': 'ActiveSubgroups.html', 'meetings.html': 'meetings.html' };

const MEETING_SLUG = { ncc: 'ncc', ar: 'alternative-response', b2i: 'bridge-to-independence', fcrrc: 'foster-care-reimbursement-rate', jsc: 'juvenile-services', ojs: 'juvenile-services', locsc: 'level-of-care', meds: 'psychotropic-medication', sfa: 'strengthening-families-act', ntf: 'strengthening-families-act', normalcy: 'normalcy-task-force' };
const decodeEnt = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, '\u2019')
  .replace(/&lsquo;/g, '\u2018').replace(/&quot;/g, '"');
const esc = (s) => s.replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/gi, '&amp;');

function src(name) { return fs.readFileSync(path.join(ROOT, 'src', name), 'utf8'); }
function mainHtml(name) {
  let h = src(name).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  const i = h.indexOf('content-padding'); const j = h.indexOf('<div class="footer">');
  return h.slice(i, j);
}
// Resolve a legacy href to either a redesigned local page, or the live site.
function fixHref(raw) {
  let h = decodeEnt(raw.trim());
  if (/^(mailto:|#|tel:)/.test(h)) return h;
  let abs;
  try { abs = new URL(h, LIVE); } catch (e) { return h; }
  if (abs.hostname.replace(/^www\./, '') === 'childrens.nebraska.gov') {
    const key = abs.pathname.replace(/^\//, '').toLowerCase();
    if (PAGES[key] !== undefined && !abs.hash) return './' + PAGES[key];
    if (key === 'meetings/pastmeetingdocs.html') return './meetings.html';
    const my = key.match(/^meetings\/pastmeetingdocs(.+?)(\d\d)\.html$/);
    if (my && MEETING_SLUG[my[1]]) return './meetings.html?group=' + MEETING_SLUG[my[1]] + '&amp;year=20' + my[2];
  }
  if (abs.protocol === 'http:' && /nebraska(legislature)?\.gov$/.test(abs.hostname)) abs.protocol = 'https:';
  return esc(abs.href.replace(/&/g, '&amp;').replace(/&amp;amp;/g, '&amp;'));
}
function links(html) { // [{href,text}] in document order
  const out = []; const re = /<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi; let m;
  while ((m = re.exec(html))) {
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) out.push({ href: fixHref(m[1]), text: esc(text) });
  }
  return out;
}
const a = (l) => `<a href="${l.href}">${l.text}</a>`;
const tidy = (s) => esc(s.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
// rewrite hrefs inside a fragment of source html
function rewriteLinks(html) {
  return html.replace(/<a\b([^>]*?)href="([^"]*)"([^>]*)>/gi, (m, p1, h, p2) => `<a href="${fixHref(h)}">`)
    .replace(/\s(target|style|class|align|width|border|bgcolor|onclick)="[^"]*"/gi, '');
}
function tables(html) { // returns [{ start, rows:[[cellHtml..]] }]
  const out = []; const re = /<table\b[\s\S]*?<\/table>/gi; let m;
  while ((m = re.exec(html))) {
    const rows = []; const rr = /<tr\b[\s\S]*?<\/tr>/gi; let r;
    while ((r = rr.exec(m[0]))) { const cells = []; const cr = /<td\b[^>]*>([\s\S]*?)<\/td>/gi; let c;
      while ((c = cr.exec(r[0]))) cells.push(c[1]); rows.push(cells); }
    out.push({ start: m.index, rows });
  }
  return out;
}
const pic = (src, alt = '', w, h) => { const t = /\.png(\?|$)/i.test(src) ? 'image/png' : 'image/jpeg'; return `<picture><source type="${t}" srcset="${src}" media="(min-width: 600px)"><img loading="lazy" src="${src}" alt="${alt}"${w ? ` width="${w}" height="${h}"` : ''}></picture>`; };
const block = (cls, rows) => `<div class="${cls}">${rows.map((cells) => `<div>${cells.map((c) => `<div>${c}</div>`).join('')}</div>`).join('')}</div>`;
const tableBlock = (rows, cls = "table col-header") => `<div class="${cls}"><div><div><table><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div></div>`;
const sectionMeta = (kv) => block('section-metadata', Object.entries(kv).map(([k, v]) => [k, v]));
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const h = (n, t) => `<h${n} id="${slug(t)}">${t}</h${n}>`;
module.exports = { tableBlock, ROOT, LIVE, SOWER, src, mainHtml, fixHref, links, a, tidy, rewriteLinks, tables, pic, block, sectionMeta, slug, h, esc, decodeEnt };
