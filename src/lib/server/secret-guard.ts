/**
 * Shared credential-rejection guard.
 *
 * Every Northvalley intake path must refuse to carry secrets, whether the text
 * arrived from the website form or from an AI assistant calling the MCP write
 * path. Keeping the term list here means a new entry protects both at once.
 */

export const blockedCredentialTerms = [
  "password",
  "api key",
  "secret",
  "token",
  "registrar login",
  "cloudflare token",
  "google password",
];

export function containsBlockedCredentialTerms(...values: string[]) {
  const combined = values.join(" ").toLowerCase();
  return blockedCredentialTerms.some((term) => combined.includes(term));
}
