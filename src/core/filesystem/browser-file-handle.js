export class BrowserFileHandle {
    constructor(file) {
        this.file = file;
        this.name = file.name;
        this.kind = "file";
    }

    async getFile() {
        return this.file;
    }

    async write(data) {
        // For browser-local files, "write" triggers a download fallback
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.name;
        a.click();
        URL.revokeObjectURL(url);
    }

    async queryPermission() {
        return "granted";
    }

    async requestPermission() {
        return "granted";
    }

    async isSameEntry(other) {
        return other instanceof BrowserFileHandle && other.file === this.file;
    }
}
