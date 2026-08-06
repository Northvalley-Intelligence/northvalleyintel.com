type MiddlewareContext = {
  request: Request;
  env: Record<string, unknown>;
  next: () => Promise<Response>;
};

/**
 * Directory domain-verification challenge.
 *
 * Served from middleware rather than a static file under public/.well-known/,
 * because dotfolder static assets are unreliable on Cloudflare Pages and the
 * verifier fetches this exactly once before deciding.
 *
 * It must return the token and nothing else: no JSON wrapper, no trailing
 * markup, content-type text/plain. Set OPENAI_APPS_CHALLENGE_TOKEN in the Pages
 * environment to the value the submission portal issues, then redeploy before
 * clicking Verify.
 */
const challengePath = "/.well-known/openai-apps-challenge";

export async function onRequest({ request, env, next }: MiddlewareContext) {
  const url = new URL(request.url);
  const host = request.headers.get("host")?.split(":")[0] || url.hostname;

  if (url.pathname === challengePath) {
    const token =
      typeof env.OPENAI_APPS_CHALLENGE_TOKEN === "string"
        ? env.OPENAI_APPS_CHALLENGE_TOKEN.trim()
        : "";

    if (!token) {
      return new Response("Challenge token is not configured.", {
        status: 404,
        headers: { "content-type": "text/plain", "cache-control": "no-store" },
      });
    }

    return new Response(token, {
      status: 200,
      headers: { "content-type": "text/plain", "cache-control": "no-store" },
    });
  }

  if (
    host === "intake.northvalleyintel.com" &&
    (url.pathname === "/" || url.pathname === "/index.html")
  ) {
    url.pathname = "/intake";
    return Response.redirect(url.toString(), 302);
  }

  return next();
}
