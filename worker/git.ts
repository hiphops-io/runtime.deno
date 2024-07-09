import git from "https://esm.sh/isomorphic-git@1.17.2";
import http from "https://esm.sh/isomorphic-git@1.17.2/http/node.js";
import * as fs from "node:fs";
import * as path from "https://deno.land/std@0.102.0/path/mod.ts";

// import * as fs from "https://deno.land/std@0.119.0/node/fs.ts";
import { call } from "./functions.ts";
import { workspace } from "./workspace.ts";

export const clone = async (repo: string, branch: string, dst: string) => {
  const workspaceDir = workspace();
  const dstPath = path.join(workspaceDir, dst);

  const token: string = (await call("hiphops.github.accesstoken")) as string;
  const repoURL = `https://x-access-token:${token}@github.com/${repo}.git`;
  // const { stdout } = await execa("git", ["push", repositoryUrl]);
  // console.log(stdout);

  // TODO: Only use dst and branch if set to non-falsey values

  try {
    await git.clone({ fs, http, dir: dstPath, url: repoURL });
  } catch (err) {
    console.log("Clone error!", err);
  }
  //  `git clone ${repoURL} ${dstPath} -b ${branch}`;

  // TODO: Check if we need to explicitly cache the repo credentials for a period
  // https://stackoverflow.com/questions/35942754/how-can-i-save-username-and-password-in-git

  console.log("Checking out repo:");
};
