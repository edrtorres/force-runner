package com.forcerunner.data.remote.model.coach;

import com.google.gson.annotations.SerializedName;

public class CoachRequest {
    @SerializedName("input_type")
    private final String inputType;

    @SerializedName("question")
    private final String question;

    @SerializedName("calories_goal")
    private final Double caloriesGoal;

    public CoachRequest(String inputType, String question, Double caloriesGoal) {
        this.inputType = inputType;
        this.question = question;
        this.caloriesGoal = caloriesGoal;
    }
}
