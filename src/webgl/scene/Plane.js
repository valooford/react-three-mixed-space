import * as THREE from "three";

class Plane extends THREE.Object3D {
  static areaScale = 0.0084;

  static areaDepth = 0.35;

  constructor({ camera, canvas, onIntersect }) {
    super();

    this.centerAnchor = new THREE.Object3D();

    this.rotateX(THREE.MathUtils.degToRad(-90));

    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.ShadowMaterial();
    material.opacity = 0.7;
    this._plane = new THREE.Mesh(geometry, material);
    this._plane.receiveShadow = true;

    const raycaster = new THREE.Raycaster();
    this.onIntersect = (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / canvas.clientWidth) * 2 - 1,
        -((e.clientY / canvas.clientHeight) * 2 - 1)
      );
      raycaster.setFromCamera(mouse, camera);

      const [intersectedPlane] = raycaster.intersectObject(this._plane, false);
      if (intersectedPlane) {
        const { x, z } = intersectedPlane.point;
        onIntersect(new THREE.Vector3(x, 0, z));
      }
    };
    this.onIntersect = this.onIntersect.bind(this);
    canvas.addEventListener("click", this.onIntersect);

    this.add(this._plane);
    this.add(this.centerAnchor);
  }

  resize(size) {
    const areaSize = new THREE.Vector2(
      Plane.areaScale * size.width,
      Plane.areaScale * size.height
    );
    const center = new THREE.Vector3(
      areaSize.x / 2,
      -areaSize.y / 2,
      Plane.areaDepth
    );

    this._plane.geometry.dispose();
    this._plane.geometry = new THREE.PlaneGeometry(areaSize.x, areaSize.y);
    this._plane.geometry.translate(areaSize.x / 2, -areaSize.y / 2, 0);

    this.centerAnchor.position.copy(center);
  }
}

export default Plane;
