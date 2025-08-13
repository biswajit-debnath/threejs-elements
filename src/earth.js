import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(screenWidth, screenHeight);
document.body.appendChild(renderer.domElement);

const fov = 75; // Field of view
const aspect = screenWidth / screenHeight; // Aspect ratio
const near = 0.1; // Near clipping plane
const far = 10; // Far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2; // Move the camera back so we can see the object

const scene = new THREE.Scene();

const geometry = new THREE.IcosahedronGeometry(1.0, 2);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const secondMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const secondMesh = new THREE.Mesh(geometry, secondMaterial);
secondMesh.scale.setScalar(1.001);
mesh.add(secondMesh);


const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x111111);
scene.add(hemisphereLight);

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
    mesh.rotation.y = t * 0.0001;
    controls.update();
    renderer.render(scene, camera);
}
animate();