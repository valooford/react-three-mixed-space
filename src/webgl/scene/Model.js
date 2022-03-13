import * as THREE from "three";

class Model extends THREE.Object3D {
  static speed = 1; // units per second

  static rotationSpeed = Math.PI; // radians per second

  static rotationLimit = Math.PI / 4; // condition for simultaneous move and rotation

  constructor({ model, texture }) {
    super();

    this.targetPosition = null;
    this.isRotated = false;
    this.isPositioned = false;

    this._material = new THREE.MeshPhongMaterial({ map: texture });

    this._model = model;
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
      const angle = this.rotate(dtimeS);
      if (this.isRotated && angle < Model.rotationLimit) {
        this.move(dtimeS);
      }

      if (this.isRotated && this.isPositioned) {
        this.targetPosition = null;
        this.isRotated = false;
        this.isPositioned = false;
      }
    }
  }

  rotate(dtime) {
    const step = Model.rotationSpeed * dtime;
    const startRotation = new THREE.Quaternion().copy(this.quaternion);
    this.lookAt(this.targetPosition);
    const targetRotation = new THREE.Quaternion().copy(this.quaternion);
    const angle = startRotation.angleTo(targetRotation);
    if (angle > step) {
      this.quaternion.copy(startRotation.rotateTowards(targetRotation, step));
    } else {
      this.quaternion.copy(targetRotation);
      this.isRotated = true;
    }
    return angle;
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
      this.isPositioned = true;
    }
  }
}

export default Model;
