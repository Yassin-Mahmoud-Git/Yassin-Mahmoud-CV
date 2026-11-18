import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {ChevronDown, ChevronUp, RotateCcw} from 'lucide-react';
import {SKILLS} from '../data/cvData';
import {
  createBeveledLugGeometry,
  createContactShadowTexture,
  createDialPlinthTexture,
  createSkillPrismGeometry,
  FINISH_PRESETS,
  FinishId,
} from './three/sculptureMaterials';

export interface SpatialSelection {
  kind: 'core' | 'ring' | 'skill';
  title: string;
  subtitle: string;
  targetSection: string;
  skillId?: string;
}

interface Interactive3DStageProps {
  darkMode: boolean;
  selectedSkillId: string | null;
  onSelectSpatialItem: (item: SpatialSelection | null) => void;
}

type CameraPreset = 'overview' | 'top' | 'side';

interface InteractableData {
  selection: SpatialSelection;
  baseEmissive: number;
  material: THREE.MeshPhysicalMaterial;
  mesh: THREE.Object3D;
}

const CAMERA_PRESETS: Record<CameraPreset, {pos: [number, number, number]; target: [number, number, number]}> = {
  overview: {pos: [5.4, 3.6, 6.2], target: [0, 0.25, 0]},
  top: {pos: [0.01, 7.6, 1.8], target: [0, 0.1, 0]},
  side: {pos: [7.4, 1.15, 0.4], target: [0, 0.25, 0]},
};

const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();

export const Interactive3DStage: React.FC<Interactive3DStageProps> = ({
  darkMode,
  selectedSkillId,
  onSelectSpatialItem,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [finishId, setFinishId] = useState<FinishId>('obsidian');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [activeSelection, setActiveSelection] = useState<SpatialSelection | null>({
    kind: 'core',
    title: 'Full-Stack Web & AI Core',
    subtitle: 'Drag to orbit · Click any prism or gimbal ring to inspect',
    targetSection: 'about',
  });

  // Mutable refs for React-to-Three synchronization without recreating WebGLRenderer
  const explodeTargetRef = useRef(explodeFactor);
  const finishTargetRef = useRef<FinishId>(finishId);
  const darkModeRef = useRef(darkMode);
  const autoRotateRef = useRef(autoRotate);
  const selectedSkillIdRef = useRef(selectedSkillId);
  const onSelectRef = useRef(onSelectSpatialItem);
  const cameraGoalRef = useRef<{pos: THREE.Vector3; target: THREE.Vector3} | null>(null);
  const syncThemeFnRef = useRef<((dark: boolean) => void) | null>(null);
  const syncFinishFnRef = useRef<((id: FinishId) => void) | null>(null);

  useEffect(() => {
    explodeTargetRef.current = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    finishTargetRef.current = finishId;
    syncFinishFnRef.current?.(finishId);
  }, [finishId]);

  useEffect(() => {
    darkModeRef.current = darkMode;
    syncThemeFnRef.current?.(darkMode);
  }, [darkMode]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    selectedSkillIdRef.current = selectedSkillId;
  }, [selectedSkillId]);

  useEffect(() => {
    onSelectRef.current = onSelectSpatialItem;
  }, [onSelectSpatialItem]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = mount.clientWidth || 720;
    const height = mount.clientHeight || 480;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialBg = darkModeRef.current ? 0x111114 : 0xf2f0ea;
    scene.background = new THREE.Color(initialBg);
    scene.fog = new THREE.FogExp2(initialBg, 0.042);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(...CAMERA_PRESETS.overview.pos);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4.0;
    controls.maxDistance = 12.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.enablePan = false;
    controls.update();

    controls.addEventListener('start', () => {
      cameraGoalRef.current = null;
    });

    // Balanced Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x27272a, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 22;
    const d = 4.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe11d48, 1.35);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    let areaLight: THREE.RectAreaLight | null = null;
    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      areaLight = new THREE.RectAreaLight(0xffffff, 2.4, 5, 2.5);
      areaLight.position.set(0, 5.5, 4);
      areaLight.lookAt(0, 0.3, 0);
      scene.add(areaLight);
    }

    // Grounded Architectural Dial & Contact Shadow
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    let dialTexture = createDialPlinthTexture(maxAniso, darkModeRef.current);
    const dialGeo = new THREE.CircleGeometry(3.55, 64);
    dialGeo.rotateX(-Math.PI / 2);
    const dialMat = new THREE.MeshBasicMaterial({
      map: dialTexture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.y = -1.52;
    scene.add(dialMesh);

    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(6.8, 6.8);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.y = -1.54;
    scene.add(shadowPlane);

    // Composite 3D Sculpture Root
    const sculptureRoot = new THREE.Group();
    sculptureRoot.position.y = 0.35;
    scene.add(sculptureRoot);

    const preset = FINISH_PRESETS[finishTargetRef.current];
    const interactables: InteractableData[] = [];

    // 1. Primary Silhouette: Central Faceted Core + Collar + Geodesic Wireframe
    const coreGroup = new THREE.Group();
    sculptureRoot.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(0.86, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: preset.coreColor,
      metalness: preset.coreMetalness,
      roughness: preset.coreRoughness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = !isSoftwareGl;
    coreMesh.receiveShadow = !isSoftwareGl;
    coreMesh.layers.enable(1);
    coreGroup.add(coreMesh);

    interactables.push({
      selection: {
        kind: 'core',
        title: 'Full-Stack Web & AI Core',
        subtitle: '4+ years web dev · AI-assisted 3D, web & Android apps',
        targetSection: 'about',
      },
      baseEmissive: 0x000000,
      material: coreMat,
      mesh: coreMesh,
    });

    // Precision Geodesic Cage around Core
    const cageGeo = new THREE.IcosahedronGeometry(1.12, 1);
    const cageEdges = new THREE.EdgesGeometry(cageGeo);
    const cageMat = new THREE.LineBasicMaterial({
      color: preset.accentColor,
      transparent: true,
      opacity: 0.55,
    });
    const cageLines = new THREE.LineSegments(cageEdges, cageMat);
    coreGroup.add(cageLines);

    // Equatorial Accent Collar
    const collarGeo = new THREE.TorusGeometry(0.98, 0.032, 16, 64);
    collarGeo.rotateX(Math.PI / 2);
    const collarMat = new THREE.MeshPhysicalMaterial({
      color: preset.accentColor,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.9,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    coreGroup.add(collarMesh);

    // 2. Secondary Read: 3 Interlocking Gimbal Rings + Beveled Mounting Lugs
    const ringConfigs = [
      {
        radius: 1.56,
        tube: 0.04,
        tilt: [Math.PI / 5, 0.2, 0] as [number, number, number],
        title: '4+ Years Web Development',
        subtitle: 'Experience · End-to-end modern web engineering',
        targetSection: 'experience',
      },
      {
        radius: 1.92,
        tube: 0.036,
        tilt: [-Math.PI / 3.4, 0.45, 0.2] as [number, number, number],
        title: 'Junior Instructor at Multiple Academies',
        subtitle: 'Experience · Teaching & mentoring developers',
        targetSection: 'experience',
      },
      {
        radius: 2.28,
        tube: 0.032,
        tilt: [Math.PI / 2.2, -0.35, 0.4] as [number, number, number],
        title: 'Cybersecurity & IB Studies',
        subtitle: 'Continuing cybersecurity growth · IB student',
        targetSection: 'education',
      },
    ];

    const lugGeo = createBeveledLugGeometry();
    const ringGroups: {group: THREE.Group; baseTilt: [number, number, number]; speed: number}[] = [];
    const ringMaterials: THREE.MeshPhysicalMaterial[] = [];

    ringConfigs.forEach((cfg, idx) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(...cfg.tilt);
      sculptureRoot.add(rGroup);

      const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 18, 96);
      const rMat = new THREE.MeshPhysicalMaterial({
        color: preset.ringColor,
        metalness: preset.ringMetalness,
        roughness: preset.ringRoughness,
        clearcoat: 0.5,
      });
      ringMaterials.push(rMat);

      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.castShadow = !isSoftwareGl;
      rMesh.layers.enable(1);
      rGroup.add(rMesh);

      // Add 2 opposite beveled mounting lugs per ring for mechanical silhouette detail
      [-1, 1].forEach((dir) => {
        const lug = new THREE.Mesh(lugGeo, collarMat);
        lug.position.set(dir * cfg.radius, 0, 0);
        lug.rotation.z = Math.PI / 2;
        rGroup.add(lug);
      });

      interactables.push({
        selection: {
          kind: 'ring',
          title: cfg.title,
          subtitle: cfg.subtitle,
          targetSection: cfg.targetSection,
        },
        baseEmissive: 0x000000,
        material: rMat,
        mesh: rMesh,
      });

      ringGroups.push({
        group: rGroup,
        baseTilt: cfg.tilt,
        speed: (idx % 2 === 0 ? 1 : -1) * (0.16 + idx * 0.06),
      });
    });

    // 3. Accent Detail: 8 Orbiting Beveled Skill Prisms
    const skillOrbitGroup = new THREE.Group();
    sculptureRoot.add(skillOrbitGroup);

    const prismGeo = createSkillPrismGeometry();
    const stemGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8);
    const skillNodes: {
      holder: THREE.Group;
      prism: THREE.Mesh;
      mat: THREE.MeshPhysicalMaterial;
      angle: number;
      baseRadius: number;
      skillId: string;
    }[] = [];

    SKILLS.forEach((skill, idx) => {
      const angle = (idx / SKILLS.length) * Math.PI * 2;
      const baseRadius = 2.68;

      const holder = new THREE.Group();
      holder.position.set(Math.cos(angle) * baseRadius, 0, Math.sin(angle) * baseRadius);
      holder.lookAt(0, 0, 0);
      skillOrbitGroup.add(holder);

      const nodeMat = new THREE.MeshPhysicalMaterial({
        color: preset.nodeColor,
        metalness: preset.nodeMetalness,
        roughness: preset.nodeRoughness,
        clearcoat: 0.7,
      });

      const prism = new THREE.Mesh(prismGeo, nodeMat);
      prism.castShadow = !isSoftwareGl;
      prism.layers.enable(1);
      holder.add(prism);

      const stem = new THREE.Mesh(stemGeo, collarMat);
      stem.rotation.x = Math.PI / 2;
      stem.position.z = 0.24;
      holder.add(stem);

      interactables.push({
        selection: {
          kind: 'skill',
          title: skill.name,
          subtitle: `Skill · ${skill.category}`,
          targetSection: 'skills',
          skillId: skill.id,
        },
        baseEmissive: 0x000000,
        material: nodeMat,
        mesh: prism,
      });

      skillNodes.push({
        holder,
        prism,
        mat: nodeMat,
        angle,
        baseRadius,
        skillId: skill.id,
      });
    });

    // Theme & Finish updaters
    syncThemeFnRef.current = (isDark: boolean) => {
      const bgHex = isDark ? 0x111114 : 0xf2f0ea;
      scene.background = new THREE.Color(bgHex);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(bgHex);
      }
      const nextDial = createDialPlinthTexture(maxAniso, isDark);
      dialMat.map = nextDial;
      dialMat.needsUpdate = true;
      dialTexture.dispose();
      dialTexture = nextDial;
    };

    syncFinishFnRef.current = (id: FinishId) => {
      const next = FINISH_PRESETS[id];
      coreMat.color.setHex(next.coreColor);
      coreMat.roughness = next.coreRoughness;
      coreMat.metalness = next.coreMetalness;

      collarMat.color.setHex(next.accentColor);
      cageMat.color.setHex(next.accentColor);
      rimLight.color.setHex(next.accentColor);

      ringMaterials.forEach((m) => {
        m.color.setHex(next.ringColor);
        m.roughness = next.ringRoughness;
        m.metalness = next.ringMetalness;
      });

      skillNodes.forEach((n) => {
        n.mat.color.setHex(next.nodeColor);
        n.mat.roughness = next.nodeRoughness;
        n.mat.metalness = next.nodeMetalness;
      });
    };

    // Raycasting setup (throttled on pointermove)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let hoveredItem: InteractableData | null = null;
    let lastHoverCheck = 0;

    const getIntersections = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const targets = interactables.map((i) => i.mesh);
      return raycaster.intersectObjects(targets, false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 45) return;
      lastHoverCheck = now;

      const hits = getIntersections(e.clientX, e.clientY);
      if (hits.length > 0) {
        const hitMesh = hits[0].object;
        const found = interactables.find((i) => i.mesh === hitMesh) ?? null;
        if (found !== hoveredItem) {
          hoveredItem = found;
          renderer.domElement.style.cursor = found ? 'pointer' : 'grab';
        }
      } else if (hoveredItem !== null) {
        hoveredItem = null;
        renderer.domElement.style.cursor = 'grab';
      }
    };

    let pointerDownPos = {x: 0, y: 0};
    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = {x: e.clientX, y: e.clientY};
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (dx * dx + dy * dy > 36) return; // Ignore orbit drags

      const hits = getIntersections(e.clientX, e.clientY);
      if (hits.length > 0) {
        const found = interactables.find((i) => i.mesh === hits[0].object);
        if (found) {
          setActiveSelection(found.selection);
          onSelectRef.current(found.selection);
        }
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // WebGL Context Loss handling
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const onContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // ResizeObserver for crisp container responsiveness
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 720;
      const h = mount.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Animation loop with exponential damping & software-GL afterDraw pacing
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let currentExplode = 0;
    let elapsedAccum = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      if (!prefersReducedMotion) {
        elapsedAccum += delta;
      }

      // Smooth Exploded-View Layer Separation
      currentExplode = THREE.MathUtils.damp(
        currentExplode,
        explodeTargetRef.current,
        7.5,
        delta
      );

      // Smooth Camera Preset Transition
      if (cameraGoalRef.current) {
        const goal = cameraGoalRef.current;
        const alpha = 1 - Math.exp(-6.5 * delta);
        camera.position.lerp(goal.pos, alpha);
        controls.target.lerp(goal.target, alpha);
        if (
          _vec3A.copy(camera.position).distanceTo(goal.pos) < 0.02 &&
          _vec3B.copy(controls.target).distanceTo(goal.target) < 0.02
        ) {
          camera.position.copy(goal.pos);
          controls.target.copy(goal.target);
          cameraGoalRef.current = null;
        }
      }

      // Gentle Motion
      const shouldSpin = autoRotateRef.current && !prefersReducedMotion && !isSoftwareGl;
      if (shouldSpin) {
        coreGroup.rotation.y += delta * 0.28;
        cageLines.rotation.x -= delta * 0.14;
        skillOrbitGroup.rotation.y -= delta * 0.12;
      }

      // Explode translations + vertical bobbing
      coreGroup.position.y = currentExplode * 0.55 + (prefersReducedMotion ? 0 : Math.sin(elapsedAccum * 1.4) * 0.04);
      cageLines.scale.setScalar(1 + currentExplode * 0.25);

      ringGroups.forEach((rg, idx) => {
        if (shouldSpin) {
          rg.group.rotation.z += delta * rg.speed;
        }
        rg.group.position.y = (idx - 1) * currentExplode * 0.52;
        rg.group.scale.setScalar(1 + currentExplode * (0.06 * (idx + 1)));
      });

      const accentHex = FINISH_PRESETS[finishTargetRef.current].accentColor;

      skillNodes.forEach((node, idx) => {
        const targetRadius = node.baseRadius + currentExplode * 0.88;
        const waveY =
          (idx % 2 === 0 ? 1 : -1) * currentExplode * 0.32 +
          (prefersReducedMotion ? 0 : Math.sin(elapsedAccum * 1.8 + idx) * 0.06);
        node.holder.position.set(
          Math.cos(node.angle) * targetRadius,
          waveY,
          Math.sin(node.angle) * targetRadius
        );
        node.holder.lookAt(0, waveY * 0.5, 0);

        const isSelected = selectedSkillIdRef.current === node.skillId;
        const isHovered = hoveredItem?.mesh === node.prism;
        const targetScale = isSelected ? 1.32 : isHovered ? 1.18 : 1.0;
        const nextScale = THREE.MathUtils.damp(node.prism.scale.x, targetScale, 10, delta);
        node.prism.scale.setScalar(nextScale);
        node.mat.emissive.setHex(isSelected || isHovered ? accentHex : 0x000000);
        node.mat.emissiveIntensity = isSelected ? 0.55 : isHovered ? 0.35 : 0;
      });

      // Highlight core or rings on hover
      interactables.forEach((item) => {
        if (item.selection.kind !== 'skill') {
          const isHovered = hoveredItem === item;
          item.material.emissive.setHex(isHovered ? accentHex : 0x000000);
          item.material.emissiveIntensity = isHovered ? 0.3 : 0;
        }
      });

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      dialTexture.dispose();
      shadowTexture.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handlePresetClick = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    cameraGoalRef.current = {
      pos: new THREE.Vector3(...cfg.pos),
      target: new THREE.Vector3(...cfg.target),
    };
  };

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-zinc-900/15 bg-[#F2F0EA] sm:h-[500px] dark:border-zinc-800 dark:bg-[#111114] no-print">
      {webglUnavailable ? (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
          <svg
            width="84"
            height="84"
            viewBox="0 0 84 84"
            fill="none"
            aria-hidden="true"
            className="text-zinc-900 dark:text-zinc-100"
          >
            <circle cx="42" cy="42" r="36" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
            <polygon points="42,14 66,28 66,56 42,70 18,56 18,28" stroke="#E11D48" strokeWidth="1.5" fill="none" />
          </svg>
          <p className="mt-4 font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Interactive 3D Architecture
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            3D WebGL viewport unavailable in this browser context.
          </p>
        </div>
      ) : (
        <>
          {/* Dedicated isolated WebGL canvas container */}
          <div ref={canvasMountRef} className="h-full w-full" aria-label="Interactive 3D developer sculpture" />

          {/* Minimal Top-Left Spatial Inspector Label (No mid-screen occlusion, no backdrop-filter) */}
          <div className="pointer-events-none absolute left-4 top-4 right-4 flex items-start justify-between gap-3">
            <div className="pointer-events-auto max-w-xs rounded-xl border border-zinc-900/12 bg-white/95 px-3.5 py-2.5 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/95">
              <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {activeSelection?.kind === 'skill'
                  ? 'Skill Node'
                  : activeSelection?.kind === 'ring'
                    ? 'Focus Ring'
                    : 'Interactive 3D Stage'}
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {activeSelection?.title}
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                {activeSelection?.subtitle}
              </p>
              {activeSelection && activeSelection.targetSection !== 'about' && (
                <a
                  href={`#${activeSelection.targetSection}`}
                  className="mt-1.5 inline-block text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
                >
                  View in {activeSelection.targetSection} section →
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => handlePresetClick('overview')}
              title="Reset 3D camera"
              aria-label="Reset 3D camera"
              className="pointer-events-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-900/12 bg-white/95 text-zinc-700 shadow-sm transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-300 dark:hover:text-rose-400"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Unified Collapsible Bottom Control Dock (Zero backdrop-filter over WebGL) */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              aria-expanded={!dockCollapsed}
              className="pointer-events-auto mb-1.5 inline-flex items-center gap-1 rounded-md border border-zinc-900/12 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-xs transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-300"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3 w-3" aria-hidden="true" />
                  <span>Show 3D Controls</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  <span>Hide 3D Controls</span>
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="pointer-events-auto flex w-full max-w-xl flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-900/12 bg-white/95 px-3.5 py-2.5 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/95">
                {/* Exploded View Slider */}
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="whitespace-nowrap">Explode</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={explodeFactor}
                    onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                    aria-label="Exploded view layer separation"
                    className="h-1.5 w-20 cursor-pointer accent-rose-600"
                  />
                </label>

                {/* Material Finish Swatches */}
                <div className="flex items-center gap-1.5" role="group" aria-label="Material finish">
                  {(Object.keys(FINISH_PRESETS) as FinishId[]).map((id) => {
                    const f = FINISH_PRESETS[id];
                    const active = finishId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFinishId(id)}
                        title={`${f.label} finish`}
                        aria-label={`${f.label} finish`}
                        aria-pressed={active}
                        className={`h-6 w-6 rounded-md border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                          active
                            ? 'scale-110 border-rose-600 ring-2 ring-rose-600/30'
                            : 'border-zinc-400/60 hover:scale-105'
                        }`}
                        style={{backgroundColor: f.swatch}}
                      />
                    );
                  })}
                </div>

                {/* Camera Presets & Orbit Toggle */}
                <div className="flex items-center gap-1">
                  {(['overview', 'top', 'side'] as CameraPreset[]).map((preset) => {
                    const active = cameraPreset === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                          active
                            ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setAutoRotate((prev) => !prev)}
                    aria-pressed={autoRotate}
                    className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                      autoRotate
                        ? 'bg-rose-600 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Spin
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
