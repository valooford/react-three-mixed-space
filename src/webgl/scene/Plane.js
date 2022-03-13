import * as THREE from "three";

class Plane extends THREE.Object3D {
  constructor({ camera, canvas }) {
    super();

    this.rotateX(THREE.MathUtils.degToRad(-90));

    const geometry = new THREE.PlaneGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({
      color: "ghostwhite",
      side: THREE.DoubleSide,
    });
    this._plane = new THREE.Mesh(geometry, material);
    this._plane.receiveShadow = true;

    const raycaster = new THREE.Raycaster();
    this.onIntersect = (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / canvas.clientWidth) * 2 - 1,
        -((e.clientY / canvas.clientHeight) * 2 - 1)
      );
      raycaster.setFromCamera(mouse, camera);
    };
    this.onIntersect = this.onIntersect.bind(this);
    canvas.addEventListener("click", this.onIntersect);

    this.add(this._plane);
  }
}

export default Plane;