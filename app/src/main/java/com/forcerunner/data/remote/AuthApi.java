package com.forcerunner.data.remote;

import com.forcerunner.data.remote.model.auth.AuthSessionDto;
import com.forcerunner.data.remote.model.auth.AuthUserDto;
import com.forcerunner.data.remote.model.auth.LoginRequest;
import com.forcerunner.data.remote.model.auth.RecoverPasswordRequest;
import com.forcerunner.data.remote.model.auth.SignupRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface AuthApi {
    @POST("auth/v1/token")
    Call<AuthSessionDto> login(
            @Query("grant_type") String grantType,
            @Body LoginRequest body
    );

    @POST("auth/v1/signup")
    Call<AuthUserDto> signup(@Body SignupRequest body);

    @POST("auth/v1/recover")
    Call<Void> recover(@Body RecoverPasswordRequest body);

    @POST("auth/v1/logout")
    Call<Void> logout();
}
