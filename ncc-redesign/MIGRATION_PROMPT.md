# Migration prompt: Nebraska Children's Commission

Migrate five pages of the Nebraska Children's Commission site (https://childrens.nebraska.gov/) onto the State of Nebraska Sower design system, using the redesigned markup in this package as the target. Then build the two meeting pages (sections below): the meeting archive, which replaces 85 old pages with one page, one custom block and one data sheet, and the upcoming-meetings page, which replaces Current Meeting Documents.

## Source pages (migrate these five)

1. https://childrens.nebraska.gov/
2. https://childrens.nebraska.gov/publications.html
3. https://childrens.nebraska.gov/Legislative.html
4. https://childrens.nebraska.gov/about.html
5. https://childrens.nebraska.gov/ActiveSubgroups.html

## Meeting archive (replaces 85 pages)

Source pages replaced: https://childrens.nebraska.gov/Meetings/PastMeetingDocs.html plus the 84 pages named `/Meetings/PastMeetingDocs<Group><YY>.html` (for example `PastMeetingDocsNCC19.html`). Do not migrate those individually.

1. Add the custom block `blocks/meeting-archive/meeting-archive.js` and `.css` from this package to the Sower-based repo's `blocks/` folder. Follow the repo's lint rules; it imports only `toClassName` from `scripts/aem.js` and `domEl` from `scripts/dom-helpers.js`.
2. Publish `data/meetings.json` as a sheet at `/data/meetings` (served as `/data/meetings.json`). Columns: group, slug, date, type, title, url, note. One row per document.
3. Create `/meetings` from `plain/meetings.plain.html`. The block is authored as one link to `/data/meetings.json`.
4. Load `redirects/meeting-redirects.csv` into the site's redirects sheet (87 rows: old URL to `/meetings?group=<slug>&year=<yyyy>`).
5. Verify: all 309 meetings and 1,809 documents are reachable; `?group=ncc&year=2019` shows 6 meetings and 88 documents; every document link opens the original PDF on childrens.nebraska.gov.

The PDFs stay where they are. This migration only moves the pages, not the files.

## Upcoming meetings (replaces Current Meeting Documents)

Source page replaced: https://childrens.nebraska.gov/Meetings/CurrentMeetingDocs.html. New path `/meetings/upcoming`.

1. Add the custom block `blocks/upcoming-meetings/upcoming-meetings.js` and `.css` to the repo's `blocks/` folder (it imports only `domEl` from `scripts/dom-helpers.js`).
2. Publish `data/upcoming-meetings.json` as a **multi-sheet** workbook at `/data/upcoming-meetings` with two sheets named `meetings` and `documents` (columns are in `README.md`).
3. Create `/meetings/upcoming` from `plain/meetings-upcoming.plain.html`. The block is authored as one link to `/data/upcoming-meetings.json`.
4. The redirect `/Meetings/CurrentMeetingDocs.html` to `/meetings/upcoming` is already in `redirects/meeting-redirects.csv`.
5. Verify: meetings that have not ended appear under Upcoming, meetings that ended in the last 60 days under Recently held, and the Add to calendar link downloads a valid .ics. One agenda link from the old page was deliberately left out (see `README.md`); do not add it back.

## Link paths

Links between these pages are relative in the files. Map them with `pathMapping` in `manifest.json` (for example `./meetings.html` is `/meetings`).

## Target

- Design system: Sower, https://github.com/OCIOStateOfNebraska/stateofnebraska-aem (USWDS-based Edge Delivery Services blocks, authored in Document Authoring). Reference site: https://main--stateofnebraska-aem--ociostateofnebraska.aem.page/
- Theme: `default` (teal and gold).
- Do not edit `scripts/aem.js` in the Sower repo.

## What is in this package

- `manifest.json`: maps each source URL to its redesigned file, template, layout and authoring file. Start here.
- `plain/*.plain.html`: the authoring source. Each file is the `<main>` content only: one `<div>` per section, blocks as `<div class="block-name">` with row and cell divs. Use these as the content to create in DA.
- `*.html`: the same pages as full documents (head metadata, header, main, footer) for reference and visual checking.
- `fragments/nav.plain.html` and `fragments/footer.plain.html`: the global header nav and footer.
- `previews/*.png`: desktop renders. Match these.
- `README.md`: block map and content decisions. Read before starting.
- `src/`: captured copies of the five source pages.

## Page-level settings

| File | template | layout |
|---|---|---|
| index.html | homepage | none |
| publications.html | default | in-page-nav |
| Legislative.html | default | in-page-nav |
| about.html | default | in-page-nav |
| ActiveSubgroups.html | default | none |

Set `template`, `layout`, `theme`, `brandslug` ("Nebraska Children's Commission"), `copyrightslug` ("State of Nebraska"), `nav` and `footer` as page metadata, as the `<head>` of each file shows.

## Blocks used

meeting-archive (custom, only on /meetings), upcoming-meetings (custom, only on /meetings/upcoming), hero-homepage (built automatically from the first section on the homepage), hero and breadcrumb (automatic on interior pages), alert, info-card-grid, table (`col-header` variant on Publications and About, standard on Legislative), summary-box, in-page-navigation (from the `in-page-nav` layout), plus the header, footer-navigation and banner blocks.

## Rules

1. Content is fixed. Keep all wording, links and PDF URLs exactly as in `plain/*.plain.html`. Do not rewrite, summarize or reorder. The text was parsed from the source pages, not retyped.
2. Do not copy the `<script>` in each page's `<head>`. It is a standalone-preview shim, not content. It also holds the import map and fetch overrides used only for preview.
3. Ignore the `data-section`, `data-intent` and `data-layout` attributes on section divs. Keep them if harmless, drop them if the authoring tool strips them.
4. Keep file names and paths the same as the live site (`/`, `/publications`, `/Legislative`, `/about`, `/ActiveSubgroups`) so existing URLs keep working. Set up redirects from the `.html` paths if the new platform drops the extension.
5. Links between these five pages are relative (`./about.html`). Rewrite them to the final site paths. All other links point to the live site (`https://childrens.nebraska.gov/...`) because those pages are not part of this migration. Leave them as they are.
6. Images are referenced from the live site (https://childrens.nebraska.gov/img/...). Upload them to the project's asset store and update the references. Local copies are in `assets/`. They are low resolution (300x300 card tiles, 1900x1109 crayon background); keep them and flag them for replacement.
7. Do not put a PDF link inside an `info-card-grid`. Sower switches that block into a dark icon mode. The homepage "Commission Governance and Organizational Structure" link already points to the About page for this reason.
8. Preserve alt text. The hero images are decorative on interior pages (empty alt) and described on the homepage.

## Content decisions already made (do not reverse without asking)

- Publications page H1 is "Publications and Reports". The source H1 was "Reports".
- The "107th Legislature (2021-2022)" heading is omitted. It had no bills under it in the source.
- Typo "sugroups" is corrected to "subgroups" on Active Subgroups.
- Homepage "Commission Governance and Organizational Structure" links to the About page resources list (2025 version) instead of a 2019 PDF.
- New interface text: homepage "About the Commission" button, table column headings (Year, Report, Reports, Bill, What it did), "home" in the header link, footer column titles.

## Out of scope

Committee and workgroup pages, news and bills of interest, contact, member resources and archived subgroups are not migrated. The nav and footer link to them on the live site.

## Done means

- Each of the five pages renders on the Sower design system and matches `previews/`.
- Header nav and footer render from the fragments. The Subgroups menu has 11 links and should render as a two-column dropdown.
- Every link, PDF URL and word from the source appears on the migrated page (except the changes listed above).
- No console errors, no broken images, one H1 per page, in-page navigation lists every H2 on Publications, Legislative and About.
- Report anything you could not do or had to change.
