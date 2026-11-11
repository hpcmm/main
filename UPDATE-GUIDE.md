# HPC-MM research website update

This review package is based on hpcmm/main commit e08249b and preserves its seven member records and 667 publication records.

## Add the group’s selections

Open editor.html on the hosted site. To preview locally, serve the extracted folder over HTTP (for example, run python3 -m http.server 8000 in the folder, then open http://localhost:8000/editor.html).

- Research areas: one project per line in the Projects box, as Project title | 10.xxxx/example. Use the DOI assigned to the project itself. Leave the DOI blank if it is not yet available.
- Group members: set the role category if the automatic role assignment needs overriding. Enter comma-separated interest keywords and research expertise techniques. Select up to five papers from the member’s linked publications under Featured Research.
- Group information: enter former members and collaborators separately, one line per person as Name | Affiliation. Blank lists are hidden.
- Cover & group photos: add molecular images to assets/images/ and enter one line per slide as relative image path | accessible description | caption. The slideshow appears beside the homepage title. It shows a placeholder until artwork is added, and controls appear once there is a second molecular image. The existing group photograph stays in The group.
- Resources: edit existing software and resource links. The old #software anchor continues to work.
- Publications: the homepage offers the current calendar year and ten preceding years. Older records are preserved in content.js.

The FCUP and REQUIMTE logos are included locally. Sources: https://www.up.pt/fcup/ and https://www.requimte.pt/img/requimte.png.

## Publish after review

Back up the repository and check for any changes since e08249b before replacing content.js. Extract this ZIP and upload its contents to the root of hpcmm/main, including the assets folder; leave the ZIP and enclosing folder out. GitHub Pages should use Deploy from a branch → main → /(root). Wait for the Pages deployment for the new commit to succeed and then open https://hpcmm.github.io/main/.

For later content-only edits, use Download updated content.js and upload it to the root. Upload any new image files separately at their exact paths.

The three proposed research topics are included. Their project entries are awaiting project titles and DOIs.
