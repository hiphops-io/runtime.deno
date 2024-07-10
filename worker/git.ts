import * as fs from "node:fs";

import git from "https://esm.sh/isomorphic-git@1.17.2";
import http from "https://esm.sh/isomorphic-git@1.17.2/http/node.js";

// Return a function that has the same type as the original iso-git
// function minus the http and fs keys in the input args
const wrappedIsoGit = <
  F extends (args: unknown) => unknown,
  A extends Parameters<F>[0],
  R
>(
  f: (a: A) => R
): ((args: { [K in keyof A as Exclude<K, "fs" | "http">]: A[K] }) => R) => {
  return (args) => {
    // Default fs and http to our preferred implementations
    return f({ fs, http, ...args } as A);
  };
};

export const add = wrappedIsoGit(git.add);
export const addNote = wrappedIsoGit(git.addNote);
export const addRemote = wrappedIsoGit(git.addRemote);
export const annotatedTag = wrappedIsoGit(git.annotatedTag);
export const branch = wrappedIsoGit(git.branch);
export const checkout = wrappedIsoGit(git.checkout);
export const clone = wrappedIsoGit(git.clone);
export const commit = wrappedIsoGit(git.commit);
export const currentBranch = wrappedIsoGit(git.currentBranch);
export const deleteBranch = wrappedIsoGit(git.deleteBranch);
export const deleteRef = wrappedIsoGit(git.deleteRef);
export const deleteRemote = wrappedIsoGit(git.deleteRemote);
export const deleteTag = wrappedIsoGit(git.deleteTag);
export const expandOid = wrappedIsoGit(git.expandOid);
export const expandRef = wrappedIsoGit(git.expandRef);
export const fastForward = wrappedIsoGit(git.fastForward);
export const fetch = wrappedIsoGit(git.fetch);
export const findMergeBase = wrappedIsoGit(git.findMergeBase);
export const findRoot = wrappedIsoGit(git.findRoot);
export const getConfig = wrappedIsoGit(git.getConfig);
export const getConfigAll = wrappedIsoGit(git.getConfigAll);
export const getRemoteInfo = wrappedIsoGit(git.getRemoteInfo);
export const getRemoteInfo2 = wrappedIsoGit(git.getRemoteInfo2);
export const hashBlob = wrappedIsoGit(git.hashBlob);
export const indexPack = wrappedIsoGit(git.indexPack);
export const init = wrappedIsoGit(git.init);
export const isDescendent = wrappedIsoGit(git.isDescendent);
export const isIgnored = wrappedIsoGit(git.isIgnored);
export const listBranches = wrappedIsoGit(git.listBranches);
export const listFiles = wrappedIsoGit(git.listFiles);
export const listNotes = wrappedIsoGit(git.listNotes);
export const listRemotes = wrappedIsoGit(git.listRemotes);
export const listServerRefs = wrappedIsoGit(git.listServerRefs);
export const listTags = wrappedIsoGit(git.listTags);
export const merge = wrappedIsoGit(git.merge);
export const packObjects = wrappedIsoGit(git.packObjects);
export const pull = wrappedIsoGit(git.pull);
export const push = wrappedIsoGit(git.push);
export const readBlob = wrappedIsoGit(git.readBlob);
export const readCommit = wrappedIsoGit(git.readCommit);
export const readNote = wrappedIsoGit(git.readNote);
export const readTag = wrappedIsoGit(git.readTag);
export const readTree = wrappedIsoGit(git.readTree);
export const remove = wrappedIsoGit(git.remove);
export const removeNote = wrappedIsoGit(git.removeNote);
export const renameBranch = wrappedIsoGit(git.renameBranch);
export const resetIndex = wrappedIsoGit(git.resetIndex);
export const resolveRef = wrappedIsoGit(git.resolveRef);
export const setConfig = wrappedIsoGit(git.setConfig);
export const status = wrappedIsoGit(git.status);
export const statusMatrix = wrappedIsoGit(git.statusMatrix);
export const tag = wrappedIsoGit(git.tag);
export const updateIndex = wrappedIsoGit(git.updateIndex);
export const version = wrappedIsoGit(git.version);
export const walk = wrappedIsoGit(git.walk);
export const writeBlob = wrappedIsoGit(git.writeBlob);
export const writeCommit = wrappedIsoGit(git.writeCommit);
export const writeRef = wrappedIsoGit(git.writeRef);
export const writeTag = wrappedIsoGit(git.writeTag);
export const writeTree = wrappedIsoGit(git.writeTree);

export const stage = git.STAGE;
export const tree = git.TREE;
export const workdir = git.WORKDIR;
