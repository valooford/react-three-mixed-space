import * as THREE from "three";

import Camera from "./scene/Camera";
import Model from "./scene/Model";
import Plane from "./scene/Plane";

class MainStartup {
  constructor({ context }) {
    const { engine } = context;

    this.engine = engine;
    this.camera = new Camera({
      camera: this.engine.camera,
      canvas: this.engine.canvas,
    });

    const light = new THREE.AmbientLight(0xffffff, 0.3);

    this.model = new Model();
    this.plane = new Plane();

    this.engine.scene.add(light);
    this.engine.scene.add(this.model);
    this.engine.scene.add(this.plane);

    this.engine.start();
  }
}

export default MainStartup;
