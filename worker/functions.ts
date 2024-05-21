/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

/**
 * TODO:
 * - Create type for inbound Hiphops event
 * - Create type for Hiphops result
 */

export type StepFunction = (e: unknown) => unknown;

let stepFunctions: StepFunction[] = [];

/** run queues a function for execution */
export const run = (fn: StepFunction) => {
  stepFunctions.push(fn);
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

const onWorkerMessage = async (e: unknown) => {
  const results = await executeAll(e);

  try {
    sendResults(results);
  } catch (err) {
    self.postMessage({ completed: false, error: err.message, results: [] });
  }

  self.close();
};

const sendResults = (promiseResults: PromiseSettledResult<unknown>[]) => {
  const results = [];
  let completed = true;

  for (const r of promiseResults) {
    if (r.status === "fulfilled") {
      results.push(r.value);
      continue;
    }

    completed = false;
    results.push({ error: r.reason });
  }

  self.postMessage({ completed, results: results });
};

if (
  typeof WorkerGlobalScope !== "undefined" &&
  self instanceof WorkerGlobalScope
) {
  self.onmessage = onWorkerMessage;
}
