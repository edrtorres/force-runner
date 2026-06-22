import { ValidationError } from "../../domain/errors.ts";
import type { FriendshipRepository, ProfileRepository, RunRepository } from "../../domain/repositories.ts";
import { NotificationService } from "../services/notification-service.ts";
import { requiredString, validateUuid } from "../validation.ts";

export class SearchUsersUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository) {}

  async execute(userId: string, query: string) {
    if (query.trim().length < 2) return { users: [] };
    const [users, statuses] = await Promise.all([
      this.profiles.searchPublic(query.trim(), userId),
      this.friendships.listFriendshipStatuses(userId)
    ]);
    const statusByUser = new Map<string, string>();
    for (const friendship of statuses) {
      const otherId = friendship.requester_id === userId ? friendship.addressee_id : friendship.requester_id;
      statusByUser.set(otherId, friendship.status === "pending" ? friendship.requester_id === userId ? "pending_sent" : "pending_received" : friendship.status);
    }
    return { users: users.map((profile) => ({ ...profile, friendship_status: statusByUser.get(profile.id) ?? "none" })) };
  }
}

export class MyFriendsUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository) {}

  async execute(userId: string) {
    return { friends: await this.profiles.findPublicByIds(await this.friendships.getAcceptedFriendIds(userId)) };
  }
}

export class FriendRequestsUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository) {}

  async execute(userId: string) {
    const requests = await this.friendships.listPending(userId);
    const ids = [...new Set(requests.flatMap((request) => [request.requester_id, request.addressee_id]).filter((id) => id !== userId))];
    const profileById = new Map((await this.profiles.findPublicByIds(ids)).map((profile) => [profile.id, profile]));
    return {
      received: requests.filter((request) => request.addressee_id === userId).map((request) => ({ ...request, requester: profileById.get(request.requester_id) ?? null })),
      sent: requests.filter((request) => request.requester_id === userId).map((request) => ({ ...request, addressee: profileById.get(request.addressee_id) ?? null }))
    };
  }
}

export class CreateFriendRequestUseCase {
  constructor(private readonly friendships: FriendshipRepository, private readonly notifications: NotificationService) {}

  async execute(userId: string, input: Record<string, unknown>) {
    const addresseeId = validateUuid(requiredString(input, "addressee_id"), "addressee_id");
    if (addresseeId === userId) throw new ValidationError("No puedes enviarte solicitud a ti mismo");
    const existing = await this.friendships.findBetween(userId, addresseeId);
    if (existing) return { friendship: existing };
    const friendship = await this.friendships.create(userId, addresseeId);
    await this.notifications.notifyWithActorName([addresseeId], userId, "friend_request_received", "quiere agregarte", "Tienes una nueva solicitud de amistad", "friendships", friendship.id);
    return { friendship };
  }
}

export class RespondFriendRequestUseCase {
  constructor(private readonly friendships: FriendshipRepository, private readonly notifications: NotificationService) {}

  async execute(userId: string, input: Record<string, unknown>) {
    const friendshipId = validateUuid(requiredString(input, "friendship_id"), "friendship_id");
    const status = requiredString(input, "status");
    if (status !== "accepted" && status !== "rejected") throw new ValidationError("status debe ser accepted o rejected");
    const friendship = await this.friendships.respond(friendshipId, userId, status);
    if (status === "accepted") {
      await this.notifications.notifyWithActorName([friendship.requester_id], userId, "friend_request_accepted", "acepto tu solicitud", "Ahora pueden verse en ranking, estado y chat", "friendships", friendship.id);
    }
    return { friendship };
  }
}

export class FriendRankingUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository, private readonly runs: RunRepository) {}

  async execute(userId: string, period: "week" | "month") {
    const userIds = [userId, ...(await this.friendships.getAcceptedFriendIds(userId))];
    const [stats, profiles] = await Promise.all([this.runs.getRanking(userIds, period), this.profiles.findPublicByIds(userIds)]);
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
    return {
      user_id: userId,
      period,
      ranking: stats
        .sort((left, right) => Number(right.total_distance_meters) - Number(left.total_distance_meters))
        .map((row, index) => ({ position: index + 1, ...row, profile: profileById.get(row.user_id) ?? null }))
    };
  }
}
