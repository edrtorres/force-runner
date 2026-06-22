import type { ProfileRepository } from "../../domain/repositories.ts";

export class GetMeUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  execute(userId: string) {
    return this.profiles.getMe(userId);
  }
}

export class UpdateMeUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  execute(userId: string, input: Record<string, unknown>) {
    return this.profiles.updateMe(userId, input);
  }
}
