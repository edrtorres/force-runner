package com.forcerunner.data.remote.model;

import com.google.gson.annotations.SerializedName;

public class ApiResponse<T> {
    @SerializedName("ok")
    private boolean ok;

    @SerializedName("data")
    private T data;

    @SerializedName("error")
    private String error;

    public boolean isOk() {
        return ok;
    }

    public T getData() {
        return data;
    }

    public String getError() {
        return error;
    }
}
