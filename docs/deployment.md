# Deployment

## Recommended Hosting

Use Vercel for the Next.js application and Cloudflare for DNS.

## Vercel Setup

1. Go to Vercel and import the GitHub repository.
2. Select the `Northvalley-Intelligence/northvalleyintel.com` repository.
3. Use the detected Next.js framework settings.
4. Production branch: `main`.
5. Build command: `npm run build`.
6. Install command: `npm ci`.
7. Output settings: leave as Vercel default for Next.js.

## Cloudflare DNS Setup

1. Add `northvalleyintel.com` to Cloudflare.
2. Update the domain registrar nameservers to the Cloudflare nameservers.
3. In Vercel, add the production domain:
   - `northvalleyintel.com`
   - `www.northvalleyintel.com`
4. In Cloudflare DNS, add the records Vercel provides.
5. Keep proxy status DNS-only for Vercel records unless Vercel documentation for the domain recommends otherwise.
6. In Vercel, set the primary production domain.
7. In Cloudflare SSL/TLS, use Full mode at minimum.

## Branch Workflow

- `main`: production
- `develop`: integration
- `feature/*`: active work

Vercel will create preview deployments for pull requests.
