import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";

import { call } from "./functions.ts";

export const client = async () => {
  console.log("Creating client");
  const { client } = await _client();
  console.log("Got client internally");
  return client;
};

export const _client = async () => {
  console.log("Internally getting client");
  const token: string = (await call("hiphops.slack.accesstoken")) as string;
  console.log("Got token");
  return { client: SlackAPI(token) };
};
