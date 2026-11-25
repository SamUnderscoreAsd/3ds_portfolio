import * as THREE from 'three'

export const config = {
  debugMode: true,
  spinMode: false,

  scene: {
    color: 0x00ffff,
  },

  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
  },

  texture: {
    actual: 'Prototype_Grid_Gray_09-256x256.png',
    debug: 'Prototype_Grid_Gray_09-256x256.png'
  },

  ds: '3ds-model/FIXED_3ds_model.gltf',

  cube: {
    color: 0x00ff00,
    transparent: true,
    opacity: {
      actual: 0,
      debug: .2
    }
  },

  wireframe: {
    color: 0xFFFFFF,
    transparent: true,
    opacity: {
      actual: 0,
      debug: 1
    }
  },

  plane: {
    planeSize: 50,
    material: {
      side: THREE.DoubleSide
    }
  },

  light: {
    ambientColor: 0x404040,
    directLight: 0xffffff
  }
};
