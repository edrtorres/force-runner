package com.forcerunner.data.remote.model.chat;

import com.google.gson.annotations.SerializedName;

public class MessageDto {
    @SerializedName("id")
    private String id;

    @SerializedName("conversation_id")
    private String conversationId;

    @SerializedName("sender_id")
    private String senderId;

    @SerializedName("body")
    private String body;

    @SerializedName("created_at")
    private String createdAt;

    public String getId() {
        return id;
    }

    public String getConversationId() {
        return conversationId;
    }

    public String getSenderId() {
        return senderId;
    }

    public String getBody() {
        return body;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
