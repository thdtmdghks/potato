import type { StorageRepository } from "../repositories";

const toPlaceholder = (path: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(path)}/800/600`;

export class MockStorageRepository implements StorageRepository {
  async upload(_bucket: string, path: string, _file: File | Blob) {
    return toPlaceholder(path);
  }
  async delete(_bucket: string, _path: string) {
    return true;
  }
  getPublicUrl(_bucket: string, path: string) {
    return toPlaceholder(path);
  }
}
