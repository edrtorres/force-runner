package com.forcerunner.domain.model;

public class FriendRankingItem {
    private final int position;
    private final String userId;
    private final double totalDistanceMeters;
    private final double totalCalories;
    private final Friend profile;

    public FriendRankingItem(int position, String userId, double totalDistanceMeters, double totalCalories, Friend profile) {
        this.position = position;
        this.userId = userId;
        this.totalDistanceMeters = totalDistanceMeters;
        this.totalCalories = totalCalories;
        this.profile = profile;
    }

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

    public Friend getProfile() {
        return profile;
    }
}
