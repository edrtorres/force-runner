package com.forcerunner.data.remote;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public final class NetworkModule {
    private NetworkModule() {
    }

    public static OkHttpClient createHttpClient(TokenProvider tokenProvider) {
        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        return new OkHttpClient.Builder()
                .addInterceptor(new AuthInterceptor(tokenProvider))
                .addInterceptor(loggingInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    public static Retrofit createRetrofit(OkHttpClient client) {
        return new Retrofit.Builder()
                .baseUrl(ApiConfig.SUPABASE_BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    public static AuthApi createAuthApi(Retrofit retrofit) {
        return retrofit.create(AuthApi.class);
    }

    public static ForceRunnerApi createForceRunnerApi(Retrofit retrofit) {
        return retrofit.create(ForceRunnerApi.class);
    }
}
