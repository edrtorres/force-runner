package com.forcerunner.data.remote;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface AuthApi {
    @POST("auth/v1/token")
    Call<Map<String, Object>> login(
            @Query("grant_type") String grantType,
            @Body Map<String, Object> body
    );

    @POST("auth/v1/signup")
    Call<Map<String, Object>> signup(@Body Map<String, Object> body);

    @POST("auth/v1/recover")
    Call<Map<String, Object>> recover(@Body Map<String, Object> body);

    @POST("auth/v1/logout")
    Call<Map<String, Object>> logout();
}
