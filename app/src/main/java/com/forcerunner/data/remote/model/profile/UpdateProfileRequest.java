package com.forcerunner.data.remote.model.profile;

import com.google.gson.annotations.SerializedName;

public class UpdateProfileRequest {
    @SerializedName("full_name")
    private final String fullName;

    @SerializedName("display_name")
    private final String displayName;

    @SerializedName("country")
    private final String country;

    @SerializedName("phone")
    private final String phone;

    @SerializedName("age")
    private final Integer age;

    @SerializedName("weight_kg")
    private final Double weightKg;

    @SerializedName("theme")
    private final String theme;

    @SerializedName("notifications_enabled")
    private final Boolean notificationsEnabled;

    public UpdateProfileRequest(String fullName, String displayName, String country, String phone, Integer age, Double weightKg, String theme, Boolean notificationsEnabled) {
        this.fullName = fullName;
        this.displayName = displayName;
        this.country = country;
        this.phone = phone;
        this.age = age;
        this.weightKg = weightKg;
        this.theme = theme;
        this.notificationsEnabled = notificationsEnabled;
    }
}
