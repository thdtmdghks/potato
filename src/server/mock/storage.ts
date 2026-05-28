import type { StorageRepository } from "../repositories";

export class MockStorageRepository implements StorageRepository {
  async upload(_bucket: string, path: string) {
    return `/mock/${path}`;
  }
  async delete() {
    return true;
  }
  getPublicUrl(_bucket: string, path: string) {
    return `/mock/${path}`;
  }
}
