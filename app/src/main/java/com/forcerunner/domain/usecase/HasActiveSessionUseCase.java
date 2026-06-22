package com.forcerunner.domain.usecase;

import com.forcerunner.domain.repository.SessionRepository;

public class HasActiveSessionUseCase {
    private final SessionRepository sessionRepository;

    public HasActiveSessionUseCase(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public boolean execute() {
        return sessionRepository.hasActiveSession();
    }
}
