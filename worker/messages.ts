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

export type ResultItem = {
  error: string | null;
  result: unknown;
};

export type ResultMessage = {
  type: "result";
  hasErrors: boolean;
  results: ResultItem[];
};
