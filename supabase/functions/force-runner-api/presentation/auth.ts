import { UnauthorizedError } from "../domain/errors.ts";

export function getAuthenticatedUserId(request: Request): string {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) throw new UnauthorizedError();

  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { sub?: unknown };
    if (typeof payload.sub !== "string" || payload.sub.length === 0) throw new UnauthorizedError();
    return payload.sub;
  } catch (_error) {
    throw new UnauthorizedError();
  }
}
