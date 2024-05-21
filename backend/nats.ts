import * as nats from "https://deno.land/x/nats@v1.25.0/src/mod.ts";
import { WorkerMap } from "./load.ts";

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
    reconnectTimeWait: 1000,
    reconnectJitter: 1000,
    maxReconnectAttempts: 5,
  });
  const js = nc.jetstream();

  return { nc, js };
};

export const getConsumer = async (
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
export const handleWork = async (client: NATSClient, workerMap: WorkerMap) => {
  const consumer = await getConsumer(client, "work", "work");
  await consume(consumer, async (m: nats.JsMsg) => {
    let workerTopic: string;
    let data: unknown;

    console.log("Received message");
    // TODO: Need to find a way to extend message deadline whilst work is carried out

    try {
      ({ workerTopic, data } = decodeMessage(m));
    } catch (err) {
      return m.term(`unable to parse message data and/or topic: ${err}`);
    }

    // Get the path via the subject on workerMap
    // Trigger appropriate worker
    // TODO: Test not existing worker
    const workerPath = workerMap[workerTopic];
    if (!workerPath) {
      return m.term("no matching worker found for message");
    }

    try {
      runWorker(workerPath, data, m.subject);
    } catch (err) {
      console.log(`failed to complete work: ${err}`);
      m.nak(1000 * 30); // Try again in 30 seconds
    }

    // TODO:
    // We should consider what behaviour is desired when a message is received
    // and execution begins, but the server is killed before completion (e.g. what will happen on any deploys)
    // Thoughts: Might be best to always re-issue non completed messages (i.e. nak them),
    // then offer mechanisms within JS to wrap things in idempotency guards

    await m.ackAck();
  });
};

const decodeMessage = (msg: nats.JsMsg): { workerTopic: string; data: any } => {
  const tokens = msg.subject.split(".");
  // subject will be in form: work.sequence_id.FLOW_NAME.WORKER_NAME
  const workerTopic = tokens.slice(2).join(".");

  const msgData = new TextDecoder().decode(msg.data);
  const data = JSON.parse(msgData);

  return {
    workerTopic,
    data,
  };
};

const runWorker = (workerPath: string, data: unknown, subject: string) => {
  const worker = new Worker(import.meta.resolve(workerPath), {
    type: "module",
  });

  worker.postMessage({ data, subject });

  const timeoutID = setTimeout(() => {
    worker.terminate();
  }, 1000 * 60 * 10);

  worker.onerror = (err: ErrorEvent) => {
    console.log("Worker error!:", err);
    clearTimeout(timeoutID);
  };

  worker.onmessage = (result: unknown) => {
    console.log("Received worker result:", result);
    clearTimeout(timeoutID);
  };
};
