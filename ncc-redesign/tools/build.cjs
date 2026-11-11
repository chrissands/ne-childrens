const fs = require('fs'); const path = require('path');
const L = require('./lib.cjs');
const { LIVE, SOWER, src, mainHtml, links, a, tidy, rewriteLinks, tables, pic, block, sectionMeta, tableBlock, h, esc, fixHref } = L;
const OUT = path.join(L.ROOT, 'out');
const IMG = LIVE + 'img/';
const HERO = IMG + 'bg-image-new.jpg';
const BRAND = "Nebraska Children's Commission";
const THEME = process.env.NCC_THEME || 'default';

/* ---------- global fragments (nav + footer), authored in Sower format ---------- */
const navSrc = src('index.html');
function navHtml() {
  const L1 = (t, kids) => `<li><p>${t}</p><ul>${kids.map((k) => `<li>${a(k)}</li>`).join('')}</ul></li>`;
  const lk = (href, text) => ({ href: fixHref(href), text });
  const sub = [
    ['Alternative Response (AR) Advisory Committee', 'Committees/ARCommittee.html'],
    ['Bridge to Independence (B2i) Advisory Committee', 'Committees/B2ICommittee.html'],
    ['Foster Care Reimbursement Rate Committee', 'Committees/FCRateCommittee.html'],
    ['Juvenile Services Committee (JSC)', 'Committees/JuvenileServicesCommittee.html'],
    ['Psychotropic Medication Committee', 'Committees/PsychotropicMedicationCommittee.html'],
    ['Strengthening Families Act Committee', 'Committees/SFACommittee.html'],
    ['Community Ownership of Child Well Being Workgroup', 'Workgroups/CommunityOwnershipWorkgroup.html'],
    ['Legal Parties Taskforce', 'Taskforces/LegalPartiesTaskforce.html'],
    ['Workforce Workgroup', 'Workgroups/WorkforceWorkgroup.html'],
    ['See All Active Groups', 'ActiveSubgroups.html'],
    ['See All Archived Groups', 'ArchivedSubgroups.html'],
  ].map(([t, u]) => lk(u, t));
  const items = [
    L1('Meeting Info', [lk('https://calendar.google.com/calendar/u/0?cid=bmViY2hpbGRyZW5AZ21haWwuY29t', 'Calendar'),
      lk('Meetings/CurrentMeetingDocs.html', 'Current Meeting Documents'), lk('Meetings/PastMeetingDocs.html', 'Past Meeting Documents')]),
    L1('Resources', [lk('publications.html', 'Reports'), lk('Legislative.html', 'Legislative'), lk('Meetings/PastMeetingDocs.html', 'Past Documents')]),
    L1('Subgroups', sub),
    `<li><p>${a(lk('about.html', 'About Us'))}</p></li>`,
    L1('News', [lk('News/BillsOfInterest.html', 'Bills of Interest'), lk('News/MembershipOpenings.html', 'Membership Openings')]),
    `<li><p>${a(lk('contact.html', 'Contact'))}</p></li>`,
  ];
  return `<div>${pic(IMG + 'ChildrensLogo.png', BRAND + ' logo', 125, 125).replace('<picture>', '<p><picture>').replace('</picture>', '</picture></p>')}<p><a href="./index.html">${BRAND} home</a></p><p><strong>${BRAND}</strong></p></div>
<div><ul>${items.join('')}</ul></div>
<div><p><a href="https://www.nebraska.gov/search/">Search</a></p></div>`;
}
function footerHtml() {
  const col = (t, ls) => `<div><h2 id="${L.slug(t)}">${t}</h2><ul>${ls.map((l) => `<li>${a(l)}</li>`).join('')}</ul></div>`;
  const lk = (href, text) => ({ href: fixHref(href), text });
  return `<div><div class="footer-navigation">
<div>${col('Meetings', [lk('https://calendar.google.com/calendar/u/0?cid=bmViY2hpbGRyZW5AZ21haWwuY29t', 'The NCC Calendar'), lk('https://www.nebraska.gov/calendar/index.cgi', 'Nebraska Public Meeting Calendar'), lk('Meetings/CurrentMeetingDocs.html', 'Current Meeting Documents'), lk('Meetings/PastMeetingDocs.html', 'Past Meeting Documents')])}
${col('Resources', [lk('publications.html', 'Publications and Reports'), lk('Legislative.html', 'Legislative'), lk('News/BillsOfInterest.html', 'Bills of Interest')])}
${col('Subgroups', [lk('ActiveSubgroups.html', 'Active Subgroups'), lk('ArchivedSubgroups.html', 'Archived Subgroups')])}
${col('Commission', [lk('about.html', 'About the NCC'), lk('News/MembershipOpenings.html', 'Membership Openings'), lk('MemberResources.html', 'Member Resources'), lk('contact.html', 'Contact')])}</div>
<div><div><p>${BRAND}<br>1225 L Street, Suite 401<br>Lincoln NE 68508<br>Phone: (402) 890-6510<br><a href="mailto:NECC.Contact@Nebraska.gov">NECC.Contact@Nebraska.gov</a></p></div>
<div><ul><li><a href="https://www.facebook.com/nebraskachildrenscommission" title="Facebook"><span class="icon icon-facebook"></span></a></li>
<li><a href="https://www.instagram.com/nechildrenscommission" title="Instagram"><span class="icon icon-instagram"></span></a></li>
<li><a href="https://www.linkedin.com/company/nebraska-childrens-commission" title="LinkedIn"><span class="icon icon-linkedin"></span></a></li></ul></div></div>
<div><div></div></div>
<div><div><ul><li><a href="http://www.nebraska.gov">Nebraska.gov</a></li><li><a href="http://www.nebraska.gov/policies.html">Security, Privacy, Acceptable Use, &amp; Accessibility Policies</a></li></ul></div></div>
</div></div>`;
}

/* ---------- page shell ---------- */
const tplSrc = (n) => fs.readFileSync(path.join(L.ROOT, 'tools/cache/tpl-' + n + '.js'), 'utf8').replace(/from '\.\.\/\.\.\/scripts\//g, "from '" + SOWER + '/scripts/');
function shell({ file, title, description, template, layout, sections, extraMeta = '', blocks = [], data = {} }) {
  const BLK = {};
  blocks.forEach((n) => { BLK[n] = { js: fs.readFileSync(path.join(OUT, 'blocks', n, n + '.js'), 'utf8').replace(/from '\.\.\/\.\.\/scripts\//g, "from '" + SOWER + '/scripts/'), css: fs.readFileSync(path.join(OUT, 'blocks', n, n + '.css'), 'utf8') }; });
  const DATA = {}; Object.entries(data).forEach(([p, f]) => { DATA[p] = fs.readFileSync(path.join(OUT, f), 'utf8'); });
  const NAV = navHtml(); const FOOT = footerHtml();
  const j = (s) => JSON.stringify(s).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${description.replace(/"/g, '&quot;')}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
<meta name="template" content="${template}">
${layout ? `<meta name="layout" content="${layout}">\n` : ''}<meta name="theme" content="${THEME}">
<meta name="brandslug" content="${BRAND}">
<meta name="copyrightslug" content="State of Nebraska">
<meta name="nav" content="/nav">
<meta name="footer" content="/footer">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ============ PREVIEW SHIM (safe to delete when this page lives in a Sower EDS repo) ============
     Standalone preview only: loads the Sower design system code from its public preview host and
     serves /nav + /footer from the inline fragments below. On *.aem.page / *.aem.live it does nothing
     except load the repo's own /scripts and /styles. -->
<script>
(function () {
  var S = ${j(SOWER)}, onEds = /\\.aem\\.(page|live)$/.test(location.hostname);
  var TPL = { default: ${j(tplSrc('default'))}, homepage: ${j(tplSrc('homepage'))} };
  var BLK = ${j(BLK)}, DATA = ${j(DATA)};
  var FRAG = { '/nav.plain.html': ${j(NAV)}, '/footer.plain.html': ${j(FOOT)} };
  if (!onEds) {
    var of = window.fetch.bind(window);
    window.fetch = function (i, o) {
      var u = new URL(i && i.url ? i.url : String(i), location.href);
      if (u.origin === location.origin) {
        if (DATA[u.pathname]) return Promise.resolve(new Response(DATA[u.pathname], { headers: { 'content-type': 'application/json' } }));
        if (FRAG[u.pathname]) return Promise.resolve(new Response(FRAG[u.pathname], { headers: { 'content-type': 'text/html' } }));
        if (/^\\/(placeholders|query-index|[a-z-]+\\.json)/.test(u.pathname)) return of(S + u.pathname + u.search, o);
      }
      return of(i, o);
    };
  }
  if (!onEds) { var map = { imports: {} };
    Object.keys(BLK).forEach(function (n) { map.imports[S + '/blocks/' + n + '/' + n + '.js'] = URL.createObjectURL(new Blob([BLK[n].js], { type: 'text/javascript' }));
      var st = document.createElement('style'); st.textContent = BLK[n].css; document.head.appendChild(st);
      var dl = document.createElement('link'); dl.rel = 'stylesheet'; dl.href = S + '/blocks/' + n + '/' + n + '.css'; document.head.appendChild(dl); }); Object.keys(TPL).forEach(function (n) { map.imports[S + '/templates/' + n + '/' + n + '.js'] = URL.createObjectURL(new Blob([TPL[n]], { type: 'text/javascript' })); });
    var im = document.createElement('script'); im.type = 'importmap'; im.textContent = JSON.stringify(map); document.head.appendChild(im); }
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = (onEds ? '' : S) + '/styles/styles.css'; document.head.appendChild(css);
  (async function () {
    var base = onEds ? '' : S;
    await import(base + '/scripts/aem.js');
    if (!onEds) window.hlx.codeBasePath = S;
    await import(base + '/scripts/scripts.js');
  })();
})();
</script>
</head>
<body>
<header></header>
<main>
${sections.join('\n')}
</main>
<footer></footer>
</body>
</html>
`;
}
const section = (name, intent, layout, inner, meta) => `<div data-section="${name}" data-intent="${intent}" data-layout="${layout}">\n${inner}${meta ? '\n' + sectionMeta(meta) : ''}\n</div>`;

/* ---------- HOME ---------- */
function home() {
  const m = mainHtml('index.html');
  const mission = tidy(m.match(/<h1>Mission Statement<\/h1>\s*<p>([\s\S]*?)<\/p>/)[1]);
  const ann = m.match(/<center>\s*<p>([\s\S]*?)<\/p>\s*<\/center>/)[1];
  const annHtml = rewriteLinks(ann).replace(/<\/?strong>/g, '').replace(/\s+/g, ' ').trim();
  // tiles: front image + title + flip-side links
  const tiles = []; const tre = /<div class="live-tile[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?=<div class="live-tile|<\/div>\s*<\/div>)/g;
  const tileBlocks = m.split(/<div class="live-tile/).slice(1);
  const cards = tileBlocks.map((t) => {
    const title = tidy(t.match(/<span class="tile-title">([\s\S]*?)<\/span>/)[1]);
    const img = t.match(/<img src="img\/tiles\/([^"]+)"/)[1];
    const full = t.match(/<span class="full">([\s\S]*?)<\/span>/)[1];
    const ls = links(full).map((l) => /Governance and Organizational Structure/.test(l.text) ? { href: './about.html#nebraska-childrens-commission-resources', text: l.text } : l).filter((l, i, arr) => arr.findIndex((x) => x.href === l.href && x.text === l.text) === i);
    return { title, img, ls };
  });
  const cardRows = cards.map((c) => [pic(IMG + 'tiles/' + c.img, ''), `${'<h3 id="' + L.slug(c.title) + '">' + c.title + '</h3>'}<ul>${c.ls.map((l) => `<li>${a(l)}</li>`).join('')}</ul>`]);
  const secs = [
    section('hero', 'establish identity and orient visitors', 'full-bleed',
      `<h1 id="nebraska-childrens-commission">${BRAND}</h1>\n<p>${pic(HERO, 'Colored pencils lined up along the left and right edges of a white page')}</p>\n<p><strong><a href="./about.html">About the Commission</a></strong></p>`),
    section('announcement', 'surface the newest reports', 'contained', block('alert', [['', annHtml]])),
    section('mission', 'state purpose', 'contained', `${h(2, 'Mission Statement')}\n<p>${mission}</p>`),
    section('wayfinding', 'route visitors to the six areas of the site', 'grid', block('info-card-grid', cardRows)),
  ];
  return shell({ file: 'index.html', title: BRAND, description: mission.replace(/&rsquo;/g, "'"), template: 'homepage', sections: secs });
}

/* ---------- ABOUT ---------- */
function about() {
  const m = mainHtml('about.html');
  const ps = [...m.matchAll(/<p>\s*([\s\S]*?)\s*<\/p>/g)].map((x) => x[1]).filter((p) => p.replace(/&nbsp;|\s/g, '').length > 40);
  const [p1, p2, p3, contact] = ps;
  const tb = tables(m);
  const reports = []; const resources = [];
  tb.forEach((t) => {
    const hdr = t.rows[0] && t.rows[0][0].match(/<h4>\s*([\s\S]*?)\s*<\/h4>/);
    if (hdr) { const year = tidy(hdr[1]); const ls = t.rows.slice(1).flatMap((r) => links(r.join(''))); reports.push({ year, ls }); }
    else resources.push(...t.rows.flatMap((r) => links(r.join(''))));
  });
  const reportRows = reports.map((r) => [r.year, r.ls.length > 1 ? `<ul>${r.ls.map((l) => `<li>${a(l)}</li>`).join('')}</ul>` : a(r.ls[0])]);
  const secs = [
    section('page-header', 'title the page', 'full-bleed', `<h1 id="about-the-nebraska-childrens-commission">About the ${BRAND}</h1>\n<p>${pic(HERO, '')}</p>`),
    section('origin-and-charge', 'explain why the Commission exists and how it meets', 'contained',
      [p1, p2, p3].map((p) => `<p>${rewriteLinks(p).replace(/\s+/g, ' ')}</p>`).join('\n')),
    section('reports', 'give direct access to every annual report and strategic plan', 'contained',
      `${h(2, 'Commission Reports and Recommendations')}\n` + tableBlock([['Year', 'Report'], ...reportRows])),
    section('resources', 'collect governance and membership documents', 'contained',
      `${h(2, "Nebraska Children's Commission Resources")}\n<ul>${resources.map((l) => `<li>${a(l)}</li>`).join('')}</ul>`),
    section('mailing-list', 'invite people to join the mailing list', 'contained', block('summary-box', [[`<p>${rewriteLinks(contact).replace(/\s+/g, ' ')}</p>`]])),
  ];
  return shell({ file: 'about.html', title: `About the ${BRAND}`, description: tidy(p2.replace(/<[^>]+>/g, '')), template: 'default', layout: 'in-page-nav', sections: secs });
}

/* ---------- PUBLICATIONS ---------- */
function publications() {
  const m = mainHtml('publications.html');
  const split = m.indexOf('Commission Subgroup Reports');
  const tb = tables(m);
  const plan = tb[0]; const planLinks = links(plan.rows.slice(1).flat().join(''));
  const yearTable = (t) => { const hd = t.rows[0][0].match(/<h4>\s*([\s\S]*?)\s*<\/h4>/); return { year: tidy(hd[1]), ls: links(t.rows.slice(1).flat().join('')) }; };
  const isYear = (t) => /<h4>/.test(t.rows[0][0]);
  const collab = tb.filter((t) => !isYear(t) && t.start > split).flatMap((t) => links(t.rows.flat().join('')));
  const ncc = tb.slice(1).filter((t) => isYear(t) && t.start < split).map(yearTable);
  const sub = tb.slice(1).filter((t) => isYear(t) && t.start > split).map(yearTable);
  const rows = (arr) => arr.map((r) => [r.year, r.ls.length > 1 ? `<ul>${r.ls.map((l) => `<li>${a(l)}</li>`).join('')}</ul>` : a(r.ls[0])]);
  const secs = [
    section('page-header', 'title the page', 'full-bleed', `<h1 id="publications-and-reports">Publications and Reports</h1>\n<p>${pic(HERO, '')}</p>`),
    section('current-plan', 'put the live strategic plan first', 'contained',
      `${h(2, 'Current Strategic Plan')}\n` + block('summary-box', [[`<ul>${planLinks.map((l) => `<li>${a(l)}</li>`).join('')}</ul>`]])),
    section('commission-reports', 'list annual reports by year', 'contained',
      `${h(2, "Nebraska Children's Commission Reports")}\n` + tableBlock([['Year', 'Report'], ...rows(ncc)])),
    section('subgroup-reports', 'list committee reports by year', 'contained',
      `${h(2, 'Commission Subgroup Reports')}\n` + tableBlock([['Year', 'Reports'], ...rows(sub)])),
    section('collaborative', 'surface publications made with partners', 'contained',
      `${h(2, 'Collaborative Publications')}\n<ul>${collab.map((l) => `<li>${a(l)}</li>`).join('')}</ul>`),
  ];
  return shell({ file: 'publications.html', title: 'Publications and Reports', description: "Annual reports, strategic plans, and subgroup reports from the Nebraska Children's Commission, 2012 to 2026.", template: 'default', layout: 'in-page-nav', sections: secs });
}

/* ---------- LEGISLATIVE ---------- */
function legislative() {
  const m = mainHtml('Legislative.html');
  const intro = tidy(m.match(/<p>([\s\S]*?)<\/p>/)[1]);
  const parts = m.split(/<h2><u>/).slice(1);
  const leg = parts.map((p) => {
    const title = tidy(p.slice(0, p.indexOf('</u>')));
    const body = p.slice(p.indexOf('</h2>'));
    // top-level <li> only (nested summary list stays inside its parent li)
    const ul = body.match(/<ul[^>]*>([\s\S]*)<\/ul>/);
    const items = [];
    if (ul) { const inner = ul[1]; const chunks = inner.split(/<li>/).slice(1);
      let depthParent = null;
      chunks.forEach((c) => { const first = c.match(/^\s*<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>\s*([-–])?\s*([\s\S]*?)(?:<\/li>|<ul|$)/);
        if (!first) return;
        const bill = { href: fixHref(first[1]), text: tidy(first[2].replace(/<[^>]+>/g, '')), desc: tidy(first[4].replace(/<[^>]+>/g, '')) , extra: [] };
        if (/^\s*<a/.test(c) && depthParent && c.includes('Summary and Findings') && !first[4].trim()) { depthParent.extra.push({ href: bill.href, text: bill.text }); return; }
        items.push(bill); depthParent = bill; });
    }
    return { title, items };
  }).filter((x) => x.items.length);
  const secs = [
    section('page-header', 'title the page', 'full-bleed', `<h1 id="legislative">Legislative</h1>\n<p>${pic(HERO, '')}</p>`),
    section('intro', 'say what the list is', 'contained', `<p>${intro}</p>`),
    ...leg.map((l) => section('legislature-' + L.slug(l.title.split(' ')[0]), 'list the bills that shaped the Commission', 'contained',
      `${h(2, l.title)}\n` + tableBlock([['Bill', 'What it did'], ...l.items.map((b) => [`<a href="${b.href}">${b.text}</a>`, b.desc + b.extra.map((e) => ` <a href="${e.href}">${e.text}</a>`).join('')])], 'table'))),
  ];
  return shell({ file: 'Legislative.html', title: 'Legislative', description: intro.replace(/&rsquo;/g, "'"), template: 'default', layout: 'in-page-nav', sections: secs });
}

/* ---------- ACTIVE SUBGROUPS ---------- */
function subgroups() {
  const m = mainHtml('ActiveSubgroups.html');
  const statIntro = tidy(m.match(/Statutory Subgroups[\s\S]*?<p align="center">([\s\S]*?)<\/p>/)[1]).replace('sugroups', 'subgroups');
  const madeIntro = tidy(m.match(/Commission Made Subgroups[\s\S]*?<p align="center">([\s\S]*?)<\/p>/)[1]);
  const cut = m.indexOf('Commission Made Subgroups');
  const card = (t) => { const rows = t.rows.map((r) => r[0].replace(/<\/?div[^>]*>/g, '').trim());
    const head = rows[0].match(/<h4>\s*([\s\S]*?)\s*<\/h4>/)[1];
    const hl = links(head)[0]; const title = hl ? a(hl) : tidy(head.replace(/<[^>]+>/g, ''));
    const plain = tidy(head.replace(/<[^>]+>/g, ''));
    const kids = rows.slice(1).map((r) => { const l = links(r)[0]; return l ? a(l) : tidy(r.replace(/<[^>]+>/g, '')); }).filter(Boolean);
    return [`<h3 id="${L.slug(plain)}">${title}</h3>${kids.length ? `<ul>${kids.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}`]; };
  const tb = tables(m);
  const stat = tb.filter((t) => t.start < cut).map(card); const made = tb.filter((t) => t.start > cut).map(card);
  const secs = [
    section('page-header', 'title the page', 'full-bleed', `<h1 id="nebraska-childrens-commission-active-subgroups">${BRAND} Active Subgroups</h1>\n<p>${pic(HERO, '')}</p>`),
    section('statutory', 'show the groups created in statute and their workgroups', 'grid', `${h(2, 'Statutory Subgroups')}\n<p>${statIntro}</p>\n` + block('info-card-grid', stat)),
    section('commission-made', 'show the groups the Commission created', 'grid', `${h(2, 'Commission Made Subgroups')}\n<p>${madeIntro}</p>\n` + block('info-card-grid', made)),
  ];
  return shell({ file: 'ActiveSubgroups.html', title: `${BRAND} Active Subgroups`, description: `${statIntro} ${madeIntro}`.replace(/&rsquo;/g, "'"), template: 'default', sections: secs });
}

/* ---------- MEETING ARCHIVE ---------- */
function meetings() {
  const secs = [
    section('page-header', 'title the page', 'full-bleed', `<h1 id="meeting-documents">Meeting Documents</h1>\n<p>${pic(HERO, '')}</p>`),
    section('intro', 'say what the archive holds and where upcoming meetings are', 'contained',
      `<p>Agendas, minutes, and handouts for the ${BRAND} and its committees. Choose a group and year, or search document titles.</p>\n<p>Looking for an upcoming meeting? See <a href="${LIVE}Meetings/CurrentMeetingDocs.html">Current Meeting Documents</a>.</p>`),
    section('archive', 'let people find any past meeting document in two steps', 'stack',
      block('meeting-archive', [['<p><a href="/data/meetings.json">/data/meetings.json</a></p>']])),
  ];
  return shell({ file: 'meetings.html', title: 'Meeting Documents', description: 'Agendas, minutes, and handouts for the Nebraska Children\'s Commission and its committees, 2012 to 2026.', template: 'default', sections: secs, blocks: ['meeting-archive'], data: { '/data/meetings.json': 'data/meetings.json' } });
}

fs.mkdirSync(OUT, { recursive: true });
const out = { 'index.html': home(), 'about.html': about(), 'publications.html': publications(), 'Legislative.html': legislative(), 'ActiveSubgroups.html': subgroups(), 'meetings.html': meetings() };
for (const [f, html] of Object.entries(out)) fs.writeFileSync(path.join(OUT, f), html);
fs.mkdirSync(path.join(OUT, 'fragments'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'fragments', 'nav.plain.html'), navHtml());
fs.writeFileSync(path.join(OUT, 'fragments', 'footer.plain.html'), footerHtml());
console.log(Object.keys(out).map((f) => f + ' ' + out[f].length).join('\n'));
