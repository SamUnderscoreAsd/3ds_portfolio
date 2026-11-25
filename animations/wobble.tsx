import * as THREE from 'three';
import { mouseCoords } from '@/types';
import { animate } from 'motion';
import { clamp } from 'three/src/nodes/TSL.js';

export default function Wobble(object: THREE.Mesh, coords: mouseCoords) {
  animate(
    object,
    {

    }
  );
}
