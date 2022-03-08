import * as THREE from "three";

export class Engine {
  static cameraFov = 60;
  static cameraZoom = 0.5;
  static cameraNear = 0.1;
  static cameraFar = 100;

  constructor({ canvas }) {
    this.requestId = null;
    this.running = false;
    this.time = 0;
    this.lastTime = 0;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
    });
    this.pixelRatio = window.devicePixelRatio;
    this.renderer.setSize(
      canvas.clientWidth * this.pixelRatio,
      canvas.clientHeight * this.pixelRatio,
      false
    );
    this.renderer.shadowMap.enabled = true;

    // canvas
    this.canvas = this.renderer.domElement;

    // camera
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      Engine.cameraFov,
      aspectRatio,
      Engine.cameraNear,
      Engine.cameraFar
    );
    this.camera.zoom = Engine.cameraZoom;
    this.camera.updateProjectionMatrix();

    // scene
    this.scene = new THREE.Scene();

    this.resize();
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

  update(dtime = 0, time = 0) {
    this.scene.traverse((obj) => {
      if (typeof obj.update === "function") {
        obj.update(dtime, time);
      }
    });
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    // adding listeners
    window.addEventListener("resize", this.resize);

    this.resize();
    this.requestId = requestAnimationFrame(this.animate);
    this.running = true;
  }

  stop() {
    cancelAnimationFrame(this.requestId);
    this.requestId = null;
    this.running = false;

    // removing listeners
    window.removeEventListener("resize", this.resize);
  }

  animate(now) {
    if (!this.running) return;
    requestAnimationFrame(this.animate);

    const dtime = now - this.lastTime;
    this.time += dtime;
    this.lastTime = now;
    this.update(dtime, this.time);
    this.draw();
  }
}
