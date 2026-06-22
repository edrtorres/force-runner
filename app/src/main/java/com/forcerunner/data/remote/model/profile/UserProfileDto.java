package com.forcerunner.data.remote.model.profile;

import com.google.gson.annotations.SerializedName;

public class UserProfileDto {
    @SerializedName("id")
    private String id;

    @SerializedName("full_name")
    private String fullName;

    @SerializedName("display_name")
    private String displayName;

    @SerializedName("country")
    private String country;

    @SerializedName("avatar_url")
    private String avatarUrl;

    public String getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCountry() {
        return country;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }
}
