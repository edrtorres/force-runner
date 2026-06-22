import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { SearchUsersUseCase } from "../application/use-cases/friend-use-cases.ts";
import type { FriendshipRepository, ProfileRepository } from "../domain/repositories.ts";

const profiles: ProfileRepository = {
  getById: () => Promise.reject(new Error("not used")),
  findPublicByIds: () => Promise.reject(new Error("not used")),
  getMe: () => Promise.reject(new Error("not used")),
  updateMe: () => Promise.reject(new Error("not used")),
  searchPublic: () => Promise.resolve([
    { id: "11111111-1111-4111-8111-111111111111", display_name: "Astrid", country: "Honduras", avatar_url: null },
    { id: "33333333-3333-4333-8333-333333333333", display_name: "Josue", country: "Honduras", avatar_url: null }
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
    { id: "aaaaaaaa-0001-4000-8000-000000000001", requester_id: "22222222-2222-4222-8222-222222222222", addressee_id: "11111111-1111-4111-8111-111111111111", status: "pending", requested_at: "", responded_at: null },
    { id: "aaaaaaaa-0002-4000-8000-000000000002", requester_id: "33333333-3333-4333-8333-333333333333", addressee_id: "22222222-2222-4222-8222-222222222222", status: "accepted", requested_at: "", responded_at: null }
  ])
};

Deno.test("SearchUsersUseCase adds friendship status without exposing private data", async () => {
  const useCase = new SearchUsersUseCase(profiles, friendships);
  const result = await useCase.execute("22222222-2222-4222-8222-222222222222", "as");

  assertEquals(result.users[0].friendship_status, "pending_sent");
  assertEquals(result.users[1].friendship_status, "accepted");
  assertEquals("email" in result.users[0], false);
  assertEquals("phone" in result.users[0], false);
});

Deno.test("SearchUsersUseCase ignores short queries", async () => {
  const useCase = new SearchUsersUseCase(profiles, friendships);
  const result = await useCase.execute("22222222-2222-4222-8222-222222222222", "a");

  assertEquals(result.users.length, 0);
});
