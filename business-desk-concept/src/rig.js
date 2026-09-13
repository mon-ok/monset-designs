import * as THREE from "three";

// Mutable, non-React scene data shared across per-frame code (camera rig,
// chair animation, HTML overlays). Populated once the model is measured.
export const rig = {
  ready: false,
  frontDir: new THREE.Vector3(0, 0, -1), // screen normal, points toward the viewer
  rightDir: new THREE.Vector3(1, 0, 0),
  up: new THREE.Vector3(0, 1, 0),
  screenQuat: new THREE.Quaternion(), // orients HTML to face the camera

  monitorCenter: new THREE.Vector3(),
  screenCenter: new THREE.Vector3(),
  screenSize: new THREE.Vector2(1, 0.6),
  monitorSize: new THREE.Vector3(),

  sceneCenter: new THREE.Vector3(),
  sceneSize: new THREE.Vector3(),
  floorY: 0,

  hero: { pos: new THREE.Vector3(), look: new THREE.Vector3() },
  monitor: { pos: new THREE.Vector3(), look: new THREE.Vector3() },
  panels: [], // [{ center, pos, look }]
};

// Continuous scroll progress (0 = hero, 1 = docked at monitor).
export const scroll = { target: 0, smooth: 0 };
