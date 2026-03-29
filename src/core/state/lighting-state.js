import { LightSource } from "../data/light-source";

export class GlobalLight {
  constructor(color = "#000000", strength = 10.0) {
    this.color = color;
    this.strength = strength;
  }

  static fromJSON(json) {
    if (!json) return new GlobalLight();
    return new GlobalLight(json.color || "#000000", json.strength ?? 10.0);
  }

  toJSON() {
    return {
      color: this.color,
      strength: this.strength,
    };
  }

  copy() {
    return new GlobalLight(this.color, this.strength);
  }
}

export class PlayerLight {
  constructor(
    enabled = false,
    color = "#FFFFFF",
    size = 0.0,
    spread = 0.0,
    intensity = 0.0,
    flicker = false,
    flickerSpeed = 0.0,
    flickerIntensity = 0.0,
  ) {
    this.enabled = enabled;
    this.color = color;
    this.size = size;
    this.spread = spread;
    this.intensity = intensity;
    this.flicker = flicker;
    this.flickerSpeed = flickerSpeed;
    this.flickerIntensity = flickerIntensity;
  }

  static fromJSON(json) {
    if (!json) return new PlayerLight();
    return new PlayerLight(
      json.enabled ?? false,
      json.color || "#FFFFFF",
      json.size ?? 0.0,
      json.spread ?? 0.0,
      json.intensity ?? 0.0,
      json.flicker ?? false,
      json.flickerSpeed ?? 0.0,
      json.flickerIntensity ?? 0.0,
    );
  }

  toJSON() {
    return {
      enabled: this.enabled,
      color: this.color,
      size: this.size,
      spread: this.spread,
      intensity: this.intensity,
      flicker: this.flicker,
      flickerSpeed: this.flickerSpeed,
      flickerIntensity: this.flickerIntensity,
    };
  }

  copy() {
    return new PlayerLight(
      this.enabled,
      this.color,
      this.size,
      this.spread,
      this.intensity,
      this.flicker,
      this.flickerSpeed,
      this.flickerIntensity,
    );
  }
}

export class LightingState {
  constructor(
    globalLight = new GlobalLight(),
    playerLight = new PlayerLight(),
    lightSources = [],
  ) {
    this.globalLight = globalLight;
    this.playerLight = playerLight;
    this.lightSources = lightSources;
  }

  static default() {
    return new LightingState();
  }

  static fromJSON(json) {
    if (!json) return LightingState.default();

    const globalLight = GlobalLight.fromJSON(json.globalLight);
    const playerLight = PlayerLight.fromJSON(json.playerLight);
    const lightSources = (json.lightSources || []).map((ls) =>
      LightSource.fromJSON(ls),
    );

    return new LightingState(globalLight, playerLight, lightSources);
  }

  toJSON() {
    return {
      globalLight: this.globalLight.toJSON(),
      playerLight: this.playerLight.toJSON(),
      lightSources: this.lightSources.map((ls) => ls.toJSON()),
    };
  }

  copy() {
    return new LightingState(
      this.globalLight.copy(),
      this.playerLight.copy(),
      this.lightSources.map((ls) => ls.copy()),
    );
  }

  withGlobalLight(globalLight) {
    let copy = this.copy();
    copy.globalLight = globalLight;
    return copy;
  }

  withPlayerLight(playerLight) {
    let copy = this.copy();
    copy.playerLight = playerLight;
    return copy;
  }

  withLightSources(lightSources) {
    let copy = this.copy();
    copy.lightSources = lightSources;
    return copy;
  }

  getLightSourcesAt(x, y) {
    return this.lightSources.filter((ls) => ls.x === x && ls.y === y);
  }

  addLightSource(lightSource) {
    return this.withLightSources([...this.lightSources, lightSource]);
  }

  removeLightSource(index) {
    const newSources = [...this.lightSources];
    newSources.splice(index, 1);
    return this.withLightSources(newSources);
  }

  updateLightSource(index, lightSource) {
    const newSources = [...this.lightSources];
    newSources[index] = lightSource;
    return this.withLightSources(newSources);
  }
}
