import * as THREE from "three";

class Engine {
  constructor({ canvas }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
  }
}

export default Engine;
