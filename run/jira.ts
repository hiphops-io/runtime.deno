import ky, { type KyInstance } from "https://esm.sh/ky@1.4.0";

import { call } from "./functions.ts";

export type JiraCredentials = {
  access_token: string;
  cloud_id: string;
};

export const credentials = async (): Promise<JiraCredentials> => {
  return (await call("hiphops.jira.accesstoken")) as JiraCredentials;
};

export const client = async (): Promise<KyInstance> => {
  const { access_token, cloud_id } = await credentials();

  return ky.extend({
    prefixUrl: `https://api.atlassian.com/ex/jira/${cloud_id}/rest/api/3`,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
