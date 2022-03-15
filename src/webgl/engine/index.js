import * as THREE from "three";

class Engine {
  static cameraFov = 60;
  static cameraZoom = 0.5;
  static cameraNear = 0.1;
  static cameraFar = 100;

  constructor({ canvas }) {
    this.requestId = null;
    this.running = false;

    this.animate = this.animate.bind(this);

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

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.requestId = requestAnimationFrame(this.animate);
    this.running = true;
  }

  stop() {
    cancelAnimationFrame(this.requestId);
    this.requestId = null;
    this.running = false;
  }

  animate() {
    if (!this.running) return;
    this.requestId = requestAnimationFrame(this.animate);
  }

  update() {}
}

export default Engine;
