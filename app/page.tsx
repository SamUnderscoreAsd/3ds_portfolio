'use client'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useEffect } from 'react';
import overshoot from '../effects/overshoot'

export default function Home() {
  useEffect(() => {
    const debugMode = true;
    let spinMode = true;
    const verticalSpeed = 1000;
    //const horizontalSpeed = 1000;

    const planeSize = 50;

    //textures
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('Prototype_Grid_Gray_09-256x256.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    //Gets scene and camera to use browser window size.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    //set background cyan (for some reason lmao)nerHeigh
    scene.background = new THREE.Color(0x00ffff);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const modelLoader = new GLTFLoader();

    //3ds model
    async function dsModle(): any {
      const ds = await modelLoader.loadAsync('3ds-model/FIXED_3ds_model.gltf');
      scene.add(ds.scene);

      return ds;
    }

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: debugMode ? .2 : 0});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 4.5, 9);

    var ds_model;
    dsModle().then(result => { ds_model = result.scene; cube.add(ds_model); });
    scene.add(cube);

    //wireframe
    const edgeGeo = new THREE.EdgesGeometry(cube.geometry);
    const mat = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: debugMode ? 1 : 0 });
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

    // function to atomically render a frame based on a given scene and camera perspective
    function animate(time) {
      if (ds_model) {
        ds_model.rotation.set(1, 0, 0);
        ds_model.position.set(0, 0, -0.1);
        if (spinMode) {
          cube.rotation.y = time / verticalSpeed;
        }
        else if (cube.rotation.y < 6) {
          cube.rotation.y = time / verticalSpeed;
        }
        else {
          spinMode = false;
          cube.rotation.y = 6.33;
        }
      }
      console.log(cube.rotation.y);
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
