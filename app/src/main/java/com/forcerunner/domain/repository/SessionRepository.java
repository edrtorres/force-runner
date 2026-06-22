package com.forcerunner.domain.repository;

public interface SessionRepository {
    boolean hasActiveSession();

    void clearSession();
}
