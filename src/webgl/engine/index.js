import * as THREE from "three";

class Engine {
  constructor({ canvas }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });

    this.canvas = this.renderer.domElement;
  }
}

export default Engine;
