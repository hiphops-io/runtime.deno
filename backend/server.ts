import {
  Application,
  Router,
  ListenOptions,
} from "https://deno.land/x/oak@v16.0.0/mod.ts";
import { NATSClient } from "./nats.ts";

export const serve = async (
  client: NATSClient,
  listenOptions: ListenOptions | undefined
) => {
  const router = new Router();
  router.get("/health", (context) => {
    if (client.nc.isClosed()) {
      context.response.status = 500;
      context.response.body = { message: "NATS connection closed" };
      return;
    }

    context.response.status = 200;
    context.response.body = { message: "OK" };
  });

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  await app.listen(listenOptions);
};
