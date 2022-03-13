import * as THREE from "three";

import Camera from "./scene/Camera";
import Model from "./scene/Model";
import Plane from "./scene/Plane";

const assetUrls = {
  modelTexture: "./assets/textures/Miner_diffuse.tga.png",
  model: "./assets/models/char_man.fbx",
  modelAnimationIdle: "./assets/models/char_man_idle.fbx",
  modelAnimationWalk: "./assets/models/char_man_walk.fbx",
};

class MainStartup {
  constructor({ context }) {
    const { engine, assets } = context;

    this.engine = engine;
    this.camera = new Camera({ camera: this.engine.camera });
    this.model = null;
    this.plane = null;
    this.tracked = new Set();

    const light = new THREE.AmbientLight(0xffffff, 0.3);

    assets.queue(assetUrls.model);
    assets.queue(assetUrls.modelTexture);
    assets.queue(assetUrls.modelAnimationIdle);
    assets.queue(assetUrls.modelAnimationWalk);

    assets.subscribe(() => {
      {
        const model = assets.get(assetUrls.model);
        const texture = assets.get(assetUrls.modelTexture);
        const idle = assets.get(assetUrls.modelAnimationIdle);
        const walk = assets.get(assetUrls.modelAnimationWalk);
        this.model = new Model({ model, texture, idle, walk });
      }

      {
        const onIntersect = (coords) => {
          this.model.targetPosition = this.engine.scene.worldToLocal(coords);
        };
        this.plane = new Plane({
          camera: this.engine.camera,
          canvas: this.engine.canvas,
          onIntersect,
        });
      }

      this.engine.scene.add(light);
      this.engine.scene.add(this.model);
      this.plane.centerAnchor.add(this.camera);
      this.engine.scene.add(this.plane);

      this.engine.start();
    });
    assets.loadQueued();
  }

  setAngle(angle) {
    this.camera.rotateTo(angle);
  }

  track(resource) {
    if (!resource) return resource;
    if (Array.isArray(resource)) {
      resource.forEach((r) => this.track(r));
      return resource;
    }
    if (typeof resource.dispose === "function") {
      this.tracked.add(resource);
    }
    if (resource instanceof THREE.Object3D) {
      this.tracked.add(resource);
      this.track(resource.geometry);
      this.track(resource.material);
      this.track(resource.children);
    }
    if (resource instanceof THREE.Material) {
      Object.values(resource).forEach((r) => {
        if (r instanceof THREE.Texture) {
          this.track(r);
        }
      });
    }
    return resource;
  }

  destroy() {
    this.engine.stop();
    this.engine = null;
    this.camera = null;
    this.model = null;
    this.plane = null;
  }
}

export default MainStartup;
