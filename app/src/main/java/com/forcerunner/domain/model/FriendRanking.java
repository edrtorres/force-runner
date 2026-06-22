package com.forcerunner.domain.model;

import java.util.List;

public class FriendRanking {
    private final String period;
    private final List<FriendRankingItem> items;

    public FriendRanking(String period, List<FriendRankingItem> items) {
        this.period = period;
        this.items = items;
    }

    public String getPeriod() {
        return period;
    }

    public List<FriendRankingItem> getItems() {
        return items;
    }
}
