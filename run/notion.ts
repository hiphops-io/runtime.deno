import { Client } from "npm:@notionhq/client";

import { call } from "./functions.ts";

export const auth = async (): Promise<string> => {
  return (await call("hiphops.slack.accesstoken")) as string;
};

export const client = async () => {
  const token: string = await auth();
  return new Client({ auth: token });
};
