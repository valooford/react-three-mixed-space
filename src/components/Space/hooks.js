import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import {
  CAM_FOV,
  CAM_HEIGHT,
  CAM_SMOOTH,
  CAM_ZOOM,
  MOD_ROTATION,
  MOD_ROTATION_LIMIT,
  MOD_SCALE,
  MOD_SPEED,
} from "./constants";
import { getAreaSize, getCenter } from "./helpers";

export const useSpaceScene = (canvasRef, { angle }) => {
  const { current: smoothCamera } = useRef({
    time: 0,
    cameraAnchor: null,
    targetRotation: null,
    savedRotation: null,
    speed: 0,
    update(time) {
      if (this.cameraAnchor && typeof this.targetRotation === "number") {
        if (!this.time) this.time = time;
        const timeDiff = time - this.time;
        this.time = time;

        const rotation = this.cameraAnchor.rotation.x;
        const angle = this.targetRotation - rotation;
        if (
          !(typeof this.savedRotation === "number") ||
          (this.speed && this.savedRotation !== this.targetRotation)
        ) {
          this.savedRotation = this.targetRotation;
          this.speed = angle / CAM_SMOOTH;
        }
        const step = this.speed * timeDiff;
        if (!this.speed || Math.abs(angle) < Math.abs(step)) {
          this.cameraAnchor.rotation.x = this.targetRotation;
          this.time = 0;
          this.targetRotation = null;
          this.savedRotation = null;
          this.speed = null;
          return;
        }
        this.cameraAnchor.rotateX(step);
      } else if (this.time) {
        this.time = 0;
      }
    },
  });
  useEffect(() => {
    smoothCamera.targetRotation = THREE.MathUtils.degToRad(angle);
  }, [angle, smoothCamera]);
  const resultRef = useRef({});
  const result = resultRef.current;
  useEffect(() => {
    // if (!canvas) return;
    const canvas = canvasRef.current;
    const textureLoader = new THREE.TextureLoader();
    const fbxLoader = new FBXLoader();
    fbxLoader.setPath("./assets/models/");

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
    });
    const pixelRatio = window.devicePixelRatio;
    renderer.setSize(
      canvas.clientWidth * pixelRatio,
      canvas.clientHeight * pixelRatio,
      false
    );
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    const areaSize = getAreaSize();
    const center = getCenter(areaSize);
    // scene.background = new THREE.Color(0x222222);

    // camera
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(CAM_FOV, aspectRatio, 0.1, 100);
    camera.zoom = CAM_ZOOM;
    camera.updateProjectionMatrix();
    camera.position.set(0, CAM_HEIGHT, 0);
    camera.rotateX(THREE.MathUtils.degToRad(-90));
    // camera.lookAt(0, 0, 0);
    // camera.rotateX(THREE.MathUtils.degToRad(-45));
    const cameraAnchor = new THREE.Object3D();
    cameraAnchor.position.copy(center);
    cameraAnchor.rotation.x = THREE.MathUtils.degToRad(angle);
    cameraAnchor.add(camera);
    smoothCamera.cameraAnchor = cameraAnchor;
    scene.add(cameraAnchor);

    // placeCamera(camera, center, angle);
    // camera.position.set(areaSize.x / 2, 8, areaSize.y / 2);
    // camera.rotation.x = THREE.MathUtils.degToRad(-90 + angle);

    // lights
    const lightA = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(lightA);

    const lightD = new THREE.DirectionalLight(0xffffff, 1);
    // lightD.position.set(20, 80, 20);
    lightD.position.set(3, 2, 1);
    lightD.lookAt(0, 0, 0);
    lightD.castShadow = true;
    lightD.shadow.mapSize.set(4096, 4096);
    // scene.add(lightD);
    // const lightDHelper = new THREE.DirectionalLightHelper(lightD);
    // lightDHelper.scale.setScalar(100);
    // lightDHelper.update();
    // scene.add(lightDHelper);

    // movement
    const animatedModel = {
      model: null,
      modelAnchor: null,
      targetPosition: null,
      time: 0,
      isRotated: false,
      isPositioned: false,
      mixer: null,
      actions: {
        idle: null,
        walk: null,
      },
      currentAction: null,
      rotate(time) {
        const speed = MOD_ROTATION * time;
        const startRotation = new THREE.Quaternion().copy(
          this.model.quaternion
        );
        this.model.lookAt(this.targetPosition);
        const targetRotation = new THREE.Quaternion().copy(
          this.model.quaternion
        );
        const angle = startRotation.angleTo(targetRotation);
        if (angle <= speed) {
          this.model.quaternion.copy(targetRotation);
          this.isRotated = true;
        } else {
          this.model.quaternion.copy(
            startRotation.rotateTowards(targetRotation, speed)
          );
        }
        return angle;
      },
      move(time) {
        const speed = MOD_SPEED * time;
        const targetVector = new THREE.Vector3()
          .copy(this.targetPosition)
          .sub(this.modelAnchor.position);
        if (targetVector.length() < speed) {
          this.modelAnchor.position.copy(this.targetPosition);
          this.isPositioned = true;
        } else {
          targetVector.normalize().multiplyScalar(speed);
          this.modelAnchor.position.add(targetVector);
        }
      },
      update(time) {
        if (!this.time) this.time = time;
        const timeDiff = time - this.time;
        this.time = time;
        if (this.mixer) this.mixer.update(timeDiff);
        if (!this.model || !this.modelAnchor || !this.targetPosition) return;

        const angle = this.rotate(timeDiff);
        if (this.isRotated && angle < MOD_ROTATION_LIMIT) {
          if (!this.actions.walk.isRunning()) {
            this.currentAction.fadeOut(0.5);
            this.currentAction = this.actions.walk;
            this.actions.walk.reset();
            this.actions.walk.fadeIn(0.5);
            this.actions.walk.play();
          }
          this.move(timeDiff);
        }

        if (this.isRotated && this.isPositioned) {
          if (this.currentAction.isRunning()) {
            this.currentAction.fadeOut(0.5);
            this.currentAction = this.actions.idle;
            this.actions.idle.reset();
            this.actions.idle.fadeIn(0.5);
            this.actions.idle.play();
          }
          this.targetPosition = null;
          this.isRotated = false;
          this.isPositioned = false;
        }
      },
    };

    // meshes
    const modelTexture = textureLoader.load(
      "./assets/textures/Miner_diffuse.tga.png"
    );
    const modelMaterial = new THREE.MeshPhongMaterial({
      map: modelTexture,
    });
    fbxLoader.load("char_man.fbx", (group) => {
      group.rotateY(THREE.MathUtils.degToRad(45));
      group.scale.setScalar(MOD_SCALE);
      const modelAnchor = new THREE.Object3D();
      modelAnchor.add(group);
      modelAnchor.add(lightD);
      modelAnchor.add(lightD.target);
      scene.add(modelAnchor);
      animatedModel.model = group;
      animatedModel.modelAnchor = modelAnchor;
      group.children.forEach((model) => {
        if (model instanceof THREE.Mesh) {
          model.material = modelMaterial;
          model.castShadow = true;

          // animations
          const mixer = new THREE.AnimationMixer(group);
          animatedModel.mixer = mixer;
          fbxLoader.load("char_man_idle.fbx", (anim) => {
            const action = mixer.clipAction(anim.animations[0]);
            action.fadeIn(0.5);
            action.play();
            animatedModel.actions.idle = action;
            animatedModel.currentAction = action;
          });
          fbxLoader.load("char_man_walk.fbx", (anim) => {
            animatedModel.actions.walk = mixer.clipAction(anim.animations[0]);
          });
        }
      });
    });

    const planeGeometry = new THREE.PlaneGeometry(areaSize.x, areaSize.y);
    planeGeometry.translate(areaSize.x / 2, -areaSize.y / 2, 0);
    // // plane grid
    // const planeTexture = textureLoader.load("./assets/textures/grid.png");
    // planeTexture.wrapS = THREE.RepeatWrapping;
    // planeTexture.wrapT = THREE.RepeatWrapping;
    // planeTexture.repeat.setScalar(2);
    // // planeTexture.magFilter = THREE.NearestFilter;
    // const planeMaterial = new THREE.MeshPhongMaterial({
    //   map: planeTexture,
    //   transparent: true,
    // });

    // plane shadow
    const planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.7;

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(THREE.MathUtils.degToRad(-90));
    plane.receiveShadow = true;
    scene.add(plane);

    // raycasting
    const raycaster = new THREE.Raycaster();
    const handleMouseClick = (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
      raycaster.setFromCamera(mouse, camera);
      const [intersectedPlane] = raycaster.intersectObject(plane, false);
      if (intersectedPlane) {
        animatedModel.targetPosition = scene.worldToLocal(
          new THREE.Vector3(
            intersectedPlane.point.x,
            0,
            intersectedPlane.point.z
          )
        );
      }
    };
    window.addEventListener("click", handleMouseClick);

    // handling window resize
    const handleWindowResize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(
        clientWidth * pixelRatio,
        clientHeight * pixelRatio,
        false
      );
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      const newAreaSize = getAreaSize();
      const newCenter = getCenter(newAreaSize);
      plane.geometry.dispose();
      plane.geometry = new THREE.PlaneGeometry(newAreaSize.x, newAreaSize.y);
      plane.geometry.translate(newAreaSize.x / 2, -newAreaSize.y / 2, 0);
      // plane.geometry.parameters.width = newAreaSize.x;
      // plane.geometry.parameters.height = newAreaSize.y;

      cameraAnchor.position.copy(newCenter);
      cameraAnchor.rotation.x = THREE.MathUtils.degToRad(angle);
      // placeCamera(camera, newCenter, angle);
      // camera.position.setX(newAreaSize.x / 2);
      // camera.position.setZ(newAreaSize.y);
    };
    window.addEventListener("resize", handleWindowResize);

    let requestId = null;
    const render = (time) => {
      const timeS = time * 0.001;
      animatedModel.update(timeS);
      smoothCamera.update(time);
      // lightDHelper.update();

      renderer.render(scene, camera);
      requestId = requestAnimationFrame(render);
    };
    requestId = requestAnimationFrame(render);

    result.cameraAnchor = cameraAnchor;
    result.center = center;

    // clearing
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("click", handleMouseClick);
      cancelAnimationFrame(requestId);
    };
  }, [result, canvasRef, smoothCamera]);

  return result;
};
