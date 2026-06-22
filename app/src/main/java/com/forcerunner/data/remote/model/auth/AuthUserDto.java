package com.forcerunner.data.remote.model.auth;

import com.google.gson.annotations.SerializedName;

public class AuthUserDto {
    @SerializedName("id")
    private String id;

    @SerializedName("email")
    private String email;

    @SerializedName("phone")
    private String phone;

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }
}
