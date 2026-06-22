import type { AuthenticatedRequest, Controller } from "../shared/http.ts";

export class FunctionController implements Controller {
  constructor(private readonly action: (context: AuthenticatedRequest) => Promise<unknown>) {}

  handle(context: AuthenticatedRequest) {
    return this.action(context);
  }
}
