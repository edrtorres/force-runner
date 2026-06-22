package com.forcerunner.domain.repository;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.Friend;
import com.forcerunner.domain.model.FriendRanking;
import java.util.List;

public interface FriendRepository {
    AppResult<List<Friend>> searchUsers(String query);

    AppResult<FriendRanking> getFriendRanking(String period);
}
