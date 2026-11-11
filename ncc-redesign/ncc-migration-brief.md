# Migration brief and page content: Nebraska Children's Commission

Migrate five pages of the Nebraska Children's Commission site (https://childrens.nebraska.gov/) onto the State of Nebraska Sower design system, using the redesigned markup in this file as the target. Then build the two meeting pages (sections below): the meeting archive, which replaces 85 old pages with one page, one custom block and one data sheet, and the upcoming-meetings page, which replaces Current Meeting Documents.

## Source pages (migrate these five)

1. https://childrens.nebraska.gov/
2. https://childrens.nebraska.gov/publications.html
3. https://childrens.nebraska.gov/Legislative.html
4. https://childrens.nebraska.gov/about.html
5. https://childrens.nebraska.gov/ActiveSubgroups.html

## Meeting archive (replaces 85 pages)

Source pages replaced: https://childrens.nebraska.gov/Meetings/PastMeetingDocs.html plus the 84 pages named `/Meetings/PastMeetingDocs<Group><YY>.html` (for example `PastMeetingDocsNCC19.html`). Do not migrate those individually.

1. Add the custom block (code at the end of this file) to the Sower-based repo's `blocks/` folder. Follow the repo's lint rules; it imports only `toClassName` from `scripts/aem.js` and `domEl` from `scripts/dom-helpers.js`.
2. Publish ncc-redesign/data/meetings.json from the repo as a sheet at `/data/meetings` (served as `/data/meetings.json`). Columns: group, slug, date, type, title, url, note. One row per document.
3. Create `/meetings` from `plain/meetings.plain.html`. The block is authored as one link to `/data/meetings.json`.
4. Load ncc-redesign/redirects/meeting-redirects.csv from the repo into the site's redirects sheet (87 rows: old URL to `/meetings?group=<slug>&year=<yyyy>`).
5. Verify: all 309 meetings and 1,809 documents are reachable; `?group=ncc&year=2019` shows 6 meetings and 88 documents; every document link opens the original PDF on childrens.nebraska.gov.

The PDFs stay where they are. This migration only moves the pages, not the files.

## Upcoming meetings (replaces Current Meeting Documents)

Source page replaced: https://childrens.nebraska.gov/Meetings/CurrentMeetingDocs.html. New path `/meetings/upcoming`.

1. Add the custom block (code at the end of this file) to the repo's `blocks/` folder (it imports only `domEl` from `scripts/dom-helpers.js`).
2. Publish ncc-redesign/data/upcoming-meetings.json from the repo as a **multi-sheet** workbook at `/data/upcoming-meetings` with two sheets named `meetings` and `documents` (columns are in `README.md`).
3. Create `/meetings/upcoming` from `plain/meetings-upcoming.plain.html`. The block is authored as one link to `/data/upcoming-meetings.json`.
4. The redirect `/Meetings/CurrentMeetingDocs.html` to `/meetings/upcoming` is already in `redirects/meeting-redirects.csv`.
5. Verify: meetings that have not ended appear under Upcoming, meetings that ended in the last 60 days under Recently held, and the Add to calendar link downloads a valid .ics. One agenda link from the old page was deliberately left out (see `README.md`); do not add it back.

## Link paths

Links between these pages are relative in the files. Map them with `pathMapping` in `manifest.json` (for example `./meetings.html` is `/meetings`).

## Target

- Design system: Sower, https://github.com/OCIOStateOfNebraska/stateofnebraska-aem (USWDS-based Edge Delivery Services blocks, authored in Document Authoring). Reference site: https://main--stateofnebraska-aem--ociostateofnebraska.aem.page/
- Theme: `default` (teal and gold).
- Do not edit `scripts/aem.js` in the Sower repo.

## What this file contains

This brief, then the authoring markup for each page, the shared nav and footer, and the code of the two custom blocks. The data sheets (meetings.json about 0.5 MB, upcoming-meetings.json) and the redirect list are in the repo under ncc-redesign/data/ and ncc-redesign/redirects/; they are too large to inline. README.md and manifest.json in the same folder have the data column definitions and the link path mapping.

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
6. Images are referenced from the live site (https://childrens.nebraska.gov/img/...). Upload them to the project's asset store and update the references. They are low resolution (300x300 card tiles, 1900x1109 crayon background); keep them and flag them for replacement.
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

- Each page renders on the Sower design system and follows the markup below (teal and gold Sower default theme, wave hero, card grids, tables).
- Header nav and footer render from the fragments. The Subgroups menu has 11 links and should render as a two-column dropdown.
- Every link, PDF URL and word from the source appears on the migrated page (except the changes listed above).
- No console errors, no broken images, one H1 per page, in-page navigation lists every H2 on Publications, Legislative and About.
- Report anything you could not do or had to change.


---

# Page content

## index.html

Source URL: https://childrens.nebraska.gov/
Page metadata: template=homepage, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="hero" data-intent="establish identity and orient visitors" data-layout="full-bleed">
<h1 id="nebraska-childrens-commission">Nebraska Children's Commission</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt="Colored pencils lined up along the left and right edges of a white page"></picture></p>
<p><strong><a href="./about.html">About the Commission</a></strong></p>
</div>
<div data-section="announcement" data-intent="surface the newest reports" data-layout="contained">
<div class="alert"><div><div></div><div>2026 reports for the <a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Nebraska%20Children's%20Commission%20Report%202025-2026%20(Final).pdf">Nebraska Children's Commission</a>, <a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/Bridge%20to%20Independence%20Report%202025-2026%20(Final).pdf">Bridge to Independence Advisory Subcommittee</a>, <a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20Annual%20Report%202025-2026%20(Final).pdf">Juvenile Services Committee</a>, and <a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/Strengthening%20Families%20Act%20Report%202025-2026%20(Final).pdf">Strengthening Families Act Committee</a> are now available!</div></div></div>
</div>
<div data-section="mission" data-intent="state purpose" data-layout="contained">
<h2 id="mission-statement">Mission Statement</h2>
<p>The Nebraska Children&rsquo;s Commission is dedicated to working collaboratively with the three branches of government and among state, local, community, public and private stakeholders to enhance practices and programs to improve the safety and well-being of children and families in Nebraska.</p>
</div>
<div data-section="wayfinding" data-intent="route visitors to the six areas of the site" data-layout="grid">
<div class="info-card-grid"><div><div><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/tiles/13.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/tiles/13.jpg" alt=""></picture></div><div><h3 id="meeting-information">Meeting Information</h3><ul><li><a href="https://www.google.com/calendar/embed?src=gk9iv5edan25532tijhpat77oc%40group.calendar.google.com&amp;ctz=America/Chicago">The NCC Calendar</a></li><li><a href="https://www.nebraska.gov/calendar/index.cgi">Nebraska Public Meeting Calendar</a></li><li><a href="./meetings-upcoming.html">Current Meeting Documents</a></li><li><a href="./meetings.html">Past Meeting Documents</a></li></ul></div></div><div><div><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/tiles/22.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/tiles/22.jpg" alt=""></picture></div><div><h3 id="resources">Resources</h3><ul><li><a href="./publications.html">Publications and Reports</a></li><li><a href="./Legislative.html">Legislative</a></li><li><a href="./meetings.html">Past Meeting Documents</a></li></ul></div></div><div><div><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/tiles/20.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/tiles/20.jpg" alt=""></picture></div><div><h3 id="news-updates">News &amp; Updates</h3><ul><li><a href="https://childrens.nebraska.gov/News/BillsOfInterest.html">Bills of Interest</a></li><li><a href="https://www.google.com/calendar/embed?src=gk9iv5edan25532tijhpat77oc%40group.calendar.google.com&amp;ctz=America/Chicago">The NCC Calendar</a></li><li><a href="https://childrens.nebraska.gov/News/MembershipOpenings.html">Current Membership Openings</a></li><li><a href="./publications.html">*NEW* Annual Reports Available</a></li></ul></div></div><div><div><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/tiles/16.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/tiles/16.jpg" alt=""></picture></div><div><h3 id="subgroups">Subgroups</h3><ul><li><a href="https://childrens.nebraska.gov/Committees/ARCommittee.html">Alternative Response (AR) Advisory Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/B2ICommittee.html">Bridge to Independence (B2i) Advisory Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/FCRateCommittee.html">Foster Care Reimbursement Rate Committee (FCRRC)</a></li><li><a href="https://childrens.nebraska.gov/Committees/JuvenileServicesCommittee.html">Juvenile Services (OJS) Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/PsychotropicMedicationCommittee.html">Psychotropic Medication Committee</a></li><li><a href="https://childrens.nebraska.gov/Taskforces/NormalcyTaskForce.html">Strengthening Families Act (SFA) Committee</a></li><li><a href="./ActiveSubgroups.html">See All</a></li></ul></div></div><div><div><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/tiles/21.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/tiles/21.jpg" alt=""></picture></div><div><h3 id="archived-subgroups">Archived Subgroups</h3><ul><li><a href="#">Past Subgroups of the B2i Advisory Committee</a></li><li><a href="https://childrens.nebraska.gov/Workgroups/DTARWorkgroup.html">Data, Technology, Accountability, and Reporting Workgroup</a></li><li><a href="https://childrens.nebraska.gov/Committees/FosterCareRateCommittee2012.html">Foster Care Reimbursement Rate Committee (2012) and Subgroups</a></li><li><a href="https://childrens.nebraska.gov/Committees/FosterCareRateCommittee2012.html">Past Subgroups of the Foster Care Reimbursement Rate Committee (Current)</a></li><li><a href="https://childrens.nebraska.gov/Taskforces/StructureTaskforce.html">Structure Taskforce</a></li><li><a href="https://childrens.nebraska.gov/Committees/IVEDemoProjectCommittee2012.html">Title IV-E Demonstration Project Committee and Subgroups</a></li><li><a href="https://childrens.nebraska.gov/ArchivedSubgroups.html">See All</a></li></ul></div></div><div><div><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/tiles/17.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/tiles/17.jpg" alt=""></picture></div><div><h3 id="member-information">Member Information</h3><ul><li><a href="https://www.google.com/calendar/embed?src=gk9iv5edan25532tijhpat77oc%40group.calendar.google.com&amp;ctz=America/Chicago">The NCC Calendar</a></li><li><a href="https://childrens.nebraska.gov/News/MembershipOpenings.html">Current Membership Openings</a></li><li><a href="./about.html#nebraska-childrens-commission-resources">Commission Governance and Organizational Structure</a></li><li><a href="#">New Member Orientation Manual</a></li><li><a href="https://childrens.nebraska.gov/MemberResources.html">See All Member Resources</a></li></ul></div></div></div>
</div>
```

## publications.html

Source URL: https://childrens.nebraska.gov/publications.html
Page metadata: template=default, layout=in-page-nav, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="page-header" data-intent="title the page" data-layout="full-bleed">
<h1 id="publications-and-reports">Publications and Reports</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt=""></picture></p>
</div>
<div data-section="current-plan" data-intent="put the live strategic plan first" data-layout="contained">
<h2 id="current-strategic-plan">Current Strategic Plan</h2>
<div class="summary-box"><div><div><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NE%20CC%20Strategic%20Plan%20Final.pdf">Nebraska Children's Commission Strategic Plan</a></li></ul></div></div></div>
</div>
<div data-section="commission-reports" data-intent="list annual reports by year" data-layout="contained">
<h2 id="nebraska-children-s-commission-reports">Nebraska Children's Commission Reports</h2>
<div class="table col-header"><div><div><table><tbody><tr><td>Year</td><td>Report</td></tr><tr><td>2026</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Nebraska%20Children's%20Commission%20Report%202025-2026%20(Final).pdf">Nebraska Children's Commission 2026 Annual Report</a></td></tr><tr><td>2025</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Nebraska%20Children's%20Commission%20Report%202024-2025%20(Final).pdf">Nebraska Children's Commission 2025 Annual Report</a></td></tr><tr><td>2024</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/2023-2024%20NCC%20Annual%20Report%20(Final)%2008.30.2024.pdf">Nebraska Children's Commission 2024 Annual Report</a></td></tr><tr><td>2023</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202022-2023%20(1).pdf">Nebraska Children's Commission 2023 Annual Report</a></td></tr><tr><td>2022</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202021-2022%20(Final).pdf">Nebraska Children's Commission 2022 Annual Report</a></td></tr><tr><td>2021</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202020-2021%20Final.pdf">Nebraska Children's Commission 2021 Annual Report</a></td></tr><tr><td>2020</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202019-2020%20FINAL.pdf">Nebraska Children's Commission 2020 Annual Report</a></td></tr><tr><td>2019</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202019%20Annual%20Report%20(Final).pdf">Nebraska Children's Commission 2019 Annual Report</a></td></tr><tr><td>2018</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202018%20Annual%20Report%20&amp;%20Strategic%20Plan%20(Final).pdf">Nebraska Children's Commission 2018 Annual Report &amp; Strategic Plan</a></td></tr><tr><td>2017</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202017%20Annual%20Report%20(Final).pdf">Nebraska Children's Commission 2017 Annual Report</a></td></tr><tr><td>2016</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%20(Final)%2011.15.2016.pdf">Nebraska Children's Comission 2016 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Strategic%20Plan%20(Final)%2011.15.2016.pdf">Nebraska Children's Commission Strategic Plan (2016)</a></li></ul></td></tr><tr><td>2015</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202015%20Annual%20Report%20Packet%20(Final).pdf">Nebraska Children's Commission 2015 Annual Report</a></td></tr><tr><td>2013</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Phase%20I%20Strategic%20Plan.pdf">Nebraska Children's Commission Phase I Strategic Plan</a></td></tr></tbody></table></div></div></div>
</div>
<div data-section="subgroup-reports" data-intent="list committee reports by year" data-layout="contained">
<h2 id="commission-subgroup-reports">Commission Subgroup Reports</h2>
<div class="table col-header"><div><div><table><tbody><tr><td>Year</td><td>Reports</td></tr><tr><td>2026</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/Bridge%20to%20Independence%20Report%202025-2026%20(Final).pdf">Bridge to Independence Advisory Committee 2026 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20Annual%20Report%202025-2026%20(Final).pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2026 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/Strengthening%20Families%20Act%20Report%202025-2026%20(Final).pdf">Strengthening Families Act Committee 2026 Annual Report</a></li></ul></td></tr><tr><td>2025</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/Bridge%20to%20Independence%20Report%202024-2025%20(Final).pdf">Bridge to Independence Advisory Committee 2025 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20&amp;%20NCJJ%20Joint%20Annual%20Report%202024-2025%20(Final).pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2025 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/Strengthening%20Families%20Act%20Report%202024-2025%20(Final).pdf">Strengthening Families Act Committee 2025 Annual Report</a></li></ul></td></tr><tr><td>2024</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/Bridge%20to%20Independence%20Report%202023-2024%20(Final)%2008.30.2024.pdf">Bridge to Independence Advisory Committee 2024 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/FCRRC/Foster%20Care%20Reimbursement%20Rate%20Committee%202024%20Report%20(Final)%2006.26.2024).pdf">Foster Care Reimbursement Rates Committee 2024 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20&amp;%20NCJJ%20Joint%20Annual%20Report%202023-2024%20(Final)%2008.30.2024.pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2024 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/2023-2024%20Strengthening%20Families%20Act%20Committee%20Annual%20Report%20(Final)%2008.30.2024.pdf">Strengthening Families Act Committee 2024 Annual Report</a></li></ul></td></tr><tr><td>2023</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/Bridge%20to%20Independence%20Report%202022-2023%20(2).pdf">Bridge to Independence Advisory Committee 2023 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20&amp;%20NCJJ%20Report%202022-2023.pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2023 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/Strengthening%20Families%20Act%20Committee%20Annual%20Report%202022-2023.pdf">Strengthening Families Act Committee 2023 Annual Report</a></li></ul></td></tr><tr><td>2022</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/2021-2022%20B2i%20Annual%20Report%20(Final).pdf">Bridge to Independence Advisory Committee 2022 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20and%20NCJJ%20Joint%20Annual%20Report%2021-22%20(Final).pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2022 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/2021-2022%20NSFA%20Committee%20Annual%20Report%20(Final).pdf">Strengthening Families Act Committee 2022 Annual Report</a></li></ul></td></tr><tr><td>2021</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/2020-2021%20B2i%20Annual%20Report%20(Final).pdf">Bridge to Independence Advisory Committee 2021 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20and%20NCJJ%20Joint%20Annual%20Report%2020-21%20(Final)%202021.pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2021 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/2020-2021%20NSFA%20Committee%20Annual%20Report%20(Final).pdf">Strengthening Families Act Committee 2021 Annual Report</a></li></ul></td></tr><tr><td>2020</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/2019-2020%20B2i%20Annual%20Report%20(Final).pdf">Bridge to Independence Advisory Committee 2020 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/FCRRC/FCRRC%202020%20Legislative%20Report%20Final%20Electronic%20Version%2006.17.2020.pdf">Foster Care Reimbursement Rates Committee 2020 Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20and%20NCJJ%20Joint%20Annual%20Report%202020%20(Final).pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2020 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/2019-2020%20NSFA%20Committee%20Annual%20Report%20(Final).pdf">Strengthening Families Act Committee 2020 Annual Report</a></li></ul></td></tr><tr><td>2019</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%20Advisory%20Committee%20Report%20(Final)%202019.pdf">Bridge to Independence Advisory Committee 2019 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20and%20NCJJ%20Joint%20Annual%20Report%20(Final)%202019.pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2019 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/SFA%20Committee%202019%20Report%20(Final).pdf">Strengthening Families Act Committee 2019 Annual Report</a></li></ul></td></tr><tr><td>2018</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%20Advisory%20Committee%20Report%20(Final)%202018.pdf">Bridge to Independence Advisory Committee 2018 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/JSC%20and%20NCJJ%20Joint%20Annual%20Report%20(Final)%202018.pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2018 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/SFA%20Committee%202018%20Report%20(Final).pdf">Strengthening Families Act Committee 2018 Annual Report</a></li></ul></td></tr><tr><td>2017</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%20Advisory%20Committee%20Report%20(Final)%202017.pdf">Bridge to Independence Advisory Committee 2017 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/OJS%20Committee%20and%20NCJJ%20Joint%202017%20Report%20(Final).pdf">Juvenile Services Committee and Nebraska Coalition for Juvenile Justice Joint 2017 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/SFA%20Committee%202017%20Report%20(Final).pdf">Strengthening Families Act Committee 2017 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/APPLA%202017%20Report%20(Final).pdf">APPLA Subcommittee Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/Grievance%20Subcommittee%20Report%2002.01.2017.pdf">Grievance Subcommittee Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/SFA/Trafficking%20Report%20(Final)%202017.pdf">Trafficking Subcommittee Report</a></li></ul></td></tr><tr><td>2016</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%202016%20Annual%20Report%20(Final)%2011.15.2016.pdf">Bridge to Independence Advisory Committee 2016 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/COCWB/COCWB%20Workgroup%20Report%20(Final)%2011.15.2016.pdf">Community Ownership of Child Well-Being Workgroup Report (2016)</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/DTAR/DTAR%20Report%2003.15.2016.pdf">Data, Technology, Accountability, and Reporting Workgroup Report (2016)</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/FCRRC/FCRRC%20Report%20(Final)%202016.pdf">Foster Care Reimbursement Rate Committee Report (2016)</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/2016/Juvenile%20Services%20Committee%20Report%20(Final)%2011.15.2016.pdf">Juvenile Services Committee 2016 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NTF/NTF%202016%20Annual%20Report%20(Final)%2011.15.2016.pdf">Normalcy Task Force 2016 Annual Report</a></li></ul></td></tr><tr><td>2015</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%20Advisory%20Committee%20Report%20(Final)%202015.pdf">Bridge to Independence Advisory Committee 2015 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/COCWB/COCWB%20Workgroup%20Report%2005.19.2015.pdf">Community Ownership of Child Well-Being Workgroup 2015 Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/FCRRC/FCRRC%20GHR%20Report%202015.pdf">Foster Care Reimbursement Rate Committee: Group Home Rate Recommendations (2015)</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/OJS%20Report%20(Final)%202015.pdf">Juvenile Services Committee 2015 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/Lead%20Agency%20Recommendations%20(Final)%202015.pdf">Lead Agency Taskforce 2015 Report</a></li></ul></td></tr><tr><td>2014</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%20Advisory%20Committee%20Report%20(Final)%202014.pdf">Bridge to Independence Advisory Committee 2014 Annual Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/FCRRC/FCRRC%20Report%202014.pdf">Foster Care Reimbursement Rate Committee 2014 Report</a></li></ul></td></tr><tr><td>2013</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/B2i%20Advisory%20Committee%20Report%20(Final)%202013.pdf">Bridge to Independence Advisory Committee 2013 Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/OJS/Juvenile%20Services%20(OJS)%20Committee%20Phase%20I%20Strategic%20Recommendations%2012.2013.pdf">Juvenile Services Committee Phase I Strategic Recommendations</a></li></ul></td></tr><tr><td>2012</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/FCRRC/FCRRC%20LB%20820%20Report%202012.pdf">Foster Care Reimbursement Rate Committee 2012 Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/IV-E%20LB%20820%20Final%20Report.pdf">IV-E Demonstration Project Committee Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/Meds/2012%20Meds%20Report.pdf">Psychotropic Medication Committee Report</a></li></ul></td></tr></tbody></table></div></div></div>
</div>
<div data-section="collaborative" data-intent="surface publications made with partners" data-layout="contained">
<h2 id="collaborative-publications">Collaborative Publications</h2>
<ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/Nebraska%20Child%20Welfare%20Financing%20Primer%20-%20Copy.pdf">2015 Nebraska Child Welfare Financing Primer</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NE%20Blueprint%20Report%2003.2017%20-%20Copy.pdf">2017 Nebraska Child Welfare Blueprint Report</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/B2I/NEb2i_ChildTrends_November2019.pdf">Nebraska Bridge to Independence Extended Foster Care Evaluation 2019</a></li></ul>
</div>
```

## Legislative.html

Source URL: https://childrens.nebraska.gov/Legislative.html
Page metadata: template=default, layout=in-page-nav, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="page-header" data-intent="title the page" data-layout="full-bleed">
<h1 id="legislative">Legislative</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt=""></picture></p>
</div>
<div data-section="intro" data-intent="say what the list is" data-layout="contained">
<p>Legislation that is key to the strategic planning processes for the Nebraska Children's Commission and its various workgroups and committees are listed below.</p>
</div>
<div data-section="legislature-109th" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="109th-legislature-2025-2026">109th Legislature (2025-2026)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://nebraskalegislature.gov/bills/view_bill.php?DocumentID=62754&amp;docnum=LB741&amp;leg=109">LB741</a></td><td>Added an additional Commission membership role from the Nebraska Commission on African American Affairs</td></tr><tr><td><a href="https://nebraskalegislature.gov/bills/view_bill.php?DocumentID=63117&amp;docnum=LB751&amp;leg=109">LB751</a></td><td>A bill requiring the Nebraska State Patrol to conduct a study to determine how to increase state criminal justice protective and investigative resources for reporting and identifying missing Black women and children in Nebraska.</td></tr><tr><td><a href="https://nebraskalegislature.gov/bills/view_bill.php?DocumentID=62854&amp;docnum=LB962&amp;leg=109">LB962</a></td><td>Created the Youth Reentry and Transitional Support Act to ensure continuity of care and case management from intake through twelve months after a has exited or transitioned from a group home, residential treatment program, or probation supervision.</td></tr><tr><td><a href="https://nebraskalegislature.gov/bills/view_bill.php?DocumentID=63152&amp;docnum=LB1032&amp;leg=109">LB1032</a></td><td>Provides for recognition and enforcement of tribal customary adoptions under the Nebraska Indian Child Welfare Act and related laws.</td></tr></tbody></table></div></div></div>
</div>
<div data-section="legislature-108th" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="108th-legislature-2023-2024">108th Legislature (2023-2024)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://nebraskalegislature.gov/bills/view_bill.php?DocumentID=49873">LB14</a></td><td>Changed provisions under the Young Adult Bridge to Independence Act. Probation youth that meet eligibility criteria can now participate in Nebraska&rsquo;s Bridge to Independence program for young adults aging out of care to begin January 1, 2025.</td></tr><tr><td><a href="https://nebraskalegislature.gov/bills/view_bill.php?DocumentID=54153">LR241</a></td><td>Interim study to examine the sufficiency of current provider rates and cost and needed frequency of rebasing provider rates for child welfare service providers. The Nebraska Children&rsquo;s Commission currently makes recommendations on the rates to foster parents and the agencies who support them.</td></tr></tbody></table></div></div></div>
</div>
<div data-section="legislature-106th" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="106th-legislature-2019-2020">106th Legislature (2019-2020)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/106/PDF/Slip/LB600.pdf">LB600</a></td><td>Passed in 2019 and eliminated the sunset date, extending the Nebraska Children’s Commission permanently. LB600 also changed provisions for the B2i program and case management for juvenile services.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/106/PDF/Slip/LB848.pdf">LB848</a></td><td>Changed eligibility for the Bridge to Independence program to include youth aging out of the tribal court system at age 18.The eligibility expansion takes effect July 1, 2021.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/106/PDF/Slip/LB1061.pdf">LB1061</a></td><td>Eliminated the sunset date for the Alternative Response pilot program and created additional provisions for the Alternative Response program. LB1061 also created an Alternative Response Advisory Committee under the Nebraska Children’s Commission.</td></tr></tbody></table></div></div></div>
</div>
<div data-section="legislature-105th" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="105th-legislature-2017-2018">105th Legislature (2017-2018)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/105/PDF/Intro/LR451.pdf">LR451</a></td><td>Interim study to examine the work of the Nebraska Children's Commission and to evaluate the need for the commission's continuation and any revisions to its structure and purpose <a href="https://childrens.nebraska.gov/PDFs/Legislation/LR451%20Summary%20and%20Findings%20(Final).pdf">LR451 Summary and Findings</a></td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/105/PDF/Slip/LB732.pdf">LB732</a></td><td>Change reporting dates for the Nebraska Children's Commission and committees appointed by the commission</td></tr></tbody></table></div></div></div>
</div>
<div data-section="legislature-104th" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="104th-legislature-2015-2016">104th Legislature (2015-2016)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://www.nebraskalegislature.gov/FloorDocs/104/PDF/Final/LB87.pdf">LB87</a></td><td>Added an additional Commission membership role and altered reporting requirements.</td></tr><tr><td><a href="https://www.nebraskalegislature.gov/FloorDocs/104/PDF/Final/LB243.pdf">LB243</a></td><td>Provided additional duties for the Nebraska Children's Commission and the Bridge to Independence Advisory Committee.</td></tr><tr><td><a href="https://www.nebraskalegislature.gov/FloorDocs/104/PDF/Final/LB746.pdf">LB746</a></td><td>Adopted the Nebraska Strengthening Families Act, changed provisions for guardians ad litem and services for children, created the Normalcy Task Force, and extended the sunset date of the Commission until June 30, 2019.</td></tr></tbody></table></div></div></div>
</div>
<div data-section="legislature-103rd" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="103rd-legislature-2013-2014">103rd Legislature (2013-2014)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://childrens.nebraska.gov/PDFs/Legislation/103rdLegislature/LB216/LB216.pdf">LB216</a></td><td>Adopt the Young Adult Voluntary Services and Support Act.</td></tr><tr><td><a href="https://childrens.nebraska.gov/PDFs/Legislation/103rdLegislature/LB216/LB216A.pdf">LB216A</a></td><td>Appropriation Bill</td></tr><tr><td><a href="https://www.nebraskalegislature.gov/FloorDocs/103/PDF/Final/LB269.pdf">LB269</a></td><td>Revised various child welfare related statutes including provisions related to the Nebraska Children&rsquo;s Commission.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/103/PDF/Slip/LB530.pdf">LB530</a></td><td>Implemented portions of the strategic recommendations of the Foster Care Reimbursement Rate Committee, and extended the sunset date of the Commission until June 30, 2016.</td></tr><tr><td><a href="https://www.nebraskalegislature.gov/FloorDocs/103/PDF/Final/LB561.pdf">LB561</a></td><td>Changed the juvenile justice system and revised the duties of the Juvenile Services (OJS) committee of the Nebraska Children&rsquo;s Commission.</td></tr><tr><td><a href="http://www.legislature.ne.gov/FloorDocs/103/PDF/Final/LB853.pdf">LB853</a></td><td>Changed and renamed the Young Adult Voluntary Services and Support Act and Advisory Committee to the Bridge to Independence Act/Advisory Committee</td></tr></tbody></table></div></div></div>
</div>
<div data-section="legislature-102nd" data-intent="list the bills that shaped the Commission" data-layout="contained">
<h2 id="102nd-legislature-2011-2012">102nd Legislature (2011-2012)</h2>
<div class="table"><div><div><table><tbody><tr><td>Bill</td><td>What it did</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB820.pdf">LB820</a></td><td>Created the Title IV-E Demonstration Project Committee and the Foster Care Reimbursement Rate Committee, provide a temporary foster care stipend, and change foster care licensure requirements.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB820A.pdf">LB820A</a></td><td>Appropriation Bill.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB821.pdf">LB821</a></td><td>Create the Nebraska Children&rsquo;s Commission and adopt the Office of Inspector General of Nebraska Child Welfare Act.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB821A.pdf">LB821A</a></td><td>Appropriation Bill.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB949.pdf">LB949</a></td><td>Require reports and a strategic plan by the Division of Children and Family Services of the Department of Health and Human Services.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB949A.pdf">LB949A</a></td><td>Appropriation Bill.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB961.pdf">LB961</a></td><td>Changed provisions relating to reform of case management of child welfare services and designation of service areas.</td></tr><tr><td><a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB1160.pdf">LB1160</a></td><td>Required development of an information system for child welfare data and set requirements for reporting of collected data.</td></tr></tbody></table></div></div></div>
</div>
```

## about.html

Source URL: https://childrens.nebraska.gov/about.html
Page metadata: template=default, layout=in-page-nav, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="page-header" data-intent="title the page" data-layout="full-bleed">
<h1 id="about-the-nebraska-childrens-commission">About the Nebraska Children's Commission</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt=""></picture></p>
</div>
<div data-section="origin-and-charge" data-intent="explain why the Commission exists and how it meets" data-layout="contained">
<p>The Nebraska Children&rsquo;s Commission was created as a result of <a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Intro/LR37.pdf">LR37</a>, an <a href="https://nebraskalegislature.gov/reports/health.php">investigation</a> by the Health and Human Services Committee that identified a number of gaps in the service delivery model for children and families.&nbsp; One of the LR&rsquo;s many significant findings was that a lack of clear vision and overarching planning for the provision of services for children has created a fragmented system.&nbsp; To remedy this problem, the legislature created the Nebraska Children&rsquo;s Commission.</p>
<p>The Nebraska Children&rsquo;s Commission was created in 2012 by the Nebraska State Legislature to provide a permanent leadership forum for the collaboration for child welfare and juvenile justice reform among the three branches of government and public and private stakeholders at the state, regional, and community levels.</p>
<p>The Commission meets regularly to work on the many issues and assignments that were part of the original charge to the Commission as provided by <a href="https://nebraskalegislature.gov/FloorDocs/102/PDF/Slip/LB821.pdf">LB821</a>, additional responsibilities added by legislation, and strategic priorities identified by the Commission. Past meeting materials can be found on our <a href="./meetings.html">Past Meeting Documents</a> page. The Commission typically meets quarterly with notice posted on the <a href="https://www.nebraska.gov/calendar/index.cgi">Nebraska Public Meeting Calendar</a>. Upcoming meeting materials can be found on the <a href="./meetings-upcoming.html">Current Meeting Documents</a> page. A number of helpful resources are provided below.</p>
</div>
<div data-section="reports" data-intent="give direct access to every annual report and strategic plan" data-layout="contained">
<h2 id="commission-reports-and-recommendations">Commission Reports and Recommendations</h2>
<div class="table col-header"><div><div><table><tbody><tr><td>Year</td><td>Report</td></tr><tr><td>2026</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Nebraska%20Children's%20Commission%20Report%202025-2026%20(Final).pdf">Nebraska Children's Commission 2026 Annual Report</a></td></tr><tr><td>2025</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Nebraska%20Children's%20Commission%20Report%202024-2025%20(Final).pdf">Nebraska Children's Commission 2025 Annual Report</a></td></tr><tr><td>2024</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/2023-2024%20NCC%20Annual%20Report%20(Final)%2008.30.2024.pdf">Nebraska Children's Commission 2024 Annual Report</a></td></tr><tr><td>2023</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202022-2023%20(Final).pdf">Nebraska Children's Commission 2023 Annual Report</a></td></tr><tr><td>2022</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202021-2022%20(Final).pdf">Nebraska Children's Commission 2022 Annual Report</a></td></tr><tr><td>2021</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202020-2021%20Final.pdf">Nebraska Children's Commission 2021 Annual Report</a></td></tr><tr><td>2020</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%202019-2020%20FINAL.pdf">Nebraska Children's Commission 2020 Annual Report</a></td></tr><tr><td>2019</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202019%20Annual%20Report%20(Final).pdf">Nebraska Children's Commission 2019 Annual Report and Strategic Plan</a></td></tr><tr><td>2018</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202018%20Annual%20Report%20&amp;%20Strategic%20Plan%20(Final).pdf">Nebraska Children's Commission 2018 Annual Report and Strategic Plan</a></td></tr><tr><td>2017</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202017%20Annual%20Report%20(Final).pdf">Nebraska Children's Commission 2017 Annual Report</a></td></tr><tr><td>2016</td><td><ul><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Strategic%20Plan%20(Final)%2011.15.2016.pdf">Nebraska Children's Commission Strategic Plan</a></li><li><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%20Annual%20Report%20(Final)%2011.15.2016.pdf">Nebraska Children's Comission 2016 Annual Report</a></li></ul></td></tr><tr><td>2015</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/NCC%202015%20Annual%20Report%20Packet%20(Final).pdf">Nebraska Children's Commission 2015 Annual Report</a></td></tr><tr><td>2012</td><td><a href="https://childrens.nebraska.gov/PDFs/Reports/NCC/Phase%20I%20Strategic%20Plan.pdf">Nebraska Children's Commission Phase I Strategic Plan</a></td></tr></tbody></table></div></div></div>
</div>
<div data-section="resources" data-intent="collect governance and membership documents" data-layout="contained">
<h2 id="nebraska-children-s-commission-resources">Nebraska Children's Commission Resources</h2>
<ul><li><a href="https://childrens.nebraska.gov/PDFs/General%20Information/NCC/NCC%20Fact%20Sheet.pdf">Commission Fact Sheet</a></li><li><a href="https://childrens.nebraska.gov/PDFs/General%20Information/NCC/NCC%20Member%20Table%20(Public)%2008.2026.pdf">Membership Listing</a></li><li><a href="https://childrens.nebraska.gov/PDFs/General%20Information/NCC/Commission%20Structure%20-%20Active%20Groups%2008.2026.pdf">Commission Structure - Active Subgroups</a></li><li><a href="https://childrens.nebraska.gov/PDFs/General%20Information/NCC/Commission%20Structure%20-%20Archived.pdf">Commission Structure - Archived Subgroups</a></li><li><a href="https://childrens.nebraska.gov/PDFs/General%20Information/NCC/Governance%20and%20Organizational%20Structure%2001.15.2025.pdf">Governance and Organizational Structure</a></li></ul>
</div>
<div data-section="mailing-list" data-intent="invite people to join the mailing list" data-layout="contained">
<div class="summary-box"><div><div><p>If you wish to be added to the Nebraska Children's Commission meeting mailing list, please contact Commission staff at <a href="mailto:NECC.Contact@nebraska.gov">NECC.Contact@nebraska.gov</a> or (402) 890-6510.</p></div></div></div>
</div>
```

## ActiveSubgroups.html

Source URL: https://childrens.nebraska.gov/ActiveSubgroups.html
Page metadata: template=default, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="page-header" data-intent="title the page" data-layout="full-bleed">
<h1 id="nebraska-childrens-commission-active-subgroups">Nebraska Children's Commission Active Subgroups</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt=""></picture></p>
</div>
<div data-section="statutory" data-intent="show the groups created in statute and their workgroups" data-layout="grid">
<h2 id="statutory-subgroups">Statutory Subgroups</h2>
<p>The following Committees are active subgroups outlined in statute. Committees may establish workgroups or subcommittees to focus on specific issues.</p>
<div class="info-card-grid"><div><div><h3 id="alternative-response-advisory-committee"><a href="https://childrens.nebraska.gov/Committees/ARCommittee.html">Alternative Response Advisory Committee</a></h3><ul><li>Data Review &amp; Oversight Workgroup</li><li>Family Engagement / AR Effectiveness Workgroup</li><li>Prevention &amp; AR Intervention Continuum Workgroup</li><li>Services Evaluation Workgroup</li></ul></div></div><div><div><h3 id="juvenile-services-committee"><a href="https://childrens.nebraska.gov/Committees/JuvenileServicesCommittee.html">Juvenile Services Committee</a></h3><ul><li>Access to Services Workgroup</li><li>R/ED Workgroup</li><li>Youth Justice Continuum of Care Workgroup</li></ul></div></div><div><div><h3 id="strengthening-families-act-committee"><a href="https://childrens.nebraska.gov/Taskforces/NormalcyTaskForce.html">Strengthening Families Act Committee</a></h3><ul><li><a href="https://childrens.nebraska.gov/Subcommittees/APPLASubcommittee.html">Another Planned Permanent Living Arrangement (APPLA) Subcommittee</a></li><li><a href="https://childrens.nebraska.gov/Subcommittees/NormalcySubcommittee.html">Normalcy Subcommittee</a></li><li>Trafficking Subcommittee</li></ul></div></div></div>
</div>
<div data-section="commission-made" data-intent="show the groups the Commission created" data-layout="grid">
<h2 id="commission-made-subgroups">Commission Made Subgroups</h2>
<p>The following are subgroups that were created by the Commission to focus on statutory obligations or strategic plan goals.</p>
<div class="info-card-grid"><div><div><h3 id="bridge-to-independence-advisory-subcommittee"><a href="https://childrens.nebraska.gov/Committees/B2ICommittee.html">Bridge to Independence Advisory Subcommittee</a></h3><ul><li><a href="https://childrens.nebraska.gov/Workgroups/B2iEvaluationWorkgroup.html">Evaluation and Data Collection Workgroup</a></li><li>Special Populations Workgroup</li><li>Sustainability Workgroup</li></ul></div></div><div><div><h3 id="foster-care-reimbursement-rate-subcommittee"><a href="https://childrens.nebraska.gov/Committees/FCRateCommittee.html">Foster Care Reimbursement Rate Subcommittee</a></h3><ul><li><a href="https://childrens.nebraska.gov/Workgroups/LOCWorkgroup.html">Level of Responsibility Workgroup</a></li><li>Foster Parent Base Rate Workgroup</li><li>Agency Rate Workgroup</li></ul></div></div><div><div><h3 id="legal-parties-taskforce"><a href="https://childrens.nebraska.gov/Taskforces/LegalPartiesTaskforce.html">Legal Parties Taskforce</a></h3></div></div><div><div><h3 id="structure-taskforce">Structure Taskforce</h3></div></div><div><div><h3 id="workforce-workgroup"><a href="https://childrens.nebraska.gov/Workgroups/WorkforceWorkgroup.html">Workforce Workgroup</a></h3></div></div></div>
</div>
```

## meetings.html

Source URL: https://childrens.nebraska.gov/Meetings/PastMeetingDocs.html (and 84 per-year pages)
Page metadata: template=default, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="page-header" data-intent="title the page" data-layout="full-bleed">
<h1 id="meeting-documents">Meeting Documents</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt=""></picture></p>
</div>
<div data-section="intro" data-intent="say what the archive holds and where upcoming meetings are" data-layout="contained">
<p>Agendas, minutes, and handouts for the Nebraska Children's Commission and its committees. Choose a group and year, or search document titles.</p>
<p>Looking for an upcoming meeting? See <a href="./meetings-upcoming.html">Current Meeting Documents</a>.</p>
</div>
<div data-section="archive" data-intent="let people find any past meeting document in two steps" data-layout="stack">
<div class="meeting-archive"><div><div><p><a href="/data/meetings.json">/data/meetings.json</a></p></div></div></div>
</div>
```

## meetings-upcoming.html

Source URL: https://childrens.nebraska.gov/Meetings/CurrentMeetingDocs.html
Page metadata: template=default, theme=default, brandslug=Nebraska Children's Commission, copyrightslug=State of Nebraska, nav=/nav, footer=/footer

```html
<div data-section="page-header" data-intent="title the page" data-layout="full-bleed">
<h1 id="current-meeting-documents">Current Meeting Documents</h1>
<p><picture><source type="image/jpeg" srcset="https://childrens.nebraska.gov/img/bg-image-new.jpg" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/bg-image-new.jpg" alt=""></picture></p>
</div>
<div data-section="intro" data-intent="explain when documents appear and where the archive is" data-layout="contained">
<p>Monthly meeting documents will be posted as soon as they are available for each committee. The location and meeting time for each meeting is listed below or can be found on the <a href="https://www.nebraska.gov/calendar/index.cgi">Nebraska Public Meeting Calendar</a>. Agendas, minutes, and other meeting documents for previous months can be found at <a href="./meetings.html">Past Meeting Documents</a></p>
</div>
<div data-section="meetings" data-intent="show what is coming up with place, time and documents" data-layout="stack">
<div class="upcoming-meetings"><div><div><p><a href="/data/upcoming-meetings.json" data-archive="/meetings">/data/upcoming-meetings.json</a></p></div></div></div>
</div>
```

---

# Global fragments

## nav (header)

```html
<div><p><picture><source type="image/png" srcset="https://childrens.nebraska.gov/img/ChildrensLogo.png" media="(min-width: 600px)"><img loading="lazy" src="https://childrens.nebraska.gov/img/ChildrensLogo.png" alt="Nebraska Children's Commission logo" width="125" height="125"></picture></p><p><a href="./index.html">Nebraska Children's Commission home</a></p><p><strong>Nebraska Children's Commission</strong></p></div>
<div><ul><li><p>Meeting Info</p><ul><li><a href="https://calendar.google.com/calendar/u/0?cid=bmViY2hpbGRyZW5AZ21haWwuY29t">Calendar</a></li><li><a href="./meetings-upcoming.html">Current Meeting Documents</a></li><li><a href="./meetings.html">Past Meeting Documents</a></li></ul></li><li><p>Resources</p><ul><li><a href="./publications.html">Reports</a></li><li><a href="./Legislative.html">Legislative</a></li><li><a href="./meetings.html">Past Documents</a></li></ul></li><li><p>Subgroups</p><ul><li><a href="https://childrens.nebraska.gov/Committees/ARCommittee.html">Alternative Response (AR) Advisory Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/B2ICommittee.html">Bridge to Independence (B2i) Advisory Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/FCRateCommittee.html">Foster Care Reimbursement Rate Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/JuvenileServicesCommittee.html">Juvenile Services Committee (JSC)</a></li><li><a href="https://childrens.nebraska.gov/Committees/PsychotropicMedicationCommittee.html">Psychotropic Medication Committee</a></li><li><a href="https://childrens.nebraska.gov/Committees/SFACommittee.html">Strengthening Families Act Committee</a></li><li><a href="https://childrens.nebraska.gov/Workgroups/CommunityOwnershipWorkgroup.html">Community Ownership of Child Well Being Workgroup</a></li><li><a href="https://childrens.nebraska.gov/Taskforces/LegalPartiesTaskforce.html">Legal Parties Taskforce</a></li><li><a href="https://childrens.nebraska.gov/Workgroups/WorkforceWorkgroup.html">Workforce Workgroup</a></li><li><a href="./ActiveSubgroups.html">See All Active Groups</a></li><li><a href="https://childrens.nebraska.gov/ArchivedSubgroups.html">See All Archived Groups</a></li></ul></li><li><p><a href="./about.html">About Us</a></p></li><li><p>News</p><ul><li><a href="https://childrens.nebraska.gov/News/BillsOfInterest.html">Bills of Interest</a></li><li><a href="https://childrens.nebraska.gov/News/MembershipOpenings.html">Membership Openings</a></li></ul></li><li><p><a href="https://childrens.nebraska.gov/contact.html">Contact</a></p></li></ul></div>
<div><p><a href="https://www.nebraska.gov/search/">Search</a></p></div>
```

## footer

```html
<div><div class="footer-navigation">
<div><div><h2 id="meetings">Meetings</h2><ul><li><a href="https://calendar.google.com/calendar/u/0?cid=bmViY2hpbGRyZW5AZ21haWwuY29t">The NCC Calendar</a></li><li><a href="https://www.nebraska.gov/calendar/index.cgi">Nebraska Public Meeting Calendar</a></li><li><a href="./meetings-upcoming.html">Current Meeting Documents</a></li><li><a href="./meetings.html">Past Meeting Documents</a></li></ul></div>
<div><h2 id="resources">Resources</h2><ul><li><a href="./publications.html">Publications and Reports</a></li><li><a href="./Legislative.html">Legislative</a></li><li><a href="https://childrens.nebraska.gov/News/BillsOfInterest.html">Bills of Interest</a></li></ul></div>
<div><h2 id="subgroups">Subgroups</h2><ul><li><a href="./ActiveSubgroups.html">Active Subgroups</a></li><li><a href="https://childrens.nebraska.gov/ArchivedSubgroups.html">Archived Subgroups</a></li></ul></div>
<div><h2 id="commission">Commission</h2><ul><li><a href="./about.html">About the NCC</a></li><li><a href="https://childrens.nebraska.gov/News/MembershipOpenings.html">Membership Openings</a></li><li><a href="https://childrens.nebraska.gov/MemberResources.html">Member Resources</a></li><li><a href="https://childrens.nebraska.gov/contact.html">Contact</a></li></ul></div></div>
<div><div><p>Nebraska Children's Commission<br>1225 L Street, Suite 401<br>Lincoln NE 68508<br>Phone: (402) 890-6510<br><a href="mailto:NECC.Contact@Nebraska.gov">NECC.Contact@Nebraska.gov</a></p></div>
<div><ul><li><a href="https://www.facebook.com/nebraskachildrenscommission" title="Facebook"><span class="icon icon-facebook"></span></a></li>
<li><a href="https://www.instagram.com/nechildrenscommission" title="Instagram"><span class="icon icon-instagram"></span></a></li>
<li><a href="https://www.linkedin.com/company/nebraska-childrens-commission" title="LinkedIn"><span class="icon icon-linkedin"></span></a></li></ul></div></div>
<div><div></div></div>
<div><div><ul><li><a href="http://www.nebraska.gov">Nebraska.gov</a></li><li><a href="http://www.nebraska.gov/policies.html">Security, Privacy, Acceptable Use, &amp; Accessibility Policies</a></li></ul></div></div>
</div></div>
```

---

# Custom block: meeting-archive

## blocks/meeting-archive/meeting-archive.js

```js
import { toClassName } from '../../scripts/aem.js';
import { domEl } from '../../scripts/dom-helpers.js';

const PAGE_SIZE = 20;
const TYPE_LABEL = { agenda: 'Agenda', minutes: 'Minutes' };

/**
 * Fetches the meeting sheet (one row per document: group, slug, date, type, title, url, note).
 * @param {string} href URL authored in the block
 * @returns {Promise<Array>} sheet rows
 */
async function fetchSheet( href ) {
	const url = new URL( href, window.location.href );
	url.searchParams.set( 'limit', '10000' );
	const resp = await fetch( url );
	if ( !resp.ok ) throw new Error( `meeting-archive: ${resp.status} for ${url}` );
	const json = await resp.json();
	return json.data || [];
}

/**
 * Groups document rows into meetings, newest first.
 * @param {Array} rows sheet rows
 * @returns {Array} meetings with their documents
 */
function toMeetings( rows ) {
	const map = new Map();
	rows.forEach( ( row ) => {
		const key = `${row.group}|${row.date}`;
		if ( !map.has( key ) ) {
			map.set( key, {
				group: row.group, slug: row.slug || toClassName( row.group ), date: row.date, year: row.date.slice( 0, 4 ), note: '', docs: [],
			} );
		}
		const meeting = map.get( key );
		if ( row.note && !meeting.note ) meeting.note = row.note;
		if ( row.url ) meeting.docs.push( { type: row.type, title: row.title, url: row.url } );
	} );
	return [...map.values()].sort( ( a, b ) => b.date.localeCompare( a.date ) || a.group.localeCompare( b.group ) );
}

const formatDate = ( iso ) => new Date( `${iso}T12:00:00` ).toLocaleDateString( 'en-US', {
	year: 'numeric', month: 'long', day: 'numeric',
} );

/**
 * Builds one meeting card.
 * @param {object} meeting grouped meeting
 * @param {boolean} showGroup whether to label the committee
 * @returns {HTMLElement} list item
 */
function renderMeeting( meeting, showGroup ) {
	const primary = meeting.docs.filter( ( d ) => d.type === 'agenda' || d.type === 'minutes' );
	const handouts = meeting.docs.filter( ( d ) => d.type === 'handout' );
	const additional = meeting.docs.filter( ( d ) => d.type === 'additional' );

	const li = domEl( 'li', { class: 'meeting-archive__meeting' } );
	const head = domEl( 'div', { class: 'meeting-archive__head' },
		domEl( 'h3', { class: 'meeting-archive__date' }, domEl( 'time', { datetime: meeting.date }, formatDate( meeting.date ) ) ) );
	if ( showGroup ) head.append( domEl( 'p', { class: 'meeting-archive__group' }, meeting.group ) );
	li.append( head );
	if ( meeting.note ) li.append( domEl( 'p', { class: 'meeting-archive__note' }, meeting.note ) );

	if ( primary.length ) {
		const ul = domEl( 'ul', { class: 'meeting-archive__primary usa-list usa-list--unstyled' } );
		primary.forEach( ( d ) => {
			ul.append( domEl( 'li', {},
				domEl( 'a', {
					href: d.url,
					class: 'usa-link usa-link--pdf meeting-archive__doc',
					target: '_blank',
					'aria-label': `${TYPE_LABEL[d.type]}, ${meeting.group}, ${formatDate( meeting.date )}`,
				}, TYPE_LABEL[d.type] ) ) );
		} );
		li.append( ul );
	}

	[['Meeting handouts', handouts], ['Additional materials', additional]].forEach( ( [label, docs] ) => {
		if ( !docs.length ) return;
		const list = domEl( 'ul', { class: 'meeting-archive__materials usa-list' } );
		docs.forEach( ( d ) => list.append( domEl( 'li', {},
			domEl( 'a', { href: d.url, class: 'usa-link usa-link--pdf', target: '_blank' }, d.title ) ) ) );
		li.append( domEl( 'details', { class: 'meeting-archive__details' },
			domEl( 'summary', {}, `${label} (${docs.length})` ), list ) );
	} );

	if ( !meeting.docs.length ) li.append( domEl( 'p', { class: 'meeting-archive__empty-doc' }, 'No documents posted.' ) );
	return li;
}

function field( id, label, control ) {
	return domEl( 'div', { class: 'meeting-archive__field' }, domEl( 'label', { for: id }, label ), control );
}

/**
 * Meeting archive: filter, search and browse every meeting's documents from one data sheet.
 * Authoring: a single link to the sheet (e.g. /data/meetings.json). Supports ?group=&year=&q=.
 * @param {HTMLElement} block The block element
 */
export default async function decorate( block ) {
	const link = block.querySelector( 'a' );
	if ( !link ) return;
	block.textContent = '';
	block.setAttribute( 'aria-busy', 'true' );

	let meetings;
	try {
		meetings = toMeetings( await fetchSheet( link.href ) );
	} catch ( e ) {
		// eslint-disable-next-line no-console
		console.error( e );
		block.append( domEl( 'p', { class: 'meeting-archive__error' }, 'Meeting documents are unavailable right now. Please try again later.' ) );
		block.removeAttribute( 'aria-busy' );
		return;
	}

	const groups = [...new Map( meetings.map( ( m ) => [m.slug, m.group] ) ).entries()].sort( ( a, b ) => a[1].localeCompare( b[1] ) );
	const params = new URLSearchParams( window.location.search );
	const state = {
		group: params.get( 'group' ) || '', year: params.get( 'year' ) || '', q: params.get( 'q' ) || '', shown: PAGE_SIZE,
	};

	const groupSelect = domEl( 'select', { id: 'ma-group', class: 'meeting-archive__select' }, domEl( 'option', { value: '' }, 'All groups' ),
		...groups.map( ( [slug, name] ) => domEl( 'option', { value: slug }, name ) ) );
	const yearSelect = domEl( 'select', { id: 'ma-year', class: 'meeting-archive__select' } );
	const search = domEl( 'input', {
		id: 'ma-q', class: 'meeting-archive__input', type: 'search', autocomplete: 'off', placeholder: 'Agenda, minutes, report title',
	} );
	const reset = domEl( 'button', { type: 'button', class: 'usa-button usa-button--outline meeting-archive__reset' }, 'Clear filters' );
	const form = domEl( 'form', { class: 'meeting-archive__filters', role: 'search', 'aria-label': 'Filter meeting documents' },
		field( 'ma-group', 'Group', groupSelect ), field( 'ma-year', 'Year', yearSelect ),
		field( 'ma-q', 'Search documents', search ), reset );
	const count = domEl( 'p', { class: 'meeting-archive__count', role: 'status', 'aria-live': 'polite' } );
	const list = domEl( 'ol', { class: 'meeting-archive__list' } );
	const more = domEl( 'button', { type: 'button', class: 'usa-button meeting-archive__more' }, 'Show more meetings' );
	block.append( form, count, list, domEl( 'div', { class: 'meeting-archive__footer' }, more ) );

	const matches = () => {
		const needle = state.q.trim().toLowerCase();
		return meetings.filter( ( m ) => ( !state.group || m.slug === state.group )
			&& ( !state.year || m.year === state.year )
			&& ( !needle || m.docs.some( ( d ) => d.title.toLowerCase().includes( needle ) )
				|| m.note.toLowerCase().includes( needle ) || m.group.toLowerCase().includes( needle ) ) );
	};

	const fillYears = () => {
		const years = [...new Set( meetings.filter( ( m ) => !state.group || m.slug === state.group ).map( ( m ) => m.year ) )].sort().reverse();
		if ( state.year && !years.includes( state.year ) ) state.year = '';
		yearSelect.replaceChildren( domEl( 'option', { value: '' }, 'All years' ), ...years.map( ( y ) => domEl( 'option', { value: y }, y ) ) );
		yearSelect.value = state.year;
	};

	const render = ( keepShown ) => {
		if ( !keepShown ) state.shown = PAGE_SIZE;
		const found = matches();
		const visible = found.slice( 0, state.shown );
		list.replaceChildren( ...visible.map( ( m ) => renderMeeting( m, !state.group ) ) );
		const docCount = found.reduce( ( n, m ) => n + m.docs.length, 0 );
		count.textContent = found.length
			? `${found.length} ${found.length === 1 ? 'meeting' : 'meetings'}, ${docCount} documents${found.length > visible.length ? ` (showing ${visible.length})` : ''}`
			: 'No meetings match these filters.';
		more.hidden = found.length <= visible.length;
		const next = new URLSearchParams();
		if ( state.group ) next.set( 'group', state.group );
		if ( state.year ) next.set( 'year', state.year );
		if ( state.q.trim() ) next.set( 'q', state.q.trim() );
		const qs = next.toString();
		window.history.replaceState( null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}` );
	};

	groupSelect.value = groups.some( ( [slug] ) => slug === state.group ) ? state.group : '';
	state.group = groupSelect.value;
	search.value = state.q;
	fillYears();

	groupSelect.addEventListener( 'change', () => { state.group = groupSelect.value; fillYears(); render(); } );
	yearSelect.addEventListener( 'change', () => { state.year = yearSelect.value; render(); } );
	let timer;
	search.addEventListener( 'input', () => { clearTimeout( timer ); timer = setTimeout( () => { state.q = search.value; render(); }, 200 ); } );
	form.addEventListener( 'submit', ( e ) => e.preventDefault() );
	reset.addEventListener( 'click', () => {
		Object.assign( state, { group: '', year: '', q: '' } );
		groupSelect.value = ''; search.value = ''; fillYears(); render();
	} );
	more.addEventListener( 'click', () => { state.shown += PAGE_SIZE; render( true ); } );

	render();
	block.removeAttribute( 'aria-busy' );
}
```

## blocks/meeting-archive/meeting-archive.css

```css
.meeting-archive {
	--ma-primary: var(--theme-hero-primary, #00607f);
	--ma-dark: var(--theme-card-heading, #003a4d);
	--ma-accent: var(--theme-card-accent, #ffc44d);
	--ma-surface: #fff;
	--ma-line: #dfe1e2;
}

.meeting-archive__filters {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	align-items: end;
	padding: 1.25rem;
	margin-bottom: 1rem;
	background: var(--ma-surface);
	border-top: 4px solid var(--ma-accent);
	border-radius: 0 0 .25rem .25rem;
	box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
}

@media (min-width: 880px) {
	.meeting-archive__filters {
		grid-template-columns: minmax(0, 1.4fr) minmax(0, .7fr) minmax(0, 1.4fr) auto;
	}
}

.meeting-archive__field {
	display: flex;
	flex-direction: column;
	gap: .375rem;
}

.meeting-archive__field label {
	font-weight: 700;
	font-size: .95rem;
	color: var(--ma-dark);
}

.meeting-archive .meeting-archive__select,
.meeting-archive .meeting-archive__input {
	box-sizing: border-box;
	-webkit-appearance: none;
	appearance: none;
	height: 2.75rem;
	min-height: 2.75rem;
	margin: 0;
	padding: 0 .75rem;
	font: inherit;
	color: #1b1b1b;
	background-color: #fff;
	border: 1px solid #565c65;
	border-radius: 0;
	width: 100%;
}

.meeting-archive .meeting-archive__select {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23565c65' stroke-width='2'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right .75rem center;
	padding-right: 2.25rem;
}

.meeting-archive__select:focus,
.meeting-archive__input:focus,
.meeting-archive__details summary:focus-visible,
.meeting-archive__reset:focus-visible,
.meeting-archive__more:focus-visible {
	outline: .25rem solid #2491ff;
	outline-offset: 0;
}

.meeting-archive__reset {
	margin: 0;
	height: 2.75rem;
}

.meeting-archive__count {
	margin: 1.25rem 0 .75rem;
	font-weight: 700;
	color: var(--ma-dark);
}

.meeting-archive__list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: .75rem;
}

.meeting-archive__meeting {
	margin: 0;
	padding: 1rem 1.25rem;
	background: var(--ma-surface);
	border: 1px solid var(--ma-line);
	border-left: 4px solid var(--ma-primary);
	border-radius: .25rem;
}

.meeting-archive__head {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	column-gap: 1rem;
	row-gap: .125rem;
}

.meeting-archive__date {
	margin: 0;
	font-size: 1.25rem;
	line-height: 1.3;
	color: var(--ma-dark);
}

.meeting-archive__group {
	margin: 0;
	font-size: .95rem;
	color: #565c65;
}

.meeting-archive__note {
	margin: .5rem 0 0;
	font-size: .95rem;
	font-style: italic;
}

.meeting-archive__primary {
	display: flex;
	flex-wrap: wrap;
	gap: .25rem 1.5rem;
	margin: .75rem 0 0;
	padding: 0;
}

.meeting-archive__primary li {
	margin: 0;
	font-weight: 700;
}

.meeting-archive__details {
	margin-top: .75rem;
	border-top: 1px solid var(--ma-line);
	padding-top: .5rem;
}

.meeting-archive__details summary {
	cursor: pointer;
	font-weight: 700;
	color: var(--ma-primary);
	padding: .25rem 0;
}

.meeting-archive__materials {
	margin: .5rem 0 .25rem;
	padding-left: 1.25rem;
}

.meeting-archive__materials li {
	margin: .25rem 0;
}

.meeting-archive__empty-doc {
	margin: .5rem 0 0;
	color: #565c65;
}

.meeting-archive__footer {
	margin-top: 1.25rem;
	text-align: center;
}

.meeting-archive__more[hidden] {
	display: none;
}

.meeting-archive__error {
	padding: 1rem;
	border-left: 4px solid #b50909;
	background: #f4e3db;
}

@media (prefers-reduced-motion: no-preference) {
	.meeting-archive__meeting {
		transition: box-shadow .15s ease;
	}

	.meeting-archive__meeting:hover {
		box-shadow: 0 2px 8px rgb(0 0 0 / 14%);
	}
}
```

---

# Custom block: upcoming-meetings

## blocks/upcoming-meetings/upcoming-meetings.js

```js
import { domEl } from '../../scripts/dom-helpers.js';

const RECENT_DAYS = 60;
const MONTH = ( d ) => d.toLocaleDateString( 'en-US', { month: 'short' } ).toUpperCase();

/**
 * Fetches the workbook: sheet "meetings" (one row per meeting) and sheet "documents" (one row per file).
 * @param {string} href authored link to the workbook
 * @returns {Promise<Array>} meetings with their documents attached
 */
async function fetchMeetings( href ) {
	const resp = await fetch( new URL( href, window.location.href ) );
	if ( !resp.ok ) throw new Error( `upcoming-meetings: ${resp.status} for ${href}` );
	const json = await resp.json();
	const meetings = ( json.meetings && json.meetings.data ) || [];
	const documents = ( json.documents && json.documents.data ) || [];
	return meetings.map( ( m ) => ( { ...m, docs: documents.filter( ( d ) => d.meeting === m.id ) } ) );
}

/** @returns {Date} end of the meeting (end time, else end of that day) */
const endOf = ( m ) => new Date( m.end || `${m.date}T23:59` );
const dayOf = ( m ) => new Date( `${m.date}T12:00:00` );

/**
 * Builds a downloadable calendar entry (.ics) for a meeting.
 * @param {object} m meeting
 * @returns {string} data URL
 */
function icsHref( m ) {
	const stamp = ( iso ) => {
		const s = iso.replace( /[-:]/g, '' ).slice( 0, 15 );
		return s.length === 13 ? `${s}00` : s;
	};
	const lines = [
		'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nebraska Children\'s Commission//Meetings//EN', 'BEGIN:VEVENT',
		`UID:${m.id}@childrens.nebraska.gov`, `DTSTAMP:${stamp( new Date().toISOString() )}Z`,
		`DTSTART;TZID=America/Chicago:${stamp( m.start )}`, `DTEND;TZID=America/Chicago:${stamp( m.end )}`,
		`SUMMARY:${m.group} meeting`, `LOCATION:${m.location.replace( /\n/g, ', ' )}`,
		m.virtual_url ? `DESCRIPTION:${m.virtual_label || 'Join online'}: ${m.virtual_url}` : null,
		'END:VEVENT', 'END:VCALENDAR',
	].filter( Boolean );
	return `data:text/calendar;charset=utf-8,${encodeURIComponent( lines.join( '\r\n' ) )}`;
}

function renderMeeting( m, upcoming ) {
	const day = dayOf( m );
	const agenda = m.docs.filter( ( d ) => d.type === 'agenda' );
	const handouts = m.docs.filter( ( d ) => d.type !== 'agenda' );
	const docLink = ( d, cls = 'usa-link usa-link--pdf' ) => {
		const attrs = { href: d.url, class: cls, target: '_blank' };
		if ( d.type === 'agenda' ) {
			attrs['aria-label'] = `${d.title}, ${m.group}, ${day.toLocaleDateString( 'en-US', { month: 'long', day: 'numeric', year: 'numeric' } )}`;
		}
		return domEl( 'a', attrs, d.action ? domEl( 'strong', {}, d.title ) : d.title );
	};

	const where = domEl( 'address', { class: 'upcoming-meetings__where' } );
	m.location.split( '\n' ).filter( Boolean ).forEach( ( line, i ) => {
		if ( i ) where.append( domEl( 'br' ) );
		where.append( line );
	} );

	const body = domEl( 'div', { class: 'upcoming-meetings__body' },
		domEl( 'h3', { class: 'upcoming-meetings__group' }, m.group ),
		domEl( 'p', { class: 'upcoming-meetings__when' },
			domEl( 'time', { datetime: m.start || m.date }, day.toLocaleDateString( 'en-US', {
				weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
			} ) ),
			m.when ? domEl( 'span', { class: 'upcoming-meetings__time' }, m.when ) : '' ),
		where );
	if ( m.virtual_url ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__virtual' },
			domEl( 'a', { href: m.virtual_url, class: 'usa-link usa-link--external', target: '_blank' }, m.virtual_label || 'Join online' ) ) );
	}
	if ( agenda.length ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__agenda' }, ...agenda.map( ( d ) => docLink( d, 'usa-button usa-button--outline' ) ) ) );
	}
	if ( handouts.length ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__label' }, 'Meeting handouts' ),
			domEl( 'ul', { class: 'upcoming-meetings__docs usa-list' }, ...handouts.map( ( d ) => domEl( 'li', {}, docLink( d ) ) ) ) );
	}
	if ( upcoming && m.start && m.end ) {
		body.append( domEl( 'p', { class: 'upcoming-meetings__cal' },
			domEl( 'a', { href: icsHref( m ), download: `${m.id}.ics`, class: 'usa-link' }, 'Add to calendar' ) ) );
	}
	return domEl( 'li', { class: 'upcoming-meetings__item' },
		domEl( 'div', { class: 'upcoming-meetings__badge', 'aria-hidden': 'true' },
			domEl( 'span', { class: 'upcoming-meetings__month' }, MONTH( day ) ),
			domEl( 'span', { class: 'upcoming-meetings__day' }, String( day.getDate() ) ) ),
		body );
}

function section( id, heading, items, upcoming ) {
	return domEl( 'section', { class: 'upcoming-meetings__section', 'aria-labelledby': id },
		domEl( 'h2', { id }, heading ),
		domEl( 'ol', { class: 'upcoming-meetings__list' }, ...items.map( ( m ) => renderMeeting( m, upcoming ) ) ) );
}

/**
 * Upcoming and recent meetings, with agendas and handouts, from one workbook.
 * Authoring: a single link to the workbook (e.g. /data/upcoming-meetings.json). Meetings move from
 * "Upcoming" to "Recently held" on their own, and drop off after 60 days.
 * @param {HTMLElement} block The block element
 */
export default async function decorate( block ) {
	const link = block.querySelector( 'a' );
	if ( !link ) return;
	const archive = link.dataset.archive || '/meetings';
	block.textContent = '';
	let meetings;
	try {
		meetings = await fetchMeetings( link.href );
	} catch ( e ) {
		// eslint-disable-next-line no-console
		console.error( e );
		block.append( domEl( 'p', { class: 'upcoming-meetings__error' }, 'Meeting information is unavailable right now. Please try again later.' ) );
		return;
	}
	const now = new Date();
	const cutoff = new Date( now.getTime() - RECENT_DAYS * 86400000 );
	const upcoming = meetings.filter( ( m ) => endOf( m ) >= now ).sort( ( a, b ) => a.date.localeCompare( b.date ) );
	const recent = meetings.filter( ( m ) => endOf( m ) < now && endOf( m ) >= cutoff ).sort( ( a, b ) => b.date.localeCompare( a.date ) );

	if ( upcoming.length ) block.append( section( 'um-upcoming', 'Upcoming meetings', upcoming, true ) );
	else {
		block.append( domEl( 'section', { class: 'upcoming-meetings__section' }, domEl( 'h2', {}, 'Upcoming meetings' ),
			domEl( 'p', {}, 'No meetings are scheduled right now. Earlier meetings are in the ',
				domEl( 'a', { href: archive, class: 'usa-link' }, 'meeting archive' ), '.' ) ) );
	}
	if ( recent.length ) block.append( section( 'um-recent', 'Recently held', recent, false ) );
	if ( meetings.some( ( m ) => m.docs.some( ( d ) => d.action ) ) ) {
		block.append( domEl( 'p', { class: 'upcoming-meetings__legend' }, 'Items noted in bold indicate potential action items' ) );
	}
}
```

## blocks/upcoming-meetings/upcoming-meetings.css

```css
.upcoming-meetings {
	--um-primary: var(--theme-hero-primary, #00607f);
	--um-dark: var(--theme-card-heading, #003a4d);
	--um-accent: var(--theme-card-accent, #ffc44d);
	--um-line: #dfe1e2;
}

.upcoming-meetings__section + .upcoming-meetings__section {
	margin-top: 2.5rem;
}

.upcoming-meetings__list {
	list-style: none;
	margin: 1rem 0 0;
	padding: 0;
	display: grid;
	gap: 1rem;
}

.upcoming-meetings__item {
	display: grid;
	grid-template-columns: 4.5rem minmax(0, 1fr);
	gap: 1.25rem;
	margin: 0;
	padding: 1.25rem;
	background: #fff;
	border: 1px solid var(--um-line);
	border-top: 4px solid var(--um-accent);
	border-radius: 0 0 .25rem .25rem;
	box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

.upcoming-meetings__badge {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	align-self: start;
	width: 4.5rem;
	height: 4.5rem;
	color: #fff;
	background: var(--um-primary);
	border-radius: .25rem;
	line-height: 1;
}

.upcoming-meetings__month {
	font-size: .8rem;
	font-weight: 700;
	letter-spacing: .08em;
}

.upcoming-meetings__day {
	margin-top: .25rem;
	font-size: 1.75rem;
	font-weight: 700;
}

.upcoming-meetings__body > * {
	margin-top: 0;
	margin-bottom: .75rem;
}

.upcoming-meetings__body > :last-child {
	margin-bottom: 0;
}

.upcoming-meetings__group {
	margin-bottom: .25rem;
	font-size: 1.35rem;
	color: var(--um-dark);
}

.upcoming-meetings__when {
	display: flex;
	flex-wrap: wrap;
	column-gap: .75rem;
	font-weight: 700;
}

.upcoming-meetings__time {
	font-weight: 400;
}

.upcoming-meetings__where {
	font-style: normal;
}

.upcoming-meetings__label {
	margin-bottom: .25rem;
	font-weight: 700;
	color: var(--um-dark);
}

.upcoming-meetings__docs {
	margin: 0;
	padding-left: 1.25rem;
}

.upcoming-meetings__legend {
	margin-top: 1.5rem;
	font-size: .95rem;
	font-style: italic;
}

.upcoming-meetings__error {
	padding: 1rem;
	border-left: 4px solid #b50909;
	background: #f4e3db;
}

@media (max-width: 479px) {
	.upcoming-meetings__item {
		grid-template-columns: 1fr;
	}
}
```
