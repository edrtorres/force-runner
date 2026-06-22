package com.forcerunner.data.remote;

public class EmptyTokenProvider implements TokenProvider {
    @Override
    public String getAccessToken() {
        return null;
    }
}
