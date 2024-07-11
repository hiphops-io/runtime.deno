// This was removed as it was causing LSP issues for unstable features. If it causes issues, then replace
// /// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import type {
  ResultItem,
  ResultMessage,
  HiphopsMsg,
  HiphopsMsgData,
} from "./messages.ts";
import * as Comlink from "https://unpkg.com/comlink@4.4.1/dist/esm/comlink.mjs";

export type StepFunction = (e: HiphopsMsg) => unknown;

// stepFunctions stores all the functions that users have scheduled with hiphops.run
const stepFunctions: StepFunction[] = [];
// workspaceDir stores the path to the workspace folder this function has write access to
let workspaceDir = "";

/** run queues a function for execution */
export const run = (fn: StepFunction) => {
  stepFunctions.push(fn);
};

export const workspace = () => {
  try {
    Deno.mkdirSync(workspaceDir);
  } catch (err) {
    if (!(err instanceof Deno.errors.AlreadyExists)) {
      throw err;
    }
  }

  return workspaceDir;
};

const executeAll = async (
  e: HiphopsMsg
): Promise<PromiseSettledResult<unknown>[]> => {
  const calls = [];
  for (const fn of stepFunctions) {
    calls.push(fn(e));
  }

  return await Promise.allSettled(calls);
};

const onInboundMessage = async (msg: HiphopsMsg) => {
  const results = await executeAll(msg);
  return prepareResults(results);
};

const prepareResults = (
  promiseResults: PromiseSettledResult<unknown>[]
): ResultMessage => {
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
      throw new Error(r.reason);
      result.hasErrors = true;
      resultItem.error = r.reason;
    }

    result.results.push(resultItem);
  }

  return result;
};

// callHandler is provided by the worker parent to handle outbound requests
let callHandler: (s: string, p?: unknown) => Promise<unknown>;

// call is used by users e.g. hiphops.call("hiphops.someservice.dothing", "somepayload")
// the requests are sent onto the worker parent and dispatched onwards
export const call = async (
  subject: string,
  payload?: unknown
): Promise<unknown> => {
  return await callHandler(subject, payload);
};

Comlink.expose(
  (
    message: { subject: string; data: HiphopsMsgData },
    request: (s: string, p?: unknown) => Promise<unknown>,
    context: { workspaceDir: string; codeDir: string }
  ) => {
    workspaceDir = context.workspaceDir;
    CODE_DIR = context.codeDir;

    callHandler = request;
    return onInboundMessage(message);
  }
);
