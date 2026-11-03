# Publishing to the public npmjs.org registry

GitHub Packages (`npm.pkg.github.com`) and the public npm registry (`registry.npmjs.org`) are separate. The repository's source version is `@firexcore/agent-orbs@0.2.0`; publishing there requires control of the `@firexcore` npmjs scope.

The publish workflow is `.github/workflows/publish-npmjs.yml`. It checks the package/version and source repository, builds, runs tests, confirms required ESM/CJS exports and upstream license notices, runs `npm pack --dry-run`, and publishes with `--access public`. For the initial 0.2.0 release, provenance is temporarily disabled in the workflow because a duplicate Sigstore transparency-log entry returned 409. It verifies public registry metadata with delayed polling before reporting success. It does not modify the GitHub Packages release.

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

**Published:** `@firexcore/agent-orbs@0.2.0` is available on the public npm registry. The independent [registry verification job](https://github.com/FireXCore/agent-orbs/actions/runs/41674994651) emitted `PUBLIC_NPMJS_VERIFIED` after npm completed indexing. The initial publish workflow returned a false failure because its original 15-second verification window was shorter than npm's metadata processing delay. The verification window is now extended to 6 minutes.

Independently verify at https://www.npmjs.com/package/@firexcore/agent-orbs and by using:

```bash
npm view @firexcore/agent-orbs@0.2.0 version --registry=https://registry.npmjs.org/
npm install @firexcore/agent-orbs@0.2.0 --registry=https://registry.npmjs.org/
```

Do not claim npmjs publication solely because GitHub CI, GitHub Packages or Vercel succeeded.

For subsequent releases, move from long-lived `NPM_TOKEN` to npm Trusted Publishing and restore provenance after confirming the Sigstore duplicate-entry issue is resolved. Token revocation should follow a tested OIDC transition.
