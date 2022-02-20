import * as THREE from "three";

import { AREA_DEPTH, AREA_SCALE } from "./constants";

export function getAreaSize() {
  // 0.036: fov 135, camera (0, 12, 4)
  const cf = AREA_SCALE;
  return new THREE.Vector2(cf * window.innerWidth, cf * window.innerHeight);
}

export function getCenter(areaSize) {
  return new THREE.Vector3(areaSize.x / 2, AREA_DEPTH, areaSize.y / 2);
}
