import * as path from "jsr:@std/path";
import { Octokit } from "https://esm.sh/octokit@4.0.2?dts";

import { call, workspace } from "./functions.ts";
import * as git from "./git.ts";

/** client returns a pre-authenticated Octokit instance */
export const client = async () => {
  const token: string = (await call("hiphops.github.accesstoken")) as string;
  return new Octokit({ auth: token });
};

/**
 * clone the given repo into the current workspace using github integration credentials
 *
 * repo: Name of the repo in the form "OWNER/REPO_NAME"
 * args: Arguments as accepted by git.clone()
 */
type CloneArgs = Partial<Parameters<typeof git.clone>[0]>;
export const clone = async (repo: string, args?: CloneArgs) => {
  // Ensure the workspace dir exists and create the default destination path
  const workspaceDir = workspace();
  const dir = path.join(workspaceDir, repo.split("/")[1]);

  const token: string = (await call("hiphops.github.accesstoken")) as string;
  const url = `https://x-access-token:${token}@github.com/${repo}.git`;

  await git.clone({ dir, url, ...args });

  return dir;
};
