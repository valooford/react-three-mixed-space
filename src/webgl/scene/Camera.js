import * as THREE from "three";

class Camera extends THREE.Object3D {
  static smoothTime = 1500;

  constructor({ camera }) {
    super();

    this.camera = camera;
    this.targetRotation = null;
    this.savedRotation = null;
    this.speed = 0;

    this.camera.position.set(0, 0.5, 4);

    this.add(this.camera);
  }

  update(dtime, time) {
    if (typeof this.targetRotation === "number") {
      const rotation = this.rotation.x;
      const angle = this.targetRotation - rotation;
      // if rotation not in process or new rotation started
      if (
        !(typeof this.savedRotation === "number") ||
        (this.speed && this.savedRotation !== this.targetRotation)
      ) {
        this.savedRotation = this.targetRotation;
        this.speed = angle / Camera.smoothTime; // rad per millisecond
      }
      const step = this.speed * dtime; // rad to rotate
      // if angle is reached
      if (!this.speed || Math.abs(angle) < Math.abs(step)) {
        this.rotation.x = this.targetRotation;
        this.targetRotation = null;
        this.savedRotation = null;
        this.speed = null;
        return;
      }
      this.rotateX(step);
    }
  }

  rotateTo(angle) {
    this.targetRotation = THREE.MathUtils.degToRad(angle);
  }
}

export default Camera;
