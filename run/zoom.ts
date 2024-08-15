import ky, { type KyInstance } from "https://esm.sh/ky@1.4.0";

import { call } from "./functions.ts";

export const auth = async (): Promise<string> => {
  return (await call("hiphops.zoom.accesstoken")) as string;
};

export const client = async (): Promise<KyInstance> => {
  const token: string = await auth();

  return ky.extend({
    prefixUrl: `https://api.zoom.us/v2`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
