# eomap-js Documentation

## Overview

**eomap-js** is an Endless Map File (EMF) editor for the Endless Online game. It provides a modern, cross-platform map editing experience.

### Platforms

- **Desktop**: Electron app for Windows, Linux, and macOS
- **Web**: Hosted at https://eomap.dev

### Key Features

- Map editing with multiple layers (Ground, Objects, Overlay, Walls, Roof, Top, Shadow, etc.)
- Drawing tools: Draw, Erase, Fill, Eyedropper, Entity placement
- Entity editing: NPCs, Items, Signs, Warps, Chests, Doors
- Map properties: Type, effects, music control, tile specs
- Graphics loading: Supports local EGF files and remote "Connected Mode"
- Grid lines overlay
- Undo/redo via command pattern
- Recent files history
- Keyboard shortcuts
- Context menus for entity operations

---

## Architecture

### Hybrid Architecture

The application uses a shared core with platform-specific adapters:

- **Shared core** (`src/core/`) - Used by both Electron and web
- **Platform adapters** (`src/electron/`, `src/web/`) - Filesystem and UI specifics

### Technology Stack

| Technology              | Purpose                     |
| ----------------------- | --------------------------- |
| Phaser 3                | Map rendering engine        |
| LitElement              | UI components               |
| Spectrum Web Components | UI design system            |
| Webpack                 | Module bundling             |
| Electron                | Desktop application wrapper |

### Design Patterns

- **Command Pattern** - Undo/redo functionality (`src/core/command/`)
- **State Management** - Custom state classes (`src/core/state/`)
- **Strategy Pattern** - Graphics loading (local vs remote)
- **Component-Based UI** - Custom elements with LitElement

---

## Directory Structure

```
eomap-js/
├── src/
│   ├── core/           # Shared application core
│   │   ├── command/    # Command pattern for undo/redo
│   │   ├── components/ # LitElement UI components
│   │   ├── data/       # EMF file format handling
│   │   ├── filesystem/ # Abstract filesystem interface
│   │   ├── gameobjects/# Phaser game objects
│   │   ├── gfx/        # Graphics loading system
│   │   ├── scenes/     # Phaser scenes
│   │   ├── state/      # Application state management
│   │   └── tools/      # Editor tools
│   ├── electron/       # Electron-specific code
│   │   ├── main/       # Main process
│   │   ├── preload/    # Preload scripts
│   │   └── renderer/   # Renderer process
│   └── web/            # Web-specific code
├── webpack/            # Webpack configurations
│   ├── base.js         # Shared config
│   ├── electron/       # Electron bundles
│   └── web/            # Web bundle
├── scripts/            # Build scripts
├── build/              # Build assets (icons, etc.)
└── docs/               # Documentation assets
```

---

## Key Source Files

### Entry Points

| File                             | Purpose                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `src/core/index.js`              | Core application initialization                              |
| `src/electron/main/index.js`     | Electron main process (window management, IPC, file dialogs) |
| `src/electron/renderer/index.js` | Electron renderer initialization                             |
| `src/web/index.js`               | Web app initialization                                       |

### Core Components (`src/core/components/`)

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `application.js`   | Main application component, orchestrates UI   |
| `editor.js`        | Map editor component, manages Phaser instance |
| `palette.js`       | Graphics palette for tile selection           |
| `entity-editor.js` | Entity property editing dialogs               |
| `sidebar.js`       | Tool sidebar                                  |
| `settings.js`      | Application settings                          |
| `menubar.js`       | Menu bar component                            |

### Game Objects (`src/core/gameobjects/`)

| File                | Purpose                              |
| ------------------- | ------------------------------------ |
| `eomap.js`          | Phaser game object for map rendering |
| `cursor.js`         | Cursor rendering                     |
| `palette-layer.js`  | Palette rendering layer              |
| `lighting-layer.js` | Lighting effects renderer            |

### Scenes (`src/core/scenes/`)

| File               | Purpose                            |
| ------------------ | ---------------------------------- |
| `editor-scene.js`  | Main Phaser scene for map editing  |
| `palette-scene.js` | Phaser scene for palette rendering |

### Data Handling (`src/core/data/`)

| File                            | Purpose                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `emf.js`                        | EMF file format definitions (MapItem, MapNPC, MapWarp, etc.) |
| `eo-reader.js`                  | Reading Endless Online binary format                         |
| `eo-builder.js`                 | Writing Endless Online binary format                         |
| `eo-encode.js` / `eo-decode.js` | Encoding/decoding utilities                                  |
| `eo-numeric-limits.js`          | Numeric limits for EO data types                             |
| `light-source.js`               | Light source entity class                                    |

### Tools (`src/core/tools/`)

| File                 | Purpose             |
| -------------------- | ------------------- |
| `tool.js`            | Base tool class     |
| `draw-tool.js`       | Drawing tiles       |
| `erase-tool.js`      | Erasing tiles       |
| `fill-tool.js`       | Fill tool           |
| `eyedropper-tool.js` | Pick tile from map  |
| `entity-tool.js`     | Place/edit entities |
| `move-tool.js`       | Pan camera          |
| `zoom-tool.js`       | Zoom camera         |

### Graphics System (`src/core/gfx/`)

| File                                       | Purpose                              |
| ------------------------------------------ | ------------------------------------ |
| `gfx-loader.js`                            | Graphics loading coordinator         |
| `load/gfx-loader.worker.js`                | Web Worker for graphics processing   |
| `load/strategy/local-loading-strategy.js`  | Local file loading                   |
| `load/strategy/remote-loading-strategy.js` | Remote HTTP loading                  |
| `texture-cache.js`                         | Texture caching system               |
| `asset.js`                                 | Graphics asset representation        |
| `load/dib-reader.js`                       | Windows DIB bitmap reader            |
| `load/pe-reader.js`                        | PE executable reader (for EGF files) |

### State Management (`src/core/state/`)

| File                        | Purpose                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| `map-state.js`              | Current map state (loaded, dirty, file handle)                     |
| `entity-state.js`           | Entity editing state (includes light sources)                      |
| `map-properties-state.js`   | Map properties                                                     |
| `lighting-state.js`         | Lighting configuration (global light, player light, light sources) |
| `layer-visibility-state.js` | Layer visibility toggles                                           |
| `settings-state.js`         | Application settings                                               |
| `menubar-state.js`          | Menu bar state                                                     |
| `tilepos-state.js`          | Tile position state                                                |

### Commands (`src/core/command/`)

| File                    | Purpose                      |
| ----------------------- | ---------------------------- |
| `command.js`            | Base command class           |
| `draw-command.js`       | Draw operation commands      |
| `fill-command.js`       | Fill operation commands      |
| `entity-command.js`     | Entity modification commands |
| `map-command.js`        | Map-level commands           |
| `properties-command.js` | Property change commands     |

---

## Build System

### Webpack Configuration

| File                           | Purpose                                      |
| ------------------------------ | -------------------------------------------- |
| `webpack/base.js`              | Shared webpack config (CSS, assets, plugins) |
| `webpack/electron/main.js`     | Electron main process bundle                 |
| `webpack/electron/renderer.js` | Electron renderer bundle (with Babel)        |
| `webpack/electron/preload.js`  | Electron preload script bundle               |
| `webpack/web/web.js`           | Web bundle (with Terser for production)      |

### Build Scripts (`scripts/`)

| Script                      | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| `build.js`                  | Production build (preload → main → renderer)           |
| `start.js`                  | Development build with webpack-dev-server and Electron |
| `bump-changelog-version.js` | Version bumping utility                                |

### NPM Scripts

```bash
npm start           # Development mode (webpack-dev-server + Electron)
npm run build       # Production build
npm run dist:web    # Web distribution to dist/web/
npm run dist:electron # Electron packaging with electron-builder
```

### Build Process

1. **Development**: Webpack dev server on port 9000, Electron loads from localhost
2. **Production**: Sequential builds (preload → main → renderer)
3. **Distribution**:
   - Web: Outputs to `dist/web/`
   - Electron: Uses electron-builder for platform-specific packages

---

## Dependencies

### Runtime Dependencies

| Package                           | Version  | Purpose                           |
| --------------------------------- | -------- | --------------------------------- |
| `phaser`                          | ^3.55.2  | Game framework for map rendering  |
| `@spectrum-web-components/bundle` | ^0.24.10 | Adobe Spectrum UI components      |
| `@mapbox/shelf-pack`              | ^3.2.0   | Texture packing algorithm         |
| `crc-32`                          | ^1.2.2   | CRC32 checksum calculation        |
| `windows-1252`                    | ^3.0.4   | Character encoding for EO strings |
| `idb-keyval`                      | ^6.2.2   | IndexedDB key-value storage       |
| `eventemitter3`                   | ^5.0.1   | Event emitter                     |
| `electron-log`                    | ^4.4.8   | Logging for Electron              |
| `electron-updater`                | ^6.6.2   | Auto-update functionality         |
| `yargs`                           | ^17.7.2  | Command-line argument parsing     |

### Development Dependencies

| Package                        | Purpose                  |
| ------------------------------ | ------------------------ |
| `webpack`                      | Module bundler           |
| `babel-loader` + `@babel/core` | JavaScript transpilation |
| `electron`                     | Electron runtime         |
| `electron-builder`             | Electron app packaging   |
| `prettier`                     | Code formatting          |
| `husky` + `lint-staged`        | Git hooks for formatting |
| `webpack-dev-server`           | Development server       |
| `worker-loader`                | Web Worker support       |

---

## Special Features

### Lighting System

The map editor includes a lighting system for visual effects:

**Global Light**: Ambient lighting applied to the entire map

- Color: Hex color value (default `#000033`)
- Strength: 0-10 scale controlling darkness (default 5.0)

**Player Light**: Light emanating from the player position (preview at screen center)

- Enabled: Toggle on/off
- Color, Size, Spread, Intensity: Control light appearance
- Flicker: Optional flickering effect with speed and intensity controls

**Light Sources**: Placeable light entities on the map

- Added via Entity Tool > Light Sources section
- Each light source has: position, color, size, spread, intensity, flicker settings
- Multiple light sources can be placed per tile

**Storage**: Lighting data is stored in a companion JSON file (`mapname.json`) alongside the EMF file, not in the EMF itself.

**Rendering**: Uses multiply blend mode overlay technique compatible with both WebGL and Canvas renderers.

### Connected Mode

- Can load graphics from remote Mapper Service (CORS-enabled server)
- Environment variable `FORCE_CONNECTED_MODE_URL` locks to a specific service

### Platform-Specific Features

- **macOS**: Native menus
- **Windows**: NSIS installer, Jump List support
- **Linux**: Snap package support

### File Associations

- Associates with `.emf` files
- App ID: `dev.eomap.app`

---

## CI/CD

### GitHub Actions Workflows

| Workflow      | Purpose                |
| ------------- | ---------------------- |
| `build.yml`   | Build verification     |
| `format.yml`  | Code formatting checks |
| `release.yml` | Release automation     |

### Code Quality

- Prettier formatting enforced via pre-commit hooks
- SonarCloud integration for code analysis

---

## Version

Current version: **1.3.2**
