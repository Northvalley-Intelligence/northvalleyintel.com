type FunctionContext = {
  env: Record<string, unknown>;
};

export function onRequestGet({ env }: FunctionContext) {
  const turnstileSiteKey =
    typeof env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === "string"
      ? env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      : "";

  return new Response(JSON.stringify({ turnstileSiteKey }), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
    },
  });
}

export function onRequestPost() {
  return new Response(JSON.stringify({ error: "Method not allowed." }), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
    },
    status: 405,
  });
}
