package com.forcerunner.data.remote.model.friend;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class SearchUsersResponseDto {
    @SerializedName("users")
    private List<FriendDto> users;

    public List<FriendDto> getUsers() {
        return users;
    }
}
