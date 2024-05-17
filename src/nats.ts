import * as nats from "https://deno.land/x/nats@v1.25.0/src/mod.ts";

export interface NATSClient {
  nc: nats.NatsConnection;
  js: nats.JetStreamClient;
}

export const closeNatsClient = async (client: NATSClient) => {
  const err = await client.nc.closed();
  if (err) {
    throw err;
  }
};

export const createNATSClient = async (
  servers: string | string[]
): Promise<NATSClient> => {
  const nc = await nats.connect({
    servers,
    reconnect: true,
    reconnectTimeWait: 500,
    reconnectJitter: 1000,
    maxReconnectAttempts: 5,
  });
  const js = nc.jetstream();

  return { nc, js };
};

export const createConsumer = async (
  client: NATSClient,
  stream: string,
  consumer: string
) => {
  return await client.js.consumers.get(stream, consumer);
};

export const consume = async (
  consumer: nats.Consumer,
  callback: (msg: nats.JsMsg) => Promise<void>
) => {
  const messages = await consumer.consume();
  for await (const m of messages) {
    try {
      await callback(m);
      await m.ackAck();
    } catch (err) {
      // TODO: Add proper logging
      console.log(`Error handling message: ${err}`);
      m.nak(1000 * 60);
    }
  }
};

/** handleWork consumes messages from NATS and executes the appropriate user code */
export const handleWork = async (client: NATSClient) => {
  const consumer = await createConsumer(client, "notify", "notify");
  await consume(consumer, async (m: nats.JsMsg) => {
    const msgData = new TextDecoder().decode(m.data);
    const msgJSON = JSON.parse(msgData);

    // TODO: Actually dispatch a worker.
    // We should consider what behaviour is desired when a message is received
    // and execution begins, but the server is killed before completion (e.g. what will happen on any deploys)
    // Thoughts: Might be best to always re-issue non completed, then offer mechanisms within JS to wrap things in idempotency guards

    console.log("Message json is:", msgJSON);

    await m.ackAck();
  });
};
