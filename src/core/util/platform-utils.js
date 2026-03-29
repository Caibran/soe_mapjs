let _isElectron = false;
let _isMacintosh = false;
let _isWindows = false;
let _isLinux = false;
let _isTouch = false;

if (typeof process !== "undefined") {
  // Electron main process
  _isElectron = true;
  _isMacintosh = process.platform === "darwin";
  _isWindows = process.platform === "win32";
  _isLinux = process.platform === "linux";
  _isTouch = false;
} else if (window._isElectron) {
  // Electron renderer process
  _isElectron = true;
  _isMacintosh = window.bridge.os.platform() === "darwin";
  _isWindows = window.bridge.os.platform() === "win32";
  _isLinux = window.bridge.os.platform() === "linux";
  _isTouch = false;
} else {
  // Web
  _isElectron = false;
  _isMacintosh = navigator.userAgent.includes("Macintosh");
  _isWindows = navigator.userAgent.includes("Windows");
  _isLinux = navigator.userAgent.includes("Linux");
  _isTouch =
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    navigator.userAgent.toLowerCase().includes("ipad") ||
    navigator.userAgent.toLowerCase().includes("iphone");
}

export function isMac() {
  return _isMacintosh;
}

export function isWindows() {
  return _isWindows;
}

export function isLinux() {
  return _isLinux;
}

export function isElectron() {
  return _isElectron;
}

export function isTouch() {
  return _isTouch;
}
