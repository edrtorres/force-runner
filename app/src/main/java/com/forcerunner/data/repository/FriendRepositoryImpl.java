package com.forcerunner.data.repository;

import com.forcerunner.data.mapper.FriendMapper;
import com.forcerunner.data.remote.ForceRunnerApi;
import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.Friend;
import com.forcerunner.domain.model.FriendRanking;
import com.forcerunner.domain.repository.FriendRepository;
import java.util.List;

public class FriendRepositoryImpl implements FriendRepository {
    private final ForceRunnerApi forceRunnerApi;

    public FriendRepositoryImpl(ForceRunnerApi forceRunnerApi) {
        this.forceRunnerApi = forceRunnerApi;
    }

    @Override
    public AppResult<List<Friend>> searchUsers(String query) {
        return RemoteCallExecutor.executeApiResponse(forceRunnerApi.searchUsers(query), FriendMapper::toFriends);
    }

    @Override
    public AppResult<FriendRanking> getFriendRanking(String period) {
        return RemoteCallExecutor.executeApiResponse(forceRunnerApi.friendRanking(period), FriendMapper::toRanking);
    }
}
