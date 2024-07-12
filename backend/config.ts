import { Env } from "https://cdn.skypack.dev/@humanwhocodes/env?dts";

const env = new Env();

export const config = {
  natsServers: env.get("NATS_SERVER_URLS", "hops:4222").split(","),
  workspacesDir: env.get("WORKSPACES_DIR", "/workspaces"),
  workerTimeout: Number(env.get("WORKER_TIMEOUT_SECONDS", "600")),
  workerGracePeriod: Number(env.get("WORKER_GRACE_PERIOD_SECONDS", "120")),
};
