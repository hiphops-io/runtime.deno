export const workspace = () => {
  console.log("Creating workspace dir ", WORKSPACE_DIR);
  // TODO: WORKSPACE_DIR shouldn't be a global var given we're doing JIT creation
  try {
    Deno.mkdirSync(WORKSPACE_DIR, {});
  } catch (err) {
    if (err! instanceof Deno.errors.AlreadyExists) {
      throw err;
    } else {
      console.log("Dir already exists");
    }
  }

  console.log("Workspace dir contents ", Deno.readDir(WORKSPACE_DIR));

  return WORKSPACE_DIR;
};
