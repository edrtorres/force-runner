import { AppError } from "../domain/errors.ts";
import { corsHeaders, error, ok, type Controller } from "../shared/http.ts";
import { getAuthenticatedUserId } from "./auth.ts";

export class Router {
  private readonly routes = new Map<string, Controller>();

  register(method: string, path: string, controller: Controller) {
    this.routes.set(`${method.toUpperCase()} ${path}`, controller);
  }

  async handle(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/^\/force-runner-api/, "") || "/";
      const controller = this.routes.get(`${request.method.toUpperCase()} ${path}`);
      if (!controller) return error("Endpoint no encontrado", 404);

      const userId = getAuthenticatedUserId(request);
      const body = await this.readBody(request);
      return ok(await controller.handle({ request, url, userId, body }));
    } catch (cause) {
      if (cause instanceof AppError) return error(cause.message, cause.status);
      const message = cause instanceof Error ? cause.message : "Error inesperado";
      console.error(JSON.stringify({ level: "error", message }));
      return error(message, 400);
    }
  }

  private async readBody(request: Request): Promise<Record<string, unknown>> {
    if (request.method === "GET") return {};
    const text = await request.text();
    if (text.trim().length === 0) return {};
    const parsed = JSON.parse(text) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  }
}
