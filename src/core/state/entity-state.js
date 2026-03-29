import { MapItem, MapNPC } from "../data/emf";
import { LightSource } from "../data/light-source";

export class EntityState {
  constructor(x, y, warp, sign, npcs, items, lightSources = []) {
    this.x = x;
    this.y = y;
    this.warp = warp;
    this.sign = sign;
    this.npcs = npcs;
    this.items = items;
    this.lightSources = lightSources;
  }

  copy() {
    return new EntityState(
      this.x,
      this.y,
      this.warp,
      this.sign,
      this.npcs.map(
        (npc) =>
          new MapNPC(
            npc.x,
            npc.y,
            npc.id,
            npc.spawnType,
            npc.spawnTime,
            npc.amount,
          ),
      ),
      this.items.map(
        (item) =>
          new MapItem(
            item.x,
            item.y,
            item.key,
            item.chestSlot,
            item.id,
            item.spawnTime,
            item.amount,
          ),
      ),
      this.lightSources.map((ls) => ls.copy()),
    );
  }

  withX(x) {
    let copy = this.copy();
    copy.x = x;
    for (let npc of copy.npcs) {
      npc.x = x;
    }
    for (let item of copy.items) {
      item.x = x;
    }
    for (let ls of copy.lightSources) {
      ls.x = x;
    }
    return copy;
  }

  withY(y) {
    let copy = this.copy();
    copy.y = y;
    for (let npc of copy.npcs) {
      npc.y = y;
    }
    for (let item of copy.items) {
      item.y = y;
    }
    for (let ls of copy.lightSources) {
      ls.y = y;
    }
    return copy;
  }

  withWarp(warp) {
    let copy = this.copy();
    copy.warp = warp;
    return copy;
  }

  withSign(sign) {
    let copy = this.copy();
    copy.sign = sign;
    return copy;
  }

  withNpcs(npcs) {
    let copy = this.copy();
    copy.npcs = npcs;
    return copy;
  }

  withItems(items) {
    let copy = this.copy();
    copy.items = items;
    return copy;
  }

  withLightSources(lightSources) {
    let copy = this.copy();
    copy.lightSources = lightSources;
    return copy;
  }
}
