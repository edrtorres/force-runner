package com.forcerunner.data.remote.model.coach;

import com.google.gson.annotations.SerializedName;

public class CoachMessageDto {
    @SerializedName("id")
    private String id;

    @SerializedName("input_type")
    private String inputType;

    @SerializedName("question")
    private String question;

    @SerializedName("answer")
    private String answer;

    @SerializedName("calories_goal")
    private Double caloriesGoal;

    public String getId() {
        return id;
    }

    public String getInputType() {
        return inputType;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }

    public Double getCaloriesGoal() {
        return caloriesGoal;
    }
}
