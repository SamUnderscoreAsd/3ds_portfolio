'use client'
import { animate, frame } from "motion";
import { threeEffect } from "motion/three"
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useEffect, useState } from 'react';
import { config } from '../config/config'

import LoadingScreen from "@/components/loadingScreen";
import rotateDSCube from "@/animations/spinmode";
import DebugScreen from "@/components/debugScreen";
import { mouseCoords } from "@/types";

export default function Home() {

  const [isLoaded, setIsLoaded] = useState(false); //Refers to point when all assets are fully loaded
  const [loadedMessage, setLoadedMessage] = useState(""); //Messages that are sent into loading screen
  const [mousePos, setMousePos] = useState<mouseCoords>( { x: 0, y: 0 } )

  function handleMouseMove(event : React.MouseEvent){
    setMousePos({ x: ((event.clientX / window.innerWidth) * 2 - 1), y: ((event.clientY / window.innerHeight) * -2 + 1) })
    //console.log("mouse posx: " + mousePos.x + "\nmouse posy: " + mousePos.y)
  }

  useEffect(() => {

    // Gets scene and camera to use browser window size.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.scene.color); //set background cyan (for some reason lmao)nerHeigh
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Get canvas from html
    const canvas: THREE.OffscreenCanvas = document.getElementById("c");
    if (!canvas) {
      throw new Error("CANVAS NOT FOUND");
    }

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas});
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
      rotateDSCube(cube, config.spinMode);
      setIsLoaded(true);
    }

    //textures
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texture = textureLoader.load(config.debugMode ? config.texture.debug : config.texture.actual);
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
    const material = new THREE.MeshBasicMaterial({ color: config.cube.color, transparent: config.cube.transparent, opacity: config.debugMode ? config.cube.opacity.debug : config.cube.opacity.actual });
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
    const mat = new THREE.LineBasicMaterial({ color: config.wireframe.color, transparent: config.wireframe.transparent, opacity: config.debugMode ? config.wireframe.opacity.debug : config.wireframe.opacity.actual });
    const wireframe = new THREE.LineSegments(edgeGeo, mat);
    cube.add(wireframe);

    // Plane
    const planeGeo = new THREE.PlaneGeometry(config.plane.planeSize, config.plane.planeSize);
    const planeMat = new THREE.MeshPhongMaterial({ map: texture, side: config.plane.material.side});
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -.5;
    scene.add(planeMesh);

    // Lighting
    const ambient = new THREE.AmbientLight(config.light.ambientColor, 1);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(config.light.directLight, 1.0);
    scene.add(dirLight);

    frame.render(() => renderer.render(scene, camera), true);
  }, []);

  return (
    <>
      {!isLoaded ? <LoadingScreen id="LoadingScreen" loadMessage={loadedMessage}/> : null}
      {config.debugMode ? <DebugScreen isLoaded={isLoaded} mousePos={ mousePos }/> : null}
      <canvas id="c" onMouseMove={handleMouseMove}>
      </canvas>
    </>
  );
}
