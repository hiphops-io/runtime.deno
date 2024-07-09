declare global {
  // Absolute path to the workspace directory for this worker
  var WORKSPACE_DIR: string;
  var WORKER_DIR: string;
}

globalThis.WORKSPACE_DIR = "";
globalThis.WORKER_DIR = "";
