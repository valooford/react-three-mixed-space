import * as THREE from "three";

class Camera extends THREE.Object3D {
  constructor({ camera, canvas }) {
    super();

    this.camera = camera;
    this.camera.position.z = 2;
  }
}

export default Camera;
