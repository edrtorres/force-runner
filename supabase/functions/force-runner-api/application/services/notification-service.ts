import type { NotificationRepository, ProfileRepository } from "../../domain/repositories.ts";

export class NotificationService {
  constructor(
    private readonly notifications: NotificationRepository,
    private readonly profiles: ProfileRepository
  ) {}

  async notifyUsers(recipientIds: string[], actorUserId: string, type: string, title: string, body: string, relatedTable?: string, relatedId?: string) {
    if (recipientIds.length === 0) return [];
    return this.notifications.createMany(
      recipientIds.map((recipientUserId) => ({
        recipient_user_id: recipientUserId,
        actor_user_id: actorUserId,
        type,
        title,
        body,
        related_table: relatedTable ?? null,
        related_id: relatedId ?? null
      }))
    );
  }

  async notifyWithActorName(recipientIds: string[], actorUserId: string, type: string, titleSuffix: string, body: string, relatedTable?: string, relatedId?: string) {
    const actor = await this.profiles.getById(actorUserId);
    return this.notifyUsers(recipientIds, actorUserId, type, `${actor.display_name} ${titleSuffix}`, body, relatedTable, relatedId);
  }
}
