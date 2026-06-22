package com.forcerunner.data.remote.model.friend;

import com.google.gson.annotations.SerializedName;

public class FriendRankingItemDto {
    @SerializedName("position")
    private int position;

    @SerializedName("user_id")
    private String userId;

    @SerializedName("total_distance_meters")
    private double totalDistanceMeters;

    @SerializedName("total_calories")
    private double totalCalories;

    @SerializedName("profile")
    private FriendDto profile;

    public int getPosition() {
        return position;
    }

    public String getUserId() {
        return userId;
    }

    public double getTotalDistanceMeters() {
        return totalDistanceMeters;
    }

    public double getTotalCalories() {
        return totalCalories;
    }

    public FriendDto getProfile() {
        return profile;
    }
}
