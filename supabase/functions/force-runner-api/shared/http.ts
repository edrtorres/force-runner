export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS"
};

export interface AuthenticatedRequest {
  request: Request;
  url: URL;
  userId: string;
  body: Record<string, unknown>;
}

export interface Controller {
  handle(context: AuthenticatedRequest): Promise<unknown>;
}

export function ok(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ ok: true, data }), { status, headers: corsHeaders });
}

export function error(message: string, status = 400): Response {
  return new Response(JSON.stringify({ ok: false, error: message }), { status, headers: corsHeaders });
}
