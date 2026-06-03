# Deployment

## Recommended Hosting

Use Cloudflare Pages for the Next.js application and Cloudflare DNS for the domain.

The site is configured as a static Next.js export:

```bash
npm run build
```

The generated production artifact is `out/`.

## Cloudflare Pages Setup

1. Go to Cloudflare Pages and connect the GitHub repository.
2. Select the `Northvalley-Intelligence/northvalleyintel.com` repository.
3. Configure the Pages project:
   - Framework preset: None/static site, or Next.js static export if available.
   - Production branch: `main`.
   - Build command: `npm run build`.
   - Install command: `npm ci`.
   - Build output directory: `out`.
   - Environment variable: `NODE_VERSION=22`.
4. Add GitHub Actions secrets:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN` with Cloudflare Pages write access.
5. Preview deployments are created by the `cloudflare-pages-preview` GitHub Actions job on pull requests to `main`.
6. Production deployments are created by the `cloudflare-pages-production` GitHub Actions job on pushes to `main`.
7. After the first pull request preview deployment runs, add `cloudflare-pages-preview` as a required check in GitHub branch protection for `main`.
8. Keep the existing `quality` check required for `main`.

## GitHub Branch Protection

`main` and production must stay in sync.

1. Require pull requests before merging to `main`.
2. Require the `quality` status check.
3. Require the `cloudflare-pages-preview` status check.
4. Do not allow bypassing required checks for normal feature or bug work.
5. Let Cloudflare Pages deploy production only from `main`.

Do not deploy production manually from feature branches, PR branches, local dirty worktrees, detached commits, or unmerged code.

## Cloudflare DNS Setup

1. Add `northvalleyintel.com` to Cloudflare if it is not already managed there.
2. In Cloudflare Pages, add the custom domains:
   - `northvalleyintel.com`
   - `www.northvalleyintel.com`
3. Let Cloudflare create or update the required DNS records for the Pages project.
4. In Cloudflare SSL/TLS, use Full mode at minimum.

## Production Verification

After a change is merged to `main`, wait for the Cloudflare Pages production deployment to finish, then verify the live site at:

- `https://northvalleyintel.com`
- `https://www.northvalleyintel.com`

For UI and content changes, verify the rendered production page and deployed assets, not just the source code.

## Legacy Vercel Setup

Vercel was the previous hosting target. Do not deploy production from Vercel after Cloudflare Pages is live and verified.

The `vercel.json` file may remain temporarily as rollback documentation during the migration. Remove it after the Cloudflare production deployment and custom domains are verified.
