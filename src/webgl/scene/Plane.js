import * as THREE from "three";

class Plane extends THREE.Object3D {
  static areaScale = 0.0084;
  static shadowScale = Plane.areaScale * 1.5;
  static areaDepth = 0.35;

  constructor({ canvas, camera, texture, onIntersect }) {
    super();

    this.canvas = canvas;
    this.centerAnchor = new THREE.Object3D();

    this.rotateX(THREE.MathUtils.degToRad(-90));

    {
      const geometry = new THREE.PlaneGeometry();
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.setScalar(2);
      // // texture.magFilter = THREE.NearestFilter;
      // const material = new THREE.MeshPhongMaterial({
      //   map: texture,
      //   transparent: true,
      // });
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false, // prevents shadow artifacts on overlapping planes
      });
      this.actionPlane = new THREE.Mesh(geometry, material);
    }

    {
      const geometry = new THREE.PlaneGeometry();
      const material = new THREE.ShadowMaterial();
      material.opacity = 0.7;
      this.shadowPlane = new THREE.Mesh(geometry, material);
      this.shadowPlane.receiveShadow = true;
    }

    // raycasting
    const raycaster = new THREE.Raycaster();
    this.onIntersect = (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
      raycaster.setFromCamera(mouse, camera);
      const [intersectedPlane] = raycaster.intersectObject(
        this.actionPlane,
        false
      );
      if (intersectedPlane) {
        onIntersect(
          new THREE.Vector3(
            intersectedPlane.point.x,
            0,
            intersectedPlane.point.z
          )
        );
      }
    };
    this.onIntersect = this.onIntersect.bind(this);
    window.addEventListener("click", this.onIntersect);

    this.add(this.centerAnchor);
    this.add(this.actionPlane);
    this.add(this.shadowPlane);
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

    this.actionPlane.geometry.dispose();
    this.actionPlane.geometry = new THREE.PlaneGeometry(areaSize.x, areaSize.y);
    this.actionPlane.geometry.translate(areaSize.x / 2, -areaSize.y / 2, 0);
    this.centerAnchor.position.copy(center);

    this.shadowPlane.geometry.dispose();
    this.shadowPlane.geometry = new THREE.PlaneGeometry(
      shadowSize.x,
      shadowSize.y
    );
    const shiftX = (shadowSize.x - areaSize.x) / 2;
    const shiftY = (shadowSize.y - areaSize.y) / 2;
    this.shadowPlane.geometry.translate(
      shadowSize.x / 2 - shiftX,
      -shadowSize.y / 2 + shiftY,
      0
    );
    this.centerAnchor.position.copy(center);
  }

  dispose() {
    window.removeEventListener("click", this.onIntersect);
  }
}

export default Plane;
