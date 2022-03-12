import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Camera extends THREE.Object3D {
  constructor({ camera, canvas }) {
    super();

    this.camera = camera;

    this.controls = new OrbitControls(this.camera, canvas);
  }
}

export default Camera;
