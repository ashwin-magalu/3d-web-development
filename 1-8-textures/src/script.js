import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// One way of loading the texture
// import colorDoor from "../static/textures/door/color.jpg";

/**
 * Texture
 */
// Second way of loading the texture
// const image = new Image();
// const texture = new THREE.Texture(image);
// // In the latest version of THREE.JS, we need to encode textures in the sRGB format. So need to use the following method
// texture.colorSpace = THREE.SRGBColorSpace;
// image.addEventListener("load", () => {
//   console.log("image loaded");
//   // Convert loaded image to the texture
//   texture.needsUpdate = true;
// });
// image.src = "/textures/door/color.jpg";

// Third and simplest approach o load the texture
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("texture loading started");
};
loadingManager.onProgress = () => {
  console.log("texture loading in progress");
};
loadingManager.onLoad = () => {
  console.log("texture loading finished");
};
loadingManager.onError = () => {
  console.log("texture loading failed");
};

const textureLoader = new THREE.TextureLoader(loadingManager); // passing loadingManager is not mandatory

// const texture = textureLoader.load(
//   "textures/door/color.jpg",
//   () => {
//     // load
//     console.log("loading texture");
//   },
//   (progress) => {
//     // progress --> usually this won't be called
//     console.log("progress in loading", progress);
//   },
//   () => {
//     // error
//     console.log("error loading");
//   }
// );

const colorTexture = textureLoader.load("textures/door/color.jpg");
// used for minification textures
// const colorTexture = textureLoader.load("textures/checkerboard-1024x1024.png");
// used for magnification textures
// const colorTexture = textureLoader.load("textures/checkerboard-8x8.png");
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");

// In the latest version of THREE.JS, we need to encode textures in the sRGB format. So need to use the following method
colorTexture.colorSpace = THREE.SRGBColorSpace;

// Transforming the texture
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// // following code is added to stop stretching the last pixel of the texture
// colorTexture.wrapS = THREE.RepeatWrapping; // we can also use THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping; // we can also use THREE.MirroredRepeatWrapping
// // adding offset to the texture
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// // rotate the texture
// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// Filtering and Mipmapping
/**
 * Mipmapping: Mipmapping (or "mip mapping") is a technique that consists of creating half a
 * smaller version of a texture again and again until you get a 1x1 texture. All those
 * texture variations are sent to the GPU, and the GPU will choose the most appropriate version
 * of the texture.
 * Three.js and the GPU already handle all of this, and you can just set what filter algorithm to use.
 * There are two types of filter algorithms: the minification filter and the magnification filter.
 */
// mipmapping is turned off as we are using NearestFilter for minFilter
// colorTexture.generateMipmaps = false;
// colorTexture.minFilter = THREE.NearestFilter; // Nearest Filter is the best filter for performance
// colorTexture.magFilter = THREE.NearestFilter;

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
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Seeing UV coordinates
console.log(geometry.attributes.uv);

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
camera.position.z = 1;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
