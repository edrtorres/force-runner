package com.forcerunner.data.repository;

import com.forcerunner.data.local.SessionStorage;
import com.forcerunner.domain.repository.SessionRepository;

public class SessionRepositoryImpl implements SessionRepository {
    private final SessionStorage sessionStorage;

    public SessionRepositoryImpl(SessionStorage sessionStorage) {
        this.sessionStorage = sessionStorage;
    }

    @Override
    public boolean hasActiveSession() {
        String accessToken = sessionStorage.getAccessToken();
        return accessToken != null && !accessToken.trim().isEmpty();
    }

    @Override
    public void clearSession() {
        sessionStorage.clear();
    }
}
