package com.forcerunner.data.remote;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {
    private final TokenProvider tokenProvider;

    public AuthInterceptor(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();
        Request.Builder builder = original.newBuilder()
                .header("apikey", ApiConfig.SUPABASE_PUBLISHABLE_KEY)
                .header("Content-Type", "application/json");

        String accessToken = tokenProvider.getAccessToken();
        if (accessToken != null && !accessToken.trim().isEmpty()) {
            builder.header("Authorization", "Bearer " + accessToken);
        }

        return chain.proceed(builder.build());
    }
}
