# Upload and deploy this complete package

1. Back up the current repository (Code → Download ZIP), especially content.js if anyone edited it after the recovery package was prepared.
2. Extract HPCMM-complete-repair-2026-10-24.zip on your computer. Do not upload the ZIP itself. Open the extracted folder: index.html, content.js and the assets folder must be side by side.
3. Open https://github.com/hpcmm/main on branch main, at the repository root. Choose Add file → Upload files. Drag ALL extracted files and the assets folder together into the upload area. Replace matching files and commit once. Do not upload the enclosing folder. Existing unrelated repository files need not be deleted.
4. Check the resulting paths in GitHub:
   - index.html
   - content.js
   - content-loader.js
   - assets/images/cover.webp
   - assets/images/group-photo.webp
   - assets/images/team/postdoctoral-researcher.webp
   The folder is assets/images/team, not assets/team. Capitalization must match. A plain file named assets is not a folder. The supplied .nojekyll is hidden on macOS; Command+Shift+. shows it. Include it if possible; the current files also work with GitHub's default static build.
5. Open Settings → Pages → Build and deployment. Set Source to Deploy from a branch; Branch to main; folder to /(root); Save. Do not choose /docs. Do not choose GitHub Actions for this package: it contains no custom deployment workflow.
6. In Actions, open the latest pages build and deployment run for your commit and wait for a green success. Cancelled earlier runs can be superseded by a newer commit; inspect the newest run. If a run fails, open its failed job and retain the exact error.
7. Visit https://hpcmm.github.io/main/ and hard-refresh (Mac: Command+Shift+R). Check the cover, group photograph and Pedro Paiva portrait. Visit member.html?id=postdoctoral-researcher and editor.html at the same base URL.
8. Direct image checks (each should show a photograph):
   https://hpcmm.github.io/main/assets/images/cover.webp
   https://hpcmm.github.io/main/assets/images/group-photo.webp
   https://hpcmm.github.io/main/assets/images/team/postdoctoral-researcher.webp
   A 404 here means the image was not uploaded at the exact path, or the newest deployment is not yet published. The public base path is /main/; do not change image paths to /assets/… .

## Content preservation
This package uses the repository content from commit f274baf1bafe5b20a38c142a5b0c0892b3fa0eae. It includes all recovered source files and all three photographs. If the live repository has since changed, retain the newer content.js and upload any new image files it references. Blank photograph fields for the other example members are preserved.

## Diagnosis and limits
The original /mnt/data/main-main.zip and /mnt/data/HPCMM-website-fixed-2026-10-24.zip were not accessible in this desktop workspace or through the earlier chat. Recovery used the complete public Git repository instead; no claim is made of a byte comparison with those ZIPs.

Repository history shows the optimized content file referencing separate images before those image files were added. A plain file called assets was created and later deleted, and assets/team was tried before the correct assets/images/team folder. Missing files at the exact referenced paths explain the disappeared photographs. The latest recovered commit contains the three correct assets.

Public Actions results at inspection show the latest run 40097125070 succeeded; three preceding runs were cancelled. The homepage returned HTTP 200. This does not establish the cause of any earlier failed job. Earlier setup documents also incorrectly instructed selecting GitHub Actions while no custom workflow was present. The recovery instructions consistently use branch deployment.

No production repository or Pages settings were changed by this repair.
