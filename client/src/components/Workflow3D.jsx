import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MessageSquare, Cpu, Database, Zap, Terminal } from 'lucide-react';
import './Workflow3D.css';

export default function Workflow3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Tooltip DOM references to project positions directly
  const tooltipRefs = useRef([]);
  const statusRef = useRef(null);

  const [activeNode, setActiveNode] = useState(null);

  const nodeData = [
    {
      id: 1,
      title: 'Lead Captured',
      tag: 'LIVE FEED',
      desc: 'Form submission received',
      icon: <MessageSquare size={14} />,
      color: '#06b6d4', // Cyan
      pos: { x: -1.2, y: 0.6, z: -1.4 }
    },
    {
      id: 2,
      title: 'AI Classifier',
      tag: 'AI PROCESSING',
      desc: "Confidence: 99.1% - Tagged: 'Growth Lead'",
      icon: <Cpu size={14} />,
      color: '#7c3aed', // Purple
      pos: { x: 0.0, y: 0.3, z: -0.2 }
    },
    {
      id: 3,
      title: 'SQLite Database',
      tag: 'DATABASE ENTRY',
      desc: 'Row inserted in submissions.db',
      icon: <Database size={14} />,
      color: '#10b981', // Teal
      pos: { x: 1.0, y: -0.2, z: 0.6 }
    },
    {
      id: 4,
      title: 'Auto-Response',
      tag: 'AUTO-EXECUTION',
      desc: 'Slack alert dispatched in 40ms',
      icon: <Zap size={14} />,
      color: '#f59e0b', // Amber
      pos: { x: 1.2, y: 0.8, z: -0.5 }
    }
  ];

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight || 520;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040508, 0.06);

    // --- 2. Camera Setup (Orthographic for Isometric projection) ---
    const aspect = width / height;
    const d = 2.4; // Zoomed in closer for detailed brain mesh
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );
    // Standard isometric camera angle
    camera.position.set(10, 8.5, 10);
    camera.lookAt(0, 0, 0);

    // --- 3. Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 4. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // --- 5. Brain Group Setup (for global rotation) ---
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // --- 6. Brain Nodes Generation (70 nodes representing a neural network) ---
    const nodes = [];
    
    // Explicitly define primary/workflow nodes
    nodes.push({ x: -1.2, y: 0.6, z: -1.4, isPrimary: true, id: 1, color: '#06b6d4' }); // Lead Captured (0)
    nodes.push({ x: 0.0, y: 0.3, z: -0.2, isPrimary: true, id: 2, color: '#7c3aed' });  // AI Classifier (1)
    nodes.push({ x: 1.0, y: -0.2, z: 0.6, isPrimary: true, id: 3, color: '#10b981' });  // SQLite Database (2)
    nodes.push({ x: 1.2, y: 0.8, z: -0.5, isPrimary: true, id: 4, color: '#f59e0b' });  // Auto-Response (3)

    // Intermediate path nodes to route pulses organically through the brain
    nodes.push({ x: -0.8, y: 0.5, z: -1.0, isPath: true }); // Index 4 (Lead -> AI step 1)
    nodes.push({ x: -0.4, y: 0.4, z: -0.6, isPath: true }); // Index 5 (Lead -> AI step 2)
    nodes.push({ x: 0.4, y: 0.1, z: 0.1, isPath: true });   // Index 6 (AI -> DB step 1)
    nodes.push({ x: 0.8, y: -0.1, z: 0.4, isPath: true });  // Index 7 (AI -> DB step 2)
    nodes.push({ x: 0.4, y: 0.5, z: -0.3, isPath: true });  // Index 8 (AI -> Auto step 1)
    nodes.push({ x: 0.8, y: 0.7, z: -0.4, isPath: true });  // Index 9 (AI -> Auto step 2)

    // Generate the remaining 60 nodes for Left/Right Cerebral Hemispheres, Cerebellum, and Brainstem
    for (let i = 10; i < 70; i++) {
      if (i >= 10 && i < 35) {
        // Left Cerebral Hemisphere (x < 0)
        const theta = Math.random() * Math.PI;
        const phi = (Math.random() - 0.5) * Math.PI;
        const rx = 1.25 + Math.sin(phi * 4.0) * 0.12;
        const ry = 0.85 + Math.cos(theta * 3.0) * 0.08;
        const rz = 1.5;
        nodes.push({
          x: -Math.abs(rx * Math.sin(theta) * Math.cos(phi)) - 0.1,
          y: ry * Math.sin(theta) * Math.sin(phi) + 0.2,
          z: rz * Math.cos(theta) - 0.1,
          isAuxiliary: true
        });
      } else if (i >= 35 && i < 60) {
        // Right Cerebral Hemisphere (x > 0)
        const theta = Math.random() * Math.PI;
        const phi = (Math.random() - 0.5) * Math.PI;
        const rx = 1.25 + Math.sin(phi * 4.0) * 0.12;
        const ry = 0.85 + Math.cos(theta * 3.0) * 0.08;
        const rz = 1.5;
        nodes.push({
          x: Math.abs(rx * Math.sin(theta) * Math.cos(phi)) + 0.1,
          y: ry * Math.sin(theta) * Math.sin(phi) + 0.2,
          z: rz * Math.cos(theta) - 0.1,
          isAuxiliary: true
        });
      } else if (i >= 60 && i < 66) {
        // Cerebellum (dense lower-back structure)
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * Math.PI * 2;
        const r = 0.45 + Math.random() * 0.25;
        nodes.push({
          x: r * Math.sin(theta) * Math.cos(phi) * 1.1,
          y: r * Math.sin(theta) * Math.sin(phi) * 0.5 - 0.6,
          z: r * Math.cos(theta) * 0.7 + 0.8,
          isAuxiliary: true
        });
      } else {
        // Brainstem (base cylinder of nodes descending)
        const idx = i - 66;
        nodes.push({
          x: (Math.random() - 0.5) * 0.1,
          y: -0.6 - idx * 0.18,
          z: 0.25 + (Math.random() - 0.5) * 0.1,
          isAuxiliary: true
        });
      }
    }

    // --- 7. Synapses Creation (Nerves connecting neurons) ---
    const nodeConnections = [];
    const adjacencyList = Array.from({ length: 70 }, () => []);

    const addConnection = (a, b) => {
      const exists = nodeConnections.some(c => (c.from === a && c.to === b) || (c.from === b && c.to === a));
      if (!exists && a !== b) {
        nodeConnections.push({ from: a, to: b });
        adjacencyList[a].push(b);
        adjacencyList[b].push(a);
      }
    };

    // Explicitly link the workflow paths to guarantee signal routing
    // Path 1: Lead Captured (0) -> AI Classifier (1)
    addConnection(0, 4);
    addConnection(4, 5);
    addConnection(5, 1);

    // Path 2: AI Classifier (1) -> SQLite DB (2)
    addConnection(1, 6);
    addConnection(6, 7);
    addConnection(7, 2);

    // Path 3: AI Classifier (1) -> Auto-Response (3)
    addConnection(1, 8);
    addConnection(8, 9);
    addConnection(9, 3);

    // Link closest neighbors within range for rest of the network
    for (let i = 0; i < 70; i++) {
      const distances = [];
      for (let j = 0; j < 70; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        distances.push({ index: j, dist });
      }

      distances.sort((x, y) => x.dist - y.dist);

      // Connect to the 3 closest neighbors under threshold
      let connectedCount = adjacencyList[i].length;
      for (let k = 0; k < distances.length && connectedCount < 3; k++) {
        const neighbor = distances[k];
        if (neighbor.dist < 1.3) {
          addConnection(i, neighbor.index);
          connectedCount++;
        }
      }
    }

    // --- 8. Render Neural Network Components ---

    // 8a. Node Meshes
    const nodeObjects = nodes.map((node, index) => {
      const group = new THREE.Group();
      group.position.set(node.x, node.y, node.z);

      let size = 0.04;
      let color = 0x1e293b;

      if (node.isPrimary) {
        size = 0.11;
        color = node.color;

        // Visual halo sphere (emissive look)
        const outerGeo = new THREE.SphereGeometry(size * 1.6, 16, 16);
        const outerMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.18
        });
        const outerMesh = new THREE.Mesh(outerGeo, outerMat);
        group.add(outerMesh);

        // Core sphere
        const coreGeo = new THREE.SphereGeometry(size, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: color });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);

        // Custom point light for dynamic local volumetric glow
        const pl = new THREE.PointLight(color, 2.0, 3.5);
        group.add(pl);

        group.userData = { isPrimary: true, id: node.id, color, pointLight: pl, coreMesh };
      } else if (node.isPath) {
        size = 0.055;
        const coreGeo = new THREE.SphereGeometry(size, 8, 8);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x4f46e5,
          transparent: true,
          opacity: 0.65
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);
        group.userData = { isPrimary: false };
      } else {
        // General nerve neuron cell
        size = 0.032;
        const coreGeo = new THREE.SphereGeometry(size, 8, 8);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x475569,
          transparent: true,
          opacity: 0.35
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);
        group.userData = { isPrimary: false };
      }

      brainGroup.add(group);
      return group;
    });

    // 8b. Faint Background Synaptic Web Lines
    const linePositions = [];
    const lineColors = [];
    const c1 = new THREE.Color(0x312e81);
    const c2 = new THREE.Color(0x1e1b4b);

    nodeConnections.forEach(conn => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      linePositions.push(fromNode.x, fromNode.y, fromNode.z);
      linePositions.push(toNode.x, toNode.y, toNode.z);
      lineColors.push(c1.r, c1.g, c1.b);
      lineColors.push(c2.r, c2.g, c2.b);
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.14,
      depthWrite: false
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    brainGroup.add(lineSegments);

    // 8c. Primary Wires (Slightly brighter routing path)
    const pathLinePositions = [];
    const pathConnectionsList = [
      [0, 4], [4, 5], [5, 1], // Path 1
      [1, 6], [6, 7], [7, 2], // Path 2
      [1, 8], [8, 9], [9, 3]  // Path 3
    ];
    pathConnectionsList.forEach(([a, b]) => {
      const fromNode = nodes[a];
      const toNode = nodes[b];
      pathLinePositions.push(fromNode.x, fromNode.y, fromNode.z);
      pathLinePositions.push(toNode.x, toNode.y, toNode.z);
    });

    const pathLineGeo = new THREE.BufferGeometry();
    pathLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pathLinePositions, 3));

    const pathLineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.45
    });
    const pathLineSegments = new THREE.LineSegments(pathLineGeo, pathLineMat);
    brainGroup.add(pathLineSegments);

    // --- 9. Electrical Signal Engine (Nerve Spark Pulses) ---
    const activeSignals = [];
    const activeWaves = [];

    // Spark spawner
    const spawnSignal = (nodePath, colorHex, isRealSubmit = false, onComplete = null) => {
      const size = isRealSubmit ? 0.085 : 0.05;
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.95
      });
      const mesh = new THREE.Mesh(geo, mat);

      const startNode = nodes[nodePath[0]];
      mesh.position.set(startNode.x, startNode.y, startNode.z);
      brainGroup.add(mesh);

      activeSignals.push({
        mesh,
        geo,
        mat,
        path: nodePath,
        currentHop: 0,
        progress: 0.0,
        speed: isRealSubmit ? 0.045 : 0.02, // Fast submit sparks, organic idle sparks
        color: colorHex,
        isRealSubmit,
        onComplete
      });
    };

    // Expanding shockwave ring helper on nodes
    const triggerWave = (nodeIndex, colorHex) => {
      const node = nodes[nodeIndex];
      const ringGeo = new THREE.RingGeometry(0.04, 0.25, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(node.x, node.y, node.z);
      ringMesh.rotation.x = Math.PI / 2; // Flat horizontal plane
      brainGroup.add(ringMesh);

      activeWaves.push({
        mesh: ringMesh,
        geo: ringGeo,
        mat: ringMat,
        scale: 1.0,
        opacity: 0.8,
        speed: 0.07
      });
    };

    // Global Action Potential sweep (Neural Storm)
    const triggerNeuralStorm = () => {
      // Temporarily flash the synaptic nerve connections bright
      lineMat.opacity = 0.48;
      pathLineMat.opacity = 0.85;

      // Spawn 35 random sparks traversing various parts of the brain in rapid sequence
      for (let i = 0; i < 35; i++) {
        setTimeout(() => {
          const startIdx = Math.floor(Math.random() * 70);
          const neighbors = adjacencyList[startIdx];
          if (neighbors && neighbors.length > 0) {
            const hop1 = neighbors[Math.floor(Math.random() * neighbors.length)];
            const hop1Neighbors = adjacencyList[hop1];
            const hop2 = hop1Neighbors && hop1Neighbors.length > 0
              ? hop1Neighbors[Math.floor(Math.random() * hop1Neighbors.length)]
              : null;
            
            const path = [startIdx, hop1];
            if (hop2 && hop2 !== startIdx && hop2 !== hop1) {
              path.push(hop2);
            }

            const colors = ['#06b6d4', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            spawnSignal(path, randomColor, true); // Fast spark
            
            // Randomly flash small auxiliary nodes
            const group = nodeObjects[startIdx];
            if (group && !nodes[startIdx].isPrimary) {
              group.scale.set(1.6, 1.6, 1.6);
            }
          }
        }, i * 35);
      }
    };

    // Handle Form Submit Event Sequence
    const handleFormSubmit = () => {
      // 1. Flash Lead Captured immediately
      triggerWave(0, '#06b6d4');
      const node0 = nodeObjects[0];
      if (node0) node0.scale.set(2.2, 2.2, 2.2);

      // 2. Spawn Lead Captured -> AI Classifier packet train (3 Cyan sparks)
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          spawnSignal([0, 4, 5, 1], '#06b6d4', true, i === 0 ? () => {
            // When first Cyan spark hits AI Classifier (1), flash it
            triggerWave(1, '#7c3aed');
            const node1 = nodeObjects[1];
            if (node1) node1.scale.set(2.2, 2.2, 2.2);

            // Spawn split signals down paths 2 and 3
            setTimeout(() => {
              // Path 2 to Database: [1, 6, 7, 2] (3 Teal sparks)
              for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                  spawnSignal([1, 6, 7, 2], '#10b981', true, j === 0 ? () => {
                    triggerWave(2, '#10b981');
                    const node2 = nodeObjects[2];
                    if (node2) node2.scale.set(2.2, 2.2, 2.2);
                  } : null);
                }, j * 110);
              }

              // Path 3 to Auto-Response: [1, 8, 9, 3] (3 Amber sparks)
              for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                  spawnSignal([1, 8, 9, 3], '#f59e0b', true, j === 0 ? () => {
                    triggerWave(3, '#f59e0b');
                    const node3 = nodeObjects[3];
                    if (node3) node3.scale.set(2.2, 2.2, 2.2);

                    // Once the message delivery executes, trigger the global neural storm burst!
                    triggerNeuralStorm();
                  } : null);
                }, j * 110);
              }
            }, 180);
          } : null);
        }, i * 110);
      }
    };

    window.addEventListener('lead-submitted', handleFormSubmit);

    // 8d. Idle background nerve impulse ticks (keeps the brain visually alive)
    const spawnIdleSignal = () => {
      const startIdx = Math.floor(Math.random() * 70);
      const neighbors = adjacencyList[startIdx];
      if (neighbors && neighbors.length > 0) {
        const hop1 = neighbors[Math.floor(Math.random() * neighbors.length)];
        const hop1Neighbors = adjacencyList[hop1];
        const hop2 = hop1Neighbors && hop1Neighbors.length > 0
          ? hop1Neighbors[Math.floor(Math.random() * hop1Neighbors.length)]
          : null;

        const path = [startIdx, hop1];
        if (hop2 && hop2 !== startIdx && hop2 !== hop1) {
          path.push(hop2);
        }

        const colors = ['#818cf8', '#6366f1', '#4f46e5', '#3b82f6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        spawnSignal(path, randomColor, false);
      }
    };

    const idleTimer = setInterval(spawnIdleSignal, 550);

    // --- 10. Raycaster Hover Handler ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundIntersect = null;
      for (let i = 0; i < intersects.length; i++) {
        let parent = intersects[i].object.parent;
        while (parent && parent !== scene) {
          if (nodeObjects.includes(parent)) {
            foundIntersect = parent;
            break;
          }
          parent = parent.parent;
        }
        if (foundIntersect) break;
      }

      if (foundIntersect) {
        const isPrimary = foundIntersect.userData.isPrimary;
        if (isPrimary) {
          setActiveNode(foundIntersect.userData.id);
        } else {
          setActiveNode(null);
        }
      } else {
        setActiveNode(null);
      }
    };

    container.addEventListener('mousemove', onMouseMove);

    // --- 11. Animation Loop & HTML Tooltip Projection ---
    const tempV = new THREE.Vector3();
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow organic brain rotation (spin and wobble)
      brainGroup.rotation.y = elapsedTime * 0.04;
      brainGroup.rotation.z = Math.sin(elapsedTime * 0.35) * 0.04;
      brainGroup.rotation.x = Math.cos(elapsedTime * 0.25) * 0.03;

      // Animate active waves
      for (let i = activeWaves.length - 1; i >= 0; i--) {
        const wave = activeWaves[i];
        wave.scale += wave.speed * 2.0;
        wave.opacity -= 0.038;
        wave.mesh.scale.set(wave.scale, wave.scale, 1);
        wave.mat.opacity = wave.opacity;

        if (wave.opacity <= 0.0) {
          brainGroup.remove(wave.mesh);
          wave.geo.dispose();
          wave.mat.dispose();
          activeWaves.splice(i, 1);
        }
      }

      // Animate nerve signals (sparks) traveling down lines
      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const sig = activeSignals[i];
        sig.progress += sig.speed;

        const startIdx = sig.path[sig.currentHop];
        const endIdx = sig.path[sig.currentHop + 1];
        const startNode = nodes[startIdx];
        const endNode = nodes[endIdx];

        if (sig.progress >= 1.0) {
          sig.progress = 0.0;
          sig.currentHop++;

          if (sig.currentHop >= sig.path.length - 1) {
            // Reached path end
            brainGroup.remove(sig.mesh);
            sig.geo.dispose();
            sig.mat.dispose();
            
            if (sig.onComplete) {
              sig.onComplete();
            }
            activeSignals.splice(i, 1);
            continue;
          }
        }

        // Interpolate position along synapse segment
        const p = sig.progress;
        const nx = startNode.x + (endNode.x - startNode.x) * p;
        const ny = startNode.y + (endNode.y - startNode.y) * p;
        const nz = startNode.z + (endNode.z - startNode.z) * p;

        // Add small chemical synapse jitter for organic appearance
        const jitter = 0.015;
        sig.mesh.position.set(
          nx + (Math.random() - 0.5) * jitter,
          ny + (Math.random() - 0.5) * jitter,
          nz + (Math.random() - 0.5) * jitter
        );
      }

      // Slowly decay synapse lines flash opacities to resting baseline levels
      lineMat.opacity += (0.12 - lineMat.opacity) * 0.04;
      pathLineMat.opacity += (0.42 - pathLineMat.opacity) * 0.04;

      // Pulse nodes & decay scale bursts
      nodeObjects.forEach((group, index) => {
        const isPrimary = group.userData.isPrimary;
        if (isPrimary) {
          const isHovered = activeNode === group.userData.id;
          const targetScale = isHovered ? 1.35 : 1.0;
          
          // Smoothly animate scaling
          group.scale.x += (targetScale - group.scale.x) * 0.1;
          group.scale.y += (targetScale - group.scale.y) * 0.1;
          group.scale.z += (targetScale - group.scale.z) * 0.1;

          // Pulse primary node cores slightly
          const core = group.userData.coreMesh;
          const pulse = 1.0 + Math.sin(elapsedTime * 4.0 + index) * 0.06;
          core.scale.set(pulse, pulse, pulse);

          // Animate local light source intensities
          const pl = group.userData.pointLight;
          const targetIntensity = isHovered ? 4.0 : 1.8 + Math.sin(elapsedTime * 2.5 + index) * 0.35;
          pl.intensity += (targetIntensity - pl.intensity) * 0.15;
        } else {
          // Decays auxiliary node scale back to normal
          group.scale.x += (1.0 - group.scale.x) * 0.08;
          group.scale.y += (1.0 - group.scale.y) * 0.08;
          group.scale.z += (1.0 - group.scale.z) * 0.08;
        }
      });

      // Project the 4 primary world coordinates directly to 2D HTML overlays
      nodeData.forEach((node, idx) => {
        const el = tooltipRefs.current[idx];
        const group = nodeObjects[idx]; // Corresponds to indices 0, 1, 2, 3 in nodeObjects
        if (!el || !group) return;

        // Fetch rotating 3D world coordinates
        group.getWorldPosition(tempV);
        tempV.y += 0.35; // Hover tooltip slightly above node

        tempV.project(camera);

        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (tempV.y * -0.5 + 0.5) * height;

        el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
      });

      // Project bottom terminal status bar coordinate at front edge of the brainstem
      if (statusRef.current) {
        tempV.set(0, -1.3, 0); // Ground position below brainstem
        tempV.project(camera);
        const sx = (tempV.x * 0.5 + 0.5) * width;
        const sy = (tempV.y * -0.5 + 0.5) * height;
        statusRef.current.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 12. Resize Handler ---
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 520;

      renderer.setSize(width, height);
      
      const newAspect = width / height;
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Clean up all resources
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('lead-submitted', handleFormSubmit);
      clearInterval(idleTimer);
      container.removeEventListener('mousemove', onMouseMove);
      
      renderer.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      pathLineGeo.dispose();
      pathLineMat.dispose();

      nodeObjects.forEach(group => {
        group.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      activeSignals.forEach(s => {
        s.geo.dispose();
        s.mat.dispose();
      });
      activeWaves.forEach(w => {
        w.geo.dispose();
        w.mat.dispose();
      });
    };
  }, [activeNode]);

  return (
    <div className="three-visual-container" ref={containerRef}>
      <canvas className="three-canvas" ref={canvasRef} />

      {/* HTML Projective Overlay Tooltips */}
      {nodeData.map((node, idx) => (
        <div
          key={node.id}
          ref={(el) => (tooltipRefs.current[idx] = el)}
          className={`projective-tooltip ${activeNode === node.id ? 'active' : ''}`}
          style={{ '--theme-color': node.color }}
        >
          <div className="tooltip-header">
            <span className="tooltip-tag">[{node.tag}]</span>
            <div className="tooltip-icon" style={{ color: node.color }}>
              {node.icon}
            </div>
          </div>
          <div className="tooltip-title">{node.title}</div>
          <div className="tooltip-desc">{node.desc}</div>
          <div className="tooltip-pointer" />
        </div>
      ))}

      {/* Bottom Status Board */}
      <div className="three-status-board" ref={statusRef}>
        <Terminal size={14} className="status-terminal-icon" />
        <span>Brainwaves listening on <code>/api/submissions</code></span>
        <span className="status-blink" />
      </div>
    </div>
  );
}
