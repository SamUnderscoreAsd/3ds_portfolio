'use client'
import * as THREE from 'three';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const verticalSpeed = 2000;
    //const horizontalSpeed = 1000;

    const planeSize = 50;

    //textures
    const loader = new THREE.TextureLoader();
    const texture = loader.load('Prototype_Grid_Gray_09-256x256.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    //Gets scene and camera to use browser window size.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    //set background cyan (for some reason lmao)
    scene.background = new THREE.Color(0x00ffff);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.y = 3;

    //wireframe
    const edgeGeo = new THREE.EdgesGeometry(cube.geometry);
    const mat = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    const wireframe = new THREE.LineSegments(edgeGeo, mat);
    cube.add(wireframe);

    // Plane
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -.5;
    scene.add(planeMesh);

    // Lighting
    const ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    scene.add(dirLight);

    camera.position.z = 5;

    // function to atomically render a frame based on a given scene and camera perspective
    function animate(time) {
      cube.rotation.y = time / verticalSpeed;
      //cube.rotation.x = time / horizontalSpeed;

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

