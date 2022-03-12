import * as THREE from "three";

class Engine {
  static cameraFov = 60;
  static cameraZoom = 0.5;
  static cameraNear = 0.1;
  static cameraFar = 100;

  constructor({ canvas }) {
    this.requestId = null;
    this.running = false;
    this.time = 0;
    this.lastTime = 0;

    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.pixelRatio = window.devicePixelRatio;
    this.renderer.setSize(
      canvas.clientWidth * this.pixelRatio,
      canvas.clientHeight * this.pixelRatio,
      false
    );

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
    window.addEventListener("resize", this.resize);

    this.resize();
    this.requestId = requestAnimationFrame(this.animate);
    this.running = true;
  }

  stop() {
    cancelAnimationFrame(this.requestId);
    this.requestId = null;
    this.running = false;

    window.removeEventListener("resize", this.resize);
  }

  animate(now) {
    if (!this.running) return;
    this.requestId = requestAnimationFrame(this.animate);

    const dtime = now - this.lastTime;
    this.time += dtime;
    this.lastTime = now;

    this.update(dtime, this.time);
    this.draw();
  }

  update(dtime, time) {
    this.scene.traverse((obj) => {
      if (typeof obj.update === "function") {
        obj.update(dtime, time);
      }
    });
  }

  resize() {
    const { clientWidth, clientHeight } = this.canvas;
    this.renderer.setSize(
      clientWidth * this.pixelRatio,
      clientHeight * this.pixelRatio,
      false
    );

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();

    const size = { width: clientWidth, height: clientHeight };
    this.scene.traverse((obj) => {
      if (typeof obj.resize === "function") {
        obj.resize(size);
      }
    });
  }
}

export default Engine;
