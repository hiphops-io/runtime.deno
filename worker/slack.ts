import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";

import { call } from "./functions.ts";

export const client = async () => {
  console.log("Getting slack client token");
  const token: string = (await call("hiphops.slack.accesstoken")) as string;

  console.log("Getting slack API client");
  const c = SlackAPI(token);
  console.log("Returning client?");
  const wC = { client: c };
  console.log("Client wrapped:", JSON.stringify(wC));
  return wC.client;
};
