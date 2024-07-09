// import {
//   Octokit,
//   type Octokit as OctokitT,
// } from "https://esm.sh/octokit@4.0.2?dts";
import { call } from "./functions.ts";

/** github returns a pre-authenticated Octokit instance */
export const github = async () => {
  const { Octokit } = await import("https://esm.sh/octokit@4.0.2?dts");
  const token: string = (await call("hiphops.github.accesstoken")) as string;
  return new Octokit({ auth: token });
};
