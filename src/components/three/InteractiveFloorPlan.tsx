"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowRight, CheckCircle2, Eye } from "lucide-react";

interface FloorPlanRoom {
  id: string;
  name: string;
  category: "office" | "open-space" | "meeting" | "services" | "parking";
  area: string;
  capacity: string;
  price: string;
  status: string;
  available: boolean;
  color: string;
  hoverColor: string;
  bounds: { x: number; z: number; w: number; d: number; h: number };
  description: string;
}

const ROOMS_DATA: FloorPlanRoom[] = [
  {
    id: "office-21m",
    name: "Bureau Privatif 21 m²",
    category: "office",
    area: "21 m²",
    capacity: "3 à 4 postes",
    price: "750€ HT / mois",
    status: "Disponible",
    available: true,
    color: "#4e7077",
    hoverColor: "#618890",
    bounds: { x: -4.5, z: -2.5, w: 3.8, d: 3.2, h: 1.2 },
    description: "Bureau intimiste baigné de lumière naturelle, vue sur cour pavée arborée."
  },
  {
    id: "office-28m",
    name: "Bureau Privatif 28 m²",
    category: "office",
    area: "28 m²",
    capacity: "5 à 6 postes",
    price: "1200€ HT / mois",
    status: "Disponible",
    available: true,
    color: "#45666c",
    hoverColor: "#587d84",
    bounds: { x: -4.5, z: 1.8, w: 3.8, d: 4.2, h: 1.2 },
    description: "Volumes de prestige avec parquet chêne et cheminée marbre décorative."
  },
  {
    id: "meeting-room",
    name: "Salle de Réunion 30 m²",
    category: "meeting",
    area: "30 m²",
    capacity: "12 à 14 personnes",
    price: "120€ HT demi-j / 200€ HT j",
    status: "Sur réservation",
    available: true,
    color: "#6b5b75",
    hoverColor: "#847190",
    bounds: { x: 0.2, z: -2.5, w: 4.5, d: 3.2, h: 1.2 },
    description: "Écran 4K visioconférence, grande table chêne, paperboard et café inclus."
  },
  {
    id: "open-space-1",
    name: "Open Space — Poste Fixe",
    category: "open-space",
    area: "5 postes fixes",
    capacity: "5 résidents",
    price: "250€ HT / mois",
    status: "Quelques places",
    available: true,
    color: "#557a70",
    hoverColor: "#6c978b",
    bounds: { x: 0.2, z: 1.8, w: 4.5, d: 4.2, h: 1.2 },
    description: "Poste dédié avec rangements privatifs, accès 24/7 et ambiance feutrée."
  },
  {
    id: "open-space-2",
    name: "Open Space — Poste Nomade",
    category: "open-space",
    area: "5 postes flex",
    capacity: "Postes nomades",
    price: "20€ HT jour / 10€ HT demi-j",
    status: "Accessible 24h",
    available: true,
    color: "#4b6c69",
    hoverColor: "#608985",
    bounds: { x: 5.2, z: 1.8, w: 3.8, d: 4.2, h: 1.2 },
    description: "Idéal pour indépendants et télétravailleurs de passage à Bordeaux."
  },
  {
    id: "kitchen-services",
    name: "Cuisine & Phonebox",
    category: "services",
    area: "20 m²",
    capacity: "Espace partagé",
    price: "Inclus dans toute formule",
    status: "Accès libre",
    available: true,
    color: "#7e786b",
    hoverColor: "#999283",
    bounds: { x: 5.2, z: -2.5, w: 3.8, d: 3.2, h: 1.2 },
    description: "Cuisine toute équipée, machine à café expresso, cabine acoustique privée."
  },
  {
    id: "parking-courtyard",
    name: "Cour Pavée — 9 Places Parking",
    category: "parking",
    area: "Cour privée fermée",
    capacity: "9 véhicules + vélos",
    price: "Inclus ou option",
    status: "4 places disponibles",
    available: true,
    color: "#3e4f52",
    hoverColor: "#52686c",
    bounds: { x: 0.3, z: 7.2, w: 13.8, d: 5.0, h: 0.2 },
    description: "Portail électrique sécurisé, bornes de recharge pour véhicules électriques."
  }
];

interface InteractiveFloorPlanProps {
  onSelectSpace?: (spaceId: string) => void;
}

export default function InteractiveFloorPlan({ onSelectSpace }: InteractiveFloorPlanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState<FloorPlanRoom>(ROOMS_DATA[0]);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8f8f5");

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 16, 17);
    camera.lookAt(0, 0, 1.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#fff5e6", 1.8);
    dirLight.position.set(10, 20, 12);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Ground slab
    const floorSlabGeo = new THREE.BoxGeometry(16, 0.2, 17);
    const floorSlabMat = new THREE.MeshStandardMaterial({
      color: "#e6e3da",
      roughness: 0.8
    });
    const floorSlab = new THREE.Mesh(floorSlabGeo, floorSlabMat);
    floorSlab.position.set(0, -0.1, 2);
    floorSlab.receiveShadow = true;
    scene.add(floorSlab);

    // Room Meshes map
    const roomMeshes: { mesh: THREE.Mesh; data: FloorPlanRoom }[] = [];

    ROOMS_DATA.forEach((room) => {
      const { x, z, w, d, h } = room.bounds;
      const boxGeo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color: room.color,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88
      });

      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { roomId: room.id };
      scene.add(mesh);

      // Add top edge border
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.6
      });
      const wireframe = new THREE.LineSegments(edgesGeo, lineMat);
      mesh.add(wireframe);

      // Parking bays markings
      if (room.category === "parking") {
        const markMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const markGeo = new THREE.PlaneGeometry(0.12, 3.2);
        for (let i = -5.5; i <= 5.5; i += 1.35) {
          const mark = new THREE.Mesh(markGeo, markMat);
          mark.rotation.x = -Math.PI / 2;
          mark.position.set(i, h / 2 + 0.02, 0);
          mesh.add(mark);
        }
      }

      roomMeshes.push({ mesh, data: room });
    });

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        roomMeshes.map((r) => r.mesh)
      );

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const roomId = hit.userData.roomId;
        setHoveredRoomId(roomId);
        const match = ROOMS_DATA.find((r) => r.id === roomId);
        if (match) setActiveRoom(match);
        renderer.domElement.style.cursor = "pointer";
      } else {
        setHoveredRoomId(null);
        renderer.domElement.style.cursor = "default";
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        roomMeshes.map((r) => r.mesh)
      );
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const roomId = hit.userData.roomId;
        if (onSelectSpace) onSelectSpace(roomId);
      }
    };

    renderer.domElement.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);

    // Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 480;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.015;

      // Update room colors based on active / hovered state
      roomMeshes.forEach(({ mesh, data }) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (data.id === activeRoom.id) {
          mat.color.set(data.hoverColor);
          mat.opacity = 0.98;
          mesh.position.y = (data.bounds.h / 2) + Math.sin(clock * 2) * 0.08 + 0.15;
        } else {
          mat.color.set(data.color);
          mat.opacity = 0.75;
          mesh.position.y = data.bounds.h / 2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("mousemove", onPointerMove);
        renderer.domElement.removeEventListener("click", onClick);
      }
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeRoom.id, onSelectSpace]);

  return (
    <div className="w-full bg-calve-cream rounded-3xl border border-calve-border overflow-hidden shadow-sm">
      {/* Top Filter Buttons */}
      <div className="p-4 md:p-6 border-b border-calve-border bg-calve-stone/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-calve-slate" />
          <span className="text-xs font-semibold tracking-wider uppercase text-calve-charcoal/70">
            Plan Architectural 3D · 48 Rue Calvé
          </span>
        </div>

        {/* Room selector pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ROOMS_DATA.map((room) => {
            const isActive = room.id === activeRoom.id;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-calve-slate text-white shadow-sm"
                    : "bg-white/80 text-calve-charcoal hover:bg-white border border-calve-border/60"
                }`}
              >
                {room.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 3D Canvas + Active Room HUD Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* 3D Viewport */}
        <div className="lg:col-span-8 relative h-[380px] md:h-[480px] bg-[#f8f8f5]">
          <div ref={containerRef} className="w-full h-full" />

          {/* Quick instructions floating badge */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-calve-border shadow-xs text-xs text-calve-charcoal/80">
              <Eye className="w-3.5 h-3.5 text-calve-slate" />
              <span>Survolez ou cliquez sur une zone pour interagir</span>
            </div>
          </div>
        </div>

        {/* Active Space Details HUD */}
        <div className="lg:col-span-4 p-6 md:p-8 bg-white border-t lg:border-t-0 lg:border-l border-calve-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-calve-slate">
                {activeRoom.category === "office"
                  ? "Bureau Privatif"
                  : activeRoom.category === "open-space"
                  ? "Espace Partagé"
                  : activeRoom.category === "meeting"
                  ? "Espace Événementiel"
                  : activeRoom.category === "parking"
                  ? "Stationnement"
                  : "Commodités"}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                  activeRoom.available
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {activeRoom.status}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-calve-charcoal mb-2">
              {activeRoom.name}
            </h3>

            <p className="text-sm text-calve-muted leading-relaxed mb-6">
              {activeRoom.description}
            </p>

            <div className="space-y-3 py-4 border-y border-calve-border/60 mb-6 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-calve-muted">Superficie / Format</span>
                <span className="font-semibold text-calve-charcoal">{activeRoom.area}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-calve-muted">Capacité conseillée</span>
                <span className="font-semibold text-calve-charcoal">{activeRoom.capacity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-calve-muted">Tarification officielle</span>
                <span className="font-semibold text-calve-slate">{activeRoom.price}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-calve-charcoal/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accès fibre ultra-haut débit sécurisée</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-calve-charcoal/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accès illimité aux 9 places de parking (selon formule)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-calve-charcoal/90">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Boissons chaudes/fraîches & pauses gourmandes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectSpace) onSelectSpace(activeRoom.id);
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <span>Demander une visite pour cet espace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
