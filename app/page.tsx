'use client'
import * as THREE from 'three';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {

    //Gets scene and camera to use browser window size.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    //wireframe
    const edgeGeo = new THREE.EdgesGeometry(cube.geometry);
    const mat = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    const wireframe = new THREE.LineSegments(edgeGeo, mat);

    cube.add(wireframe);
    camera.position.z = 5;

    // function to atomically render a frame based on a given scene and camera perspective
    function animate(time) {
      cube.rotation.y = time / 2000;
      cube.rotation.x = time / 2000;

      renderer.render(scene, camera);
    }

    // This starts the actual loop to render the canvas
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, [])

  return (
    <div>
    </div>
  );
}

