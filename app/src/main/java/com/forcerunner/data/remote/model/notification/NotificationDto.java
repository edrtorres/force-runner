package com.forcerunner.data.remote.model.notification;

import com.google.gson.annotations.SerializedName;

public class NotificationDto {
    @SerializedName("id")
    private String id;

    @SerializedName("type")
    private String type;

    @SerializedName("title")
    private String title;

    @SerializedName("body")
    private String body;

    @SerializedName("created_at")
    private String createdAt;

    @SerializedName("read_at")
    private String readAt;

    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getReadAt() {
        return readAt;
    }
}
