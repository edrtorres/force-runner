import { createApp } from "./presentation/app.ts";
import { createContainer } from "./shared/container.ts";

const app = createApp(createContainer());

Deno.serve((request: Request) => app.handle(request));
