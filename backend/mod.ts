import { config } from "./config.ts";
import { loadWorkers } from "./load.ts";
import { createNATSClient, closeNatsClient, handleWork } from "./nats.ts";
import { serve } from "./server.ts";

/** TODO: 
- Add some error handling (at least better logging of them)
  All errors at this level are fatal and better handled by container runtime's healthcheck/retry loop
- Add logging
- Add config options listen port/address.
*/

const main = async () => {
  console.log("Starting!");

  const natsClient = await createNATSClient(config.natsServers);
  const workerMap = await loadWorkers("/hiphops/flows/");

  await Promise.all([
    handleWork(natsClient, workerMap),
    serve(natsClient, { port: 8080, hostname: "0.0.0.0" }),
  ]);

  await closeNatsClient(natsClient);
};

if (import.meta.main) main();
