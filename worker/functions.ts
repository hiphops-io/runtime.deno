/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import type { ResultItem, RequestMessage, ResultMessage } from "./messages.ts";

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

export const call = (subject: string, payload?: unknown) => {
  const request: RequestMessage = {
    type: "request",
    subject: subject,
    payload: payload,
    id: 0,
  };
  self.postMessage(request);
  // TODO: Need to wait for and wire back the response
};

const executeAll = async (
  e: unknown
): Promise<PromiseSettledResult<unknown>[]> => {
  const calls = [];
  for (const fn of stepFunctions) {
    // TODO: We might want to deep copy e to prevent weird
    // behaviour if they try to mutate. Could also just document the behaviour
    calls.push(fn(e));
  }

  return await Promise.allSettled(calls);
};

const onInboundMessage = async (e: MessageEvent<unknown>) => {
  // TODO: Unwrap the MessageEvent to extract the actual data/hops info etc
  const results = await executeAll(e);
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

if (
  typeof WorkerGlobalScope !== "undefined" &&
  self instanceof WorkerGlobalScope
) {
  self.onmessage = onInboundMessage;
}
