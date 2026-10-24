# ORCID updates in this recovery package

Manual publication import is available in editor.html. The scripts/sync-orcid.cjs and root sync-orcid.cjs utilities are preserved.

There is no .github/workflows/update-orcid.yml in the recovered repository. Earlier instructions claiming a workflow was supplied were incorrect. Do not select GitHub Actions in Pages settings unless you separately install a complete Pages deployment workflow.

For this recovery use Deploy from a branch, main, /(root), as described in DEPLOYMENT.md. Weekly automatic updates require a separate workflow installation. A bot commit using GITHUB_TOKEN does not trigger branch-based Pages builds, so weekly automation must also explicitly deploy Pages. The preserved sync script alone does not install scheduling or publishing.
