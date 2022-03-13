import * as THREE from "three";

class Model extends THREE.Object3D {
  static scale = 0.035;

  static speed = Model.scale * 30; // units per second

  static rotationSpeed = Math.PI; // radians per second

  static rotationLimit = Math.PI / 4; // condition for simultaneous move and rotation

  constructor({ model, texture, idle, walk }) {
    super();

    this.targetPosition = null;
    this.isRotated = false;
    this.isPositioned = false;
    this._mixer = null;
    this._actions = { idle: null };
    this._currentAction = null;

    this._material = new THREE.MeshPhongMaterial({ map: texture });

    this._model = model;
    this._model.scale.setScalar(Model.scale);
    this._model.children.forEach((part) => {
      if (part instanceof THREE.Mesh) {
        part.material = this._material;
        part.castShadow = true;
      }
    });

    this._mixer = new THREE.AnimationMixer(this._model);
    this._actions.idle = this._mixer.clipAction(idle.animations[0]);
    this._actions.idle.fadeIn(0.5);
    this._actions.idle.play();
    this._currentAction = this._actions.idle;
    this._actions.walk = this._mixer.clipAction(walk.animations[0]);

    this._light = new THREE.DirectionalLight(0xffffff, 1);
    this._light.position.set(3, 2, 1);
    this._light.castShadow = true;

    this.add(this._model);
    this.add(this._light);
    this.add(this._light.target);
  }

  switchAnimation(anim) {
    this._currentAction.fadeOut(0.5);
    this._currentAction = anim;
    this._currentAction.reset();
    this._currentAction.fadeIn(0.5);
    this._currentAction.play();
  }

  update(dtime, time) {
    const dtimeS = dtime * 0.001;
    this._mixer.update(dtimeS);

    if (this.targetPosition) {
      const angle = this.rotate(dtimeS);
      if (this.isRotated && angle < Model.rotationLimit) {
        if (!this._actions.walk.isRunning()) {
          this.switchAnimation(this._actions.walk);
        }
        this.move(dtimeS);
      }

      if (this.isRotated && this.isPositioned) {
        this.switchAnimation(this._actions.idle);
        this.targetPosition = null;
        this.isRotated = false;
        this.isPositioned = false;
      }
    }
  }

  rotate(dtime) {
    const step = Model.rotationSpeed * dtime;
    const startRotation = new THREE.Quaternion().copy(this._model.quaternion);
    this._model.lookAt(this.targetPosition);
    const targetRotation = new THREE.Quaternion().copy(this._model.quaternion);
    const angle = startRotation.angleTo(targetRotation);
    if (angle > step) {
      this._model.quaternion.copy(
        startRotation.rotateTowards(targetRotation, step)
      );
    } else {
      this._model.quaternion.copy(targetRotation);
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
