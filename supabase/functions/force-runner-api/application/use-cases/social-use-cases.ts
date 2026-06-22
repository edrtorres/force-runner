import { ForbiddenError } from "../../domain/errors.ts";
import type { ActivityRepository, ChatRepository, CoachRepository, FriendshipRepository, NotificationRepository, ProfileRepository, ReactionRepository, RunRepository } from "../../domain/repositories.ts";
import { NotificationService } from "../services/notification-service.ts";
import { enumValue, maxLength, optionalLimit, positiveNumber, requiredString, validateUuid } from "../validation.ts";

const reactionTypes = ["fire", "strong", "clap", "heart", "wow", "trophy"] as const;
const targetTypes = ["run", "activity"] as const;
const coachInputTypes = ["text", "voice"] as const;

export class SendReactionUseCase {
  constructor(private readonly reactions: ReactionRepository, private readonly runs: RunRepository, private readonly activities: ActivityRepository, private readonly friendships: FriendshipRepository) {}

  async execute(userId: string, input: Record<string, unknown>) {
    const targetType = requiredString(input, "target_type");
    const targetId = validateUuid(requiredString(input, "target_id"), "target_id");
    enumValue(targetType, targetTypes, "target_type");
    const reactionType = enumValue(requiredString(input, "reaction_type"), reactionTypes, "reaction_type");
    const ownerId = targetType === "run" ? await this.runs.getRunOwner(targetId) : targetType === "activity" ? await this.activities.getOwner(targetId) : null;
    if (!ownerId) throw new ForbiddenError("target_type no permitido");
    if (ownerId !== userId) await this.friendships.assertAcceptedFriend(userId, ownerId);
    return { reaction: await this.reactions.upsert({ user_id: userId, target_type: targetType, target_id: targetId, reaction_type: reactionType }) };
  }
}

export class GetReactionsUseCase {
  constructor(private readonly reactions: ReactionRepository, private readonly profiles: ProfileRepository) {}
  async execute(targetType: string, targetId: string) {
    const reactions = await this.reactions.list(targetType, targetId);
    return { reactions, profiles: await this.profiles.findPublicByIds([...new Set(reactions.map((reaction) => String(reaction.user_id)))]) };
  }
}

export class SendMessageUseCase {
  constructor(private readonly chat: ChatRepository, private readonly friendships: FriendshipRepository, private readonly notifications: NotificationService) {}

  async execute(userId: string, input: Record<string, unknown>) {
    const recipientUserId = validateUuid(requiredString(input, "recipient_user_id"), "recipient_user_id");
    const messageBody = maxLength(requiredString(input, "body"), "body", 1000);
    await this.friendships.assertAcceptedFriend(userId, recipientUserId);
    const first = userId < recipientUserId ? userId : recipientUserId;
    const second = userId < recipientUserId ? recipientUserId : userId;
    const conversation = await this.chat.findConversation(first, second) ?? await this.chat.createConversation(first, second);
    const message = await this.chat.createMessage(conversation.id, userId, messageBody);
    await this.chat.touchConversation(conversation.id, message.created_at);
    await this.notifications.notifyWithActorName([recipientUserId], userId, "chat_message_received", "te envio un mensaje", messageBody, "messages", message.id);
    return { conversation, message };
  }
}

export class ConversationsUseCase {
  constructor(private readonly chat: ChatRepository, private readonly profiles: ProfileRepository) {}
  async execute(userId: string) {
    const conversations = await this.chat.listConversations(userId);
    const friendIds = conversations.map((conversation) => conversation.user_a_id === userId ? conversation.user_b_id : conversation.user_a_id);
    const profileById = new Map((await this.profiles.findPublicByIds(friendIds)).map((profile) => [profile.id, profile]));
    return { conversations: conversations.map((conversation) => ({ ...conversation, friend: profileById.get(conversation.user_a_id === userId ? conversation.user_b_id : conversation.user_a_id) ?? null })) };
  }
}

export class MessagesUseCase {
  constructor(private readonly chat: ChatRepository) {}
  async execute(userId: string, conversationId: string) {
    validateUuid(conversationId, "conversation_id");
    const conversation = await this.chat.getConversation(conversationId);
    if (conversation.user_a_id !== userId && conversation.user_b_id !== userId) throw new ForbiddenError("No puedes ver esta conversacion");
    return { conversation, messages: await this.chat.listMessages(conversationId) };
  }
}

export class NotifyFriendsUseCase {
  constructor(private readonly friendships: FriendshipRepository, private readonly notifications: NotificationService) {}
  async execute(userId: string, input: Record<string, unknown>) {
    const created = await this.notifications.notifyUsers(
      await this.friendships.getAcceptedFriendIds(userId),
      userId,
      maxLength(requiredString(input, "type"), "type", 80),
      maxLength(requiredString(input, "title"), "title", 120),
      maxLength(requiredString(input, "body"), "body", 500),
      typeof input.related_table === "string" ? input.related_table : undefined,
      typeof input.related_id === "string" ? input.related_id : undefined
    );
    return { notifications_created: created.length };
  }
}

export class NotificationsUseCase {
  constructor(private readonly notifications: NotificationRepository) {}
  async execute(userId: string, limitValue: string | null) {
    return { notifications: await this.notifications.list(userId, optionalLimit(limitValue, 30, 100)) };
  }
}

export class MarkNotificationReadUseCase {
  constructor(private readonly notifications: NotificationRepository) {}
  async execute(userId: string, input: Record<string, unknown>) {
    return { notification: await this.notifications.markRead(userId, validateUuid(requiredString(input, "notification_id"), "notification_id")) };
  }
}

export class CoachAiUseCase {
  constructor(private readonly coach: CoachRepository) {}
  async execute(userId: string, input: Record<string, unknown>) {
    const question = maxLength(requiredString(input, "question"), "question", 1000);
    const inputType = typeof input.input_type === "string" ? enumValue(input.input_type, coachInputTypes, "input_type") : "text";
    const caloriesGoal = input.calories_goal === undefined || input.calories_goal === null ? null : positiveNumber(input, "calories_goal");
    const answer = caloriesGoal
      ? `Para quemar cerca de ${caloriesGoal} calorias, combina distancia, ritmo y tu peso registrado. Empieza con una carrera moderada y revisa tus estadisticas.`
      : "Te recomiendo mantener constancia, alternar intensidad y revisar tu historial para ajustar tus metas.";
    return { coach_message: await this.coach.createMessage({ user_id: userId, input_type: inputType, question, answer, calories_goal: caloriesGoal, metadata: input.metadata ?? {} }) };
  }
}
