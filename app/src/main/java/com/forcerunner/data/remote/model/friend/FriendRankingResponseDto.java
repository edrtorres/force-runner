package com.forcerunner.data.remote.model.friend;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class FriendRankingResponseDto {
    @SerializedName("user_id")
    private String userId;

    @SerializedName("period")
    private String period;

    @SerializedName("ranking")
    private List<FriendRankingItemDto> ranking;

    public String getUserId() {
        return userId;
    }

    public String getPeriod() {
        return period;
    }

    public List<FriendRankingItemDto> getRanking() {
        return ranking;
    }
}
