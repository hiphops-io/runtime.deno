import ky, { type KyInstance } from "https://esm.sh/ky@1.4.0";

import { call } from "./functions.ts";

export type ZoomCredentials = {
  access_token: string;
};

export const auth = async (): Promise<ZoomCredentials> => {
  return (await call("hiphops.zoom.accesstoken")) as ZoomCredentials;
};

export const client = async (): Promise<KyInstance> => {
  const { access_token } = await auth();

  return ky.extend({
    prefixUrl: `https://api.zoom.us/v2`,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
