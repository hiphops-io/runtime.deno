import { call } from "./functions.ts";

/** github returns a pre-authenticated Octokit instance */
export const github = async () => {
  // TODO: This loses type information - Users no longer know this returns Octokit
  // and therefore do not get intellisense support
  const octoImport = "https://esm.sh/octokit@4.0.2?dts"; // Prevents pre-download of dynamic imports
  const { Octokit } = await import(octoImport);

  const token: string = (await call("hiphops.github.accesstoken")) as string;
  return new Octokit({ auth: token });
};
