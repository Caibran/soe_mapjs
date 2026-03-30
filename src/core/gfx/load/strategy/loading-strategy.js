export class LoadingStrategy {
  async loadEGF(_filename) {
    throw new Error("LoadingStrategy.loadEGF() must be implemented");
  }

  async loadRaw(_path) {
    throw new Error("LoadingStrategy.loadRaw() must be implemented");
  }

  async loadMap(_filename) {
    throw new Error("LoadingStrategy.loadMap() must be implemented");
  }

  async saveMap(_filename, _data) {
    throw new Error("LoadingStrategy.saveMap() must be implemented");
  }

  abort() {
    // do nothing
  }
}
