package com.forcerunner.data.repository;

import com.forcerunner.data.mapper.ProfileMapper;
import com.forcerunner.data.remote.ForceRunnerApi;
import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.UserProfile;
import com.forcerunner.domain.repository.ProfileRepository;

public class ProfileRepositoryImpl implements ProfileRepository {
    private final ForceRunnerApi forceRunnerApi;

    public ProfileRepositoryImpl(ForceRunnerApi forceRunnerApi) {
        this.forceRunnerApi = forceRunnerApi;
    }

    @Override
    public AppResult<UserProfile> getCurrentProfile() {
        return RemoteCallExecutor.executeApiResponse(forceRunnerApi.getMe(), ProfileMapper::toDomain);
    }
}
