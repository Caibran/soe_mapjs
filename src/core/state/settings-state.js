export class SettingsState {
  constructor() {
    this.gfxDirectory = null;
    this.customAssetsDirectory = null;
    this.connectedModeEnabled = false;
    this.connectedModeURL = "";
  }

  static fromValues(
    gfxDirectory,
    customAssetsDirectory,
    connectedModeEnabled,
    connectedModeURL,
  ) {
    let result = new SettingsState();
    result.gfxDirectory = gfxDirectory;
    result.customAssetsDirectory = customAssetsDirectory;
    result.connectedModeEnabled = connectedModeEnabled;
    result.connectedModeURL = connectedModeURL;
    return result;
  }

  static fromIDB(settings) {
    if (settings === undefined) {
      settings = {};
    }

    const isWeb = typeof window !== "undefined" && !window.bridge;
    const defaultMode = isWeb;
    const defaultURL = isWeb
      ? window.location.origin +
      window.location.pathname.replace(/\/[^/]*$/, "/")
      : "";

    return SettingsState.fromValues(
      settings.gfxDirectory ?? null,
      settings.customAssetsDirectory ?? null,
      settings.connectedModeEnabled ?? defaultMode,
      settings.connectedModeURL ?? defaultURL,
    );
  }
}
