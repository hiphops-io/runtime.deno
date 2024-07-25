import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";

import { call } from "./functions.ts";

export const auth = async (): Promise<string> => {
  return (await call("hiphops.slack.accesstoken")) as string;
};

export const client = async () => {
  const token: string = await auth();
  const slackClient = SlackAPI(token);
  // Workaround for: https://github.com/slackapi/deno-slack-api/issues/107
  Object.assign(slackClient, { then: undefined });
  return slackClient;
};
