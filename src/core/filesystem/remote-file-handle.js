export class RemoteFileHandle {
    constructor(name, loadingStrategy) {
        this.name = name;
        this.loadingStrategy = loadingStrategy;
        this.kind = "file";
    }

    async getFile() {
        const buffer = await this.loadingStrategy.loadMap(this.name);
        return {
            arrayBuffer: async () => buffer,
            name: this.name,
        };
    }

    async write(data) {
        await this.loadingStrategy.saveMap(this.name, data);
    }

    async queryPermission() {
        return "granted";
    }

    async requestPermission() {
        return "granted";
    }

    async isSameEntry(other) {
        return other instanceof RemoteFileHandle && other.name === this.name;
    }
}
