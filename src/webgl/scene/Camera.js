import * as THREE from "three";

class Camera extends THREE.Object3D {
  constructor({ camera }) {
    super();

    this.camera = camera;
    this._targetRotation = null;
    this._savedRotation = null;
    this._speed = 0;

    this.camera.position.set(0, 0.5, 4);

    this.rotation.x = THREE.MathUtils.degToRad(20);

    this.add(this.camera);
  }

  rotateTo(angle) {
    this._targetRotation = THREE.MathUtils.degToRad(angle);
  }
}

export default Camera;
