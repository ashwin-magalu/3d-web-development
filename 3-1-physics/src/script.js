import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
// You can use cannon package as well, but it is not updated for a long time now

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    object.body.removeEventListener("collide", playHitSound);
    world.remove(object.body);
    scene.remove(object.mesh);
  }
  objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, "createSphere").name("Create Sphere");
gui.add(debugObject, "createBox").name("Create Box");
gui.add(debugObject, "reset").name("Reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sounds
const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // gravity in the y direction
world.broadphase = new CANNON.SAPBroadphase(world); // performance enhancing function
/**
 * makes non moving object rest until sufficient force is applied on it to move. So it increases the performance
 * by not considering sleeping objects while checking the movement and the collision detection
 * */
world.allowSleep = true;

// Materials
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");
const defaultMaterial = new CANNON.Material("default");

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1, // how much does it rub. 0.3 is the default value
//     restitution: 0.7, // how much does it bounce. 0.3 is the default value
//   }
// );
// world.addContactMaterial(concretePlasticContactMaterial);
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // how much does it rub. 0.3 is the default value
    restitution: 0.7, // how much does it bounce. 0.3 is the default value
  }
);
world.addContactMaterial(defaultContactMaterial);
/**
 * instead of assigning defaultContactMaterial to sphere and floor bodies separately we can use this
 * as all the bodies in the world has the same material
 */
world.defaultContactMaterial = defaultContactMaterial;

// Sphere
// const sphereShape = new CANNON.Sphere(0.5); // radius same as our test sphere
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   //   material: plasticMaterial,
//   //   material: defaultMaterial,
// });
// // Adding force to manipulate the motion of the sphere externally
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
// world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0; // Default value for mass is 0. So we can omit this line and still it will work
floorBody.addShape(floorShape);
// We did not provide the position as by default it is in the center and we want it in the center, so
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // rotating the plane as by default it will be vertical plane instead of horizontal plane
// Here we are rotating with respect to the x direction
// floorBody.material = concreteMaterial;
// floorBody.material = defaultMaterial;
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
  // Three.js Sphere
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  scene.add(mesh);

  // Physics sphere
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  objectsToUpdate.push({ mesh, body });
};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
const createBox = (width, height, depth, position) => {
  // Three.js Sphere
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.castShadow = true;
  mesh.scale.set(width, height, depth);
  mesh.position.copy(position);
  scene.add(mesh);

  // Physics sphere
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  objectsToUpdate.push({ mesh, body });
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update the Physics world
  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  // we used 1/60 so as to experience the run at 60fps
  world.step(1 / 60, deltaTime, 3);

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion); // for boxes
  }

  // Updating ThreeJS sphere with respect to Physics world
  //   sphere.position.x = sphereBody.position.x;
  //   sphere.position.y = sphereBody.position.y;
  //   sphere.position.z = sphereBody.position.z;
  // Use above code or the below code
  //   sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
