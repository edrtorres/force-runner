package com.forcerunner.data.local;

import com.forcerunner.data.remote.TokenProvider;

public class SessionTokenProvider implements TokenProvider {
    private final SessionStorage sessionStorage;

    public SessionTokenProvider(SessionStorage sessionStorage) {
        this.sessionStorage = sessionStorage;
    }

    @Override
    public String getAccessToken() {
        return sessionStorage.getAccessToken();
    }
}
