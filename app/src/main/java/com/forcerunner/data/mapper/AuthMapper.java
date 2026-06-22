package com.forcerunner.data.mapper;

import com.forcerunner.data.remote.model.auth.AuthSessionDto;
import com.forcerunner.data.remote.model.auth.AuthUserDto;
import com.forcerunner.domain.model.AuthSession;

public final class AuthMapper {
    private AuthMapper() {
    }

    public static AuthSession toDomain(AuthSessionDto dto) {
        AuthUserDto user = dto.getUser();
        return new AuthSession(
                dto.getAccessToken(),
                dto.getRefreshToken(),
                dto.getExpiresIn(),
                user != null ? user.getId() : null,
                user != null ? user.getEmail() : null
        );
    }
}
