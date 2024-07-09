// import {
//   Octokit,
//   type Octokit as OctokitT,
// } from "https://esm.sh/octokit@4.0.2?dts";
import { call } from "./functions.ts";

/** github returns a pre-authenticated Octokit instance */
export const github = async () => {
  // Dynamic import is split to prevent Deno static analysis pre-downloading
  // the module even if it's not needed.
  const octoImport = "https://esm.sh/octokit@4.0.2?dts";
  const { Octokit } = await import(octoImport);

  const token: string = (await call("hiphops.github.accesstoken")) as string;
  return new Octokit({ auth: token });
};
