import { createNATSClient, closeNatsClient, handleWork } from "./nats.ts";
import { serve } from "./server.ts";

/** TODO: 
- Add some error handling (at least better logging of them)
  All errors at this level are fatal and better handled by container runtime's healthcheck/retry loop
- Add logging
- Add config options for nats server address and listen port/address.
*/
const main = async () => {
  const natsClient = await createNATSClient("hops:4222");

  await Promise.all([
    handleWork(natsClient),
    serve(natsClient, { port: 8080, hostname: "0.0.0.0" }),
  ]);

  await closeNatsClient(natsClient);
};

if (import.meta.main) main();
