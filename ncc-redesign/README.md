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
