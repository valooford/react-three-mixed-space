import * as THREE from "three";

class Model extends THREE.Object3D {
  static scale = 0.035;
  static scaleGlobal = 33 * Model.scale;

  static speed = Model.scale * 30; // units per second

  static rotation = Math.PI; // radians per second

  static rotationLimit = Math.PI / 4; // rotating while moving

  constructor({ model, texture, idle, walk }) {
    super();

    this.targetPosition = null;
    this.isRotated = false;
    this.isPositioned = false;
    this.mixer = null;
    this.actions = {
      idle: null,
      walk: null,
    };
    this.currentAction = null;

    this.material = new THREE.MeshPhongMaterial({
      map: texture,
    });

    this.model = model;
    this.model.rotateY(THREE.MathUtils.degToRad(45));
    this.model.scale.setScalar(Model.scale);
    this.model.children.forEach((model) => {
      if (model instanceof THREE.Mesh) {
        model.material = this.material;
        model.castShadow = true;
      }
    });

    // animations
    this.mixer = new THREE.AnimationMixer(this.model);
    this.actions.idle = this.mixer.clipAction(idle.animations[0]);
    this.actions.idle.fadeIn(0.5);
    this.actions.idle.play();
    this.currentAction = this.actions.idle;

    this.actions.walk = this.mixer.clipAction(walk.animations[0]);

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.copy(
      new THREE.Vector3(3, 2, 1).multiplyScalar(Model.scaleGlobal)
    );
    this.light.lookAt(0, 0, 0);
    this.light.castShadow = true;
    this.light.shadow.mapSize.set(512, 512); // values above 512 causes memory leaks
    this.light.shadow.camera = new THREE.OrthographicCamera(
      -1 * Model.scaleGlobal, // left
      1 * Model.scaleGlobal, // right
      1.4 * Model.scaleGlobal, // top
      -0.2 * Model.scaleGlobal, // bottom
      2.5 * Model.scaleGlobal, // near
      6 * Model.scaleGlobal // far
    );

    this.add(this.model);
    this.add(this.light);
    this.add(this.light.target);
  }

  switchAnimation(anim) {
    this.currentAction.fadeOut(0.5);
    this.currentAction = anim;
    this.currentAction.reset();
    this.currentAction.fadeIn(0.5);
    this.currentAction.play();
  }

  update(dtime, time) {
    dtime /= 1000;
    this.mixer.update(dtime);

    if (!this.targetPosition) return;

    const angle = this.rotate(dtime);
    if (this.isRotated && angle < Model.rotationLimit) {
      if (!this.actions.walk.isRunning()) {
        this.switchAnimation(this.actions.walk);
      }
      this.move(dtime);
    }

    if (this.isRotated && this.isPositioned) {
      if (this.currentAction.isRunning()) {
        this.switchAnimation(this.actions.idle);
      }
      this.targetPosition = null;
      this.isRotated = false;
      this.isPositioned = false;
    }
  }

  rotate(dtime) {
    const speed = Model.rotation * dtime;
    const startRotation = new THREE.Quaternion().copy(this.model.quaternion);
    this.model.lookAt(this.targetPosition);
    const targetRotation = new THREE.Quaternion().copy(this.model.quaternion);
    const angle = startRotation.angleTo(targetRotation);
    if (angle <= speed) {
      this.model.quaternion.copy(targetRotation);
      this.isRotated = true;
    } else {
      this.model.quaternion.copy(
        startRotation.rotateTowards(targetRotation, speed)
      );
    }
    return angle;
  }

  move(dtime) {
    const speed = Model.speed * dtime;
    const targetVector = new THREE.Vector3()
      .copy(this.targetPosition)
      .sub(this.position);
    if (targetVector.length() < speed) {
      this.position.copy(this.targetPosition);
      this.isPositioned = true;
    } else {
      targetVector.normalize().multiplyScalar(speed);
      this.position.add(targetVector);
    }
  }

  dispose() {
    this.light.shadow.dispose();
  }
}

export default Model;
