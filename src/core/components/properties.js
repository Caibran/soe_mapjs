import { html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import "@spectrum-web-components/field-group/sp-field-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/switch/sp-switch.js";
import "@spectrum-web-components/accordion/sp-accordion-item.js";

import "./accordion";
import "./modal";
import "./number-field";
import "./picker";
import "./textfield";
import "./menu-item";
import "./menu-divider";
import "./color-picker";

import { CHAR_MAX, SHORT_MAX } from "../data/eo-numeric-limits";
import { MapEffect, MapType, MusicControl } from "../data/emf";
import { MapPropertiesState } from "../state/map-properties-state";
import {
  GlobalLight,
  PlayerLight,
  LightingState,
} from "../state/lighting-state";

@customElement("eomap-properties")
export class Properties extends LitElement {
  @query("eomap-accordion")
  accordion;

  @query("#width", true)
  width;

  @query("#height", true)
  height;

  @query("#name", true)
  name;

  @query("#type", true)
  type;

  @query("#effect", true)
  effect;

  @query("#minimap", true)
  minimap;

  @query("#scrolls", true)
  scrolls;

  @query("#music", true)
  music;

  @query("#ambient-sound", true)
  ambientSound;

  @query("#music-control", true)
  musicControl;

  @query("#respawn-x", true)
  respawnX;

  @query("#respawn-y", true)
  respawnY;

  // Global Light queries
  @query("#global-light-color", true)
  globalLightColor;

  @query("#global-light-strength", true)
  globalLightStrength;

  // Player Light queries
  @query("#player-light-enabled", true)
  playerLightEnabled;

  @query("#player-light-color", true)
  playerLightColor;

  @query("#player-light-size", true)
  playerLightSize;

  @query("#player-light-spread", true)
  playerLightSpread;

  @query("#player-light-intensity", true)
  playerLightIntensity;

  @query("#player-light-flicker", true)
  playerLightFlicker;

  @query("#player-light-flicker-speed", true)
  playerLightFlickerSpeed;

  @query("#player-light-flicker-intensity", true)
  playerLightFlickerIntensity;

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  _lightingState = LightingState.default();

  updated(changed) {
    if (changed.has("open")) {
      this.manageOpen();
    }
  }

  manageOpen() {
    if (this.open) {
      this.accordion.expand();
    }
  }

  renderGeneral() {
    return html`
      <sp-field-group>
        <div>
          <sp-field-label for="name">Name</sp-field-label>
          <eomap-textfield id="name" maxlength="24"></eomap-textfield>
        </div>
        <div>
          <sp-field-label for="width">Width</sp-field-label>
          <eomap-number-field
            id="width"
            max="${CHAR_MAX - 1}"
          ></eomap-number-field>
        </div>
        <div>
          <sp-field-label for="height">Height</sp-field-label>
          <eomap-number-field
            id="height"
            max="${CHAR_MAX - 1}"
          ></eomap-number-field>
        </div>
      </sp-field-group>
      <sp-field-group>
        <div class="picker-container">
          <sp-field-label for="type">Type</sp-field-label>
          <eomap-picker id="type">
            <eomap-menu-item label="Normal" value="${MapType.Normal}">
            </eomap-menu-item>
            <eomap-menu-divider></eomap-menu-divider>
            <eomap-menu-item label="Hostile (PK)" value="${MapType.PK}">
            </eomap-menu-item>
          </eomap-picker>
        </div>
        <div class="picker-container">
          <sp-field-label for="effect">Effect</sp-field-label>
          <eomap-picker id="effect">
            <eomap-menu-item
              label="None"
              value="${MapEffect.None}"
            ></eomap-menu-item>
            <eomap-menu-divider></eomap-menu-divider>
            <eomap-menu-item
              label="Poison (HP Drain)"
              value="${MapEffect.HPDrain}"
            ></eomap-menu-item>
            <eomap-menu-item
              label="Vortex (TP Drain)"
              value="${MapEffect.TPDrain}"
            ></eomap-menu-item>
            <eomap-menu-divider></eomap-menu-divider>
            <eomap-menu-item
              label="Quake 1 (Weakest)"
              value="${MapEffect.Quake1}"
            ></eomap-menu-item>
            <eomap-menu-item label="Quake 2" value="${MapEffect.Quake2}">
            </eomap-menu-item>
            <eomap-menu-item label="Quake 3" value="${MapEffect.Quake3}">
            </eomap-menu-item>
            <eomap-menu-item
              label="Quake 4 (Strongest)"
              value="${MapEffect.Quake4}"
            ></eomap-menu-item>
          </eomap-picker>
        </div>
      </sp-field-group>
      <sp-field-group>
        <div>
          <sp-field-label for="minimap">Mini-map Allowed</sp-field-label>
          <div class="switch-container">
            <sp-switch id="minimap" emphasized></sp-switch>
          </div>
        </div>
        <div>
          <sp-field-label for="scrolls">Scrolls Allowed</sp-field-label>
          <div class="switch-container">
            <sp-switch id="scrolls" emphasized></sp-switch>
          </div>
        </div>
      </sp-field-group>
    `;
  }

  renderAudio() {
    return html`
      <sp-field-group>
        <div>
          <sp-field-label for="music">Music</sp-field-label>
          <eomap-number-field
            id="music"
            max="${CHAR_MAX - 1}"
          ></eomap-number-field>
        </div>
        <div>
          <sp-field-label for="ambient-sound">Ambient Sound</sp-field-label>
          <eomap-number-field
            id="ambient-sound"
            max="${SHORT_MAX - 1}"
          ></eomap-number-field>
        </div>
        <div class="picker-container">
          <sp-field-label for="music-control">Music Control</sp-field-label>
          <eomap-picker id="music-control">
            <eomap-menu-item
              label="Stop different - Play once"
              value="${MusicControl.InterruptIfDifferentPlayOnce}"
            ></eomap-menu-item>
            <eomap-menu-item
              label="Stop any - Play once"
              value="${MusicControl.InterruptPlayOnce}"
            ></eomap-menu-item>
            <eomap-menu-item
              label="Wait - Play once"
              value="${MusicControl.FinishPlayOnce}"
            ></eomap-menu-item>
            <eomap-menu-divider></eomap-menu-divider>
            <eomap-menu-item
              label="Stop different - Play repeat"
              value="${MusicControl.InterruptIfDifferentPlayRepeat}"
            ></eomap-menu-item>
            <eomap-menu-item
              label="Stop any - Play repeat"
              value="${MusicControl.InterruptPlayRepeat}"
            ></eomap-menu-item>
            <eomap-menu-item
              label="Wait - Play repeat"
              value="${MusicControl.FinishPlayRepeat}"
            ></eomap-menu-item>
            <eomap-menu-divider></eomap-menu-divider>
            <eomap-menu-item
              label="Stop any - Play nothing"
              value="${MusicControl.InterruptPlayNothing}"
            ></eomap-menu-item>
          </eomap-picker>
        </div>
      </sp-field-group>
    `;
  }

  renderRespawn() {
    return html`
      <sp-field-group>
        <div>
          <sp-field-label for="respawn-x">X</sp-field-label>
          <eomap-number-field
            id="respawn-x"
            max="${CHAR_MAX - 1}"
          ></eomap-number-field>
        </div>
        <div>
          <sp-field-label for="respawn-y">Y</sp-field-label>
          <eomap-number-field
            id="respawn-y"
            max="${CHAR_MAX - 1}"
          ></eomap-number-field>
        </div>
      </sp-field-group>
    `;
  }

  renderGlobalLight() {
    return html`
      <sp-field-group>
        <div class="color-picker-container">
          <sp-field-label>Color</sp-field-label>
          <eomap-color-picker
            id="global-light-color"
            .value=${this._lightingState.globalLight.color}
            @color-change=${this._onGlobalLightColorChange}
          ></eomap-color-picker>
        </div>
        <div>
          <sp-field-label for="global-light-strength">Strength</sp-field-label>
          <eomap-number-field
            id="global-light-strength"
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
    `;
  }

  renderPlayerLight() {
    return html`
      <sp-field-group>
        <div>
          <sp-field-label for="player-light-enabled">Enabled</sp-field-label>
          <div class="switch-container">
            <sp-switch id="player-light-enabled" emphasized></sp-switch>
          </div>
        </div>
      </sp-field-group>
      <sp-field-group>
        <div class="color-picker-container">
          <sp-field-label>Color</sp-field-label>
          <eomap-color-picker
            id="player-light-color"
            .value=${this._lightingState.playerLight.color}
            @color-change=${this._onPlayerLightColorChange}
          ></eomap-color-picker>
        </div>
      </sp-field-group>
      <sp-field-group>
        <div>
          <sp-field-label for="player-light-size">Size</sp-field-label>
          <eomap-number-field
            id="player-light-size"
            min="0"
            max="50"
            step="0.1"
            .formatOptions=${{
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }}
          ></eomap-number-field>
        </div>
        <div>
          <sp-field-label for="player-light-spread">Spread</sp-field-label>
          <eomap-number-field
            id="player-light-spread"
            min="0"
            max="50"
            step="0.1"
            .formatOptions=${{
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }}
          ></eomap-number-field>
        </div>
        <div>
          <sp-field-label for="player-light-intensity"
            >Intensity</sp-field-label
          >
          <eomap-number-field
            id="player-light-intensity"
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
          <sp-field-label for="player-light-flicker">Flicker</sp-field-label>
          <div class="switch-container">
            <sp-switch id="player-light-flicker" emphasized></sp-switch>
          </div>
        </div>
        <div>
          <sp-field-label for="player-light-flicker-speed"
            >Flicker Speed</sp-field-label
          >
          <eomap-number-field
            id="player-light-flicker-speed"
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
          <sp-field-label for="player-light-flicker-intensity"
            >Flicker Intensity</sp-field-label
          >
          <eomap-number-field
            id="player-light-flicker-intensity"
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
    `;
  }

  _onGlobalLightColorChange(event) {
    const newGlobalLight = this._lightingState.globalLight.copy();
    newGlobalLight.color = event.detail.value;
    this._lightingState = this._lightingState.withGlobalLight(newGlobalLight);
  }

  _onPlayerLightColorChange(event) {
    const newPlayerLight = this._lightingState.playerLight.copy();
    newPlayerLight.color = event.detail.value;
    this._lightingState = this._lightingState.withPlayerLight(newPlayerLight);
  }

  render() {
    return html`
      <eomap-modal
        confirm-label="Save"
        cancel-label="Cancel"
        headline="Map Properties"
        .open=${this.open}
        .width=${544}
        @confirm=${this.confirm}
        @cancel=${this.cancel}
        @close=${this.close}
      >
        <style>
          eomap-textfield {
            --spectrum-textfield-texticon-min-width: 208px;
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          eomap-number-field {
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          eomap-picker {
            --spectrum-picker-min-width: 208px;
          }
          .switch-container {
            width: 208px;
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          .picker-container {
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          .color-picker-container {
            padding-bottom: var(--spectrum-global-dimension-size-200);
          }
          eomap-color-picker {
            margin-top: var(--spectrum-global-dimension-size-100);
          }
        </style>
        <eomap-accordion>
          <sp-accordion-item label="General">
            ${this.renderGeneral()}
          </sp-accordion-item>
          <sp-accordion-item label="Audio">
            ${this.renderAudio()}
          </sp-accordion-item>
          <sp-accordion-item label="Respawn">
            ${this.renderRespawn()}
          </sp-accordion-item>
          <sp-accordion-item label="Global Light">
            ${this.renderGlobalLight()}
          </sp-accordion-item>
          <sp-accordion-item label="Player Light">
            ${this.renderPlayerLight()}
          </sp-accordion-item>
        </eomap-accordion>
      </eomap-modal>
    `;
  }

  populate(emf, lightingState = null) {
    this.width.invalid = false;
    this.height.invalid = false;
    this.music.invalid = false;
    this.ambientSound.invalid = false;
    this.respawnX.invalid = false;
    this.respawnY.invalid = false;

    this.name.value = emf.name;
    this.width.value = emf.width;
    this.height.value = emf.height;
    this.type.value = emf.type.toString();
    this.effect.value = emf.effect.toString();
    this.minimap.checked = emf.mapAvailable;
    this.scrolls.checked = emf.canScroll;
    this.music.value = emf.musicID;
    this.ambientSound.value = emf.ambientSoundID;
    this.musicControl.value = emf.musicControl.toString();
    this.respawnX.value = emf.relogX;
    this.respawnY.value = emf.relogY;

    // Populate lighting state
    this._lightingState = lightingState || LightingState.default();
    this.globalLightStrength.value = this._lightingState.globalLight.strength;
    this.playerLightEnabled.checked = this._lightingState.playerLight.enabled;
    this.playerLightSize.value = this._lightingState.playerLight.size;
    this.playerLightSpread.value = this._lightingState.playerLight.spread;
    this.playerLightIntensity.value = this._lightingState.playerLight.intensity;
    this.playerLightFlicker.checked = this._lightingState.playerLight.flicker;
    this.playerLightFlickerSpeed.value =
      this._lightingState.playerLight.flickerSpeed;
    this.playerLightFlickerIntensity.value =
      this._lightingState.playerLight.flickerIntensity;
  }

  validateRequired(field) {
    field.invalid = isNaN(field.value);
  }

  validateFields() {
    this.validateRequired(this.width);
    this.validateRequired(this.height);
    this.validateRequired(this.music);
    this.validateRequired(this.ambientSound);
    this.validateRequired(this.respawnX);
    this.validateRequired(this.respawnY);

    return (
      !this.width.invalid &&
      !this.height.invalid &&
      !this.music.invalid &&
      !this.ambientSound.invalid &&
      !this.respawnX.invalid &&
      !this.respawnY.invalid
    );
  }

  confirm(_event) {
    if (this.validateFields()) {
      this.open = false;

      // Build lighting state from form values
      const globalLight = new GlobalLight(
        this._lightingState.globalLight.color,
        this.globalLightStrength.value ?? 5.0,
      );

      const playerLight = new PlayerLight(
        this.playerLightEnabled.checked,
        this._lightingState.playerLight.color,
        this.playerLightSize.value ?? 2.4,
        this.playerLightSpread.value ?? 7.0,
        this.playerLightIntensity.value ?? 1.0,
        this.playerLightFlicker.checked,
        this.playerLightFlickerSpeed.value ?? 1.0,
        this.playerLightFlickerIntensity.value ?? 0.0,
      );

      const lightingState = new LightingState(
        globalLight,
        playerLight,
        this._lightingState.lightSources,
      );

      this.dispatchEvent(
        new CustomEvent("save", {
          detail: {
            mapProperties: new MapPropertiesState(
              this.name.value,
              this.width.value,
              this.height.value,
              Number.parseInt(this.type.value),
              Number.parseInt(this.effect.value),
              this.minimap.checked,
              this.scrolls.checked,
              this.music.value,
              this.ambientSound.value,
              Number.parseInt(this.musicControl.value),
              this.respawnX.value,
              this.respawnY.value,
            ),
            lightingState: lightingState,
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
