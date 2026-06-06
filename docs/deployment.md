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

## Workflow Chat Configuration

The homepage workflow assistant is served by a Cloudflare Pages Function at
`/api/workflow-chat`. The static Next.js export still builds to `out/`; the
function is deployed from the repository `functions/` directory by Cloudflare
Pages.

Configure AI provider secrets in Cloudflare Pages:

- `AI_CHAT_PROVIDER_CHAIN=gemini,openrouter`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` such as `google/gemini-2.5-flash`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` such as `gemini-2.5-flash`
- Optional local testing with an OpenAI-compatible local model:
  - `AI_CHAT_PROVIDER_CHAIN=local,openrouter,gemini`
  - `LOCAL_LLM_BASE_URL=http://127.0.0.1:11434/v1/chat/completions`
  - `LOCAL_LLM_MODEL` such as `llama3.1`
- `AI_CHAT_APP_URL=https://northvalleyintel.com`
- `AI_CHAT_APP_TITLE=Northvalley Intelligence`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `CHAT_RATE_LIMIT_PER_MINUTE`, default `6`
- `CHAT_RATE_LIMIT_PER_HOUR`, default `30`

The assistant must answer only from the website context in
`src/lib/workflow-chat.ts`. If a visitor asks for details the site does not
support, the assistant should invite them to set up time to discuss and
understand more.

### Chat Notifications

Email notifications use Resend from the Cloudflare Pages Function. Configure:

- `RESEND_API_KEY`
- `CHAT_NOTIFY_TO=ferosh@northvalleyintel.com`
- `CHAT_NOTIFY_FROM`, such as `Northvalley Intelligence <alerts@northvalleyintel.com>`

Verify `northvalleyintel.com` in Resend and add the DNS records Resend provides
before using a `northvalleyintel.com` sender address.

### Chat Storage and Rate Limiting

Create a Cloudflare D1 database for this site, bind it to the Pages project as
`WORKFLOW_CHAT_DB`, then apply:

```bash
npx wrangler d1 execute <database-name> --file=database/workflow-chat.sql
```

The same D1 table stores chat history and supports per-session/per-IP rate
limiting before AI provider calls are made. The function hashes IP addresses
before storage.

### Bot Protection

Create a Cloudflare Turnstile widget for `northvalleyintel.com` and configure:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a public build/runtime variable
- `TURNSTILE_SECRET_KEY` as a secret

When `TURNSTILE_SECRET_KEY` is set, `/api/workflow-chat` rejects chat messages
without a valid Turnstile token. Local development can omit the secret.

Optional Google Calendar invite creation requires:

- `GOOGLE_CALENDAR_ENABLED=true`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REFRESH_TOKEN`
- `ASSESSMENT_HOST_EMAIL`, defaulting to `ferosh@northvalleyintel.com`

The function only attempts an invite when the chat message includes scheduling
intent, an email address, and a recognizable Eastern business-hours time.

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
