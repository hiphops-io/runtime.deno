import * as path from "jsr:@std/path";
import { walk } from "jsr:@std/fs/walk";

export interface WorkerMap {
  [key: string]: string;
}

export const loadWorkers = async (searchRoot: string): Promise<WorkerMap> => {
  const workers: WorkerMap = {};

  for await (const dirEntry of walk(searchRoot, {
    exts: ["work.ts", "work.js"],
  })) {
    if (!dirEntry.isFile) {
      continue;
    }

    const parsedPath = path.parse(dirEntry.path);
    const name = path.basename(dirEntry.path, `.work${parsedPath.ext}`);
    const namespace = parsedPath.dir.split("flows/")[1].split("/");

    const topic = [...namespace, name].join(".");
    workers[topic] = dirEntry.path;
  }

  return workers;
};
