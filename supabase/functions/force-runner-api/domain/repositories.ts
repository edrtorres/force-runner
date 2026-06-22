import type { Conversation, Friendship, Message, Notification, Profile, ProfileSummary, Run, RunStatistics } from "./models.ts";

export interface ProfileRepository {
  getById(userId: string): Promise<Profile>;
  findPublicByIds(userIds: string[]): Promise<ProfileSummary[]>;
  searchPublic(query: string, currentUserId: string): Promise<ProfileSummary[]>;
  getMe(userId: string): Promise<Record<string, unknown>>;
  updateMe(userId: string, input: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export interface FriendshipRepository {
  getAcceptedFriendIds(userId: string): Promise<string[]>;
  assertAcceptedFriend(userId: string, friendId: string): Promise<void>;
  findBetween(userId: string, otherUserId: string): Promise<Friendship | null>;
  create(requesterId: string, addresseeId: string): Promise<Friendship>;
  respond(friendshipId: string, addresseeId: string, status: "accepted" | "rejected"): Promise<Friendship>;
  listPending(userId: string): Promise<Friendship[]>;
  listFriendshipStatuses(userId: string): Promise<Friendship[]>;
}

export interface RunRepository {
  create(userId: string, input: Record<string, unknown>): Promise<Run>;
  addPoints(runId: string, input: Record<string, unknown>, endedAt: string): Promise<number>;
  getOwnRun(userId: string, runId: string): Promise<Run>;
  getRunOwner(runId: string): Promise<string>;
  listHistory(userId: string, limit: number): Promise<Run[]>;
  listPoints(runId: string): Promise<Record<string, unknown>[]>;
  getStatistics(userId: string, period: "week" | "month"): Promise<RunStatistics | null>;
  getRanking(userIds: string[], period: "week" | "month"): Promise<RunStatistics[]>;
}

export interface ActivityRepository {
  create(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  getOwner(activityId: string): Promise<string>;
}

export interface ReactionRepository {
  upsert(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  list(targetType: string, targetId: string): Promise<Record<string, unknown>[]>;
}

export interface ChatRepository {
  findConversation(userAId: string, userBId: string): Promise<Conversation | null>;
  createConversation(userAId: string, userBId: string): Promise<Conversation>;
  touchConversation(conversationId: string, lastMessageAt: string): Promise<void>;
  getConversation(conversationId: string): Promise<Conversation>;
  createMessage(conversationId: string, senderId: string, body: string): Promise<Message>;
  listMessages(conversationId: string): Promise<Message[]>;
  listConversations(userId: string): Promise<Conversation[]>;
}

export interface NotificationRepository {
  createMany(input: Record<string, unknown>[]): Promise<Notification[]>;
  list(userId: string, limit: number): Promise<Notification[]>;
  markRead(userId: string, notificationId: string): Promise<Notification>;
}

export interface CoachRepository {
  createMessage(input: Record<string, unknown>): Promise<Record<string, unknown>>;
}
