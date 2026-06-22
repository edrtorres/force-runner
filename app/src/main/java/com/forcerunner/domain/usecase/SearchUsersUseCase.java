package com.forcerunner.domain.usecase;

import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.Friend;
import com.forcerunner.domain.repository.FriendRepository;
import java.util.List;

public class SearchUsersUseCase {
    private final FriendRepository friendRepository;

    public SearchUsersUseCase(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    public AppResult<List<Friend>> execute(String query) {
        if (query == null || query.trim().length() < 2) {
            return AppResult.failure("Ingresa al menos 2 caracteres");
        }
        return friendRepository.searchUsers(query.trim());
    }
}
