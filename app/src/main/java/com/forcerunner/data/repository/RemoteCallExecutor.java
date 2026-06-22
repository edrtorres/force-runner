package com.forcerunner.data.repository;

import com.forcerunner.data.remote.model.ApiResponse;
import com.forcerunner.domain.common.AppResult;
import java.io.IOException;
import retrofit2.Call;
import retrofit2.Response;

final class RemoteCallExecutor {
    private static final String NETWORK_ERROR = "No se pudo conectar con el servidor";
    private static final String EMPTY_RESPONSE = "Respuesta vacia del servidor";

    private RemoteCallExecutor() {
    }

    interface Mapper<I, O> {
        O map(I input);
    }

    static <T, R> AppResult<R> executeApiResponse(Call<ApiResponse<T>> call, Mapper<T, R> mapper) {
        try {
            Response<ApiResponse<T>> response = call.execute();
            if (!response.isSuccessful()) {
                return AppResult.failure("Error del servidor: " + response.code());
            }
            ApiResponse<T> body = response.body();
            if (body == null) {
                return AppResult.failure(EMPTY_RESPONSE);
            }
            if (!body.isOk()) {
                return AppResult.failure(body.getError() != null ? body.getError() : "Operacion no completada");
            }
            return AppResult.success(mapper.map(body.getData()));
        } catch (IOException exception) {
            return AppResult.failure(NETWORK_ERROR);
        }
    }

    static <T, R> AppResult<R> execute(Call<T> call, Mapper<T, R> mapper) {
        try {
            Response<T> response = call.execute();
            if (!response.isSuccessful()) {
                return AppResult.failure("Error del servidor: " + response.code());
            }
            T body = response.body();
            if (body == null) {
                return AppResult.failure(EMPTY_RESPONSE);
            }
            return AppResult.success(mapper.map(body));
        } catch (IOException exception) {
            return AppResult.failure(NETWORK_ERROR);
        }
    }
}
