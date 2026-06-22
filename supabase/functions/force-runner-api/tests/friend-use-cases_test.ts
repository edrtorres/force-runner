import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { SearchUsersUseCase } from "../application/use-cases/friend-use-cases.ts";
import type { FriendshipRepository, ProfileRepository } from "../domain/repositories.ts";

const profiles: ProfileRepository = {
  getById: () => Promise.reject(new Error("not used")),
  findPublicByIds: () => Promise.reject(new Error("not used")),
  getMe: () => Promise.reject(new Error("not used")),
  updateMe: () => Promise.reject(new Error("not used")),
  searchPublic: () => Promise.resolve([
    { id: "user-2", display_name: "Astrid", country: "Honduras", avatar_url: null },
    { id: "user-3", display_name: "Josue", country: "Honduras", avatar_url: null }
  ])
};

const friendships: FriendshipRepository = {
  getAcceptedFriendIds: () => Promise.reject(new Error("not used")),
  assertAcceptedFriend: () => Promise.reject(new Error("not used")),
  findBetween: () => Promise.reject(new Error("not used")),
  create: () => Promise.reject(new Error("not used")),
  respond: () => Promise.reject(new Error("not used")),
  listPending: () => Promise.reject(new Error("not used")),
  listFriendshipStatuses: () => Promise.resolve([
    { id: "friendship-1", requester_id: "user-1", addressee_id: "user-2", status: "pending", requested_at: "", responded_at: null },
    { id: "friendship-2", requester_id: "user-3", addressee_id: "user-1", status: "accepted", requested_at: "", responded_at: null }
  ])
};

Deno.test("SearchUsersUseCase adds friendship status without exposing private data", async () => {
  const useCase = new SearchUsersUseCase(profiles, friendships);
  const result = await useCase.execute("user-1", "as");

  assertEquals(result.users[0].friendship_status, "pending_sent");
  assertEquals(result.users[1].friendship_status, "accepted");
  assertEquals("email" in result.users[0], false);
  assertEquals("phone" in result.users[0], false);
});

Deno.test("SearchUsersUseCase ignores short queries", async () => {
  const useCase = new SearchUsersUseCase(profiles, friendships);
  const result = await useCase.execute("user-1", "a");

  assertEquals(result.users.length, 0);
});
