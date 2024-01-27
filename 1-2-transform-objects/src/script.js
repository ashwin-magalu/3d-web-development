import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
/* const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1); // can b used to set the x,y and z position of the mesh
// mesh.position.length can be used to find the distance between the mesh and the center of the scene
// mesh.position.distanceTo(camera.position) can be used to find the distance between the mesh and the camera
// mesh.position.normalize() will reduce the distance of mesh from center of the Scene to 1

// Scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5);

mesh.rotation.reorder("YXZ");
mesh.rotation.x = Math.PI / 4;
mesh.rotation.y = Math.PI / 4; */
/**
 * Rotate: We can rotate an object using rotate or quaternion. updating one will automatically
 * update the other
 * The rotation property also has x, y, and z properties, but instead of a Vector3, it's a Euler.
 * When you change the x, y, and z properties of a Euler, you can imagine putting a stick through
 * your object's center in the axis's direction and then rotating that object on that stick.
 * If you spin on the y axis, you can picture it like a carousel.
 * If you spin on the x axis, you can imagine that you are rotating the wheels of a car you'd be in.
 * And if you rotate on the z axis, you can imagine that you are rotating the propellers in front
 * of an aircraft you'd be in.
 * The value of these axes is expressed in radians. If you want to achieve half a rotation, you'll
 * have to write something like 3.14159... You probably recognize that number as π. In native
 * JavaScript, you can end up with an approximation of π using Math.PI.
 *
 * when you combine those rotations, you might end up with strange results. Why? Because,
 * while you rotate the x axis, you also change the other axes' orientation. The rotation
 * applies in the following order: x, y, and then z. That can result in weird behaviors like
 * one named gimbal lock when one axis has no more effect, all because of the previous ones.
 * We can change this order by using the reorder(...) method object.rotation.reorder('YXZ')
 * While Euler is easier to understand, this order problem can cause issues. And this is why
 * most engines and 3D softwares use another solution named Quaternion.
 *
 * Quaternion: The quaternion property also expresses a rotation, but in a more mathematical way,
 * which solves the order problem.
 */

/**
 * Scene graph: At some point, you might want to group things. Let's say you are building a house
 * with walls, doors, windows, a roof, bushes, etc.
 * When you think you're done, you become aware that the house is too small, and you have to
 * re-scale each object and update their positions.
 * A good alternative would be to group all those objects into a container and scale that container.
 * You can do that with the Group class.
 * Instantiate a Group and add it to the scene. Now, when you want to create a new object, you can
 * add it to the Group you just created using the add(...) method rather than adding it directly to
 * the scene.
 * Because the Group class inherits from the Object3D class, it has access to the previously-mentioned
 * properties and methods like position, scale, rotation, quaternion, and lookAt.
 * Comment the lookAt(...) call and, instead of our previously created cube, create 3 cubes and
 * add them to a Group. Then apply transformations on the group:
 */
const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 1.5;
group.rotation.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

cube2.position.x = -2;
cube3.position.x = 2;

group.add(cube1, cube2, cube3);

// Adding AxesHelper to help us visualize axes
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;
// Position and Scale are a Vector 3 property, whereas rotation is an Euler property
scene.add(camera);

// camera.lookAt(mesh.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
