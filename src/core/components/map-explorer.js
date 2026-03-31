import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@spectrum-web-components/dialog/sp-dialog-wrapper";
import "@spectrum-web-components/button/sp-button";
import "@spectrum-web-components/action-group/sp-action-group";
import "@spectrum-web-components/search/sp-search";
import "@spectrum-web-components/divider/sp-divider";

@customElement("eomap-map-explorer")
export class MapExplorer extends LitElement {
    static get styles() {
        return css`
      :host {
        display: block;
      }
      .map-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: var(--spectrum-global-dimension-size-100);
        max-height: 400px;
        overflow-y: auto;
        padding: var(--spectrum-global-dimension-size-100);
        margin-top: var(--spectrum-global-dimension-size-100);
      }
      .map-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--spectrum-global-dimension-size-100);
        cursor: pointer;
        border: 1px solid transparent;
        border-radius: var(--spectrum-alias-component-border-radius);
        transition: background-color 0.2s, border-color 0.2s;
      }
      .map-item:hover {
        background-color: var(--spectrum-global-color-gray-200);
      }
      .map-item.selected {
        background-color: var(--spectrum-global-color-blue-100);
        border-color: var(--spectrum-global-color-blue-400);
      }
      .map-icon {
        font-size: 32px;
        margin-bottom: var(--spectrum-global-dimension-size-50);
      }
      .map-id {
        font-size: var(--spectrum-global-dimension-font-size-75);
        font-weight: bold;
      }
      sp-search {
        width: 100%;
        margin-bottom: var(--spectrum-global-dimension-size-100);
      }
      .empty-state {
        text-align: center;
        padding: var(--spectrum-global-dimension-size-200);
        color: var(--spectrum-global-color-gray-600);
      }
    `;
    }

    @state()
    maps = [];

    @state()
    filteredMaps = [];

    @state()
    searchQuery = "";

    @state()
    selectedMapId = null;

    @state()
    loading = true;

    async connectedCallback() {
        super.connectedCallback();
        await this.fetchMaps();
    }

    async fetchMaps() {
        this.loading = true;
        try {
            const response = await fetch("maps.json");
            if (response.ok) {
                this.maps = await response.json();
                this.filterMaps();
            } else {
                console.error("Failed to fetch maps.json");
            }
        } catch (e) {
            console.error("Error fetching maps:", e);
        } finally {
            this.loading = false;
        }
    }

    filterMaps() {
        if (!this.searchQuery) {
            this.filteredMaps = this.maps;
        } else {
            const query = this.searchQuery.toLowerCase();
            this.filteredMaps = this.maps.filter(
                (m) =>
                    m.id.toLowerCase().includes(query) ||
                    m.filename.toLowerCase().includes(query)
            );
        }
    }

    onSearch(e) {
        this.searchQuery = e.target.value;
        this.filterMaps();
    }

    onMapClick(mapId) {
        this.selectedMapId = mapId;
    }

    onMapDoubleClick(mapId) {
        this.selectedMapId = mapId;
        this.onConfirm();
    }

    onConfirm() {
        if (this.selectedMapId) {
            this.dispatchEvent(
                new CustomEvent("confirm", {
                    detail: { mapId: this.selectedMapId },
                })
            );
        }
    }

    onCancel() {
        this.dispatchEvent(new CustomEvent("cancel"));
    }

    renderMap(map) {
        return html`
      <div
        class="map-item ${this.selectedMapId === map.id ? "selected" : ""}"
        @click=${() => this.onMapClick(map.id)}
        @dblclick=${() => this.onMapDoubleClick(map.id)}
      >
        <div class="map-icon">🗺️</div>
        <div class="map-id">${map.id}</div>
      </div>
    `;
    }

    render() {
        return html`
      <sp-dialog-wrapper
        open
        headline="Browse Remote Maps"
        confirm-label="Open"
        cancel-label="Cancel"
        footer="Select a map from the repository"
        @confirm=${this.onConfirm}
        @cancel=${this.onCancel}
      >
        <sp-search
          placeholder="Search maps..."
          .value=${this.searchQuery}
          @input=${this.onSearch}
        ></sp-search>
        <sp-divider size="s"></sp-divider>
        <div class="map-list">
          ${this.loading
                ? html`<div class="empty-state">Loading maps...</div>`
                : this.filteredMaps.length > 0
                    ? this.filteredMaps.map((m) => this.renderMap(m))
                    : html`<div class="empty-state">No maps found.</div>`}
        </div>
      </sp-dialog-wrapper>
    `;
    }
}
