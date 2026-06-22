package com.forcerunner.domain.model;

public class UserProfile {
    private final String id;
    private final String fullName;
    private final String displayName;
    private final String country;
    private final String avatarUrl;
    private final String email;
    private final String phone;
    private final Integer age;
    private final Double weightKg;
    private final String theme;
    private final boolean notificationsEnabled;

    public UserProfile(String id, String fullName, String displayName, String country, String avatarUrl, String email, String phone, Integer age, Double weightKg, String theme, boolean notificationsEnabled) {
        this.id = id;
        this.fullName = fullName;
        this.displayName = displayName;
        this.country = country;
        this.avatarUrl = avatarUrl;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.weightKg = weightKg;
        this.theme = theme;
        this.notificationsEnabled = notificationsEnabled;
    }

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

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Integer getAge() {
        return age;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public String getTheme() {
        return theme;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }
}
