package com.forcerunner.data.remote.model.auth;

import com.google.gson.annotations.SerializedName;

public class RecoverPasswordRequest {
    @SerializedName("email")
    private final String email;

    public RecoverPasswordRequest(String email) {
        this.email = email;
    }
}
