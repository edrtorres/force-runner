import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Router } from "../presentation/router.ts";
import { FunctionController } from "../presentation/controllers.ts";
import type { RateLimitRepository } from "../domain/repositories.ts";

function tokenFor(userId: string) {
  const payload = btoa(JSON.stringify({ sub: userId })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `header.${payload}.signature`;
}

Deno.test("Router supports /v1 aliases without changing controllers", async () => {
  const router = new Router();
  router.register("GET", "/me", new FunctionController(({ userId }) => Promise.resolve({ userId })));

  const response = await router.handle(new Request("https://example.test/v1/me", {
    headers: { authorization: `Bearer ${tokenFor("22222222-2222-4222-8222-222222222222")}` }
  }));
  const payload = await response.json();

  assertEquals(response.status, 200);
  assertEquals(payload.ok, true);
  assertEquals(payload.data.userId, "22222222-2222-4222-8222-222222222222");
});

Deno.test("Router applies configured rate limits", async () => {
  let count = 0;
  const limiter: RateLimitRepository = {
    increment: () => Promise.resolve(++count)
  };
  const router = new Router(limiter);
  router.register("POST", "/coach-ai", new FunctionController(() => Promise.resolve({ answer: "ok" })));

  for (let index = 0; index < 20; index++) {
    const response = await router.handle(new Request("https://example.test/coach-ai", {
      method: "POST",
      headers: { authorization: `Bearer ${tokenFor("22222222-2222-4222-8222-222222222222")}` },
      body: "{}"
    }));
    assertEquals(response.status, 200);
  }

  const blocked = await router.handle(new Request("https://example.test/coach-ai", {
    method: "POST",
    headers: { authorization: `Bearer ${tokenFor("22222222-2222-4222-8222-222222222222")}` },
    body: "{}"
  }));

  assertEquals(blocked.status, 429);
});
