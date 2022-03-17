import * as THREE from "three";

class Camera extends THREE.Object3D {
  static smoothTime = 1500;

  constructor({ camera }) {
    super();

    this.camera = camera;
    this._targetRotation = null;
    this._savedRotation = null;
    this._speed = 0;

    this.camera.position.set(0, 0.5, 4);

    this.add(this.camera);
  }

  update(dtime, time) {
    if (typeof this._targetRotation === "number") {
      const rotation = this.rotation.x;
      const angle = this._targetRotation - rotation;
      // if rotation not in process or new rotation started
      if (
        !(typeof this._savedRotation === "number") ||
        (this._speed && this._savedRotation !== this._targetRotation)
      ) {
        this._savedRotation = this._targetRotation;
        this._speed = angle / Camera.smoothTime; // rad per millisecond
      }
      const step = this._speed * dtime; // rad to rotate
      // if angle is reached
      if (!this._speed || Math.abs(angle) < Math.abs(step)) {
        this.rotation.x = this._targetRotation;
        this._targetRotation = null;
        this._savedRotation = null;
        this._speed = null;
        return;
      }
      this.rotateX(step);
    }
  }

  rotateTo(angle) {
    this._targetRotation = THREE.MathUtils.degToRad(angle);
  }
}

export default Camera;
