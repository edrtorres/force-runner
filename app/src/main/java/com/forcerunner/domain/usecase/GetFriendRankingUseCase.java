package com.forcerunner.domain.usecase;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.FriendRanking;
import com.forcerunner.domain.repository.FriendRepository;

public class GetFriendRankingUseCase {
    private final FriendRepository friendRepository;

    public GetFriendRankingUseCase(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    public AppResult<FriendRanking> execute(String period) {
        String normalizedPeriod = "week".equals(period) ? "week" : "month";
        return friendRepository.getFriendRanking(normalizedPeriod);
    }
}
