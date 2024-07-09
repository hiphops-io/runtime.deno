declare global {
  // Absolute path to the workspace directory for this worker
  var WORKSPACE_DIR: string;
}

globalThis.WORKSPACE_DIR = "workywork";
