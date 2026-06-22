package com.forcerunner.data.mapper;

import com.forcerunner.data.remote.model.profile.MeResponseDto;
import com.forcerunner.data.remote.model.profile.PrivateDetailsDto;
import com.forcerunner.data.remote.model.profile.UserPreferencesDto;
import com.forcerunner.data.remote.model.profile.UserProfileDto;
import com.forcerunner.domain.model.UserProfile;

public final class ProfileMapper {
    private ProfileMapper() {
    }

    public static UserProfile toDomain(MeResponseDto dto) {
        UserProfileDto profile = dto.getProfile();
        PrivateDetailsDto privateDetails = dto.getPrivateDetails();
        UserPreferencesDto preferences = dto.getPreferences();
        return new UserProfile(
                profile != null ? profile.getId() : null,
                profile != null ? profile.getFullName() : null,
                profile != null ? profile.getDisplayName() : null,
                profile != null ? profile.getCountry() : null,
                profile != null ? profile.getAvatarUrl() : null,
                privateDetails != null ? privateDetails.getEmail() : null,
                privateDetails != null ? privateDetails.getPhone() : null,
                privateDetails != null ? privateDetails.getAge() : null,
                privateDetails != null ? privateDetails.getWeightKg() : null,
                preferences != null ? preferences.getTheme() : "light",
                preferences != null && preferences.isNotificationsEnabled()
        );
    }
}
