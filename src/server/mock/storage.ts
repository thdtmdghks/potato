import type { StorageRepository } from "../repositories";

export class MockStorageRepository implements StorageRepository {
  async upload(_bucket: string, path: string, _file: File | Blob) {
    return `/mock/${path}`;
  }
  async delete(_bucket: string, _path: string) {
    return true;
  }
  getPublicUrl(_bucket: string, path: string) {
    return `/mock/${path}`;
  }
}
