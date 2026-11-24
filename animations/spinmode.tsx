import { animate } from "motion";
import * as THREE from 'three';
// Designed to accept the GLTF ds model's parent mesh which is a cube
// and then applies a rotation animation to it dependeing on the current mode
export default function rotateDSCube(ds: THREE.Mesh, spinMode:boolean) {
  if (spinMode) {
    console.log("Doing spin mode BITCH")
    animate(
      ds,
      { rotateY: 360 },
      { duration: 2, repeat: Infinity, ease: "linear" }
    )
  }
  else {
    animate(
      ds,
      { rotateY: 360 },
      { duration: 5, repeat: 0, ease: "backOut" }
    )
  }
}
