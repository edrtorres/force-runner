package com.forcerunner.data.local;

import android.content.Context;
import android.content.SharedPreferences;

public class SharedPreferencesSessionStorage implements SessionStorage {
    private static final String FILE_NAME = "force_runner_session";
    private static final String KEY_ACCESS_TOKEN = "access_token";

    private final SharedPreferences preferences;

    public SharedPreferencesSessionStorage(Context context) {
        preferences = context.getApplicationContext().getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE);
    }

    @Override
    public String getAccessToken() {
        return preferences.getString(KEY_ACCESS_TOKEN, null);
    }

    @Override
    public void saveAccessToken(String accessToken) {
        preferences.edit().putString(KEY_ACCESS_TOKEN, accessToken).apply();
    }

    @Override
    public void clear() {
        preferences.edit().clear().apply();
    }
}
