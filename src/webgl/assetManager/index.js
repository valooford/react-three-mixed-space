import * as THREE from "three";

class AssetManager {
  constructor() {
    this._queue = new Set();
    this._cache = {};
    this._listeners = [];
  }

  subscribe(fn) {
    this._listeners.push(fn);
  }

  queue(url) {
    this._queue.add(url);
  }

  get(url) {
    return this._cache[url];
  }

  loadQueued() {
    if (this._queue.size === 0) {
      this._listeners.forEach((fn) => fn());
      return;
    }
    const queue = Array.from(this._queue);
    this._queue.clear();
    let count = 0;
    queue.map((url) =>
      this.load(url).then(() => {
        count++;
        if (count === queue.length) {
          // progress calculation goes here...
          this._listeners.forEach((fn) => fn());
        }
      })
    );
  }

  load(url) {
    return new Promise((resolve, reject) => {
      if (url.endsWith(".png")) {
        const loader = new THREE.TextureLoader();
        loader.load(url, resolve, undefined, reject);
      } else {
        reject();
      }
    })
      .then((res) => {
        this._cache[url] = res;
        return res;
      })
      .catch(() => {
        delete this._cache[url];
        throw Error(`Error while uploading ${url}`);
      });
  }
}

export default AssetManager;
