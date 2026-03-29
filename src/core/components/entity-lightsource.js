import { html, LitElement } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import "@spectrum-web-components/field-group/sp-field-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/switch/sp-switch.js";

import "./modal";
import "./number-field";
import "./color-picker";

import { LightSource } from "../data/light-source";

@customElement("eomap-entity-lightsource")
export class EntityLightSource extends LitElement {
  @query("#size", true)
  size;

  @query("#spread", true)
  spread;

  @query("#intensity", true)
  intensity;

  @query("#flicker", true)
  flicker;

  @query("#flicker-speed", true)
  flickerSpeed;

  @query("#flicker-intensity", true)
  flickerIntensity;

  @query("eomap-color-picker", true)
  colorPicker;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, reflect: true })
  headline;

  @state()
  _color = "#FFFFFF";

  render() {
    return html`
      <eomap-modal
        confirm-label="Save"
        cancel-label="Cancel"
        .headline=${this.headline}
        .open=${this.open}
        @confirm=${this.confirm}
        @cancel=${this.cancel}
        @close=${this.close}
      >
        <style>
          sp-field-group {
            justify-content: center;
          }
          eomap-number-field {
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          .color-picker-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          .switch-container {
            width: var(--spectrum-global-dimension-size-1200);
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
        </style>
        <sp-field-group>
          <div class="color-picker-container">
            <sp-field-label>Color</sp-field-label>
            <eomap-color-picker
              .value=${this._color}
              @color-change=${this._onColorChange}
            ></eomap-color-picker>
          </div>
        </sp-field-group>
        <sp-field-group>
          <div>
            <sp-field-label for="size">Size</sp-field-label>
            <eomap-number-field
              id="size"
              min="0"
              max="100"
              step="0.1"
              .formatOptions=${{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
            ></eomap-number-field>
          </div>
          <div>
            <sp-field-label for="spread">Spread</sp-field-label>
            <eomap-number-field
              id="spread"
              min="0"
              max="100"
              step="0.1"
              .formatOptions=${{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
            ></eomap-number-field>
          </div>
          <div>
            <sp-field-label for="intensity">Intensity</sp-field-label>
            <eomap-number-field
              id="intensity"
              min="0"
              max="10"
              step="0.1"
              .formatOptions=${{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
            ></eomap-number-field>
          </div>
        </sp-field-group>
        <sp-field-group>
          <div>
            <sp-field-label for="flicker">Flicker</sp-field-label>
            <div class="switch-container">
              <sp-switch id="flicker" emphasized></sp-switch>
            </div>
          </div>
          <div>
            <sp-field-label for="flicker-speed">Flicker Speed</sp-field-label>
            <eomap-number-field
              id="flicker-speed"
              min="0"
              max="10"
              step="0.1"
              .formatOptions=${{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
            ></eomap-number-field>
          </div>
          <div>
            <sp-field-label for="flicker-intensity"
              >Flicker Intensity</sp-field-label
            >
            <eomap-number-field
              id="flicker-intensity"
              min="0"
              max="10"
              step="0.1"
              .formatOptions=${{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
            ></eomap-number-field>
          </div>
        </sp-field-group>
      </eomap-modal>
    `;
  }

  _onColorChange(event) {
    this._color = event.detail.value;
  }

  reset() {
    this._color = "#FFFFFF";
    this.size.value = 3.0;
    this.size.invalid = false;
    this.spread.value = 5.0;
    this.spread.invalid = false;
    this.intensity.value = 1.0;
    this.intensity.invalid = false;
    this.flicker.checked = false;
    this.flickerSpeed.value = 1.0;
    this.flickerSpeed.invalid = false;
    this.flickerIntensity.value = 0.0;
    this.flickerIntensity.invalid = false;
  }

  populate(lightSource) {
    this.reset();
    this._color = lightSource.color;
    this.size.value = lightSource.size;
    this.spread.value = lightSource.spread;
    this.intensity.value = lightSource.intensity;
    this.flicker.checked = lightSource.flicker;
    this.flickerSpeed.value = lightSource.flickerSpeed;
    this.flickerIntensity.value = lightSource.flickerIntensity;
  }

  validateRequired(field) {
    field.invalid = isNaN(field.value);
  }

  validateFields() {
    this.validateRequired(this.size);
    this.validateRequired(this.spread);
    this.validateRequired(this.intensity);
    this.validateRequired(this.flickerSpeed);
    this.validateRequired(this.flickerIntensity);

    return (
      !this.size.invalid &&
      !this.spread.invalid &&
      !this.intensity.invalid &&
      !this.flickerSpeed.invalid &&
      !this.flickerIntensity.invalid
    );
  }

  confirm(_event) {
    if (this.validateFields()) {
      this.open = false;

      this.dispatchEvent(
        new CustomEvent("save", {
          detail: {
            color: this._color,
            size: this.size.value,
            spread: this.spread.value,
            intensity: this.intensity.value,
            flicker: this.flicker.checked,
            flickerSpeed: this.flickerSpeed.value,
            flickerIntensity: this.flickerIntensity.value,
          },
        }),
      );
    }
  }

  cancel(_event) {
    this.open = false;
  }

  close(_event) {
    this.open = false;
    this.dispatchEvent(new CustomEvent("close"));
  }
}
