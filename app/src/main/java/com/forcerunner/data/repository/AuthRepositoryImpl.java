package com.forcerunner.data.repository;

import com.forcerunner.data.mapper.AuthMapper;
import com.forcerunner.data.remote.AuthApi;
import com.forcerunner.data.remote.model.auth.LoginRequest;
import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.AuthSession;
import com.forcerunner.domain.repository.AuthRepository;

public class AuthRepositoryImpl implements AuthRepository {
    private static final String PASSWORD_GRANT = "password";

    private final AuthApi authApi;

    public AuthRepositoryImpl(AuthApi authApi) {
        this.authApi = authApi;
    }

    @Override
    public AppResult<AuthSession> login(String email, String password) {
        return RemoteCallExecutor.execute(
                authApi.login(PASSWORD_GRANT, new LoginRequest(email, password)),
                AuthMapper::toDomain
        );
    }
}
