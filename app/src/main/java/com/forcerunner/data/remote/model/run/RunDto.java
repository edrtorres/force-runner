package com.forcerunner.data.remote.model.run;

import com.google.gson.annotations.SerializedName;

public class RunDto {
    @SerializedName("id")
    private String id;

    @SerializedName("user_id")
    private String userId;

    @SerializedName("started_at")
    private String startedAt;

    @SerializedName("ended_at")
    private String endedAt;

    @SerializedName("duration_seconds")
    private long durationSeconds;

    @SerializedName("distance_meters")
    private double distanceMeters;

    @SerializedName("calories")
    private double calories;

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getStartedAt() {
        return startedAt;
    }

    public String getEndedAt() {
        return endedAt;
    }

    public long getDurationSeconds() {
        return durationSeconds;
    }

    public double getDistanceMeters() {
        return distanceMeters;
    }

    public double getCalories() {
        return calories;
    }
}
