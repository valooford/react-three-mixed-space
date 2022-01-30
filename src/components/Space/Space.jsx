import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import classes from "./style.module.css";

const Space = () => {
  const canvasRef = useRef(null);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    const loader = new THREE.TextureLoader();

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

    // meshes
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = loader.load("./assets/textures/wall.jpg");
    const material = new THREE.MeshPhongMaterial({
      // color: "lightgreen",
      // wireframe: true,
      map: texture,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.5;
    cube.castShadow = true;
    scene.add(cube);

    {
      const geometry = new THREE.PlaneGeometry(10, 10, 10);
      const material = new THREE.MeshPhongMaterial({
        color: "darkslategray",
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(THREE.MathUtils.degToRad(-90));
      plane.receiveShadow = true;
      scene.add(plane);
    }

    let requestId = null;

    const render = (time) => {
      const timeS = time * 0.001;
      cube.position.x = Math.cos(timeS);
      cube.position.z = Math.cos(timeS - Math.PI / 2);
      cube.rotateY(Math.sin(timeS) * 0.05);
      renderer.render(scene, camera);
      requestId = requestAnimationFrame(render);
    };
    requestId = requestAnimationFrame(render);

    // clearing
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas className={classes.canvas} ref={canvasRef} />;
};

export default Space;
