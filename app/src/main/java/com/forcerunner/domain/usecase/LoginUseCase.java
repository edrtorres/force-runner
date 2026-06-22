package com.forcerunner.domain.usecase;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.AuthSession;
import com.forcerunner.domain.repository.AuthRepository;

public class LoginUseCase {
    private final AuthRepository authRepository;

    public LoginUseCase(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public AppResult<AuthSession> execute(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            return AppResult.failure("El correo es obligatorio");
        }
        if (password == null || password.trim().isEmpty()) {
            return AppResult.failure("La contrasena es obligatoria");
        }
        return authRepository.login(email.trim(), password);
    }
}
