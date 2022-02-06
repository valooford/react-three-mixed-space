import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import classes from "./style.module.css";

const Space = () => {
  const canvasRef = useRef(null);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    const textureLoader = new THREE.TextureLoader();
    const fbxLoader = new FBXLoader();
    fbxLoader.setPath("./assets/models/");

    const renderer = new THREE.WebGLRenderer({ canvas });
    const pixelRatio = window.devicePixelRatio;
    renderer.setSize(
      canvas.clientWidth * pixelRatio,
      canvas.clientHeight * pixelRatio,
      false
    );
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // camera
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    camera.position.set(0, 2, 2);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 6;
    controls.target.set(0, 0.5, 0);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
    controls.update();
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
    };
    window.addEventListener("resize", handleWindowResize);

    // lights
    const lightA = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(lightA);

    const lightD = new THREE.DirectionalLight(0xffffff, 1);
    lightD.position.set(2, 3, 1);
    lightD.castShadow = true;
    lightD.shadow.mapSize.set(4096, 4096);
    scene.add(lightD);

    // movement
    const CUBE_SPEED = 1.5; // units per second
    const CUBE_ROTATION_SPEED = Math.PI; // radians per second
    const MAX_MOVE_RAD = Math.PI / 4; // rotating while moving
    const animatedModel = {
      model: null,
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
        const speed = CUBE_ROTATION_SPEED * time;
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
        const speed = CUBE_SPEED * time;
        const targetVector = new THREE.Vector3()
          .copy(this.targetPosition)
          .sub(this.model.position);
        if (targetVector.length() < speed) {
          this.model.position.copy(this.targetPosition);
          this.isPositioned = true;
        } else {
          targetVector.normalize().multiplyScalar(speed);
          this.model.position.add(targetVector);
        }
      },
      update(time) {
        if (!this.time) this.time = time;
        const timeDiff = time - this.time;
        this.time = time;
        if (this.mixer) this.mixer.update(timeDiff);
        if (!this.model || !this.targetPosition) return;

        const angle = this.rotate(timeDiff);
        if (this.isRotated && angle < MAX_MOVE_RAD) {
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
      group.scale.setScalar(0.05);
      scene.add(group);
      animatedModel.model = group;
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

    const planeGeometry = new THREE.PlaneGeometry(10, 10, 10);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: "darkslategray",
      side: THREE.DoubleSide,
    });
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
    canvas.addEventListener("click", handleMouseClick);

    let requestId = null;
    const render = (time) => {
      const timeS = time * 0.001;
      animatedModel.update(timeS);

      renderer.render(scene, camera);
      requestId = requestAnimationFrame(render);
    };
    requestId = requestAnimationFrame(render);

    // clearing
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      canvas.removeEventListener("click", handleMouseClick);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas className={classes.canvas} ref={canvasRef} />;
};

export default Space;
