import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { NotificationService } from "../application/services/notification-service.ts";
import type { NotificationRepository, ProfileRepository } from "../domain/repositories.ts";

Deno.test("NotificationService does not write when there are no recipients", async () => {
  let writes = 0;
  const notifications: NotificationRepository = {
    createMany: (rows) => {
      writes += rows.length;
      return Promise.resolve([]);
    },
    list: () => Promise.reject(new Error("not used")),
    markRead: () => Promise.reject(new Error("not used"))
  };
  const profiles: ProfileRepository = {
    getById: () => Promise.reject(new Error("not used")),
    findPublicByIds: () => Promise.reject(new Error("not used")),
    searchPublic: () => Promise.reject(new Error("not used")),
    getMe: () => Promise.reject(new Error("not used")),
    updateMe: () => Promise.reject(new Error("not used"))
  };

  const service = new NotificationService(notifications, profiles);
  const result = await service.notifyUsers([], "user-1", "type", "title", "body");

  assertEquals(result.length, 0);
  assertEquals(writes, 0);
});
