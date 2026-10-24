# HPC-MM performance changes (24 October 2026)

- Extracted three embedded data-URI images from `content.js` to optimised WebP assets in `assets/`.
- All 473 publication records, group details and member associations are preserved.
- Content loading now uses `cache: 'no-cache'`, allowing conditional HTTP revalidation rather than forcing an unconditional full download with `Date.now()` and `no-store`.
- Member profiles initially show five publications, with the existing Show More control adding five at a time and preserving year headings.
- Abstracts remain behind expandable `details` controls; the public site does not fetch ORCID records at visit time. ORCID importing is performed in the editor or sync utility.
- Images on the homepage below the fold are lazy-loaded; profile photos are requested eagerly and images use async decoding.

## Publishing

Upload **all files and folders inside this ZIP** to the root of the GitHub repository, replacing matching files. Preserve the `assets/` folder and its WebP images. Existing repository files should remain unless explicitly replaced. The old `content.js` editing workflow is retained: when you upload new photos through the editor they may be re-embedded in the exported content file; re-optimise them for best performance.

## Validation

This package was checked for JavaScript syntax and publication/image references. Exact LCP and production page-load improvements must be measured on the deployed GitHub Pages website; no live production benchmark is claimed.
