package com.forcerunner.data.remote.model.profile;

import com.google.gson.annotations.SerializedName;

public class UserPreferencesDto {
    @SerializedName("theme")
    private String theme;

    @SerializedName("language")
    private String language;

    @SerializedName("notifications_enabled")
    private boolean notificationsEnabled;

    public String getTheme() {
        return theme;
    }

    public String getLanguage() {
        return language;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }
}
