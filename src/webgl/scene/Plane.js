import * as THREE from "three";

class Plane extends THREE.Object3D {
  constructor() {
    super();

    const geometry = new THREE.PlaneGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({ color: "ghostwhite" });
    this._plane = new THREE.Mesh(geometry, material);

    this.add(this._plane);
  }
}

export default Plane;
