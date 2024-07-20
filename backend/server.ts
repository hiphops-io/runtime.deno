import {
  Application,
  Router,
  ListenOptions,
  Context,
} from "https://deno.land/x/oak@v16.0.0/mod.ts";
import { send } from "https://deno.land/x/oak@v16.0.0/send.ts";
import { isHttpError } from "jsr:@oak/commons@0.10/http_errors";

import { NATSClient } from "./nats.ts";
import { config } from "./config.ts";

export const serve = async (
  client: NATSClient,
  listenOptions: ListenOptions | undefined
) => {
  const router = new Router();
  router.get("/health", (ctx) => {
    if (client.nc.isClosed()) {
      ctx.response.status = 500;
      ctx.response.body = { message: "NATS connection closed" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "OK" };
  });

  // TODO: Make this conditional on the frontend existing
  router.get("/(.*)", async (ctx: Context, next: () => Promise<unknown>) => {
    try {
      await send(ctx, ctx.request.url.pathname, {
        root: config.siteDir,
        extensions: ["html"],
        index: "index.html",
        // immutable: true, // Note: Enable this once cache busting is in place
      });
    } catch (err) {
      if (isHttpError(err)) {
        ctx.response.status = err.status;
        ctx.response.body = { error: err.message };
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: "Unknown error occurred" };
      }
      ctx.response.type = "application/json";

      return;
    }

    await next();
  });

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  await app.listen(listenOptions);
};
