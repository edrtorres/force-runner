package com.forcerunner.data.remote.model.notification;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class NotificationsResponseDto {
    @SerializedName("notifications")
    private List<NotificationDto> notifications;

    public List<NotificationDto> getNotifications() {
        return notifications;
    }
}
