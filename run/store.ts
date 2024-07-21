export type ObjectInfo = {
  // The revision number for the entry
  revision: number;
  // A cryptographic checksum of the data as a whole
  digest: string;
  // The size in bytes of the object
  size: number;
};

export type Store = {
  /** Delete an object from the store. Returns true if the operation completed successfully */
  delete: (name: string) => Promise<boolean>;
  //** Get an object from the store, returns the contents or null if the object isn't found */
  get: (name: string) => Promise<string | null>;
  /** Put an object in the store (create or overwrite) */
  put: (
    name: string,
    value: string,
    description?: string
  ) => Promise<ObjectInfo>;
};
