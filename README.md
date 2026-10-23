# HPC-MM homepage mockup

A responsive academic homepage for High Performance Computing in Molecular Modeling. HPC-MM is provisional. All example people, publications, software and news are explicitly labeled. Research themes and mission copy are proposals, not verified claims.

## Preview
Open `index.html` directly in a browser. No installation, build, external font, or network connection is required. Alternatively serve this directory with any static web server.

## Edit
- `index.html`: all visible text, sections, publications, people, software and news. Search for the section IDs `about`, `research`, `publications`, `people`, `software`, `news`.
- `styles.css`: colors and maximum page width are in `:root` at the beginning. Typography uses local Helvetica Neue/Arial. Responsive breakpoints are 1000px and 760px.
- `script.js`: mobile navigation and publication filters.
- The hero now contains a neutral placeholder for a PNG supplied by the group.
- `favicon.svg`: provisional molecular identity mark.

To add a publication, duplicate a `.publication` article. Use a matching `data-topic` and filter button `data-filter`. All topics displays every item. The script updates an accessible result count.

Profiles use a simple text directory. If adding real photographs, use meaningful alt text and ensure you have permission. Add verified institutional, contact, publication DOI, and repository links when available. No fake external destinations are included.

## GitHub Pages
Copy this folder's contents, including `.nojekyll`, into the root of your GitHub repository. `index.html` must be at the root, not inside an extra parent folder. In repository Settings → Pages, choose deployment from your main branch and the root folder. All asset paths are relative, so this also works under a project URL such as `https://USERNAME.github.io/REPOSITORY/`.

No GitHub account changes or repository publication have been performed as part of this deliverable.

## Accessibility and behavior
Includes semantic landmarks, skip link, keyboard focus indicators, reduced-motion support, native expandable summaries, labeled navigation, menu expanded state and live publication count. With JavaScript disabled, all publications remain visible; desktop navigation and all content remain available. To keep mobile navigation available without JavaScript, a noscript style is included.

## Before using as the real group website
Replace or remove every illustrative item; confirm the mission, themes, affiliation and abbreviation. Add real contact details. Remove the concept banner only after replacing the examples. Review desktop and mobile layouts with actual content.

## Replace the image placeholder
Add your PNG as `group-image.png` alongside `index.html`. In `index.html`, replace the `<div class="group-image-placeholder">…</div>` element with `<img src="group-image.png" alt="A description of your research image">`. Update the caption beneath it. The image scales proportionally.

## Member profiles
Each name in the People section links to a standalone HTML profile page. Edit `principal-investigator.html`, `postdoctoral-researcher.html`, `doctoral-researcher.html`, and `research-software-engineer.html` to update biographies, research interests, and papers. These pages work without JavaScript and can be bookmarked or shared individually. Links to example papers point to their entries on the homepage; replace those with verified DOI or publication links when available. To add a member, copy a profile page and add its relative link to the homepage’s `.people-grid`. Publication associations are explicitly illustrative.
