import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
// This size is not perfect, so we will use the css to over write browser window object default margins
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// handle resize events
window.addEventListener("resize", (event) => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update the camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);

  /**
   * Handling Pixel Ratio:
   * Some might see a blurry render and stairs effect on the edges. If so, it's because you are
   * testing on a screen with a pixel ratio greater than 1
   * The pixel ratio corresponds to how many physical pixels you have on the screen for one pixel
   * unit on the software part.
   * A pixel ratio of 2 means 4 times more pixels to render. And a pixel ratio of 3 means 9 times
   * more pixels to render.
   * Highest pixel ratios are usually on the weakest devices — like mobiles phones
   * To get the screen pixel ratio you can use window.devicePixelRatio , and to update the pixel ratio
   * of your renderer, you simply need to call the renderer.setPixelRatio(...)
   * 3 is the highest pixel ratio we can use. Above 3 is not needed. Iphone uses pixel ratio of 3.
   */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// handle full screen
window.addEventListener("dblclick", () => {
  // Below code is added to make it work in chrome, safari and firefox
  const fullScreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
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
camera.position.z = 3;
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

/**
 * Animate
 */
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
