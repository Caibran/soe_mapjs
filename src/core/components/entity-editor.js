import { html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  AddCircleIcon,
  CloseIcon,
} from "@spectrum-web-components/icons-workflow";

import "@spectrum-web-components/accordion/sp-accordion-item.js";
import "@spectrum-css/table/dist/index-vars.css";

import "./accordion";
import "./modal";
import "./entity-warp";
import "./entity-sign";
import "./entity-npc";
import "./entity-item";
import "./entity-lightsource";

import { EntityState } from "../state/entity-state";
import { MapItem, MapNPC, MapSign, MapWarp } from "../data/emf";
import { LightSource } from "../data/light-source";
import { TilePosState } from "../state/tilepos-state";

@customElement("eomap-entity-editor")
export class EntityEditor extends LitElement {
  @query("eomap-accordion")
  accordion;

  @query("eomap-entity-warp")
  warp;

  @query("eomap-entity-sign")
  sign;

  @query("eomap-entity-npc")
  npc;

  @query("eomap-entity-item")
  item;

  @query("eomap-entity-lightsource")
  lightSource;

  @property({ type: TilePosState })
  tilePos;

  @property({ type: Boolean, reflect: true })
  open = false;

  @state({ type: EntityState })
  entityState;

  @state({ type: Function })
  onWarpSave = (event) => {
    this.entityState = this.entityState.withWarp(
      new MapWarp(
        event.detail.map,
        event.detail.x,
        event.detail.y,
        event.detail.level,
        event.detail.door,
      ),
    );
  };

  @state({ type: Function })
  onSignSave = (event) => {
    this.entityState = this.entityState.withSign(
      new MapSign(event.detail.title, event.detail.message),
    );
  };

  @state({ type: Function })
  onNpcSave;

  @state({ type: Function })
  onItemSave;

  @state({ type: Function })
  onLightSourceSave;

  renderNewButton(onClick) {
    return html`
      <sp-action-button quiet @click=${onClick}>
        New
        <sp-icon slot="icon">${AddCircleIcon()}</sp-icon>
      </sp-action-button>
    `;
  }

  renderDeleteButton(onClick) {
    return html`
      <sp-action-button class="delete-button" quiet @click=${onClick}>
        <sp-icon slot="icon">${CloseIcon()}</sp-icon>
      </sp-action-button>
    `;
  }

  renderWarp() {
    if (this.entityState) {
      let warp = this.entityState.warp;
      if (warp) {
        return html`
          <table class="spectrum-Table spectrum-Table--sizeS">
            <thead class="spectrum-Table-head">
              <tr>
                <th class="spectrum-Table-headCell">Map</th>
                <th class="spectrum-Table-headCell">X</th>
                <th class="spectrum-Table-headCell">Y</th>
                <th class="spectrum-Table-headCell">Level</th>
                <th class="spectrum-Table-headCell">Key</th>
                <th class="spectrum-Table-headCell">Door</th>
              </tr>
            </thead>
            <tbody class="spectrum-Table-body">
              <tr
                class="spectrum-Table-row"
                tabindex="0"
                @click=${() => {
                  this.saveFocus();
                  this.warp.open = true;
                  this.warp.headline = "Edit Warp";
                  this.warp.populate(warp);
                }}
              >
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${warp.map}
                </td>
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${warp.x}
                </td>
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${warp.y}
                </td>
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${warp.level}
                </td>
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${warp.door > 1 ? warp.door : ""}
                </td>
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${warp.door > 0 ? "Yes" : "No"}
                </td>
              </tr>
              ${this.renderDeleteButton(() => {
                this.entityState = this.entityState.withWarp(null);
              })}
            </tbody>
          </table>
        `;
      } else {
        return this.renderNewButton(() => {
          this.saveFocus();
          this.warp.open = true;
          this.warp.headline = "New Warp";
          this.warp.reset();
        });
      }
    }
  }

  renderSign() {
    if (this.entityState) {
      let sign = this.entityState.sign;
      if (sign) {
        return html`
          <table
            class="spectrum-Table spectrum-Table--sizeS"
            style="width: 395px"
          >
            <style>
              td {
                max-width: 200px;
                word-break: break-word;
              }
            </style>
            <thead class="spectrum-Table-head">
              <tr>
                <th class="spectrum-Table-headCell">Title</th>
                <th class="spectrum-Table-headCell">Message</th>
              </tr>
            </thead>
            <tbody class="spectrum-Table-body">
              <tr
                class="spectrum-Table-row"
                tabindex="0"
                @click=${() => {
                  this.saveFocus();
                  this.sign.open = true;
                  this.sign.headline = "Edit Sign";
                  this.sign.populate(sign);
                }}
              >
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${sign.title || "\u200B"}
                </td>
                <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                  ${sign.message || "\u200B"}
                </td>
              </tr>
              ${this.renderDeleteButton(() => {
                this.entityState = this.entityState.withSign(null);
              })}
            </tbody>
          </table>
        `;
      } else {
        return this.renderNewButton(() => {
          this.saveFocus();
          this.sign.open = true;
          this.sign.headline = "New Sign";
          this.sign.reset();
        });
      }
    }
  }

  renderNPCs() {
    if (this.entityState) {
      let rows = this.entityState.npcs.map((npc, index) => {
        return html`
          <tbody class="spectrum-Table-body">
            <tr
              class="spectrum-Table-row"
              tabindex="0"
              @click=${() => {
                this.saveFocus();
                this.npc.open = true;
                this.npc.headline = "Edit NPC Spawn";
                this.npc.populate(npc);
                this.onNpcSave = (event) => {
                  let npcs = [...this.entityState.npcs];
                  npcs[index] = new MapNPC(
                    this.tilePos.x,
                    this.tilePos.y,
                    event.detail.id,
                    event.detail.speed,
                    event.detail.spawnTime,
                    event.detail.amount,
                  );
                  this.entityState = this.entityState.withNpcs(npcs);
                };
              }}
            >
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${npc.id}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${npc.amount}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${npc.spawnType}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${npc.spawnTime}
              </td>
            </tr>
            ${this.renderDeleteButton(() => {
              this.entityState = this.entityState.copy();
              this.entityState.npcs.splice(index, 1);
            })}
          </tbody>
        `;
      });

      let table;
      if (rows.length > 0) {
        table = html`
          <table class="spectrum-Table spectrum-Table--sizeS">
            <thead class="spectrum-Table-head">
              <tr>
                <th class="spectrum-Table-headCell">ID</th>
                <th class="spectrum-Table-headCell">Amount</th>
                <th class="spectrum-Table-headCell">Speed</th>
                <th class="spectrum-Table-headCell">Spawn time</th>
              </tr>
            </thead>
            ${rows}
          </table>
        `;
      }

      return html`
        ${table}
        ${this.renderNewButton(() => {
          this.saveFocus();
          this.npc.open = true;
          this.npc.headline = "New NPC Spawn";
          this.npc.reset();
          this.onNpcSave = (event) => {
            let newNpc = new MapNPC(
              this.tilePos.x,
              this.tilePos.y,
              event.detail.id,
              event.detail.speed,
              event.detail.spawnTime,
              event.detail.amount,
            );
            let npcs = [...this.entityState.npcs, newNpc];
            this.entityState = this.entityState.withNpcs(npcs);
          };
        })}
      `;
    }
  }

  renderItems() {
    if (this.entityState) {
      let rows = this.entityState.items.map((item, index) => {
        return html`
          <tbody class="spectrum-Table-body">
            <tr
              class="spectrum-Table-row"
              tabindex="0"
              @click=${() => {
                this.saveFocus();
                this.item.open = true;
                this.item.headline = "Edit Item Spawn";
                this.item.populate(item);
                this.onItemSave = (event) => {
                  let items = [...this.entityState.items];
                  items[index] = new MapItem(
                    this.tilePos.x,
                    this.tilePos.y,
                    event.detail.key,
                    event.detail.chestSlot,
                    event.detail.id,
                    event.detail.spawnTime,
                    event.detail.amount,
                  );
                  this.entityState = this.entityState.withItems(items);
                };
              }}
            >
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${item.id}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${item.amount}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${item.spawnTime}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${item.chestSlot}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${item.key}
              </td>
            </tr>
            ${this.renderDeleteButton(() => {
              this.entityState = this.entityState.copy();
              this.entityState.items.splice(index, 1);
            })}
          </tbody>
        `;
      });

      let table;
      if (rows.length > 0) {
        table = html`
          <table class="spectrum-Table spectrum-Table--sizeS">
            <thead class="spectrum-Table-head">
              <tr>
                <th class="spectrum-Table-headCell">ID</th>
                <th class="spectrum-Table-headCell">Amount</th>
                <th class="spectrum-Table-headCell">Spawn time</th>
                <th class="spectrum-Table-headCell">Chest slot</th>
                <th class="spectrum-Table-headCell">Key</th>
              </tr>
            </thead>
            ${rows}
          </table>
        `;
      }

      return html`
        ${table}
        ${this.renderNewButton(() => {
          this.saveFocus();
          this.item.open = true;
          this.item.headline = "New Item Spawn";
          this.item.reset();
          this.onItemSave = (event) => {
            let newItem = new MapItem(
              this.tilePos.x,
              this.tilePos.y,
              event.detail.key,
              event.detail.chestSlot,
              event.detail.id,
              event.detail.spawnTime,
              event.detail.amount,
            );
            let items = [...this.entityState.items, newItem];
            this.entityState = this.entityState.withItems(items);
          };
        })}
      `;
    }
  }

  renderLightSources() {
    if (this.entityState) {
      let rows = this.entityState.lightSources.map((ls, index) => {
        return html`
          <tbody class="spectrum-Table-body">
            <tr
              class="spectrum-Table-row"
              tabindex="0"
              @click=${() => {
                this.saveFocus();
                this.lightSource.open = true;
                this.lightSource.headline = "Edit Light Source";
                this.lightSource.populate(ls);
                this.onLightSourceSave = (event) => {
                  let lightSources = [...this.entityState.lightSources];
                  lightSources[index] = new LightSource(
                    this.tilePos.x,
                    this.tilePos.y,
                    event.detail.color,
                    event.detail.size,
                    event.detail.spread,
                    event.detail.intensity,
                    event.detail.flicker,
                    event.detail.flickerSpeed,
                    event.detail.flickerIntensity,
                  );
                  this.entityState =
                    this.entityState.withLightSources(lightSources);
                };
              }}
            >
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                <span
                  style="display: inline-block; width: 16px; height: 16px; background-color: ${ls.color}; border: 1px solid #888; border-radius: 2px; vertical-align: middle;"
                ></span>
                ${ls.color}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${ls.size.toFixed(1)}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${ls.spread.toFixed(1)}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${ls.intensity.toFixed(1)}
              </td>
              <td class="spectrum-Table-cell spectrum-Table-cell--divider">
                ${ls.flicker ? "Yes" : "No"}
              </td>
            </tr>
            ${this.renderDeleteButton(() => {
              this.entityState = this.entityState.copy();
              this.entityState.lightSources.splice(index, 1);
            })}
          </tbody>
        `;
      });

      let table;
      if (rows.length > 0) {
        table = html`
          <table class="spectrum-Table spectrum-Table--sizeS">
            <thead class="spectrum-Table-head">
              <tr>
                <th class="spectrum-Table-headCell">Color</th>
                <th class="spectrum-Table-headCell">Size</th>
                <th class="spectrum-Table-headCell">Spread</th>
                <th class="spectrum-Table-headCell">Intensity</th>
                <th class="spectrum-Table-headCell">Flicker</th>
              </tr>
            </thead>
            ${rows}
          </table>
        `;
      }

      return html`
        ${table}
        ${this.renderNewButton(() => {
          this.saveFocus();
          this.lightSource.open = true;
          this.lightSource.headline = "New Light Source";
          this.lightSource.reset();
          this.onLightSourceSave = (event) => {
            let newLightSource = new LightSource(
              this.tilePos.x,
              this.tilePos.y,
              event.detail.color,
              event.detail.size,
              event.detail.spread,
              event.detail.intensity,
              event.detail.flicker,
              event.detail.flickerSpeed,
              event.detail.flickerIntensity,
            );
            let lightSources = [
              ...this.entityState.lightSources,
              newLightSource,
            ];
            this.entityState = this.entityState.withLightSources(lightSources);
          };
        })}
      `;
    }
  }

  renderDialogStyles() {
    return html`
      <style>
        .spectrum-Table {
          width: calc(100% - 28px);
          margin-bottom: var(--spectrum-table-regular-header-padding-bottom);
        }
        .spectrum-Row {
          vertical-align: middle;
        }
        .delete-button {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          right: -28px;
          min-width: 28px;
          min-height: 28px;
          width: 28px;
          height: 28px;
        }
        .spectrum-Table tbody.spectrum-Table-body:last-of-type .delete-button {
          bottom: 1px;
        }
      </style>
    `;
  }

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

  render() {
    return html`
      <eomap-modal
        headline="Entities"
        confirm-label="Save"
        cancel-label="Cancel"
        .open=${this.open}
        .width=${535}
        @confirm=${this.confirm}
        @cancel=${this.cancel}
        @close=${this.close}
      >
        ${this.renderDialogStyles()}
        <eomap-accordion>
          <sp-accordion-item label="Warp">
            ${this.renderWarp()}
          </sp-accordion-item>
          <sp-accordion-item label="Sign">
            ${this.renderSign()}
          </sp-accordion-item>
          <sp-accordion-item label="NPC Spawns">
            ${this.renderNPCs()}
          </sp-accordion-item>
          <sp-accordion-item label="Item Spawns">
            ${this.renderItems()}
          </sp-accordion-item>
          <sp-accordion-item label="Light Sources">
            ${this.renderLightSources()}
          </sp-accordion-item>
        </eomap-accordion>
      </eomap-modal>
      <eomap-entity-warp
        @close=${this.restoreFocus}
        @save=${this.onWarpSave}
      ></eomap-entity-warp>
      <eomap-entity-sign
        @close=${this.restoreFocus}
        @save=${this.onSignSave}
      ></eomap-entity-sign>
      <eomap-entity-npc
        @close=${this.restoreFocus}
        @save=${this.onNpcSave}
      ></eomap-entity-npc>
      <eomap-entity-item
        @close=${this.restoreFocus}
        @save=${this.onItemSave}
      ></eomap-entity-item>
      <eomap-entity-lightsource
        @close=${this.restoreFocus}
        @save=${this.onLightSourceSave}
      ></eomap-entity-lightsource>
    `;
  }

  confirm(_event) {
    this.open = false;
    this.dispatchEvent(new CustomEvent("save", { detail: this.entityState }));
  }

  cancel(_event) {
    this.open = false;
  }

  close(_event) {
    this.open = false;
    this.dispatchEvent(new CustomEvent("close"));
  }

  saveFocus() {
    this.focusedElement = document.activeElement;
  }

  restoreFocus() {
    this.focusedElement.focus();
  }
}
