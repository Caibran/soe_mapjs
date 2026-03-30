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

  static get isWeb() {
    return typeof window !== "undefined" && !window.bridge;
  }

  static get defaultConnectedModeEnabled() {
    return SettingsState.isWeb;
  }

  static get defaultConnectedModeURL() {
    if (SettingsState.isWeb) {
      return (
        window.location.origin +
        window.location.pathname.replace(/\/[^/]*$/, "/")
      );
    }
    return "";
  }

  static fromIDB(settings) {
    if (settings === undefined) {
      settings = {};
    }

    return SettingsState.fromValues(
      settings.gfxDirectory ?? null,
      settings.customAssetsDirectory ?? null,
      settings.connectedModeEnabled ?? SettingsState.defaultConnectedModeEnabled,
      settings.connectedModeURL || SettingsState.defaultConnectedModeURL,
    );
  }
}
