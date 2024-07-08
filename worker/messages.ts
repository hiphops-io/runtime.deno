export type HiphopsMsg = {
  data: HiphopsMsgData;
  subject: string;
};

export type HiphopsMsgData = {
  hops: {
    event: string;
    source: string;
    action?: string;
  };
  [key: string]: unknown;
};

// TODO: We might not need the custom Result/Request message types now that we're using comlink.
// Check and delete if so
export type ResultItem = {
  error: string | null;
  result: unknown;
};

export type ResultMessage = {
  type: "result";
  hasErrors: boolean;
  results: ResultItem[];
};

export type RequestMessage = {
  type: "request";
  subject: string;
  payload: unknown;
  id: number;
};

export type ResponseMessage = {
  type: "response";
  payload: unknown;
  id: number;
};

export type WorkerMessages = ResultMessage | RequestMessage;
