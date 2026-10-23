# ORCID import + automatic weekly updates

## What colleagues do
1. Open editor.html, choose Group members, and add a member.
2. Paste the ORCID iD or https://orcid.org/… link in the ORCID field.
3. Click Import publications from ORCID, review the list, and click Add selected publications.
4. Weekly updates are enabled for that member after import. You can untick the automatic-updates checkbox to pause their updates.
5. Complete the name, biography and role yourself; remove the example-content checkbox when the profile is real.
6. Download content.js and upload it to GitHub as usual.

Only public works are available. ORCID entries may lack complete author lists or journal details; review imported citations. Existing citations, biographies and manually added works are preserved. Shared DOIs are deduplicated. Works without a DOI can be matched within one ORCID record but may need manual deduplication across different members.

Unchecked works stay excluded. Unchecking a linked publication or removing an imported publication also excludes it from future automatic imports. New public works are added without a review step when weekly updates are enabled. We do not automatically remove papers if ORCID stops listing them: remove unwanted papers in the editor. This avoids deletions caused by temporary ORCID problems or privacy changes.

## One-time installation in GitHub
This is a GitHub Actions workflow, not a reminder. It is supplied in this ZIP but is NOT active on your GitHub repository until installed.

1. Upload all updated website files, including orcid.js and the scripts folder, into the folder containing index.html.
2. The ZIP contains a hidden `.github/workflows/update-orcid.yml` file. It must go at the ROOT of the repository, even if your website is in a subfolder. On a Mac, Command + Shift + . shows hidden files in Finder.
   Alternatively: on GitHub choose Add file → Create new file, name it `.github/workflows/update-orcid.yml`, and paste the supplied workflow text. A visible copy is also provided separately with the download.
3. If index.html is in a subfolder, change SITE_DIRECTORY in the workflow from '.' to that repository-relative folder, e.g. 'hpcmm-website'. If index.html is at the root, leave it alone. Your public URL alone does not determine this setting.
4. The workflow defaults to the main branch. If your default branch has another name, change the push branch in the workflow accordingly. The workflow file must be on the default branch for scheduling to run.
5. Open Settings → Pages. Change Source to GitHub Actions. This workflow publishes the website directly after updating the papers; a bot's commit by itself does not trigger a branch-based Pages build.
6. Open Settings → Actions → General. If your repository policy blocks it, enable workflow read/write permissions. The workflow needs permission to update content.js and deploy Pages. No personal access token or ORCID secret is required. Branch protection may require an administrator to permit the automation or an alternative PR-based process.
7. Open Actions → Update ORCID publications and publish website → Run workflow. Verify the first run finishes successfully and the page URL is correct.

Runs every Monday at 06:17 UTC and after changes to main. This is 06:17 Lisbon time in winter and 07:17 in summer. GitHub can delay scheduled runs. You can also run it manually from Actions. There is no need to open the editor for weekly updates.

## Failure and collaboration behavior
If ORCID is unavailable, the run fails and leaves the published site/data untouched. Check the Actions run for details, then retry. If a member has an invalid ORCID, correct it in the editor. No member ORCID is prefilled in this template.

Automatic updates commit the new content back to GitHub. Refresh the editor before making a draft so you do not overwrite new imports with an older downloaded file. Avoid simultaneous editing; GitHub will reject an automation push if the branch changed during the run instead of force-overwriting it.

GitHub can disable scheduled workflows in a public repository after 60 days without repository activity. If that happens, re-enable it from Actions. Routine imports that add new papers create commits, but periods with no new publications may still require re-enabling.
