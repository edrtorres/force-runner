package com.forcerunner.domain.repository;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.AuthSession;

public interface AuthRepository {
    AppResult<AuthSession> login(String email, String password);
}
