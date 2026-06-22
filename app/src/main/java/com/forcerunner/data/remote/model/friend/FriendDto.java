package com.forcerunner.data.remote.model.friend;

import com.google.gson.annotations.SerializedName;

public class FriendDto {
    @SerializedName("id")
    private String id;

    @SerializedName("display_name")
    private String displayName;

    @SerializedName("country")
    private String country;

    @SerializedName("avatar_url")
    private String avatarUrl;

    @SerializedName("friendship_status")
    private String friendshipStatus;

    public String getId() {
        return id;
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

    public String getFriendshipStatus() {
        return friendshipStatus;
    }
}
