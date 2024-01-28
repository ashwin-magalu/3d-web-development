import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

// Using Buffer Geometry instead of BoxGeometry using Float32Array

// One way to create a Float32Array
// const positionsArray = new Float32Array(9);
// // First vertex
// positionsArray[0] = 0; // x position
// positionsArray[1] = 0; // y position
// positionsArray[2] = 0; // z position
// // second vertex
// positionsArray[3] = 0; // x position
// positionsArray[4] = 1; // y position
// positionsArray[5] = 0; // z position
// // third vertex
// positionsArray[6] = 1; // x position
// positionsArray[7] = 0; // y position
// positionsArray[8] = 0; // z position

// Second way to create a Float32Array
const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

const geometry = new THREE.BufferGeometry();
// geometry.setAttribute("position", positionsAttribute); // This creates a single triangle

// creating a bunch of random triangles
const count = 50;
const positionsArray2 = new Float32Array(count * 3 * 3);
for (let index = 0; index < count * 3 * 3; index++) {
  positionsArray2[index] = (Math.random() - 0.5) * 4;
}
const positionsAttribute2 = new THREE.BufferAttribute(positionsArray2, 3);
geometry.setAttribute("position", positionsAttribute2);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
