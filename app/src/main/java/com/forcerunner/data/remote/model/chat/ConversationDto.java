package com.forcerunner.data.remote.model.chat;

import com.forcerunner.data.remote.model.friend.FriendDto;
import com.google.gson.annotations.SerializedName;

public class ConversationDto {
    @SerializedName("id")
    private String id;

    @SerializedName("user_a_id")
    private String userAId;

    @SerializedName("user_b_id")
    private String userBId;

    @SerializedName("last_message_at")
    private String lastMessageAt;

    @SerializedName("friend")
    private FriendDto friend;

    public String getId() {
        return id;
    }

    public String getUserAId() {
        return userAId;
    }

    public String getUserBId() {
        return userBId;
    }

    public String getLastMessageAt() {
        return lastMessageAt;
    }

    public FriendDto getFriend() {
        return friend;
    }
}
