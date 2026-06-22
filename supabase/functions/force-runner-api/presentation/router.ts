import { AppError, TooManyRequestsError } from "../domain/errors.ts";
import type { RateLimitRepository } from "../domain/repositories.ts";
import { corsHeaders, error, ok, type Controller } from "../shared/http.ts";
import { getAuthenticatedUserId } from "./auth.ts";

export class Router {
  private readonly routes = new Map<string, Controller>();
  private readonly limits = new Map<string, number>([
    ["GET /search-users", 30],
    ["POST /send-message", 60],
    ["POST /send-reaction", 120],
    ["POST /coach-ai", 20],
    ["POST /finish-run", 20],
    ["POST /create-friend-request", 30],
    ["POST /notify-friends", 30]
  ]);

  constructor(private readonly rateLimits?: RateLimitRepository) {}

  register(method: string, path: string, controller: Controller) {
    this.routes.set(`${method.toUpperCase()} ${path}`, controller);
  }

  async handle(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
      const requestId = crypto.randomUUID();
      const startedAt = Date.now();
      const url = new URL(request.url);
      const path = this.normalizePath(url.pathname);
      const routeKey = `${request.method.toUpperCase()} ${path}`;
      const controller = this.routes.get(routeKey);
      if (!controller) return error("Endpoint no encontrado", 404);

      const userId = getAuthenticatedUserId(request);
      await this.enforceRateLimit(userId, routeKey);
      const body = await this.readBody(request);
      const response = ok(await controller.handle({ request, url, userId, body }));
      console.info(JSON.stringify({ level: "info", request_id: requestId, route: routeKey, status: 200, duration_ms: Date.now() - startedAt }));
      return response;
    } catch (cause) {
      if (cause instanceof AppError) return error(cause.message, cause.status);
      const message = cause instanceof Error ? cause.message : "Error inesperado";
      console.error(JSON.stringify({ level: "error", message }));
      return error("Error interno del servidor", 500);
    }
  }

  private normalizePath(pathname: string): string {
    return (pathname.replace(/^\/force-runner-api/, "").replace(/^\/v1/, "") || "/");
  }

  private async enforceRateLimit(userId: string, routeKey: string): Promise<void> {
    if (!this.rateLimits) return;
    const limit = this.limits.get(routeKey);
    if (!limit) return;
    const windowStart = new Date(Math.floor(Date.now() / 60000) * 60000).toISOString();
    const count = await this.rateLimits.increment(userId, routeKey, windowStart);
    if (count > limit) throw new TooManyRequestsError();
  }

  private async readBody(request: Request): Promise<Record<string, unknown>> {
    if (request.method === "GET") return {};
    const text = await request.text();
    if (text.trim().length === 0) return {};
    const parsed = JSON.parse(text) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  }
}
