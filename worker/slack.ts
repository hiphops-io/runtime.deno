import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";

import { call } from "./functions.ts";

export const client = async () => {
  const token: string = (await call("hiphops.slack.accesstoken")) as string;

  return SlackAPI(token);
};
