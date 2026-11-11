const fs = require('fs');
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&rsquo;|&#8217;/g, '\u2019').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const clean = (s) => dec(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dateRe = new RegExp('(' + MONTHS.join('|') + '),?\\s+(\\d{1,2}),?\\s+(\\d{4})');
const iso = (m) => `${m[3]}-${String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
const abs = (h) => { try { return new URL(dec(h).trim().replace(/ /g, '%20'), 'https://childrens.nebraska.gov/Meetings/').href; } catch (e) { return null; } };
const fname = (u) => decodeURIComponent(u.split('/').pop()).replace(/\.pdf$/i, '');
const rows = []; const names = {}; const pageIdx = [];
for (const f of fs.readdirSync('meet-html').sort()) {
  const code = f.match(/PastMeetingDocs(.+?)\d\d\.html/)[1]; const yy = f.match(/(\d\d)\.html/)[1];
  let h = fs.readFileSync('meet-html/' + f, 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  h = h.slice(h.indexOf('content-padding'), h.indexOf('<div class="footer">'));
  h = h.replace(/(<\/tr>\s*)(<td)/gi, '$1<tr>$2');
  const nm = clean((h.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]).replace(/^\d{4}\s*-\s*/, '');
  (names[code] = names[code] || {})[nm] = (names[code][nm] || 0) + 1;
  let n = 0;
  for (const tr of h.match(/<tr\b[\s\S]*?<\/tr>/gi) || []) {
    const cells = tr.split(/<td\b[^>]*>/i).slice(1).map((c) => c.replace(/<\/td>[\s\S]*$/i, '').replace(/<\/tr>[\s\S]*$/i, ''));
    if (cells.length < 2) continue;
    const dm = clean(cells[0]).match(dateRe); if (!dm) continue;
    const date = iso(dm); const note = clean(cells[0]).replace(dm[0], '').replace(/^[\s,\-\u2013]+/, '').trim();
    const docs = [];
    // agenda/minutes column
    for (const m of (cells[1] || '').matchAll(/<a\b[^>]*?href="([^"]*)"[^>]*>((?:(?!<a\b)[\s\S])*?)(?:<\/a>|(?=<a\b))/gi)) {
      const u = abs(m[1]); if (!u) continue; const t = clean(m[2]) || fname(u);
      docs.push({ type: /agenda/i.test(t) ? 'agenda' : /minutes/i.test(t) ? 'minutes' : 'handout', title: t, url: u });
    }
    // handouts column: walk tokens, switch to "additional" after a non-link heading paragraph
    let mode = 'handout';
    if (cells[2]) { const col = cells[2].replace(/<\/?(p|li|ul|ol|div|br|strong|em|b|span)\b[^>]*>/gi, '\n');
      for (const tok of col.matchAll(/<a\b[^>]*?href="([^"]*)"[^>]*>((?:(?!<a\b)[\s\S])*?)(?:<\/a>|(?=<a\b))|([^<]+)/gi)) {
        if (tok[1] !== undefined) { const t = clean(tok[2]); const u = abs(tok[1]); if (u) docs.push({ type: mode, title: t || fname(u), url: u }); }
        else if (/addit?ional|addtional/i.test(clean(tok[3] || ''))) mode = 'additional'; } }
    // a 4th column, if any, is more materials
    for (let i = 3; i < cells.length; i++) for (const m of cells[i].matchAll(/<a\b[^>]*?href="([^"]*)"[^>]*>((?:(?!<a\b)[\s\S])*?)(?:<\/a>|(?=<a\b))/gi)) { const t = clean(m[2]); const u = abs(m[1]); if (t && u) docs.push({ type: 'handout', title: t, url: u }); }
    if (!docs.length) rows.push({ code, date, type: 'none', title: '', url: '', note });
    docs.forEach((d, i) => rows.push({ code, date, ...d, note: i === 0 ? note : '' }));
    n++;
  }
  pageIdx.push({ f, code, meetings: n });
}
fs.writeFileSync('meetings-raw.json', JSON.stringify({ rows, names, pageIdx }, null, 0));
console.log('rows', rows.length, 'docs', rows.filter((r) => r.url).length, 'meetings', new Set(rows.map((r) => r.code + r.date)).size);
console.log(JSON.stringify(names, null, 1));
