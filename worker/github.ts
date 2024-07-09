import {
  Octokit,
  type Octokit as OctokitT,
} from "https://esm.sh/octokit@4.0.2?dts";
import { call } from "./functions.ts";

export const github = async (): Promise<OctokitT> => {
  const token: string = (await call("hiphops.github.accesstoken")) as string;

  console.log("---lib token:", token);

  return new Octokit({ auth: token });
};
