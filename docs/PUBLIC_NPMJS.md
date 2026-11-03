# Publishing to the public npmjs.org registry

GitHub Packages (`npm.pkg.github.com`) and the public npm registry (`registry.npmjs.org`) are separate. The repository's source version is `@firexcore/agent-orbs@0.2.0`; publishing there requires control of the `@firexcore` npmjs scope.

The publish workflow is `.github/workflows/publish-npmjs.yml`. It checks the package/version and source repository, builds, runs tests, confirms required ESM/CJS exports and upstream license notices, runs `npm pack --dry-run`, and publishes with `--access public --provenance`. It verifies public registry metadata before reporting success. It does not modify the GitHub Packages release.

## Authentication

Preferred: npm **Trusted Publishing** via GitHub Actions and OpenID Connect (OIDC). Configure a trusted publisher in npmjs.com package settings with:

- Owner or organization: `FireXCore`
- Repository: `agent-orbs`
- Workflow filename: `publish-npmjs.yml`
- GitHub environment: none
- Allow direct `npm publish`

The workflow has `id-token: write`, uses GitHub-hosted runners and Node.js 24. A first public package release may require an initial authenticated publication and a matching npm account/organization; trusted publishing configuration cannot grant ownership of a new scope.

Alternative: create a short-lived granular npm publish token with required package permissions/2FA bypass according to npm account settings, and save it as the GitHub Actions repository secret `NPM_TOKEN`. **Never paste npm tokens into commits, chat messages or logs.**

Once authenticated, a push changing the workflow on `main` runs the publish automatically. Subsequent manual runs can use GitHub Actions → **Publish FireXCore Agent Orbs to public npmjs.org** → Run workflow.

## Status and verification

The GitHub Actions run must finish successfully and emit `PUBLIC_NPMJS_VERIFIED`. Independently verify at https://www.npmjs.com/package/@firexcore/agent-orbs and by using:

```bash
npm view @firexcore/agent-orbs@0.2.0 version --registry=https://registry.npmjs.org/
npm install @firexcore/agent-orbs@0.2.0 --registry=https://registry.npmjs.org/
```

Do not claim npmjs publication solely because GitHub CI, GitHub Packages or Vercel succeeded.
