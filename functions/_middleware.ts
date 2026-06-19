type MiddlewareContext = {
  request: Request;
  next: () => Promise<Response>;
};

export async function onRequest({ request, next }: MiddlewareContext) {
  const url = new URL(request.url);
  const host = request.headers.get("host")?.split(":")[0] || url.hostname;

  if (
    host === "intake.northvalleyintel.com" &&
    (url.pathname === "/" || url.pathname === "/index.html")
  ) {
    url.pathname = "/intake";
    return Response.redirect(url.toString(), 302);
  }

  return next();
}
