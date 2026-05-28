# Architecture Overview

## Application

The website is a Next.js App Router application. The initial version is mostly server-rendered static content with strong SEO metadata and reusable components.

## Directories

- `src/app`: routes, layouts, and global styles
- `src/components`: reusable UI and page sections
- `src/lib`: shared utilities and structured content
- `content/blog`: future blog/insight source content
- `docs`: operating documentation
- `architecture`: technical direction
- `.github/workflows`: CI checks

## Deployment Model

GitHub is the source of truth. Vercel builds and deploys production from `main`, while Cloudflare manages DNS and domain-level controls.
