package com.forcerunner.data.remote.model.chat;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class ConversationsResponseDto {
    @SerializedName("conversations")
    private List<ConversationDto> conversations;

    public List<ConversationDto> getConversations() {
        return conversations;
    }
}
