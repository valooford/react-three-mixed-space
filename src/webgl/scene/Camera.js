import * as THREE from "three";

class Camera extends THREE.Object3D {
  constructor({ camera }) {
    super();

    this.camera = camera;
    this.camera.position.set(0, 0.5, 4);

    this.rotation.x = THREE.MathUtils.degToRad(-70);

    this.add(this.camera);
  }
}

export default Camera;
