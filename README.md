# Northvalley Intelligence Website

Next.js website for Northvalley Intelligence LLC.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Cloudflare Pages deployment
- Cloudflare DNS

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

The deployment target is Cloudflare Pages. Cloudflare also manages DNS for `northvalleyintel.com`.

See [docs/deployment.md](docs/deployment.md).
