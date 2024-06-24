/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import type { ResultItem, ResultMessage } from "./messages.ts";
import * as Comlink from "https://unpkg.com/comlink@4.4.1/dist/esm/comlink.mjs";

/**
 * TODO:
 * - Create type for inbound Hiphops event
 * - Create type for Hiphops result
 * - Create type for unwrapped event passed to step function
 */

export type StepFunction = (e: unknown) => unknown;

const stepFunctions: StepFunction[] = [];

/** run queues a function for execution */
export const run = (fn: StepFunction) => {
  stepFunctions.push(fn);
};

let callHandler: (s: string, p?: unknown) => Promise<unknown>;

export const call = async (
  subject: string,
  payload?: unknown
): Promise<unknown> => {
  return await callHandler(subject, payload);
};

const executeAll = async (
  e: unknown
): Promise<PromiseSettledResult<unknown>[]> => {
  const calls = [];
  for (const fn of stepFunctions) {
    calls.push(fn(e));
  }

  return await Promise.allSettled(calls);
};

const onInboundMessage = async (msg: { subject: string; data: unknown }) => {
  // TODO: Unwrap the MessageEvent to extract the actual data/hops info etc
  const results = await executeAll(msg);
  sendResults(results);
  self.close();
};

const sendResults = (promiseResults: PromiseSettledResult<unknown>[]) => {
  const result: ResultMessage = {
    type: "result",
    hasErrors: false,
    results: [],
  };

  for (const r of promiseResults) {
    const resultItem: ResultItem = {
      result: undefined,
      error: null,
    };

    if (r.status === "fulfilled") {
      resultItem.result = r.value;
    } else {
      result.hasErrors = true;
      resultItem.error = r.reason;
    }

    result.results.push(resultItem);
  }

  self.postMessage(result);
};

Comlink.expose(
  (
    message: { subject: string; data: unknown },
    request: (s: string, p?: unknown) => Promise<unknown>
  ) => {
    callHandler = request;
    onInboundMessage(message);
  }
);
