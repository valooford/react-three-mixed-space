import * as THREE from "three";

import Camera from "./scene/Camera";
import Model from "./scene/Model";
import Plane from "./scene/Plane";

const assetUrls = {
  modelTexture: "./assets/textures/wall.png",
};

class MainStartup {
  constructor({ context }) {
    const { engine, assets } = context;

    this.engine = engine;
    this.camera = new Camera({
      camera: this.engine.camera,
      canvas: this.engine.canvas,
    });
    this.model = null;
    this.plane = null;

    const light = new THREE.AmbientLight(0xffffff, 0.3);

    assets.queue(assetUrls.modelTexture);

    assets.subscribe(() => {
      {
        const texture = assets.get(assetUrls.modelTexture);
        this.model = new Model({ texture });
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
      this.engine.scene.add(this.plane);

      this.engine.start();
    });
    assets.loadQueued();
  }
}

export default MainStartup;
