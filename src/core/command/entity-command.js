import { MapCommand } from "./map-command";

export class EntityCommand extends MapCommand {
  constructor(mapState, x, y, oldEntityState, newEntityState, onLightSourceChange = null) {
    super(mapState);
    this.x = x;
    this.y = y;
    this.oldEntityState = oldEntityState;
    this.newEntityState = newEntityState;
    this.onLightSourceChange = onLightSourceChange;
  }

  setEntityState(entityState) {
    this.map.setWarp(this.x, this.y, entityState.warp);
    this.map.setSign(this.x, this.y, entityState.sign);
    this.map.setItems(this.x, this.y, entityState.items);
    this.map.setNPCs(this.x, this.y, entityState.npcs);

    // Update light sources via callback if provided
    if (this.onLightSourceChange) {
      this.onLightSourceChange(entityState);
    }
  }

  execute() {
    this.setEntityState(this.newEntityState);
  }

  undo() {
    this.setEntityState(this.oldEntityState);
  }
}
