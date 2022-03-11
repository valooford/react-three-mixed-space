import * as THREE from "three";

class Model extends THREE.Object3D {
  constructor() {
    super();

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._material = new THREE.MeshPhongMaterial({ color: "lightgreen" });

    this._model = new THREE.Mesh(this._geometry, this._material);

    this.add(this._model);
  }
}

export default Model;
