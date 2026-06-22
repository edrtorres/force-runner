export class AppError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Token no valido") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permiso para realizar esta accion") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
