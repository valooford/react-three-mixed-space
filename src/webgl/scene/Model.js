import * as THREE from "three";

class Model extends THREE.Object3D {
  constructor() {
    super();

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
  }
}

export default Model;
