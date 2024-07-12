import * as path from "jsr:@std/path";

import { config } from "./config.ts";

export const cleanup = async () => {
  try {
    await deleteExpiredWorkspaces();
  } catch (err) {
    console.log("Failed to clean up workspaces:", err);
  }
};

const deleteExpiredWorkspaces = async () => {
  const workspaceEntries = Deno.readDirSync(config.workspacesDir);
  const deletes: Promise<void>[] = [];

  for (const dirEntry of workspaceEntries) {
    if (!dirEntry.isDirectory) continue;

    const dirPath = path.join(config.workspacesDir, dirEntry.name);
    const dirInfo = Deno.statSync(dirPath);

    const now = new Date().getTime();
    console.log("Current date/time is: ", now);
    console.log("Dir modification date/time is: ", dirInfo.mtime);
    if (dirInfo.mtime === null) {
      console.log("Unable to get workspace creation time!");
      continue;
    }

    const delta = Math.abs(now - dirInfo.mtime.getTime());

    if (delta > 1000 * (config.workerTimeout + config.workerGracePeriod)) {
      deletes.push(Deno.remove(dirPath));
    }
  }

  const results = await Promise.allSettled(deletes);

  for (const r of results) {
    if (r.status == "rejected") {
      console.log("Failed to clean up workspace:", r.reason);
    }
  }
};
