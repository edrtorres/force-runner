package com.forcerunner.data.remote.model.auth;

import com.google.gson.annotations.SerializedName;

public class SignupRequest {
    @SerializedName("email")
    private final String email;

    @SerializedName("password")
    private final String password;

    @SerializedName("phone")
    private final String phone;

    public SignupRequest(String email, String password, String phone) {
        this.email = email;
        this.password = password;
        this.phone = phone;
    }
}
