# Releasing

This project is distributed as `pi-provider-workbuddy-wire` on npm and can
also be installed from a Git repository.

## One-time setup

### GitHub

The upstream project remains available as `upstream`; releases are stored in
the public repository `h731428977-ux/pi-provider-workbuddy-wire`:

```powershell
git remote rename origin upstream
gh repo create h731428977-ux/pi-provider-workbuddy-wire `
  --public --source . --remote origin --push
```

Add an npm automation token with publish access as the repository secret
`NPM_TOKEN`. The publish workflow also uses GitHub OIDC to attach npm
provenance.

### npm

The package name `pi-provider-workbuddy-wire` is currently available on the
public npm registry. Log in explicitly against npmjs rather than a mirror:

```powershell
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
```

## Release checklist

1. Update the version in `package.json` and `package-lock.json`.
2. Add the same version and date to `CHANGELOG.md`.
3. Run the complete release gate:

```powershell
npm ci
npm run verify
npm pack --dry-run
```

4. Create and publish the version tag:

```powershell
git add -A
git commit -m "release: v0.3.0"
git tag v0.3.0
git push origin main
git push origin v0.3.0
```

Pushing the tag runs `.github/workflows/publish.yml`, which:

- verifies the tag matches `package.json`;
- reruns type checking, tests, build, and package validation;
- publishes the npm tarball with provenance;
- creates a GitHub Release with the tarball and `SHA256SUMS`.

## Manual publish fallback

Use this only when GitHub Actions is unavailable:

```powershell
npm run verify
New-Item -ItemType Directory -Force release | Out-Null
npm pack --ignore-scripts --pack-destination release
npm publish .\release\*.tgz --registry=https://registry.npmjs.org/ --access public
```

Verify the public package and installation:

```powershell
npm view pi-provider-workbuddy-wire version --registry=https://registry.npmjs.org/
pi install npm:pi-provider-workbuddy-wire
```

## Offline release bundle

`npm pack` produces an installable npm tarball. Pi's local-path loader expects
an unpacked directory, not a `.tgz` directly, so extract the archive first:

```powershell
New-Item -ItemType Directory -Force release\extracted | Out-Null
tar -xzf .\release\pi-provider-workbuddy-wire-0.3.0.tgz -C .\release\extracted
pi install .\release\extracted\package
```

Do not commit `.tgz` files or the `release/` directory; publish them as release
artifacts instead.
