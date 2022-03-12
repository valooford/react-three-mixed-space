import * as THREE from "three";

class Plane extends THREE.Object3D {
  constructor() {
    super();

    this.rotateX(THREE.MathUtils.degToRad(-90));

    const geometry = new THREE.PlaneGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({
      color: "ghostwhite",
      side: THREE.DoubleSide,
    });
    this._plane = new THREE.Mesh(geometry, material);
    this._plane.receiveShadow = true;

    this.add(this._plane);
  }
}

export default Plane;
