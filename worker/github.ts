import * as path from "https://deno.land/std@0.102.0/path/mod.ts";

import { call } from "./functions.ts";
import { workspace } from "./workspace.ts";

/** github returns a pre-authenticated Octokit instance */
export const github = async () => {
  const octoImport = "https://esm.sh/octokit@4.0.2?dts"; // Prevents pre-download of dynamic imports
  const { Octokit } = await import(octoImport);

  const token: string = (await call("hiphops.github.accesstoken")) as string;
  return new Octokit({ auth: token });
};

export const checkout = async (repo: string, branch: string, dst: string) => {
  const exacaImport = "npm:execa"; // Prevents pre-download of dynamic imports
  const { execa } = await import(exacaImport);

  const workspaceDir = workspace();
  const dstPath = path.join(workspaceDir, dst);

  const token: string = (await call("hiphops.github.accesstoken")) as string;
  const repoURL = `https://x-access-token:${token}@github.com/${repo}.git`;
  // const { stdout } = await execa("git", ["push", repositoryUrl]);
  // console.log(stdout);

  // TODO: Only use dst and branch if set to non-falsey values

  const { all } = await execa({
    all: true,
  })`git clone ${repoURL} ${dstPath} -b ${branch}`;

  // TODO: Check if we need to explicitly cache the repo credentials for a period
  // https://stackoverflow.com/questions/35942754/how-can-i-save-username-and-password-in-git

  console.log("Checking out repo:", all);
};
