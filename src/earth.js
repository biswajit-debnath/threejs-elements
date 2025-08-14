import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import getStarfield from './starFields.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;
const canvas = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(screenWidth, screenHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const fov = 75; // Field of view
const aspect = screenWidth / screenHeight; // Aspect ratio
const near = 0.1; // Near clipping plane
const far = 1000; // Far clipping plane - increased to see stars
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2; // Move the camera back so we can see the object

const scene = new THREE.Scene();

const earthGroup = new THREE.Group();
scene.add(earthGroup);
earthGroup.rotation.z = -23.4 * (Math.PI / 180); // Rotate the group to simulate Earth's axial tilt
const loader = new THREE.TextureLoader();
const highResolution = true; // Set to true for high resolution textures
const geometry = new THREE.IcosahedronGeometry(1.0, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load(
    !highResolution ? './textures/00_earthmap1k.jpg'  // Use high resolution texture
    :
    './textures/8081_earthmap4k.jpg'),
});

const mesh = new THREE.Mesh(geometry, material);
earthGroup.add(mesh);

const starFields = getStarfield({ numStars: 2000 });
scene.add(starFields);

// Create satellite
const satelliteOrbitGroup = new THREE.Group();
scene.add(satelliteOrbitGroup);


// Create a satellite model using GLTFLoader
const gltfLoader = new GLTFLoader();
gltfLoader.load('./3d-models/space_x_crew_dragon.glb', (gltf) => {
  // decrease the size of the satellite model
  gltf.scene.scale.set(0.06, 0.06, 0.06); // Scale down the model
  // Face the earth
  gltf.scene.rotation.y = Math.PI / 2;
  // Position satellite away from Earth center (1.5 units away)
  gltf.scene.position.set(1.3, 0, 0); // Position the satellite
  satelliteOrbitGroup.add(gltf.scene); // Add the satellite model to the orbit group
});

// Adding earth lights
const lightMaterial = new THREE.MeshBasicMaterial({
    map: loader.load(
      !highResolution ? './textures/8081_earthlights2k.jpg'  // Use high resolution texture
      : './textures/8081_earthlights4k.jpg'
    ),
    blending: THREE.AdditiveBlending, // Additive blending for lights
});
const lightMesh = new THREE.Mesh(geometry, lightMaterial);
earthGroup.add(lightMesh);


// Adding Clouds
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: loader.load(
    !highResolution ? './textures/2k_earth_clouds.jpg'
      : './textures/8081_earthhiresclouds4K.jpg'
  ),
  blending: THREE.AdditiveBlending
});
const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
cloudMesh.scale.setScalar(1.003); // Slightly larger than the Earth mesh to simulate clouds
earthGroup.add(cloudMesh);

const sunlight = new THREE.DirectionalLight(0xffffff, 2.0);
sunlight.position.set(-2, -0.5, 1.5);
scene.add(sunlight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-

window.addEventListener('resize', () => {
    const newScreenHeight = window.innerHeight;
    const newScreenWidth = window.innerWidth;
    renderer.setSize(newScreenWidth, newScreenHeight);
    camera.aspect = newScreenWidth / newScreenHeight;
    camera.updateProjectionMatrix();
})

function animate(t = 0) {
    requestAnimationFrame(animate);
    
    // Earth rotation on its axis
    mesh.rotation.y = t * 0.00012;
    lightMesh.rotation.y = t * 0.00012;
    cloudMesh.rotation.y = t * 0.00017;
    
    // Satellite orbit around Earth (faster than Earth's rotation)
    satelliteOrbitGroup.rotation.y = t * 0.0003;

    controls.update();
    renderer.render(scene, camera);
}
animate();