package com.forcerunner.domain.repository;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.UserProfile;

public interface ProfileRepository {
    AppResult<UserProfile> getCurrentProfile();
}
