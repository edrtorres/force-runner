package com.forcerunner.data.remote.model.profile;

import com.google.gson.annotations.SerializedName;

public class MeResponseDto {
    @SerializedName("profile")
    private UserProfileDto profile;

    @SerializedName("private_details")
    private PrivateDetailsDto privateDetails;

    @SerializedName("preferences")
    private UserPreferencesDto preferences;

    public UserProfileDto getProfile() {
        return profile;
    }

    public PrivateDetailsDto getPrivateDetails() {
        return privateDetails;
    }

    public UserPreferencesDto getPreferences() {
        return preferences;
    }
}
