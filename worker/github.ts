import { Octokit, type Octokit as OctokitT } from "https://esm.sh/octokit?dts";
import { call } from "./functions.ts";

export const githubClient = async (): Promise<OctokitT> => {
  const token: string = (await call("hiphops.github.accesstoken")) as string;

  console.log("---lib token:", token);

  return new Octokit({ auth: token });
};
