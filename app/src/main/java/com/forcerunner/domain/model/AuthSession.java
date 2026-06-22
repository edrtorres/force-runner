package com.forcerunner.domain.model;

public class AuthSession {
    private final String accessToken;
    private final String refreshToken;
    private final long expiresIn;
    private final String userId;
    private final String email;

    public AuthSession(String accessToken, String refreshToken, long expiresIn, String userId, String email) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.email = email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }
}
