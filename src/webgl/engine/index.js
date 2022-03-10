import * as THREE from "three";

class Engine {
  static cameraFov = 60;
  static cameraZoom = 0.5;
  static cameraNear = 0.1;
  static cameraFar = 100;

  constructor({ canvas }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });

    this.canvas = this.renderer.domElement;

    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      Engine.cameraFov,
      aspectRatio,
      Engine.cameraNear,
      Engine.cameraFar
    );
    this.camera.zoom = Engine.cameraZoom;
    this.camera.updateProjectionMatrix();
  }
}

export default Engine;
