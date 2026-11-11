const fs = require('fs'); const L = require('./lib.cjs');
const strip = (h) => L.decodeEnt(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')).replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').toLowerCase();
const words = (t) => t.match(/[a-z0-9][a-z0-9'.&\/-]*/g) || [];
const pages = { "index.html": "index.html", 'about.html': 'about.html', 'publications.html': 'publications.html', 'Legislative.html': 'Legislative.html', 'ActiveSubgroups.html': 'ActiveSubgroups.html' };
let bad = 0;
for (const f of Object.keys(pages)) {
  const srcMain = L.mainHtml(f);
  const out = fs.readFileSync('out/' + f, 'utf8');
  const outMain = out.slice(out.indexOf('<main>'), out.indexOf('</main>'));
  // word multiset diff
  const count = (ws) => ws.reduce((m, w) => (m[w] = (m[w] || 0) + 1, m), {});
  const sw = count(words(strip(srcMain))), ow = count(words(strip(outMain)));
  const missing = Object.keys(sw).filter((w) => (ow[w] || 0) < sw[w]);
  // links: source (resolved) vs output
  const sl = L.links(srcMain).map((l) => l.text.toLowerCase() + '|' + l.href);
  const ol = L.links(outMain).map((l) => l.text.toLowerCase() + '|' + l.href);
  const oset = new Set(ol);
  const lostLinks = [...new Set(sl)].filter((x) => !oset.has(x));
  const imgs = (outMain.match(/<img /g) || []).length, noAlt = (outMain.match(/<img (?![^>]*alt=)/g) || []).length;
  const h1 = (outMain.match(/<h1[ >]/g) || []).length;
  console.log(`\n== ${f}\n  source words ${words(strip(srcMain)).length}, output words ${words(strip(outMain)).length}`);
  console.log(`  source links ${new Set(sl).size}, preserved ${new Set(sl).size - lostLinks.length}, h1=${h1}, img=${imgs}, img-without-alt=${noAlt}`);
  if (missing.length) console.log('  words in source not (fully) in output:', missing.slice(0, 40).join(', '));
  if (lostLinks.length) console.log('  links not preserved:\n    ' + lostLinks.slice(0, 12).join('\n    '));
  bad += lostLinks.length;
}
