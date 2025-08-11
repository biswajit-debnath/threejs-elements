# 3D Models Directory

Place your GLB/GLTF model files here.

## Required file:
- `medieval_box.glb` - The medieval box model used in sphere.html

## How to add models:
1. Copy your GLB files to this directory
2. Reference them in your JavaScript using relative paths like: `'./3d-models/your-model.glb'`

## Example:
```javascript
loader.load('./3d-models/medieval_box.glb', (gltf) => {
  scene.add(gltf.scene);
});
```
