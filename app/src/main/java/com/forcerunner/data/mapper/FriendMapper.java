package com.forcerunner.data.mapper;

import com.forcerunner.data.remote.model.friend.FriendDto;
import com.forcerunner.data.remote.model.friend.FriendRankingItemDto;
import com.forcerunner.data.remote.model.friend.FriendRankingResponseDto;
import com.forcerunner.data.remote.model.friend.SearchUsersResponseDto;
import com.forcerunner.domain.model.Friend;
import com.forcerunner.domain.model.FriendRanking;
import com.forcerunner.domain.model.FriendRankingItem;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class FriendMapper {
    private FriendMapper() {
    }

    public static List<Friend> toFriends(SearchUsersResponseDto dto) {
        if (dto == null || dto.getUsers() == null) {
            return Collections.emptyList();
        }
        List<Friend> friends = new ArrayList<>();
        for (FriendDto user : dto.getUsers()) {
            friends.add(toFriend(user));
        }
        return friends;
    }

    public static FriendRanking toRanking(FriendRankingResponseDto dto) {
        if (dto == null || dto.getRanking() == null) {
            return new FriendRanking("month", Collections.emptyList());
        }
        List<FriendRankingItem> items = new ArrayList<>();
        for (FriendRankingItemDto item : dto.getRanking()) {
            items.add(new FriendRankingItem(
                    item.getPosition(),
                    item.getUserId(),
                    item.getTotalDistanceMeters(),
                    item.getTotalCalories(),
                    toFriend(item.getProfile())
            ));
        }
        return new FriendRanking(dto.getPeriod(), items);
    }

    private static Friend toFriend(FriendDto dto) {
        if (dto == null) {
            return null;
        }
        return new Friend(
                dto.getId(),
                dto.getDisplayName(),
                dto.getCountry(),
                dto.getAvatarUrl(),
                dto.getFriendshipStatus()
        );
    }
}
