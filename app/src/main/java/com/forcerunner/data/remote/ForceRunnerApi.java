package com.forcerunner.data.remote;

import com.forcerunner.data.remote.model.ApiResponse;
import com.forcerunner.data.remote.model.chat.ConversationsResponseDto;
import com.forcerunner.data.remote.model.chat.MessagesResponseDto;
import com.forcerunner.data.remote.model.coach.CoachRequest;
import com.forcerunner.data.remote.model.coach.CoachResponseDto;
import com.forcerunner.data.remote.model.friend.FriendRankingResponseDto;
import com.forcerunner.data.remote.model.friend.SearchUsersResponseDto;
import com.forcerunner.data.remote.model.notification.NotificationsResponseDto;
import com.forcerunner.data.remote.model.profile.MeResponseDto;
import com.forcerunner.data.remote.model.profile.UpdateProfileRequest;
import com.forcerunner.data.remote.model.run.RunHistoryResponseDto;
import com.forcerunner.data.remote.model.run.StatisticsResponseDto;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ForceRunnerApi {
    @GET("functions/v1/force-runner-api-v2/me")
    Call<ApiResponse<MeResponseDto>> getMe();

    @PATCH("functions/v1/force-runner-api-v2/me")
    Call<ApiResponse<MeResponseDto>> updateMe(@Body UpdateProfileRequest body);

    @GET("functions/v1/force-runner-api-v2/search-users")
    Call<ApiResponse<SearchUsersResponseDto>> searchUsers(@Query("query") String query);

    @GET("functions/v1/force-runner-api-v2/friend-ranking")
    Call<ApiResponse<FriendRankingResponseDto>> friendRanking(@Query("period") String period);

    @GET("functions/v1/force-runner-api-v2/run-history")
    Call<ApiResponse<RunHistoryResponseDto>> runHistory(@Query("limit") int limit);

    @GET("functions/v1/force-runner-api-v2/statistics")
    Call<ApiResponse<StatisticsResponseDto>> statistics(@Query("period") String period);

    @GET("functions/v1/force-runner-api-v2/notifications")
    Call<ApiResponse<NotificationsResponseDto>> notifications(@Query("limit") int limit);

    @GET("functions/v1/force-runner-api-v2/conversations")
    Call<ApiResponse<ConversationsResponseDto>> conversations();

    @GET("functions/v1/force-runner-api-v2/messages")
    Call<ApiResponse<MessagesResponseDto>> messages(@Query("conversation_id") String conversationId);

    @POST("functions/v1/force-runner-api-v2/coach-ai")
    Call<ApiResponse<CoachResponseDto>> coachAi(@Body CoachRequest body);
}
