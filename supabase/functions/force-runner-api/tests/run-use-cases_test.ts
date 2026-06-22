import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { FinishRunUseCase, StartRunUseCase } from "../application/use-cases/run-use-cases.ts";
import { NotificationService } from "../application/services/notification-service.ts";
import { ValidationError } from "../domain/errors.ts";
import type { ActivityRepository, FriendshipRepository, NotificationRepository, ProfileRepository, RunRepository } from "../domain/repositories.ts";

const profiles: ProfileRepository = {
  getById: () => Promise.resolve({ id: "user-1", full_name: "Edwin Torres", display_name: "Edwin", country: "Honduras", avatar_url: null }),
  findPublicByIds: () => Promise.resolve([]),
  searchPublic: () => Promise.resolve([]),
  getMe: () => Promise.resolve({}),
  updateMe: () => Promise.resolve({})
};

const friendships: FriendshipRepository = {
  getAcceptedFriendIds: () => Promise.resolve(["user-2"]),
  assertAcceptedFriend: () => Promise.resolve(),
  findBetween: () => Promise.resolve(null),
  create: () => Promise.reject(new Error("not used")),
  respond: () => Promise.reject(new Error("not used")),
  listPending: () => Promise.resolve([]),
  listFriendshipStatuses: () => Promise.resolve([])
};

const notificationsRepository: NotificationRepository = {
  createMany: (rows) => Promise.resolve(rows.map((row, index) => ({ id: `notification-${index}`, read_at: null, created_at: "", ...row })) as never),
  list: () => Promise.resolve([]),
  markRead: () => Promise.reject(new Error("not used"))
};

const notificationService = new NotificationService(notificationsRepository, profiles);

Deno.test("StartRunUseCase validates coordinate ranges", async () => {
  const activities: ActivityRepository = {
    create: () => Promise.resolve({ id: "activity-1", title: "started", body: "body" }),
    getOwner: () => Promise.reject(new Error("not used"))
  };
  const useCase = new StartRunUseCase(profiles, friendships, activities, notificationService);

  await assertRejects(() => useCase.execute("user-1", { latitude: 91 }), ValidationError);
});

Deno.test("FinishRunUseCase rejects zero distance", async () => {
  const runs: RunRepository = {
    create: () => Promise.reject(new Error("should not persist invalid runs")),
    addPoints: () => Promise.resolve(0),
    getOwnRun: () => Promise.reject(new Error("not used")),
    getRunOwner: () => Promise.reject(new Error("not used")),
    listHistory: () => Promise.resolve([]),
    listPoints: () => Promise.resolve([]),
    getStatistics: () => Promise.resolve(null),
    getRanking: () => Promise.resolve([])
  };
  const activities: ActivityRepository = {
    create: () => Promise.reject(new Error("not used")),
    getOwner: () => Promise.reject(new Error("not used"))
  };
  const useCase = new FinishRunUseCase(profiles, friendships, runs, activities, notificationService);

  await assertRejects(() => useCase.execute("user-1", { duration_seconds: 120, distance_meters: 0 }), ValidationError);
});

Deno.test("FinishRunUseCase returns notification count for valid runs", async () => {
  const runs: RunRepository = {
    create: () => Promise.resolve({ id: "run-1", user_id: "user-1", status: "saved", started_at: "", ended_at: "", duration_seconds: 120, distance_meters: 1000, pace_seconds_per_km: 120, calories: 50, mood: null }),
    addPoints: () => Promise.resolve(0),
    getOwnRun: () => Promise.reject(new Error("not used")),
    getRunOwner: () => Promise.reject(new Error("not used")),
    listHistory: () => Promise.resolve([]),
    listPoints: () => Promise.resolve([]),
    getStatistics: () => Promise.resolve(null),
    getRanking: () => Promise.resolve([])
  };
  const activities: ActivityRepository = {
    create: () => Promise.resolve({ id: "activity-1", title: "finished", body: "body" }),
    getOwner: () => Promise.reject(new Error("not used"))
  };
  const useCase = new FinishRunUseCase(profiles, friendships, runs, activities, notificationService);
  const result = await useCase.execute("user-1", { duration_seconds: 120, distance_meters: 1000 });

  assertEquals(result.notifications_created, 1);
});
