# Updating HPC-MM photographs

Photographs are independent files in GitHub, **not** embedded in `content.js`.

1. Open the GitHub repository `hpcmm/main`.
2. Choose **Add file → Upload files** and upload the photograph to `assets/images/team/` (or `assets/images/` for cover and group photographs). You can create folders when preparing files locally if GitHub's web upload interface does not support choosing a destination directly.
3. Prefer WebP, ideally less than 200–400 KB per team portrait, with descriptive lowercase filenames such as `pedro-paiva.webp`.
4. Open `editor.html` for the website (at your GitHub Pages address), choose **Group members**, and enter the relative image path, e.g. `assets/images/team/pedro-paiva.webp` in the member photograph field. Include accessible image description.
5. Download the revised `content.js` from the editor and upload it to the root of the repository, replacing the existing file.
6. Wait for GitHub Pages to deploy and hard refresh the page if needed.

The editor does not automatically upload photographs to GitHub. Image preview requires the asset to be at that exact path. Previewing a brand-new photo before deployment may show a missing image, which is expected.

Do not paste Base64 `data:image/...` strings or upload pictures using the old editor. This version intentionally takes paths instead to prevent the content file becoming enormous.
