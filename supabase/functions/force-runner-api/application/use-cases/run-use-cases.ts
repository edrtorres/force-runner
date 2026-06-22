import type { ActivityRepository, FriendshipRepository, ProfileRepository, RunRepository } from "../../domain/repositories.ts";
import { NotificationService } from "../services/notification-service.ts";
import { optionalCoordinate, optionalLimit, positiveNumber } from "../validation.ts";

export class StartRunUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository, private readonly activities: ActivityRepository, private readonly notifications: NotificationService) {}

  async execute(userId: string, input: Record<string, unknown>) {
    const profile = await this.profiles.getById(userId);
    const latitude = optionalCoordinate(input, "latitude");
    const longitude = optionalCoordinate(input, "longitude");
    const activity = await this.activities.create({
      user_id: userId,
      type: "started_running",
      title: `${profile.display_name} comenzo a correr`,
      body: "Enviale apoyo y motivacion",
      metadata: { latitude, longitude }
    });
    const created = await this.notifications.notifyUsers(await this.friendships.getAcceptedFriendIds(userId), userId, "friend_started_running", String(activity.title), String(activity.body), "activities", String(activity.id));
    return { activity, notifications_created: created.length };
  }
}

export class CancelRunUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository, private readonly activities: ActivityRepository, private readonly notifications: NotificationService) {}

  async execute(userId: string, input: Record<string, unknown>) {
    const profile = await this.profiles.getById(userId);
    const reason = typeof input.reason === "string" ? input.reason : "El corredor detuvo su actividad";
    const activity = await this.activities.create({ user_id: userId, type: "stopped_running", title: `${profile.display_name} dejo de correr`, body: reason, metadata: { reason } });
    const created = await this.notifications.notifyUsers(await this.friendships.getAcceptedFriendIds(userId), userId, "friend_stopped_running", String(activity.title), String(activity.body), "activities", String(activity.id));
    return { activity, notifications_created: created.length };
  }
}

export class FinishRunUseCase {
  constructor(private readonly profiles: ProfileRepository, private readonly friendships: FriendshipRepository, private readonly runs: RunRepository, private readonly activities: ActivityRepository, private readonly notifications: NotificationService) {}

  async execute(userId: string, input: Record<string, unknown>) {
    positiveNumber(input, "duration_seconds");
    positiveNumber(input, "distance_meters");
    const run = await this.runs.create(userId, input);
    const pointsCreated = await this.runs.addPoints(run.id, input, run.ended_at ?? new Date().toISOString());
    const profile = await this.profiles.getById(userId);
    const activity = await this.activities.create({
      user_id: userId,
      run_id: run.id,
      type: "finished_run",
      title: `${profile.display_name} completo ${(Number(run.distance_meters) / 1000).toFixed(2)} km`,
      body: "Reacciona a su carrera",
      metadata: { distance_meters: run.distance_meters, calories: run.calories }
    });
    const created = await this.notifications.notifyUsers(await this.friendships.getAcceptedFriendIds(userId), userId, "friend_finished_run", String(activity.title), String(activity.body), "runs", run.id);
    return { run, activity, points_created: pointsCreated, notifications_created: created.length };
  }
}

export class RunHistoryUseCase {
  constructor(private readonly runs: RunRepository) {}
  async execute(userId: string, limitValue: string | null) {
    return { runs: await this.runs.listHistory(userId, optionalLimit(limitValue, 20, 100)) };
  }
}

export class RunDetailUseCase {
  constructor(private readonly runs: RunRepository) {}
  async execute(userId: string, runId: string) {
    const run = await this.runs.getOwnRun(userId, runId);
    return { run, points: await this.runs.listPoints(run.id) };
  }
}

export class StatisticsUseCase {
  constructor(private readonly runs: RunRepository) {}
  async execute(userId: string, period: "week" | "month") {
    return { period, statistics: await this.runs.getStatistics(userId, period) ?? { user_id: userId, total_runs: 0, total_distance_meters: 0, total_duration_seconds: 0, total_calories: 0, avg_pace_seconds_per_km: null } };
  }
}
