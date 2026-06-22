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
import com.forcerunner.data.repository.SessionRepositoryImpl;
import com.forcerunner.domain.repository.AuthRepository;
import com.forcerunner.domain.repository.FriendRepository;
import com.forcerunner.domain.repository.ProfileRepository;
import com.forcerunner.domain.repository.SessionRepository;
import com.forcerunner.domain.usecase.GetCurrentProfileUseCase;
import com.forcerunner.domain.usecase.GetFriendRankingUseCase;
import com.forcerunner.domain.usecase.HasActiveSessionUseCase;
import com.forcerunner.domain.usecase.LoginUseCase;
import com.forcerunner.domain.usecase.SearchUsersUseCase;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;

public class AppContainer {
    private final SessionStorage sessionStorage;
    private final AuthRepository authRepository;
    private final ProfileRepository profileRepository;
    private final FriendRepository friendRepository;
    private final SessionRepository sessionRepository;

    private final LoginUseCase loginUseCase;
    private final HasActiveSessionUseCase hasActiveSessionUseCase;
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

        authRepository = new AuthRepositoryImpl(authApi, sessionStorage);
        profileRepository = new ProfileRepositoryImpl(forceRunnerApi);
        friendRepository = new FriendRepositoryImpl(forceRunnerApi);
        sessionRepository = new SessionRepositoryImpl(sessionStorage);

        loginUseCase = new LoginUseCase(authRepository);
        hasActiveSessionUseCase = new HasActiveSessionUseCase(sessionRepository);
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

    public HasActiveSessionUseCase getHasActiveSessionUseCase() {
        return hasActiveSessionUseCase;
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
