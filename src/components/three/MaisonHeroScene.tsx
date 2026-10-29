"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface MaisonHeroSceneProps {
  onExploreClick?: () => void;
}

export default function MaisonHeroScene({ onExploreClick }: MaisonHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // SCENE & RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8f8f5");
    scene.fog = new THREE.FogExp2("#f8f8f5", 0.022);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 14.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fff4e6", 2.2);
    sunLight.position.set(8, 12, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight("#a6c3ca", 0.8);
    fillLight.position.set(-8, 6, -5);
    scene.add(fillLight);

    // MATERIALS
    const limestoneMat = new THREE.MeshStandardMaterial({
      color: "#e6e0d3",
      roughness: 0.85,
      metalness: 0.05
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: "#f5f2eb",
      roughness: 0.7,
      metalness: 0.05
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: "#3a474a",
      roughness: 0.5,
      metalness: 0.2
    });

    const windowGlassMat = new THREE.MeshStandardMaterial({
      color: "#4d6b73",
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7
    });

    const gateMat = new THREE.MeshStandardMaterial({
      color: "#2a393c",
      roughness: 0.4,
      metalness: 0.7
    });

    const groundMat = new THREE.MeshStandardMaterial({
      color: "#dfdad0",
      roughness: 0.9,
      metalness: 0.02
    });

    const lawnMat = new THREE.MeshStandardMaterial({
      color: "#7a8f7c",
      roughness: 0.8,
      metalness: 0.0
    });

    const woodDoorMat = new THREE.MeshStandardMaterial({
      color: "#4e3629",
      roughness: 0.6,
      metalness: 0.1
    });

    // ARCHITECTURAL GROUP
    const mansionGroup = new THREE.Group();

    // Ground Plane (Courtyard & street)
    const groundGeo = new THREE.PlaneGeometry(35, 30);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    mansionGroup.add(ground);

    // Main Building Body (Hôtel Particulier)
    const mainBodyGeo = new THREE.BoxGeometry(10, 5, 5);
    const mainBody = new THREE.Mesh(mainBodyGeo, limestoneMat);
    mainBody.position.set(0, 2.5, -4);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    mansionGroup.add(mainBody);

    // Central Portico / Pediment
    const porticoGeo = new THREE.BoxGeometry(4.2, 5.2, 0.4);
    const portico = new THREE.Mesh(porticoGeo, trimMat);
    portico.position.set(0, 2.6, -1.4);
    portico.castShadow = true;
    mansionGroup.add(portico);

    // Pediment Triangle (Fronton)
    const pedimentGeo = new THREE.ConeGeometry(2.4, 1.2, 4);
    const pediment = new THREE.Mesh(pedimentGeo, trimMat);
    pediment.rotation.y = Math.PI / 4;
    pediment.position.set(0, 5.8, -1.4);
    pediment.castShadow = true;
    mansionGroup.add(pediment);

    // Mansard Roof
    const roofGeo = new THREE.ConeGeometry(7.5, 2.2, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 6.1, -4);
    roof.castShadow = true;
    mansionGroup.add(roof);

    // Left Wing
    const wingGeo = new THREE.BoxGeometry(3.5, 4, 4.5);
    const leftWing = new THREE.Mesh(wingGeo, limestoneMat);
    leftWing.position.set(-6, 2, -3.8);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    mansionGroup.add(leftWing);

    // Right Wing
    const rightWing = new THREE.Mesh(wingGeo, limestoneMat);
    rightWing.position.set(6, 2, -3.8);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    mansionGroup.add(rightWing);

    // Windows Generator
    const windowGeo = new THREE.BoxGeometry(0.85, 1.4, 0.1);
    const windowFrameGeo = new THREE.BoxGeometry(0.95, 1.5, 0.08);

    const windowPositions = [
      // Ground floor central
      [-3.2, 1.8, -1.48],
      [-1.6, 1.8, -1.48],
      [1.6, 1.8, -1.48],
      [3.2, 1.8, -1.48],
      // 1st floor central
      [-3.2, 3.8, -1.48],
      [-1.6, 3.8, -1.48],
      [0, 3.8, -1.18],
      [1.6, 3.8, -1.48],
      [3.2, 3.8, -1.48],
      // Wings
      [-6, 2.8, -1.5],
      [6, 2.8, -1.5]
    ];

    windowPositions.forEach((pos) => {
      const frame = new THREE.Mesh(windowFrameGeo, trimMat);
      frame.position.set(pos[0], pos[1], pos[2]);
      const glass = new THREE.Mesh(windowGeo, windowGlassMat);
      glass.position.set(pos[0], pos[1], pos[2] + 0.02);
      mansionGroup.add(frame);
      mansionGroup.add(glass);
    });

    // Grand Arched Main Door
    const doorGeo = new THREE.BoxGeometry(1.2, 2.2, 0.15);
    const door = new THREE.Mesh(doorGeo, woodDoorMat);
    door.position.set(0, 1.2, -1.18);
    door.castShadow = true;
    mansionGroup.add(door);

    // Courtyard Enclosure Walls
    const sideWallGeo = new THREE.BoxGeometry(0.35, 1.8, 8);
    const leftWall = new THREE.Mesh(sideWallGeo, limestoneMat);
    leftWall.position.set(-6.8, 0.9, 0.5);
    leftWall.castShadow = true;
    mansionGroup.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, limestoneMat);
    rightWall.position.set(6.8, 0.9, 0.5);
    rightWall.castShadow = true;
    mansionGroup.add(rightWall);

    // Front Gate Pillars
    const pillarGeo = new THREE.BoxGeometry(0.7, 2.4, 0.7);
    const leftPillar = new THREE.Mesh(pillarGeo, trimMat);
    leftPillar.position.set(-2.4, 1.2, 4.2);
    leftPillar.castShadow = true;
    mansionGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, trimMat);
    rightPillar.position.set(2.4, 1.2, 4.2);
    rightPillar.castShadow = true;
    mansionGroup.add(rightPillar);

    // Signature Wrought Iron Gate (Blue/Slate)
    const gateBarGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.1, 8);
    for (let i = -2; i <= 2; i += 0.3) {
      if (Math.abs(i) > 0.1) {
        const bar = new THREE.Mesh(gateBarGeo, gateMat);
        bar.position.set(i, 1.1, 4.2);
        bar.castShadow = true;
        mansionGroup.add(bar);
      }
    }
    const gateTopGeo = new THREE.BoxGeometry(4.4, 0.08, 0.08);
    const gateTop = new THREE.Mesh(gateTopGeo, gateMat);
    gateTop.position.set(0, 2.1, 4.2);
    mansionGroup.add(gateTop);

    // Planters & Courtyard Greenery
    const potGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.7, 12);
    const treeFoliageGeo = new THREE.DodecahedronGeometry(0.75, 1);

    [
      [-4.5, 0, 1.5],
      [4.5, 0, 1.5],
      [-2, 0, 3.2],
      [2, 0, 3.2]
    ].forEach((pos) => {
      const pot = new THREE.Mesh(potGeo, limestoneMat);
      pot.position.set(pos[0], 0.35, pos[2]);
      pot.castShadow = true;
      mansionGroup.add(pot);

      const tree = new THREE.Mesh(treeFoliageGeo, lawnMat);
      tree.position.set(pos[0], 1.2, pos[2]);
      tree.castShadow = true;
      mansionGroup.add(tree);
    });

    // 9 Parking spaces markings in courtyard
    const lineMat = new THREE.MeshBasicMaterial({ color: "#c8c4b8" });
    const markGeo = new THREE.BoxGeometry(0.08, 0.02, 3.2);

    [-4.2, -2.8, -1.4, 1.4, 2.8, 4.2].forEach((x) => {
      const mark = new THREE.Mesh(markGeo, lineMat);
      mark.position.set(x, 0.01, 1.2);
      mansionGroup.add(mark);
    });

    scene.add(mansionGroup);
    setIsLoaded(true);

    // INTERACTIVE MOUSE PARALLAX
    let targetX = 0;
    let targetY = 4.5;
    let currentX = 0;
    let currentY = 4.5;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = normX * 1.8;
      targetY = 4.5 + normY * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01;

      // Smooth camera interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX;
      camera.position.y = currentY;
      camera.lookAt(0, 2.2, -1.5);

      // Subtle breath rotation of mansion
      mansionGroup.rotation.y = Math.sin(time * 0.4) * 0.018;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-calve-stone/40 flex items-center justify-center">
        <img
          src="/images/spaces/real-open-space-fixe-4k.jpg"
          alt="Maison Calvé - 48 rue Calvé, Bordeaux"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/60 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[700px] overflow-hidden">
      {/* 3D Canvas mount container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle overlay vignettes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-calve-cream via-calve-cream/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-calve-cream via-calve-cream/80 to-transparent" />

      {/* Interactive badge & hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-calve-cream/90 backdrop-blur-md border border-calve-border shadow-sm text-xs font-medium text-calve-charcoal/80">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Modèle architectural 3D temps réel · 48 rue Calvé</span>
      </div>
    </div>
  );
}
