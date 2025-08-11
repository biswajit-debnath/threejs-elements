import './style.css'

// Your JavaScript code here

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as lil from 'lil-gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const textureLoader = new THREE.TextureLoader();
const color = textureLoader.load('/textures/color.jpg');
const roughness = textureLoader.load('/textures/roughness.jpg');
const normal = textureLoader.load('/textures/normal.png');

const geometry = new THREE.BoxGeometry( 3, 1.8, 2);
const material = new THREE.MeshStandardMaterial( { map: color, roughnessMap: roughness, normalMap: normal } );
const box = new THREE.Mesh( geometry, material );
scene.add( box );

camera.position.z = 5;

const canvas = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( window.innerWidth, window.innerHeight );

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(1, -1.5, 1);  
scene.add(pointLight);

// Directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.autoRotate = true; // Enable auto-rotation

// Add lil gui
const gui = new lil.GUI();
const materialFolder = gui.addFolder('Material Properties');
materialFolder.add(material, 'roughness', 0, 1);
materialFolder.add(material, 'metalness', 0, 1);

// Mesh settings
const meshFolder = gui.addFolder('Mesh Settings'); 
meshFolder.add(box.scale, 'x', 0.1, 5).name('Scale X');
meshFolder.add(box.scale, 'y', 0.1, 5).name('Scale Y');
meshFolder.add(box.position, 'z', 0.1, 5).name('Position Z');

// Directional light settings
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight.position, 'x', -10, 10);
directionalLightFolder.add(directionalLight.position, 'y', -10, 10);
directionalLightFolder.add(directionalLight.position, 'z', -10, 10);
directionalLightFolder.add(directionalLight, 'intensity', 0, 5);

// Point light settings
const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.add(pointLight.position, 'x', -10, 10);
pointLightFolder.add(pointLight.position, 'y', -10, 10);
pointLightFolder.add(pointLight.position, 'z', -10, 10);
pointLightFolder.add(pointLight, 'intensity', 0, 5);

function animate() {
  requestAnimationFrame( animate );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();
  renderer.render( scene, camera );
}

animate();