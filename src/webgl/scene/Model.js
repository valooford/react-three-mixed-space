import * as THREE from "three";

class Model extends THREE.Object3D {
  constructor() {
    super();

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._material = new THREE.MeshPhongMaterial({ color: "lightgreen" });

    this._model = new THREE.Mesh(this._geometry, this._material);
    this._model.position.y = 0.5;

    this._light = new THREE.DirectionalLight(0xffffff, 1);
    this._light.position.set(3, 2, 1);

    this.add(this._model);
    this.add(this._light);
    this.add(this._light.target);
  }

  update(dtime, time) {}
}

export default Model;
