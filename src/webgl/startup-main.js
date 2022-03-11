import * as THREE from "three";

import Model from "./scene/Model";

class MainStartup {
  constructor({ context }) {
    const { engine } = context;

    this.engine = engine;
    this.engine.camera.position.z = 2;

    const light = new THREE.AmbientLight(0xffffff, 1);

    this.model = new Model();

    this.engine.scene.add(light);
    this.engine.scene.add(this.model);

    this.engine.draw();
  }
}

export default MainStartup;
