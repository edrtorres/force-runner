package com.forcerunner.domain.model;

public class Friend {
    private final String id;
    private final String displayName;
    private final String country;
    private final String avatarUrl;
    private final String friendshipStatus;

    public Friend(String id, String displayName, String country, String avatarUrl, String friendshipStatus) {
        this.id = id;
        this.displayName = displayName;
        this.country = country;
        this.avatarUrl = avatarUrl;
        this.friendshipStatus = friendshipStatus;
    }

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
