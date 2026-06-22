import { NotificationService } from "../application/services/notification-service.ts";
import { CreateFriendRequestUseCase, FriendRankingUseCase, FriendRequestsUseCase, MyFriendsUseCase, RespondFriendRequestUseCase, SearchUsersUseCase } from "../application/use-cases/friend-use-cases.ts";
import { GetMeUseCase, UpdateMeUseCase } from "../application/use-cases/profile-use-cases.ts";
import { CancelRunUseCase, FinishRunUseCase, RunDetailUseCase, RunHistoryUseCase, StartRunUseCase, StatisticsUseCase } from "../application/use-cases/run-use-cases.ts";
import { CoachAiUseCase, ConversationsUseCase, GetReactionsUseCase, MarkNotificationReadUseCase, MessagesUseCase, NotificationsUseCase, NotifyFriendsUseCase, SendMessageUseCase, SendReactionUseCase } from "../application/use-cases/social-use-cases.ts";
import { createSupabaseServiceClient } from "../infrastructure/supabase/client.ts";
import { SupabaseActivityRepository, SupabaseChatRepository, SupabaseCoachRepository, SupabaseFriendshipRepository, SupabaseNotificationRepository, SupabaseProfileRepository, SupabaseReactionRepository, SupabaseRunRepository } from "../infrastructure/supabase/repositories.ts";

export interface AppContainer {
  startRun: StartRunUseCase;
  finishRun: FinishRunUseCase;
  cancelRun: CancelRunUseCase;
  runHistory: RunHistoryUseCase;
  runDetail: RunDetailUseCase;
  statistics: StatisticsUseCase;
  searchUsers: SearchUsersUseCase;
  myFriends: MyFriendsUseCase;
  friendRequests: FriendRequestsUseCase;
  createFriendRequest: CreateFriendRequestUseCase;
  respondFriendRequest: RespondFriendRequestUseCase;
  friendRanking: FriendRankingUseCase;
  sendReaction: SendReactionUseCase;
  getReactions: GetReactionsUseCase;
  sendMessage: SendMessageUseCase;
  conversations: ConversationsUseCase;
  messages: MessagesUseCase;
  notifyFriends: NotifyFriendsUseCase;
  notifications: NotificationsUseCase;
  markNotificationRead: MarkNotificationReadUseCase;
  getMe: GetMeUseCase;
  updateMe: UpdateMeUseCase;
  coachAi: CoachAiUseCase;
}

export function createContainer(): AppContainer {
  const db = createSupabaseServiceClient();
  const profiles = new SupabaseProfileRepository(db);
  const friendships = new SupabaseFriendshipRepository(db);
  const runs = new SupabaseRunRepository(db);
  const activities = new SupabaseActivityRepository(db);
  const reactions = new SupabaseReactionRepository(db);
  const chat = new SupabaseChatRepository(db);
  const notifications = new SupabaseNotificationRepository(db);
  const coach = new SupabaseCoachRepository(db);
  const notificationService = new NotificationService(notifications, profiles);

  return {
    startRun: new StartRunUseCase(profiles, friendships, activities, notificationService),
    finishRun: new FinishRunUseCase(profiles, friendships, runs, activities, notificationService),
    cancelRun: new CancelRunUseCase(profiles, friendships, activities, notificationService),
    runHistory: new RunHistoryUseCase(runs),
    runDetail: new RunDetailUseCase(runs),
    statistics: new StatisticsUseCase(runs),
    searchUsers: new SearchUsersUseCase(profiles, friendships),
    myFriends: new MyFriendsUseCase(profiles, friendships),
    friendRequests: new FriendRequestsUseCase(profiles, friendships),
    createFriendRequest: new CreateFriendRequestUseCase(friendships, notificationService),
    respondFriendRequest: new RespondFriendRequestUseCase(friendships, notificationService),
    friendRanking: new FriendRankingUseCase(profiles, friendships, runs),
    sendReaction: new SendReactionUseCase(reactions, runs, activities, friendships),
    getReactions: new GetReactionsUseCase(reactions, profiles),
    sendMessage: new SendMessageUseCase(chat, friendships, notificationService),
    conversations: new ConversationsUseCase(chat, profiles),
    messages: new MessagesUseCase(chat),
    notifyFriends: new NotifyFriendsUseCase(friendships, notificationService),
    notifications: new NotificationsUseCase(notifications),
    markNotificationRead: new MarkNotificationReadUseCase(notifications),
    getMe: new GetMeUseCase(profiles),
    updateMe: new UpdateMeUseCase(profiles),
    coachAi: new CoachAiUseCase(coach)
  };
}
