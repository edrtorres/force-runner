package com.forcerunner.domain.usecase;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.UserProfile;
import com.forcerunner.domain.repository.ProfileRepository;

public class GetCurrentProfileUseCase {
    private final ProfileRepository profileRepository;

    public GetCurrentProfileUseCase(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public AppResult<UserProfile> execute() {
        return profileRepository.getCurrentProfile();
    }
}
