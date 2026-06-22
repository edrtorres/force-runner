package com.forcerunner.data.remote.model.chat;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class MessagesResponseDto {
    @SerializedName("conversation")
    private ConversationDto conversation;

    @SerializedName("messages")
    private List<MessageDto> messages;

    public ConversationDto getConversation() {
        return conversation;
    }

    public List<MessageDto> getMessages() {
        return messages;
    }
}
