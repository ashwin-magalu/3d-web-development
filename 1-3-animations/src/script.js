// Using time

import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

let time = Date.now(); // This will be in milliseconds

// Animations
const tick = () => {
  console.log("tick");
  /** Following function will call tick function on the load of next frame. This way we create
   an animation using frames. 60 fps means 60 frames created per second to create
   the animation effect
  */

  // Adapting to frame rate using time, so the animation looks the same in 60fps system and 120fps system
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  // Update the object with new position, so it can animate using time to maintain consistency
  mesh.rotation.y += 0.001 * deltaTime;

  // moved renderer.render function inside this function to call it on each frame load
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
