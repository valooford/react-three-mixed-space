import * as THREE from "three";

import Model from "./scene/Model";

class MainStartup {
  constructor({ context }) {
    const { engine } = context;

    this.engine = engine;

    this.model = new Model();

    this.engine.scene.add(this.model);
  }
}

export default MainStartup;
