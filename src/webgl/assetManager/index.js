import * as THREE from "three";

class AssetManager {
  constructor() {
    this._queue = new Set();
    this._cache = {};
    this._listeners = [];
  }

  subscribe() {}

  queue() {}

  get() {}

  loadQueued() {}

  load() {}
}

export default AssetManager;
