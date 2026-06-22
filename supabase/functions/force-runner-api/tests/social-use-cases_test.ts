import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { CoachAiUseCase, SendReactionUseCase } from "../application/use-cases/social-use-cases.ts";
import { ValidationError } from "../domain/errors.ts";
import type { ActivityRepository, CoachRepository, FriendshipRepository, ReactionRepository, RunRepository } from "../domain/repositories.ts";

Deno.test("SendReactionUseCase rejects unsupported reaction types", async () => {
  const reactions: ReactionRepository = {
    upsert: () => Promise.reject(new Error("should not persist invalid reactions")),
    list: () => Promise.resolve([])
  };
  const runs: RunRepository = {
    create: () => Promise.reject(new Error("not used")),
    addPoints: () => Promise.resolve(0),
    finishTransaction: () => Promise.reject(new Error("not used")),
    getOwnRun: () => Promise.reject(new Error("not used")),
    getRunOwner: () => Promise.resolve("22222222-2222-4222-8222-222222222222"),
    listHistory: () => Promise.resolve([]),
    listPoints: () => Promise.resolve([]),
    getStatistics: () => Promise.resolve(null),
    getRanking: () => Promise.resolve([])
  };
  const activities: ActivityRepository = {
    create: () => Promise.reject(new Error("not used")),
    getOwner: () => Promise.reject(new Error("not used"))
  };
  const friendships: FriendshipRepository = {
    getAcceptedFriendIds: () => Promise.resolve([]),
    assertAcceptedFriend: () => Promise.resolve(),
    findBetween: () => Promise.resolve(null),
    create: () => Promise.reject(new Error("not used")),
    respond: () => Promise.reject(new Error("not used")),
    listPending: () => Promise.resolve([]),
    listFriendshipStatuses: () => Promise.resolve([])
  };
  const useCase = new SendReactionUseCase(reactions, runs, activities, friendships);

  await assertRejects(() => useCase.execute("22222222-2222-4222-8222-222222222222", { target_type: "run", target_id: "bbbbbbbb-0001-4000-8000-000000000001", reaction_type: "angry" }), ValidationError);
});

Deno.test("CoachAiUseCase validates positive calorie goals", async () => {
  const coach: CoachRepository = {
    createMessage: (input) => Promise.resolve({ id: "coach-1", ...input })
  };
  const useCase = new CoachAiUseCase(coach);

  await assertRejects(() => useCase.execute("22222222-2222-4222-8222-222222222222", { question: "Cuanto debo correr?", calories_goal: 0 }), ValidationError);

  const result = await useCase.execute("22222222-2222-4222-8222-222222222222", { question: "Cuanto debo correr?", calories_goal: 300, input_type: "text" });
  assertEquals((result.coach_message as Record<string, unknown>).calories_goal, 300);
});
