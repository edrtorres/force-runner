package com.forcerunner.di;

import android.content.Context;

import com.forcerunner.data.local.SessionStorage;
import com.forcerunner.data.local.SessionTokenProvider;
import com.forcerunner.data.local.SharedPreferencesSessionStorage;
import com.forcerunner.data.remote.AuthApi;
import com.forcerunner.data.remote.ForceRunnerApi;
import com.forcerunner.data.remote.NetworkModule;
import com.forcerunner.data.remote.TokenProvider;
import com.forcerunner.data.repository.AuthRepositoryImpl;
import com.forcerunner.data.repository.FriendRepositoryImpl;
import com.forcerunner.data.repository.ProfileRepositoryImpl;
import com.forcerunner.domain.repository.AuthRepository;
import com.forcerunner.domain.repository.FriendRepository;
import com.forcerunner.domain.repository.ProfileRepository;
import com.forcerunner.domain.usecase.GetCurrentProfileUseCase;
import com.forcerunner.domain.usecase.GetFriendRankingUseCase;
import com.forcerunner.domain.usecase.LoginUseCase;
import com.forcerunner.domain.usecase.SearchUsersUseCase;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;

public class AppContainer {
    private final SessionStorage sessionStorage;
    private final AuthRepository authRepository;
    private final ProfileRepository profileRepository;
    private final FriendRepository friendRepository;

    private final LoginUseCase loginUseCase;
    private final GetCurrentProfileUseCase getCurrentProfileUseCase;
    private final SearchUsersUseCase searchUsersUseCase;
    private final GetFriendRankingUseCase getFriendRankingUseCase;

    public AppContainer(Context context) {
        sessionStorage = new SharedPreferencesSessionStorage(context);
        TokenProvider tokenProvider = new SessionTokenProvider(sessionStorage);
        OkHttpClient httpClient = NetworkModule.createHttpClient(tokenProvider);
        Retrofit retrofit = NetworkModule.createRetrofit(httpClient);
        AuthApi authApi = NetworkModule.createAuthApi(retrofit);
        ForceRunnerApi forceRunnerApi = NetworkModule.createForceRunnerApi(retrofit);

        authRepository = new AuthRepositoryImpl(authApi);
        profileRepository = new ProfileRepositoryImpl(forceRunnerApi);
        friendRepository = new FriendRepositoryImpl(forceRunnerApi);

        loginUseCase = new LoginUseCase(authRepository);
        getCurrentProfileUseCase = new GetCurrentProfileUseCase(profileRepository);
        searchUsersUseCase = new SearchUsersUseCase(friendRepository);
        getFriendRankingUseCase = new GetFriendRankingUseCase(friendRepository);
    }

    public SessionStorage getSessionStorage() {
        return sessionStorage;
    }

    public LoginUseCase getLoginUseCase() {
        return loginUseCase;
    }

    public GetCurrentProfileUseCase getGetCurrentProfileUseCase() {
        return getCurrentProfileUseCase;
    }

    public SearchUsersUseCase getSearchUsersUseCase() {
        return searchUsersUseCase;
    }

    public GetFriendRankingUseCase getGetFriendRankingUseCase() {
        return getFriendRankingUseCase;
    }
}
