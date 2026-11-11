// Parses src/CurrentMeetingDocs.html into a multi-sheet workbook (meetings + documents) for the upcoming-meetings block.
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&rsquo;|&#8217;/g, '\u2019').replace(/&quot;/g, '"');
const clean = (s) => dec(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const GROUPS = [ // [pattern, canonical name, slug]
  [/children.?s commission/i, "Nebraska Children's Commission", 'ncc'], [/alternative response/i, 'Alternative Response Advisory Committee', 'alternative-response'],
  [/bridge to independence/i, 'Bridge to Independence Advisory Committee', 'bridge-to-independence'], [/foster care reimburs/i, 'Foster Care Reimbursement Rate Committee', 'foster-care-reimbursement-rate'],
  [/juvenile services/i, 'Juvenile Services Committee', 'juvenile-services'], [/strengthening families/i, 'Strengthening Families Act Committee', 'strengthening-families-act'],
];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dateRe = new RegExp('(' + MONTHS.join('|') + '),?\\s+(\\d{1,2}),?\\s+(\\d{4})');
const abs = (h) => new URL(dec(h).trim().replace(/ /g, '%20'), 'https://childrens.nebraska.gov/Meetings/').href;
const to24 = (h, m, ap) => { h = +h % 12; if (/p/i.test(ap)) h += 12; return String(h).padStart(2, '0') + ':' + (m || '00'); };

let html = fs.readFileSync(path.join(ROOT, 'src/CurrentMeetingDocs.html'), 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
html = html.slice(html.indexOf('content-padding'), html.indexOf('<div class="footer">'));
const intro = clean((html.match(/<h1[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/) || [, ''])[1]);
const meetings = []; const documents = []; const flags = [];
const parts = html.split(/<h4[^>]*>/).slice(1);
for (const part of parts) {
  const title = clean(part.slice(0, part.indexOf('</h4>')));
  const g = GROUPS.find((x) => x[0].test(title)); if (!g || !/<table/i.test(part)) continue;
  for (const tr of part.match(/<tr\b[\s\S]*?<\/tr>/gi) || []) {
    const cells = tr.split(/<td\b[^>]*>/i).slice(1).map((c) => c.replace(/<\/td>[\s\S]*$/i, ''));
    const dm = clean(cells[0] || '').match(dateRe); if (!dm) continue;
    const date = `${dm[3]}-${String(MONTHS.indexOf(dm[1]) + 1).padStart(2, '0')}-${String(dm[2]).padStart(2, '0')}`;
    const lines = (cells[0] || '').replace(/\s+/g, ' ').replace(/<br\s*\/?>|<\/?p\b[^>]*>/gi, '\n').split('\n').map((l) => l.trim()).filter((l) => clean(l));
    const whenLine = clean(lines.shift()); let when = whenLine.slice(whenLine.indexOf(dm[0]) + dm[0].length).replace(/^[\s,\-\u2013]+/, '').trim();
    let virtualUrl = '', virtualLabel = ''; const loc = [];
    for (const l of lines) { const a = l.match(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i); if (a) { virtualUrl = dec(a[1]); virtualLabel = clean(a[2]); } else if (clean(l).toLowerCase() !== 'and') loc.push(clean(l)); }
    // start/end from "9:00 AM to 12:00 PM" or "2:00 to 4:00 PM"
    let start = '', end = '', tz = (when.match(/\((C[SD]T)\)/) || [, ''])[1];
    const tm = when.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?\s*(?:to|-)\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
    if (tm) { const ap2 = tm[6]; const ap1 = tm[3] || ap2; start = `${date}T${to24(tm[1], tm[2], ap1)}`; end = `${date}T${to24(tm[4], tm[5], ap2)}`; }
    else flags.push('no time parsed: ' + g[2] + ' ' + date + ' [' + when + ']');
    const id = `${g[2]}-${date}`;
    meetings.push({ id, group: g[1], slug: g[2], date, start, end, when, location: loc.join('\n'), virtual_url: virtualUrl, virtual_label: virtualLabel });
    const addDoc = (type, a) => { const text = clean(a[2]); const u = abs(a[1]); const action = /<strong>/i.test(a[2]) ? 'yes' : '';
      if (!text) { flags.push(`link without text omitted (${g[2]} ${date}): ${u.split('/').slice(-3).join('/')}`); return; }
      documents.push({ meeting: id, type, title: text, url: u, action }); };
    for (const a of (cells[1] || '').matchAll(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) addDoc('agenda', a);
    for (const a of (cells[2] || '').matchAll(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) addDoc('handout', a);
  }
}
meetings.sort((a, b) => a.date.localeCompare(b.date));
const book = { ':names': ['meetings', 'documents'], ':type': 'multi-sheet', ':version': 3, meetings: { total: meetings.length, offset: 0, limit: meetings.length, data: meetings }, documents: { total: documents.length, offset: 0, limit: documents.length, data: documents } };
fs.mkdirSync(path.join(ROOT, 'out/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'out/data/upcoming-meetings.json'), JSON.stringify(book, null, 1));
fs.writeFileSync(path.join(ROOT, 'src/current-meetings-intro.txt'), intro);
console.log(meetings.map((m) => `${m.date} ${m.slug.padEnd(30)} ${m.start}->${m.end} | ${m.when} | loc=${m.location.split('\n').length}L virtual=${m.virtual_url ? 'y' : 'n'}`).join('\n'));
console.log('documents', documents.length, 'flags:', JSON.stringify(flags, null, 1));
