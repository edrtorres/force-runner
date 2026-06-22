package com.forcerunner.domain.common;

public class AppResult<T> {
    private final T data;
    private final String error;

    private AppResult(T data, String error) {
        this.data = data;
        this.error = error;
    }

    public static <T> AppResult<T> success(T data) {
        return new AppResult<>(data, null);
    }

    public static <T> AppResult<T> failure(String error) {
        return new AppResult<>(null, error);
    }

    public boolean isSuccess() {
        return error == null;
    }

    public T getData() {
        return data;
    }

    public String getError() {
        return error;
    }
}
