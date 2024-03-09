import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// surrounding light like the day light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// point light. It is like a distant small light
const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.x = 1;
pointLight.position.y = 1;
pointLight.position.z = 2;

// directional light like from sun
const directionalLight = new THREE.DirectionalLight(0x00aafc, 1.5);
directionalLight.position.set(1, 0.25, 0);

// will have sky color and ground color to show two colors one from above and one from below
const hemiSphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);

// Big rectangle light, like we see on the photo shoot set
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());

// Spot light is like a flash light / torch light
const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);

scene.add(ambientLight);
scene.add(pointLight);
scene.add(directionalLight);
scene.add(hemiSphereLight);
scene.add(rectAreaLight);
scene.add(spotLight);
// to rotate a spot light we need to add its target property to the scene and move it
spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemiSphereLight,
  0.2
);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);

scene.add(hemisphereLightHelper);
scene.add(directionalLightHelper);
scene.add(pointLightHelper);
scene.add(spotLightHelper);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
