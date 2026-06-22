package com.forcerunner.data.remote;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ForceRunnerApi {
    @GET("functions/v1/force-runner-api-v2/me")
    Call<Map<String, Object>> getMe();

    @PATCH("functions/v1/force-runner-api-v2/me")
    Call<Map<String, Object>> updateMe(@Body Map<String, Object> body);

    @GET("functions/v1/force-runner-api-v2/search-users")
    Call<Map<String, Object>> searchUsers(@Query("query") String query);

    @GET("functions/v1/force-runner-api-v2/friend-ranking")
    Call<Map<String, Object>> friendRanking(@Query("period") String period);
}
