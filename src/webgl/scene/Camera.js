import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Camera extends THREE.Object3D {
  constructor({ camera, canvas }) {
    super();

    this.camera = camera;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.minDistance = 2;
    this.controls.maxDistance = 6;
    this.controls.update();
  }
}

export default Camera;
