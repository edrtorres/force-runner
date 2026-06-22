package com.forcerunner.data.local;

public interface SessionStorage {
    String getAccessToken();

    void saveAccessToken(String accessToken);

    void clear();
}
