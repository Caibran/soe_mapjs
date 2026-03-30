import { WebFileSystemDirectoryHandle } from "./file-system-directory-handle";
import { WebFileSystemFileHandle } from "./file-system-file-handle";

export class WebFileSystemProvider {
  async showOpenFilePicker(options) {
    const handles = await self.showOpenFilePicker(options);
    return handles.map((handle) => new WebFileSystemFileHandle(handle));
  }

  async showSaveFilePicker(options) {
    const handle = await self.showSaveFilePicker(options);
    return new WebFileSystemFileHandle(handle);
  }

  async showDirectoryPicker(options) {
    const handle = await self.showDirectoryPicker(options);
    return new WebFileSystemDirectoryHandle(handle);
  }

  async dataTransferItemToHandle(dataTransferItem) {
    const handle = await dataTransferItem.getAsFileSystemHandle();
    return this._handleToWebHandle(handle);
  }

  serializeHandle(handle) {
    return handle._handle;
  }

  deserializeHandle(serialized) {
    return this._handleToWebHandle(serialized);
  }

  _handleToWebHandle(handle) {
    switch (handle.kind) {
      case "file":
        return new WebFileSystemFileHandle(handle);
      case "directory":
        return new WebFileSystemDirectoryHandle(handle);
    }
  }

  get supported() {
    // Safari/iPad doesn't support the File System Access API yet.
    // We allow it anyway so the UI can load, and we can implement fallbacks later.
    return true;
  }
}
