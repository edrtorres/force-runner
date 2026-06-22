package com.forcerunner.data.remote.model.coach;

import com.google.gson.annotations.SerializedName;

public class CoachResponseDto {
    @SerializedName("coach_message")
    private CoachMessageDto coachMessage;

    public CoachMessageDto getCoachMessage() {
        return coachMessage;
    }
}
