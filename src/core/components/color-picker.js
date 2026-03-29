import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import "@spectrum-web-components/color-wheel/sp-color-wheel.js";
import "@spectrum-web-components/color-area/sp-color-area.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/textfield/sp-textfield.js";

@customElement("eomap-color-picker")
export class ColorPicker extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spectrum-global-dimension-size-100);
      }

      .color-container {
        position: relative;
        width: 160px;
        height: 160px;
      }

      sp-color-wheel {
        --spectrum-colorwheel-width: 160px;
        --spectrum-colorwheel-height: 160px;
      }

      sp-color-area {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --spectrum-colorarea-default-width: 80px;
        --spectrum-colorarea-default-height: 80px;
      }

      .hex-input-container {
        display: flex;
        align-items: center;
        gap: var(--spectrum-global-dimension-size-100);
      }

      .color-preview {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid var(--spectrum-global-color-gray-400);
      }

      sp-textfield {
        --spectrum-textfield-texticon-min-width: 80px;
      }
    `;
  }

  @property({ type: String })
  value = "#FFFFFF";

  @property({ type: String })
  label = "";

  @state()
  _hue = 0;

  @state()
  _saturation = 100;

  @state()
  _lightness = 50;

  @query("sp-color-wheel")
  colorWheel;

  @query("sp-color-area")
  colorArea;

  @query("sp-textfield")
  hexInput;

  connectedCallback() {
    super.connectedCallback();
    this._parseHexColor(this.value);
  }

  updated(changedProperties) {
    if (changedProperties.has("value")) {
      this._parseHexColor(this.value);
    }
  }

  _parseHexColor(hex) {
    if (!hex || !hex.startsWith("#")) return;

    const rgb = this._hexToRgb(hex);
    if (!rgb) return;

    const hsl = this._rgbToHsl(rgb.r, rgb.g, rgb.b);
    this._hue = hsl.h;
    this._saturation = hsl.s;
    this._lightness = hsl.l;
  }

  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  _rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  _hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
        .toUpperCase()
    );
  }

  _updateColor() {
    const newValue = this._hslToHex(
      this._hue,
      this._saturation,
      this._lightness,
    );
    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(
        new CustomEvent("color-change", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  _onWheelChange(event) {
    // Stop the internal event from bubbling up
    event.stopPropagation();

    // Color wheel returns hue as a color string, extract hue from it
    const color = event.target.color;
    if (color && typeof color === "string") {
      // Parse the HSL string from color wheel
      const match = color.match(/hsl\((\d+(?:\.\d+)?)/);
      if (match) {
        this._hue = parseFloat(match[1]);
        this._updateColor();
      }
    }
  }

  _onAreaChange(event) {
    // Stop the internal event from bubbling up
    event.stopPropagation();

    // Color area returns color as hex or hsl string
    const color = event.target.color;
    if (color && typeof color === "string") {
      // Parse the color and extract saturation/lightness
      if (color.startsWith("#")) {
        const rgb = this._hexToRgb(color);
        if (rgb) {
          const hsl = this._rgbToHsl(rgb.r, rgb.g, rgb.b);
          this._saturation = hsl.s;
          this._lightness = hsl.l;
          this._updateColor();
        }
      }
    }
  }

  _onHexInput(event) {
    // Stop the internal event from bubbling up
    event.stopPropagation();

    let hex = event.target.value.trim();
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }

    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      this.value = hex.toUpperCase();
      this._parseHexColor(this.value);
      this.dispatchEvent(
        new CustomEvent("color-change", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  _getWheelColor() {
    return `hsl(${this._hue}, 100%, 50%)`;
  }

  _getAreaColor() {
    return this._hslToHex(this._hue, this._saturation, this._lightness);
  }

  render() {
    return html`
      ${this.label ? html`<sp-field-label>${this.label}</sp-field-label>` : ""}
      <div class="color-container">
        <sp-color-wheel
          .color=${this._getWheelColor()}
          @input=${this._onWheelChange}
          @change=${this._onWheelChange}
        ></sp-color-wheel>
        <sp-color-area
          .color=${this._getAreaColor()}
          @input=${this._onAreaChange}
          @change=${this._onAreaChange}
        ></sp-color-area>
      </div>
      <div class="hex-input-container">
        <div
          class="color-preview"
          style="background-color: ${this.value}"
        ></div>
        <sp-textfield
          .value=${this.value}
          @change=${this._onHexInput}
          maxlength="7"
          placeholder="#FFFFFF"
        ></sp-textfield>
      </div>
    `;
  }
}
