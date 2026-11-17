'use client'
import { animate, frame } from "motion";
import { threeEffect } from "motion/three"
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useEffect, useState } from 'react';

import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {

  const [isLoaded, setIsLoaded] = useState(false); //Refers to point when all assets are fully loaded
  const [loadedMessage, setLoadedMessage] = useState(""); //Messages that are sent into loading screen

  useEffect(() => {
    const debugMode = true; // Shows additional visual information for debugging
    const spinMode = false; //Enables infite spin on the rotateDSCube function
    let started = false; //Refers to point when start animation is finished
    const planeSize = 50; //Size of plane

    // Gets scene and camera to use browser window size.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00ffff); //set background cyan (for some reason lmao)nerHeigh
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Allow animate() to handle Three.js objects
    animate.addEffect(threeEffect);

    // Loading Manager
    const loadingManager = new THREE.LoadingManager();

    // After each loaded object
    // set loaded message to current message for loading screen
    loadingManager.onProgress = function (url, item, total) {
      console.log(`Started loading: ${url} (${total - (total - item)}/${total} Remaining)`);
      setLoadedMessage(`Started loading: ${url} (${total - (total - item)}/${total} Remaining)`);
    }

    // Once Loading is finished
    // Call startup animation, set loading to false, set started to true
    loadingManager.onLoad = function () {
      rotateDSCube(cube);
      setIsLoaded(true);
      started = true;
    }

    //textures
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texture = textureLoader.load('Prototype_Grid_Gray_09-256x256.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    const modelLoader = new GLTFLoader(loadingManager);

    //3ds model loader
    async function dsModle(): Promise<GLTF> {
      const ds = await modelLoader.loadAsync('3ds-model/FIXED_3ds_model.gltf');
      return ds;
    }

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: debugMode ? .2 : 0 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 4.5, 9);

    // Captures the promise object from dsModle() function and
    // passes result.scene into the cube object.
    let ds_model;
    dsModle().then(result => {
      ds_model = result.scene;
      ds_model.name = "ds_model";
      ds_model.rotation.set(1, 0, 0);
      ds_model.position.set(0, 0, -0.1);
      cube.add(ds_model);
    });
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

    // Designed to accept the GLTF ds model's parent mesh which is a cube
    // and then applies a rotation animation to it dependeing on the current mode
    function rotateDSCube(ds : THREE.Mesh) {
      if (spinMode) {
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

    frame.render(() => renderer.render(scene, camera), true);
  },[]);

  return (
    <>
      {!isLoaded ? <LoadingScreen id="LoadingScreen" loadMessage={loadedMessage} /> : null}
    </>
  );
}
