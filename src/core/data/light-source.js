export class LightSource {
  constructor(
    x,
    y,
    color = "#FFFFFF",
    size = 3.0,
    spread = 5.0,
    intensity = 1.0,
    flicker = false,
    flickerSpeed = 1.0,
    flickerIntensity = 0.0,
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.spread = spread;
    this.intensity = intensity;
    this.flicker = flicker;
    this.flickerSpeed = flickerSpeed;
    this.flickerIntensity = flickerIntensity;
  }

  static fromJSON(json) {
    return new LightSource(
      json.x,
      json.y,
      json.color || "#FFFFFF",
      json.size ?? 3.0,
      json.spread ?? 5.0,
      json.intensity ?? 1.0,
      json.flicker ?? false,
      json.flickerSpeed ?? 1.0,
      json.flickerIntensity ?? 0.0,
    );
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
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
    return new LightSource(
      this.x,
      this.y,
      this.color,
      this.size,
      this.spread,
      this.intensity,
      this.flicker,
      this.flickerSpeed,
      this.flickerIntensity,
    );
  }

  withX(x) {
    let copy = this.copy();
    copy.x = x;
    return copy;
  }

  withY(y) {
    let copy = this.copy();
    copy.y = y;
    return copy;
  }

  withPosition(x, y) {
    let copy = this.copy();
    copy.x = x;
    copy.y = y;
    return copy;
  }
}
