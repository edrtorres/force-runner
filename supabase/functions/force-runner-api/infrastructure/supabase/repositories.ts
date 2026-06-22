import { ForbiddenError, NotFoundError } from "../../domain/errors.ts";
import type { ActivityRepository, ChatRepository, CoachRepository, FriendshipRepository, NotificationRepository, ProfileRepository, ReactionRepository, RunRepository } from "../../domain/repositories.ts";
import type { Conversation, Friendship, Message, Notification, Profile, ProfileSummary, Run, RunStatistics } from "../../domain/models.ts";
import type { SupabaseServiceClient } from "./client.ts";
import { toPublicProfile } from "./mapper.ts";

function raise(error: { message?: string } | null, fallback: string): never {
  throw new Error(error?.message ?? fallback);
}

function pick(input: Record<string, unknown>, keys: string[]) {
  return keys.reduce<Record<string, unknown>>((result, key) => {
    if (input[key] !== undefined) result[key] = input[key];
    return result;
  }, {});
}

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private readonly db: SupabaseServiceClient) {}

  async getById(userId: string): Promise<Profile> {
    const { data, error } = await this.db.from("profiles").select("id,full_name,display_name,country,avatar_url").eq("id", userId).single();
    if (error) raise(error, "No se encontro el perfil");
    return data as Profile;
  }

  async findPublicByIds(userIds: string[]): Promise<ProfileSummary[]> {
    if (userIds.length === 0) return [];
    const { data, error } = await this.db.from("profiles").select("id,display_name,country,avatar_url").in("id", userIds).order("display_name");
    if (error) raise(error, "No se pudieron consultar perfiles");
    return (data ?? []).map((row) => toPublicProfile(row));
  }

  async searchPublic(query: string, currentUserId: string): Promise<ProfileSummary[]> {
    const clean = query.replace(/[%_]/g, "");
    const profileMatches = await this.db.from("profiles").select("id").neq("id", currentUserId).or(`display_name.ilike.%${clean}%,full_name.ilike.%${clean}%`).limit(20);
    if (profileMatches.error) raise(profileMatches.error, "No se pudo buscar usuarios");
    const ids = (profileMatches.data ?? []).map((row) => String(row.id));
    if (query.includes("@") || /\d/.test(query)) {
      const privateMatches = await this.db.from("profile_private_details").select("user_id").neq("user_id", currentUserId).or(`email.ilike.%${clean}%,phone.ilike.%${clean}%`).limit(20);
      if (privateMatches.error) raise(privateMatches.error, "No se pudo buscar usuarios");
      ids.push(...(privateMatches.data ?? []).map((row) => String(row.user_id)));
    }
    return this.findPublicByIds([...new Set(ids)]);
  }

  async getMe(userId: string): Promise<Record<string, unknown>> {
    const [profile, privateDetails, preferences] = await Promise.all([
      this.db.from("profiles").select("*").eq("id", userId).single(),
      this.db.from("profile_private_details").select("email,phone,age,weight_kg,accepted_terms,terms_accepted_at,terms_version").eq("user_id", userId).single(),
      this.db.from("user_preferences").select("theme,language,notifications_enabled").eq("user_id", userId).single()
    ]);
    if (profile.error) raise(profile.error, "No se encontro el perfil");
    if (privateDetails.error) raise(privateDetails.error, "No se encontraron datos privados");
    if (preferences.error) raise(preferences.error, "No se encontraron preferencias");
    return { profile: profile.data, private_details: privateDetails.data, preferences: preferences.data };
  }

  async updateMe(userId: string, input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const profileFields = pick(input, ["full_name", "display_name", "country", "avatar_url"]);
    if (Object.keys(profileFields).length) await this.db.from("profiles").update({ ...profileFields, updated_at: new Date().toISOString() }).eq("id", userId);
    const privateFields = pick(input, ["phone", "age", "weight_kg"]);
    if (Object.keys(privateFields).length) await this.db.from("profile_private_details").update({ ...privateFields, updated_at: new Date().toISOString() }).eq("user_id", userId);
    const preferenceFields = pick(input, ["theme", "language", "notifications_enabled"]);
    if (Object.keys(preferenceFields).length) await this.db.from("user_preferences").update({ ...preferenceFields, updated_at: new Date().toISOString() }).eq("user_id", userId);
    return this.getMe(userId);
  }
}

export class SupabaseFriendshipRepository implements FriendshipRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async getAcceptedFriendIds(userId: string): Promise<string[]> {
    const { data, error } = await this.db.from("friendships").select("requester_id,addressee_id").eq("status", "accepted").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    if (error) raise(error, "No se pudieron consultar amigos");
    return (data ?? []).map((row) => row.requester_id === userId ? String(row.addressee_id) : String(row.requester_id));
  }
  async assertAcceptedFriend(userId: string, friendId: string) {
    const friendship = await this.findBetween(userId, friendId);
    if (!friendship || friendship.status !== "accepted") throw new ForbiddenError("Solo puedes acceder a informacion de amigos aceptados");
  }
  async findBetween(userId: string, otherUserId: string): Promise<Friendship | null> {
    const { data, error } = await this.db.from("friendships").select("*").or(`and(requester_id.eq.${userId},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${userId})`).neq("status", "deleted").maybeSingle();
    if (error) raise(error, "No se pudo consultar amistad");
    return data as Friendship | null;
  }
  async create(requesterId: string, addresseeId: string): Promise<Friendship> {
    const { data, error } = await this.db.from("friendships").insert({ requester_id: requesterId, addressee_id: addresseeId, status: "pending" }).select("*").single();
    if (error) raise(error, "No se pudo crear solicitud de amistad");
    return data as Friendship;
  }
  async respond(friendshipId: string, addresseeId: string, status: "accepted" | "rejected"): Promise<Friendship> {
    const { data, error } = await this.db.from("friendships").update({ status, responded_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", friendshipId).eq("addressee_id", addresseeId).eq("status", "pending").select("*").single();
    if (error) raise(error, "No se pudo responder solicitud");
    return data as Friendship;
  }
  async listPending(userId: string): Promise<Friendship[]> {
    const { data, error } = await this.db.from("friendships").select("*").eq("status", "pending").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`).order("requested_at", { ascending: false });
    if (error) raise(error, "No se pudieron consultar solicitudes");
    return data as Friendship[];
  }
  async listFriendshipStatuses(userId: string): Promise<Friendship[]> {
    const { data, error } = await this.db.from("friendships").select("requester_id,addressee_id,status").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    if (error) raise(error, "No se pudieron consultar estados de amistad");
    return data as Friendship[];
  }
}

export class SupabaseRunRepository implements RunRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async create(userId: string, input: Record<string, unknown>): Promise<Run> {
    const duration = Number(input.duration_seconds);
    const endedAt = typeof input.ended_at === "string" ? input.ended_at : new Date().toISOString();
    const { data, error } = await this.db.from("runs").insert({ user_id: userId, started_at: input.started_at ?? new Date(Date.now() - duration * 1000).toISOString(), ended_at: endedAt, duration_seconds: duration, distance_meters: Number(input.distance_meters), pace_seconds_per_km: input.pace_seconds_per_km ?? null, calories: input.calories ?? 0, mood: input.mood ?? null }).select("*").single();
    if (error) raise(error, "No se pudo guardar la carrera");
    return data as Run;
  }
  async addPoints(runId: string, input: Record<string, unknown>, endedAt: string): Promise<number> {
    const points = Array.isArray(input.points) ? input.points : [];
    if (!points.length) return 0;
    const rows = points.map((point, index) => ({ ...(point as Record<string, unknown>), run_id: runId, point_order: (point as Record<string, unknown>).point_order ?? index, recorded_at: (point as Record<string, unknown>).recorded_at ?? endedAt }));
    const { error } = await this.db.from("run_points").insert(rows);
    if (error) raise(error, "No se pudieron guardar puntos GPS");
    return rows.length;
  }
  async getOwnRun(userId: string, runId: string): Promise<Run> {
    const { data, error } = await this.db.from("runs").select("*").eq("id", runId).eq("user_id", userId).single();
    if (error) throw new NotFoundError("Carrera no encontrada");
    return data as Run;
  }
  async getRunOwner(runId: string): Promise<string> {
    const { data, error } = await this.db.from("runs").select("user_id").eq("id", runId).single();
    if (error) throw new NotFoundError("Carrera no encontrada");
    return String(data.user_id);
  }
  async listHistory(userId: string, limit: number): Promise<Run[]> {
    const { data, error } = await this.db.from("runs").select("*").eq("user_id", userId).is("deleted_at", null).order("started_at", { ascending: false }).limit(limit);
    if (error) raise(error, "No se pudo consultar historial");
    return data as Run[];
  }
  async listPoints(runId: string): Promise<Record<string, unknown>[]> {
    const { data, error } = await this.db.from("run_points").select("*").eq("run_id", runId).order("point_order", { ascending: true });
    if (error) raise(error, "No se pudieron consultar puntos GPS");
    return data ?? [];
  }
  async getStatistics(userId: string, period: "week" | "month"): Promise<RunStatistics | null> {
    const { data, error } = await this.db.from(period === "week" ? "run_statistics_weekly" : "run_statistics_monthly").select("*").eq("user_id", userId).maybeSingle();
    if (error) raise(error, "No se pudieron consultar estadisticas");
    return data as RunStatistics | null;
  }
  async getRanking(userIds: string[], period: "week" | "month"): Promise<RunStatistics[]> {
    if (!userIds.length) return [];
    const { data, error } = await this.db.from(period === "week" ? "run_statistics_weekly" : "run_statistics_monthly").select("*").in("user_id", userIds);
    if (error) raise(error, "No se pudo consultar ranking");
    return data as RunStatistics[];
  }
}

export class SupabaseActivityRepository implements ActivityRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async create(input: Record<string, unknown>) { const { data, error } = await this.db.from("activities").insert(input).select("*").single(); if (error) raise(error, "No se pudo crear actividad"); return data; }
  async getOwner(activityId: string) { const { data, error } = await this.db.from("activities").select("user_id").eq("id", activityId).single(); if (error) throw new NotFoundError("Actividad no encontrada"); return String(data.user_id); }
}

export class SupabaseReactionRepository implements ReactionRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async upsert(input: Record<string, unknown>) { const { data, error } = await this.db.from("reactions").upsert({ ...input, updated_at: new Date().toISOString() }, { onConflict: "user_id,target_type,target_id" }).select("*").single(); if (error) raise(error, "No se pudo guardar reaccion"); return data; }
  async list(targetType: string, targetId: string) { const { data, error } = await this.db.from("reactions").select("*").eq("target_type", targetType).eq("target_id", targetId).order("created_at", { ascending: false }); if (error) raise(error, "No se pudieron consultar reacciones"); return data ?? []; }
}

export class SupabaseChatRepository implements ChatRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async findConversation(userAId: string, userBId: string) { const { data, error } = await this.db.from("conversations").select("*").or(`and(user_a_id.eq.${userAId},user_b_id.eq.${userBId}),and(user_a_id.eq.${userBId},user_b_id.eq.${userAId})`).maybeSingle(); if (error) raise(error, "No se pudo consultar conversacion"); return data as Conversation | null; }
  async createConversation(userAId: string, userBId: string) { const { data, error } = await this.db.from("conversations").insert({ user_a_id: userAId, user_b_id: userBId, last_message_at: new Date().toISOString() }).select("*").single(); if (error) raise(error, "No se pudo crear conversacion"); return data as Conversation; }
  async touchConversation(conversationId: string, lastMessageAt: string) { const { error } = await this.db.from("conversations").update({ last_message_at: lastMessageAt, updated_at: lastMessageAt }).eq("id", conversationId); if (error) raise(error, "No se pudo actualizar conversacion"); }
  async getConversation(conversationId: string) { const { data, error } = await this.db.from("conversations").select("*").eq("id", conversationId).single(); if (error) throw new NotFoundError("Conversacion no encontrada"); return data as Conversation; }
  async createMessage(conversationId: string, senderId: string, body: string) { const { data, error } = await this.db.from("messages").insert({ conversation_id: conversationId, sender_id: senderId, body }).select("*").single(); if (error) raise(error, "No se pudo enviar mensaje"); return data as Message; }
  async listMessages(conversationId: string) { const { data, error } = await this.db.from("messages").select("*").eq("conversation_id", conversationId).is("deleted_at", null).order("created_at", { ascending: true }); if (error) raise(error, "No se pudieron consultar mensajes"); return data as Message[]; }
  async listConversations(userId: string) { const { data, error } = await this.db.from("conversations").select("*").or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`).order("last_message_at", { ascending: false, nullsFirst: false }); if (error) raise(error, "No se pudieron consultar conversaciones"); return data as Conversation[]; }
}

export class SupabaseNotificationRepository implements NotificationRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async createMany(input: Record<string, unknown>[]) { if (!input.length) return []; const { data, error } = await this.db.from("notifications").insert(input).select("*"); if (error) raise(error, "No se pudieron crear notificaciones"); return data as Notification[]; }
  async list(userId: string, limit: number) { const { data, error } = await this.db.from("notifications").select("*").eq("recipient_user_id", userId).order("created_at", { ascending: false }).limit(limit); if (error) raise(error, "No se pudieron consultar notificaciones"); return data as Notification[]; }
  async markRead(userId: string, notificationId: string) { const { data, error } = await this.db.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", notificationId).eq("recipient_user_id", userId).select("*").single(); if (error) raise(error, "No se pudo marcar notificacion como leida"); return data as Notification; }
}

export class SupabaseCoachRepository implements CoachRepository {
  constructor(private readonly db: SupabaseServiceClient) {}
  async createMessage(input: Record<string, unknown>) { const { data, error } = await this.db.from("coach_messages").insert(input).select("*").single(); if (error) raise(error, "No se pudo guardar mensaje del coach"); return data; }
}
