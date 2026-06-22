package com.forcerunner.data.remote.model.run;

import com.google.gson.annotations.SerializedName;

public class StatisticsDto {
    @SerializedName("user_id")
    private String userId;

    @SerializedName("total_runs")
    private int totalRuns;

    @SerializedName("total_distance_meters")
    private double totalDistanceMeters;

    @SerializedName("total_duration_seconds")
    private long totalDurationSeconds;

    @SerializedName("total_calories")
    private double totalCalories;

    public String getUserId() {
        return userId;
    }

    public int getTotalRuns() {
        return totalRuns;
    }

    public double getTotalDistanceMeters() {
        return totalDistanceMeters;
    }

    public long getTotalDurationSeconds() {
        return totalDurationSeconds;
    }

    public double getTotalCalories() {
        return totalCalories;
    }
}
