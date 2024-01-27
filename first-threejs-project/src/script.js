import * as THREE from "three";

// Getting Canvas tag from the HTML document
const canvas = document.querySelector("canvas.webgl");

// Creating a Scene
const scene = new THREE.Scene();

/**
 * creating and adding an Object to the Scene with the help of Mesh. Mesh is a combination of
 * Geometry (shape) and Material (how it looks). here Mesh will be the object which we can see
 * in the Scene. Geometry represents the shape, while Material defines how that shape appears.
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Adding a Camera, to see the scene from the point of view you like, We can have multiple cameras as
 * well, but generally we use a single camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera); // adding camera to the scene is optional, but add it to the scene to avoid bugs

/**
 * Renderer - The renderer will render the scene from the camera's point of view. The result will be
 * drawn into a canvas
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
