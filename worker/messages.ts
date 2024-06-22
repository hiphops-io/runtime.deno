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
