/*
 * Builds the local authoring content for the Nebraska Children's Commission migration
 * from the redesign handoff in ncc-redesign/. Deterministic: wording and links are copied
 * as-is; only these changes are made:
 *   - links between the migrated pages (./x.html) are rewritten to their site paths
 *   - images on childrens.nebraska.gov/img/ are pointed at the local copies under /img/
 *   - heading ids are regenerated the way Edge Delivery generates them
 *   - a metadata block is appended from each full document's <head>
 * It also copies the meeting data sheets and writes the redirects and placeholders sheets.
 * Usage: node tools/ncc/build-content.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'ncc-redesign');
const OUT = path.join(ROOT, 'content');

// EDS serves lowercase paths only, so the two mixed-case page names become lowercase.
const PAGES = [
  { name: 'index', out: 'index', path: '/' },
  { name: 'publications', out: 'publications', path: '/publications' },
  { name: 'Legislative', out: 'legislative', path: '/legislative' },
  { name: 'about', out: 'about', path: '/about' },
  // Hyphenated for readability and SEO; /activesubgroups redirects here.
  { name: 'ActiveSubgroups', out: 'active-subgroups', path: '/active-subgroups' },
  { name: 'meetings', out: 'meetings', path: '/meetings' },
  { name: 'meetings-upcoming', out: 'meetings/upcoming', path: '/meetings/upcoming' },
];

const ASSETS = [
  ['bg-crayons.jpg', 'img/bg-image-new.jpg'],
  ['logo.png', 'img/ChildrensLogo.png'],
  ['tile-13.jpg', 'img/tiles/13.jpg'],
  ['tile-16.jpg', 'img/tiles/16.jpg'],
  ['tile-17.jpg', 'img/tiles/17.jpg'],
  ['tile-20.jpg', 'img/tiles/20.jpg'],
  ['tile-21.jpg', 'img/tiles/21.jpg'],
  ['tile-22.jpg', 'img/tiles/22.jpg'],
];

const IMG_BASE = 'https://content.da.live/chrissands/ne-childrens/img/';

// Data sheets, copied as-is (EDS sheet JSON; upcoming-meetings is a multi-sheet workbook).
const DATA = ['meetings.json', 'upcoming-meetings.json'];

function rewrite(html) {
  let out = html.replace(/href="\.\/([A-Za-z-]+)\.html(#[^"]*)?"/g, (m, name, hash) => {
    const page = PAGES.find((p) => p.name === name);
    if (!page) throw new Error(`Unknown relative link ${m}`);
    return `href="${page.path}${hash || ''}"`;
  });
  // Images point at the copies uploaded to Document Authoring (same paths as on the old site).
  // Edge Delivery ingests them from there; site-relative /img/ paths are not resolved.
  out = out.replace(/https:\/\/childrens\.nebraska\.gov\/img\//g, IMG_BASE);
  const leftover = out.match(/(href|src|srcset)="\.\/[^"]*"/g);
  if (leftover) throw new Error(`Unrewritten relative refs: ${leftover.join(', ')}`);
  return out;
}

// Heading ids as Edge Delivery generates them (github-slugger style: lowercase, punctuation
// dropped, spaces to hyphens), so in-page anchors behave in the local preview as on EDS.
const ENTITIES = {
  '&amp;': '&', '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&ndash;': '–', '&mdash;': '—',
};
function slugIds(html) {
  const seen = {};
  return html.replace(/<(h[1-6]) id="[^"]*">([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, (e) => ENTITIES[e] ?? '');
    let slug = text.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-');
    if (seen[slug] !== undefined) { seen[slug] += 1; slug = `${slug}-${seen[slug]}`; } else seen[slug] = 0;
    return `<${tag} id="${slug}">${inner}</${tag}>`;
  });
}

function headMeta(doc, attr, key) {
  const re = new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`);
  const m = doc.match(re);
  return m ? m[1] : null;
}

function metadataBlock(docHtml, depth) {
  const title = docHtml.match(/<title>([^<]*)<\/title>/)[1];
  // Fragment paths are written without the leading slash so they resolve both on EDS (/nav)
  // and in the local preview, which serves pages under /content/. Pages in a subfolder get
  // one "../" per level so they still resolve to the site-root nav and footer.
  const up = '../'.repeat(depth);
  const rel = (v) => `${up}${v.replace(/^\//, '')}`;
  const rows = [
    ['Title', title],
    ['Description', headMeta(docHtml, 'name', 'description')],
    ['Template', headMeta(docHtml, 'name', 'template')],
    ['Layout', headMeta(docHtml, 'name', 'layout')],
    ['Theme', headMeta(docHtml, 'name', 'theme')],
    ['BrandSlug', headMeta(docHtml, 'name', 'brandslug')],
    ['CopyrightSlug', headMeta(docHtml, 'name', 'copyrightslug')],
    ['Nav', rel(headMeta(docHtml, 'name', 'nav'))],
    ['Footer', rel(headMeta(docHtml, 'name', 'footer'))],
  ].filter(([, v]) => v);
  const cells = rows.map(([k, v]) => `<div><div>${k}</div><div>${v}</div></div>`).join('');
  return `<div><div class="metadata">${cells}</div></div>\n`;
}

function write(rel, data) {
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, data);
  console.log(`content/${rel}`);
}

const sheet = (data) => `${JSON.stringify({
  total: data.length, offset: 0, limit: data.length, data, ':type': 'sheet',
}, null, 2)}\n`;

PAGES.forEach((p) => {
  const plain = fs.readFileSync(path.join(SRC, 'plain', `${p.name}.plain.html`), 'utf8');
  const doc = fs.readFileSync(path.join(SRC, `${p.name}.html`), 'utf8');
  const body = slugIds(rewrite(plain)).replace(/\s*$/, '\n');
  const depth = p.out.split('/').length - 1;
  write(`${p.out}.plain.html`, body + metadataBlock(doc, depth));
});

['nav', 'footer'].forEach((f) => {
  const html = fs.readFileSync(path.join(SRC, 'fragments', `${f}.plain.html`), 'utf8');
  write(`${f}.plain.html`, rewrite(html).replace(/\s*$/, '\n'));
});

ASSETS.forEach(([from, to]) => {
  const dest = path.join(OUT, to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(SRC, 'assets', from), dest);
  console.log(`content/${to}`);
});

// Corrections to the handoff data, approved by the site owner. Each must match exactly once.
const DATA_FIXES = {
  'upcoming-meetings.json': [
    // Jan 28, 2027 is in Central Standard Time; the old page said CDT.
    ['"when": "9:30 AM to 11:30 AM (CDT)"', '"when": "9:30 AM to 11:30 AM (CST)"'],
  ],
};

DATA.forEach((f) => {
  let text = fs.readFileSync(path.join(SRC, 'data', f), 'utf8');
  (DATA_FIXES[f] || []).forEach(([from, to]) => {
    const count = text.split(from).length - 1;
    if (count !== 1) throw new Error(`Data fix for ${f} matched ${count} times: ${from}`);
    text = text.replace(from, to);
  });
  write(`data/${f}`, text);
});

// Redirects sheet: old .html and mixed-case paths to the new site paths, then the meeting
// redirects from the handoff (old meeting pages to /meetings and /meetings/upcoming).
const redirects = [
  ['/index.html', '/'],
  ['/publications.html', '/publications'],
  ['/Legislative.html', '/legislative'],
  ['/Legislative', '/legislative'],
  ['/about.html', '/about'],
  ['/ActiveSubgroups.html', '/active-subgroups'],
  ['/ActiveSubgroups', '/active-subgroups'],
  // the page was first published as /activesubgroups before it was renamed
  ['/activesubgroups', '/active-subgroups'],
  // Sower's breadcrumb looks up a page's parent as "/<folder>/", so /meetings/upcoming asks
  // for /meetings/. Redirect it to the archive page so the crumb resolves instead of a 404.
  ['/meetings/', '/meetings'],
];
const csv = fs.readFileSync(path.join(SRC, 'redirects', 'meeting-redirects.csv'), 'utf8')
  .trim().split(/\r?\n/).slice(1);
csv.forEach((line) => {
  const cols = line.split(',');
  if (cols.length !== 2) throw new Error(`Bad redirect row: ${line}`);
  if (redirects.some(([s]) => s === cols[0])) throw new Error(`Duplicate redirect: ${cols[0]}`);
  redirects.push(cols);
});
write('redirects.json', sheet(redirects.map(([Source, Destination]) => ({ Source, Destination }))));

// Placeholders sheet: Sower requests /placeholders.json on every page (same keys as the Sower reference site).
write('placeholders.json', sheet([
  { Key: 'skipnav', Text: 'Skip to main content' },
  { Key: 'banner', Text: 'An official website of the State of Nebraska' },
]));
