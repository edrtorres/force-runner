package com.forcerunner.data.remote.model.profile;

import com.google.gson.annotations.SerializedName;

public class PrivateDetailsDto {
    @SerializedName("email")
    private String email;

    @SerializedName("phone")
    private String phone;

    @SerializedName("age")
    private Integer age;

    @SerializedName("weight_kg")
    private Double weightKg;

    @SerializedName("accepted_terms")
    private boolean acceptedTerms;

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Integer getAge() {
        return age;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public boolean hasAcceptedTerms() {
        return acceptedTerms;
    }
}
