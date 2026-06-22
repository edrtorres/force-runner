import type { AppContainer } from "../shared/container.ts";
import { FunctionController } from "./controllers.ts";
import { Router } from "./router.ts";

export function createApp(container: AppContainer) {
  const router = new Router();

  router.register("POST", "/start-run", new FunctionController(({ userId, body }) => container.startRun.execute(userId, body)));
  router.register("POST", "/finish-run", new FunctionController(({ userId, body }) => container.finishRun.execute(userId, body)));
  router.register("POST", "/cancel-run", new FunctionController(({ userId, body }) => container.cancelRun.execute(userId, body)));
  router.register("GET", "/run-history", new FunctionController(({ userId, url }) => container.runHistory.execute(userId, url.searchParams.get("limit"))));
  router.register("GET", "/run-detail", new FunctionController(({ userId, url }) => container.runDetail.execute(userId, requireQuery(url, "run_id"))));
  router.register("GET", "/statistics", new FunctionController(({ userId, url }) => container.statistics.execute(userId, parsePeriod(url.searchParams.get("period")))));

  router.register("GET", "/search-users", new FunctionController(({ userId, url }) => container.searchUsers.execute(userId, url.searchParams.get("query") ?? "")));
  router.register("GET", "/my-friends", new FunctionController(({ userId }) => container.myFriends.execute(userId)));
  router.register("GET", "/friend-requests", new FunctionController(({ userId }) => container.friendRequests.execute(userId)));
  router.register("POST", "/create-friend-request", new FunctionController(({ userId, body }) => container.createFriendRequest.execute(userId, body)));
  router.register("POST", "/respond-friend-request", new FunctionController(({ userId, body }) => container.respondFriendRequest.execute(userId, body)));
  router.register("GET", "/friend-ranking", new FunctionController(({ userId, url }) => container.friendRanking.execute(userId, parsePeriod(url.searchParams.get("period")))));

  router.register("POST", "/send-reaction", new FunctionController(({ userId, body }) => container.sendReaction.execute(userId, body)));
  router.register("GET", "/get-reactions", new FunctionController(({ url }) => container.getReactions.execute(requireQuery(url, "target_type"), requireQuery(url, "target_id"))));
  router.register("POST", "/send-message", new FunctionController(({ userId, body }) => container.sendMessage.execute(userId, body)));
  router.register("GET", "/conversations", new FunctionController(({ userId }) => container.conversations.execute(userId)));
  router.register("GET", "/messages", new FunctionController(({ userId, url }) => container.messages.execute(userId, requireQuery(url, "conversation_id"))));

  router.register("POST", "/notify-friends", new FunctionController(({ userId, body }) => container.notifyFriends.execute(userId, body)));
  router.register("GET", "/notifications", new FunctionController(({ userId, url }) => container.notifications.execute(userId, url.searchParams.get("limit"))));
  router.register("POST", "/mark-notification-read", new FunctionController(({ userId, body }) => container.markNotificationRead.execute(userId, body)));
  router.register("GET", "/me", new FunctionController(({ userId }) => container.getMe.execute(userId)));
  router.register("PATCH", "/me", new FunctionController(({ userId, body }) => container.updateMe.execute(userId, body)));
  router.register("POST", "/coach-ai", new FunctionController(({ userId, body }) => container.coachAi.execute(userId, body)));

  return router;
}

function requireQuery(url: URL, key: string): string {
  const value = url.searchParams.get(key);
  if (!value) throw new Error(`${key} es obligatorio`);
  return value;
}

function parsePeriod(value: string | null): "week" | "month" {
  return value === "week" ? "week" : "month";
}
