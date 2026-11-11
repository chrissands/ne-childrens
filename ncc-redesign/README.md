# Nebraska Children's Commission: redesign on the Sower design system

Source: https://childrens.nebraska.gov/ (captured 2026-11-11)
Design system: https://github.com/OCIOStateOfNebraska/stateofnebraska-aem (Sower, USWDS-based EDS blocks)

## Files

| Page | File | Template / layout | Blocks used |
|---|---|---|---|
| Homepage | `index.html` | `homepage` | hero-homepage (auto), alert, info-card-grid |
| Publications | `publications.html` | `default` + `in-page-nav` | hero (auto), breadcrumb (auto), in-page-navigation, summary-box, table (col-header) |
| Legislative | `Legislative.html` | `default` + `in-page-nav` | hero, in-page-navigation, table (standard) |
| About us | `about.html` | `default` + `in-page-nav` | hero, in-page-navigation, table (col-header), summary-box |
| Active subgroups | `ActiveSubgroups.html` | `default` | hero, info-card-grid (x2) |
| Meeting archive (new) | `meetings.html` | `default` | hero, meeting-archive (custom) |
| Upcoming meetings (new) | `meetings-upcoming.html` | `default` | hero, upcoming-meetings (custom) |

- `plain/*.plain.html`: just the `<main>` content (sections and blocks), in the form DA / EDS ingests. Use these as the authoring source.
- `fragments/nav.plain.html`, `fragments/footer.plain.html`: global header nav and footer (`header` and `footer-navigation` blocks).
- `previews/*.png`: desktop renders of each page.
- `assets/`: local copies of the site's images (logo, six tile photos, crayon background). The HTML references the live URLs on childrens.nebraska.gov.

File names match the live site's page names, so each can replace its original path.

## How the HTML is structured

Each `*.html` is a full EDS page: `<head>` metadata (`template`, `layout`, `theme`, `brandslug`, `nav`, `footer`), then
`<header>`, `<main>` (one `<div>` per section, blocks as `<div class="block-name">` with row/cell divs), `<footer>`.
Sections carry the stardust vocabulary (`data-section`, `data-intent`, `data-layout`) for downstream tooling. Sower ignores them.

The `<script>` in `<head>` is a PREVIEW SHIM. It lets the file render standalone by loading Sower's code from its public
preview host and serving `/nav` and `/footer` from inline copies. On `*.aem.page` / `*.aem.live` it only loads the repo's own
`/scripts` and `/styles`. Delete it when the pages live in a Sower-based repo. In the standalone preview the header search
button's icon does not load; that is an artifact of the shim.

## Content decisions to review

1. All wording, links and PDF URLs come from the source pages. They were parsed from the source and never retyped. Word and link audit: every source link is preserved except the one in item 2.
2. Homepage "Commission Governance and Organizational Structure" pointed to a 2019 PDF. It now points to the About page's resources list, which has the 01.15.2025 version. A PDF link inside `info-card-grid` also forces the block into a dark "icon" mode.
3. Publications page title: the source H1 was "Reports". It is now "Publications and Reports", the label the homepage and nav use. The strategic plan box and "Collaborative Publications" are kept as their own sections.
4. Legislative page: the "107th Legislature (2021-2022)" heading had no bills under it in the source and is omitted. Add it back if it is intentional.
5. Active Subgroups page: typo "sugroups" corrected to "subgroups".
6. New interface text only: "About the Commission" button on the homepage, table column headings (Year / Report / Reports / Bill / What it did), "home" in the header link, footer column titles.
7. Nav: parent items with dropdowns are unlinked, as Sower requires. The single-child "About Us" menu is a direct link. Subgroups has 11 links, so Sower renders it as a two-column menu.
8. Images are the source site's 300x300 stock tiles and a 1900x1109 crayon photo (the old page background). They are low resolution for cards and hero. Replace with larger assets when available.

## Not covered

Only these five pages were redesigned. The nav and footer link to the rest of childrens.nebraska.gov (meetings, committees, contact, news), which still use the old design.
Theme is Sower `default` (teal and gold). Set `<meta name="theme">` to `green` or `red` to try another.

## Rebuild

`node tools/build.cjs` regenerates everything in `out/` from `src/` (saved copies of the live pages).

## Meeting archive (new, replaces 84 pages)

`meetings.html` (target path `/meetings`) replaces `/Meetings/PastMeetingDocs.html` and the 84 per-group, per-year pages
(`/Meetings/PastMeetingDocsNCC19.html`, `...AR22.html`, and so on). One custom block, `meeting-archive`, reads one data sheet and lets
visitors filter by group and year, search document titles, and open any agenda, minutes or handout.

| Piece | File |
|---|---|
| Page | `meetings.html`, `plain/meetings.plain.html` |
| Block | `blocks/meeting-archive/meeting-archive.js` and `.css` (follows Sower block conventions; copy into the repo's `blocks/`) |
| Data | `data/meetings.json`: EDS sheet, 1,810 rows (one per document), 309 meetings, 9 groups, 2012 to 2026. Columns: `group, slug, date, type, title, url, note`. Publish it as a sheet at `/data/meetings` so it is served as `/data/meetings.json` |
| Redirects | `redirects/meeting-redirects.csv`: 86 rows, old URL to `/meetings?group=<slug>&year=<yyyy>`. Load into the site's redirects sheet |
| Builders | `tools/meetings/scrape-meetings.cjs` (source pages to rows), `tools/build-meetings.cjs` (rows to sheet and redirects) |

Authoring the block is one link: `/data/meetings.json` in a `meeting-archive` block. Adding a meeting is adding rows to the sheet.
Supported URL parameters: `group`, `year`, `q`.

Data decisions to review:
- Renamed committees are merged: "Juvenile Services (OJS) Committee" (2012-2018) and "Juvenile Services Committee (JSC)" (2019 on) are one group; "Strengthening Families Act Taskforce/Committee" pages are one group. "Normalcy Task Force" stays separate.
- Document names and PDF URLs are exactly as on the old pages. Document types: agenda and minutes (the two links in the old second column), handout, additional (items under an "Additional Materials" label).
- Every document link on the 84 pages was captured. Two exceptions are not rows: one stray empty link outside any table on the 2019 JSC page, and 13 exact duplicate links within the same meeting.
- Typo fixed in the group name: "Reimbursment" is "Reimbursement".
- New interface text: page intro, filter labels, "Clear filters", "Show more meetings", "Meeting handouts", "Additional materials".
- Links on the five earlier pages that pointed at Past Meeting Documents now point to `/meetings`.
- Dates in the sheet are ISO (`YYYY-MM-DD`); the block formats them for display.
- The block's filter and search run in the browser on the whole sheet (about 0.5 MB). That is fine at this size. If the archive grows past a few thousand meetings, move to a paged query.

## Upcoming meetings (new, replaces Current Meeting Documents)

`meetings-upcoming.html` (target path `/meetings/upcoming`) replaces `/Meetings/CurrentMeetingDocs.html`. The old page was a hand-edited stack of
tables, and it had gone stale: three of its six meetings (Oct 5, 6 and 27, 2026) had already happened. The new page is driven by a workbook and
sorts itself by date.

| Piece | File |
|---|---|
| Page | `meetings-upcoming.html`, `plain/meetings-upcoming.plain.html` |
| Block | `blocks/upcoming-meetings/` (`.js`, `.css`) |
| Data | `data/upcoming-meetings.json`: EDS multi-sheet workbook. Publish as `/data/upcoming-meetings`. Sheet `meetings`: id, group, slug, date, start, end, when, location, virtual_url, virtual_label. Sheet `documents`: meeting (the id), type (agenda or handout), title, url, action (yes = shown in bold) |
| Builder | `tools/build-upcoming.cjs` |
| Redirect | `/Meetings/CurrentMeetingDocs.html` to `/meetings/upcoming` (in `redirects/meeting-redirects.csv`) |

Behavior: meetings that have not ended show under "Upcoming meetings" (each with an Add to calendar file). Meetings that ended in the last 60 days show under
"Recently held", so their documents stay reachable until they are added to the archive sheet. After 60 days they drop off. If nothing is upcoming, the page says so and links to the archive.
Staff update the page by editing rows in the workbook; no page edits.

Data decisions to review:
- The source row for the Nov 17, 2026 Commission meeting has an agenda link with no link text that points to an **Alternative Response** agenda dated 09.17.2026. It looks like a mistake, so it is omitted. Confirm.
- Group names follow the archive (for example "Bridge to Independence Advisory Committee"; the old page said "Subcommittee" and misspelled "Reimbursemsent").
- Times, locations and Teams links are exactly as on the old page. The "and" between a room and a Teams link is not shown; the Teams link sits on its own line. Start and end times (used for sorting and the calendar file) were parsed from the displayed time; the calendar file uses the America/Chicago time zone.
- The old intro paragraph is kept word for word. New interface text: "Upcoming meetings", "Recently held", "Meeting handouts" (this was a column heading on the old page), "Add to calendar".

## Path mapping for links

Links between pages in these files are relative. Final paths: `./index.html` is `/`, `./about.html` is `/about`, `./publications.html` is `/publications`, `./Legislative.html` is `/Legislative`,
`./ActiveSubgroups.html` is `/ActiveSubgroups`, `./meetings.html` is `/meetings`, `./meetings-upcoming.html` is `/meetings/upcoming`. The same mapping is in `manifest.json` under `pathMapping`.
