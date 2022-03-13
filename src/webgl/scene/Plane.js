import * as THREE from "three";

class Plane extends THREE.Object3D {
  static areaScale = 0.0084;
  static shadowScale = Plane.areaScale * 2;

  static areaDepth = 0.35;

  constructor({ camera, onIntersect }) {
    super();

    this.centerAnchor = new THREE.Object3D();

    this.rotateX(THREE.MathUtils.degToRad(-90));

    {
      const geometry = new THREE.PlaneGeometry();
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false, // prevents shadow artifacts on overlapping planes
      });
      this._actionPlane = new THREE.Mesh(geometry, material);
    }

    {
      const geometry = new THREE.PlaneGeometry();
      const material = new THREE.ShadowMaterial();
      material.opacity = 0.7;
      this._shadowPlane = new THREE.Mesh(geometry, material);
      this._shadowPlane.receiveShadow = true;
    }

    const raycaster = new THREE.Raycaster();
    this.onIntersect = (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
      raycaster.setFromCamera(mouse, camera);

      const [intersectedPlane] = raycaster.intersectObject(
        this._actionPlane,
        false
      );
      if (intersectedPlane) {
        const { x, z } = intersectedPlane.point;
        onIntersect(new THREE.Vector3(x, 0, z));
      }
    };
    this.onIntersect = this.onIntersect.bind(this);
    window.addEventListener("click", this.onIntersect);

    this.add(this._actionPlane);
    this.add(this._shadowPlane);
    this.add(this.centerAnchor);
  }

  resize(size) {
    const areaSize = new THREE.Vector2(
      Plane.areaScale * size.width,
      Plane.areaScale * size.height
    );
    const shadowSize = new THREE.Vector2(
      Plane.shadowScale * size.width,
      Plane.shadowScale * size.height
    );
    const center = new THREE.Vector3(
      areaSize.x / 2,
      -areaSize.y / 2,
      Plane.areaDepth
    );

    this._actionPlane.geometry.dispose();
    this._actionPlane.geometry = new THREE.PlaneGeometry(
      areaSize.x,
      areaSize.y
    );
    this._actionPlane.geometry.translate(areaSize.x / 2, -areaSize.y / 2, 0);

    this._shadowPlane.geometry.dispose();
    this._shadowPlane.geometry = new THREE.PlaneGeometry(
      shadowSize.x,
      shadowSize.y
    );
    const shiftX = (shadowSize.x - areaSize.x) / 2;
    const shiftY = (shadowSize.y - areaSize.y) / 2;
    this._shadowPlane.geometry.translate(
      shadowSize.x / 2 - shiftX,
      -shadowSize.y / 2 + shiftY,
      0
    );

    this.centerAnchor.position.copy(center);
  }
}

export default Plane;
