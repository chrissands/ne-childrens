// Builds the meeting-archive data sheet, redirect map and stats from src/meetings-raw.json
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/meetings-raw.json'), 'utf8'));
const GROUPS = { // legacy code -> canonical group (one committee can span renamed pages)
  NCC: ["Nebraska Children's Commission", 'ncc'], AR: ['Alternative Response Advisory Committee', 'alternative-response'],
  B2I: ['Bridge to Independence Advisory Committee', 'bridge-to-independence'], FCRRC: ['Foster Care Reimbursement Rate Committee', 'foster-care-reimbursement-rate'],
  JSC: ['Juvenile Services Committee', 'juvenile-services'], OJS: ['Juvenile Services Committee', 'juvenile-services'],
  LOCSC: ['Level of Care Assessment Sub-Committee', 'level-of-care'], Meds: ['Psychotropic Medication Committee', 'psychotropic-medication'],
  SFA: ['Strengthening Families Act Committee', 'strengthening-families-act'], NTF: ['Strengthening Families Act Committee', 'strengthening-families-act'],
  Normalcy: ['Normalcy Task Force', 'normalcy-task-force'],
};
const fix = (u) => u.replace(/^http:\/\/(www\.)?childrens\.nebraska\.gov\//i, 'https://childrens.nebraska.gov/').replace(/^https:\/\/www\.childrens\.nebraska\.gov\//i, 'https://childrens.nebraska.gov/');
const seen = new Set(); const data = [];
for (const r of raw.rows) {
  const g = GROUPS[r.code]; const key = [g[0], r.date, r.url || r.type].join('|'); if (seen.has(key)) continue; seen.add(key);
  data.push({ group: g[0], slug: g[1], date: r.date, type: r.type, title: r.title, url: r.url ? fix(r.url) : '', note: r.note || '' });
}
data.sort((a, b) => a.group.localeCompare(b.group) || b.date.localeCompare(a.date) || a.type.localeCompare(b.type));
const sheet = { total: data.length, offset: 0, limit: data.length, data, ':type': 'sheet' };
fs.mkdirSync(path.join(ROOT, 'out/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'out/data/meetings.json'), JSON.stringify(sheet));
// redirects: old per-year pages -> filtered archive view; hubs -> archive
const red = ['Source,Destination', '/Meetings/PastMeetingDocs.html,/meetings', '/Meetings/PastMeetingDocs,/meetings', '/Meetings/CurrentMeetingDocs.html,/meetings/upcoming'];
for (const p of raw.pageIdx) {
  const m = p.f.match(/PastMeetingDocs(.+?)(\d\d)\.html/); const [, code, yy] = m; const g = GROUPS[code];
  const year = (parseInt(yy, 10) < 50 ? '20' : '19') + yy;
  red.push(`/Meetings/${p.f},/meetings?group=${g[1]}&year=${year}`);
}
fs.mkdirSync(path.join(ROOT, 'out/redirects'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'out/redirects/meeting-redirects.csv'), red.join('\n') + '\n');
const meetings = new Set(data.map((d) => d.group + d.date)); const docs = data.filter((d) => d.url);
const years = data.map((d) => d.date.slice(0, 4)).sort();
const byGroup = {}; data.forEach((d) => { (byGroup[d.group] = byGroup[d.group] || new Set()).add(d.date); });
console.log(JSON.stringify({ rows: data.length, docs: docs.length, meetings: meetings.size, years: [years[0], years[years.length - 1]], noDocs: data.filter((d) => !d.url).length, redirects: red.length - 1, bytes: JSON.stringify(sheet).length, groups: Object.fromEntries(Object.entries(byGroup).map(([k, v]) => [k, v.size])) }, null, 1));
