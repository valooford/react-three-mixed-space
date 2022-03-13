import * as THREE from "three";

class Model extends THREE.Object3D {
  static speed = 1; // units per second

  constructor() {
    super();

    this.targetPosition = null;

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._material = new THREE.MeshPhongMaterial({ color: "lightgreen" });

    this._model = new THREE.Mesh(this._geometry, this._material);
    this._model.position.y = 0.5;
    this._model.castShadow = true;

    this._light = new THREE.DirectionalLight(0xffffff, 1);
    this._light.position.set(3, 2, 1);
    this._light.castShadow = true;

    this.add(this._model);
    this.add(this._light);
    this.add(this._light.target);
  }

  update(dtime, time) {
    const dtimeS = dtime * 0.001;

    if (this.targetPosition) {
      this.move(dtimeS);
    }
  }

  move(dtime) {
    const distance = Model.speed * dtime;
    const targetVector = new THREE.Vector3()
      .copy(this.targetPosition)
      .sub(this.position);
    if (targetVector.length() > distance) {
      targetVector.normalize().multiplyScalar(distance);
      this.position.add(targetVector);
    } else {
      this.position.copy(this.targetPosition);
      this.targetPosition = null;
    }
  }
}

export default Model;
