import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { runPipeline } from "@/lib/rangraph";

export type AssemblyController = {
  select: (system: number, stage: number) => void;
  pause: (value: boolean) => void;
  reset: () => void;
  dispose: () => void;
};

// Authored architecture sculptures, informed by ThreeUI's visible material and
// lighting references. This is original procedural geometry, not a hardware scan.
export function createAssembly(
  host: HTMLElement,
  onUnavailable?: () => void,
): AssemblyController {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.6),
  );
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(5.2, 4.4, 7.5);
  camera.lookAt(0, 0.05, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentScene = new RoomEnvironment();
  const environment = pmrem.fromScene(environmentScene, 0.04);
  environmentScene.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.7;
  const root = new THREE.Group();
  root.rotation.y = -0.1;
  scene.add(root);
  scene.add(new THREE.HemisphereLight(0xc4e3f4, 0x1c2228, 1.2));
  const cyanLight = new THREE.PointLight(0x4de8ed, 20, 12);
  cyanLight.position.set(-3, 1.2, 2);
  scene.add(cyanLight);
  const goldLight = new THREE.PointLight(0xe6b46c, 30, 12);
  goldLight.position.set(3, 3, -3);
  scene.add(goldLight);
  const keyLight = new THREE.DirectionalLight(0xf6eee3, 3);
  keyLight.position.set(1, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const textures: THREE.Texture[] = [];
  const keepGeometry = <T extends THREE.BufferGeometry>(g: T) => {
    geometries.push(g);
    return g;
  };
  const keepMaterial = <T extends THREE.Material>(m: T) => {
    materials.push(m);
    return m;
  };
  const metal = keepMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0x8e9b9c,
      metalness: 1,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
    }),
  );
  const gold = keepMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xb99d73,
      metalness: 0.92,
      roughness: 0.26,
    }),
  );
  const dark = keepMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0x091018,
      metalness: 0.45,
      roughness: 0.32,
      clearcoat: 1,
    }),
  );
  const glass = keepMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0x7be7e6,
      metalness: 0.16,
      roughness: 0.05,
      transmission: 0.75,
      thickness: 0.65,
      transparent: true,
      opacity: 0.8,
      ior: 1.45,
      iridescence: 1,
      iridescenceIOR: 1.2,
    }),
  );
  const signal = keepMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x36d8e1,
      emissive: 0x0aafb9,
      emissiveIntensity: 2.1,
      metalness: 0.35,
      roughness: 0.24,
    }),
  );
  const traceMaterial = keepMaterial(
    new THREE.MeshBasicMaterial({
      color: 0x24656e,
      transparent: true,
      opacity: 0.65,
    }),
  );
  const activeTrace = keepMaterial(
    new THREE.MeshBasicMaterial({
      color: 0x72f0ef,
      transparent: true,
      opacity: 0.86,
    }),
  );
  function mesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Group,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(x, y, z);
    parent.add(obj);
    return obj;
  }
  const board = new THREE.Group();
  root.add(board);
  mesh(
    keepGeometry(new RoundedBoxGeometry(4.3, 0.14, 3.5, 4, 0.12)),
    dark,
    board,
    0,
    -0.9,
    0,
  );
  mesh(
    keepGeometry(new RoundedBoxGeometry(4.36, 0.05, 3.56, 3, 0.12)),
    gold,
    board,
    0,
    -1,
    0,
  );
  const pinGeometry = keepGeometry(new THREE.BoxGeometry(0.085, 0.075, 0.26));
  const pins = new THREE.InstancedMesh(pinGeometry, gold, 64);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 64; i++) {
    const side = Math.floor(i / 16),
      along = ((i % 16) - 7.5) * 0.24;
    matrix.makeRotationY((side * Math.PI) / 2);
    matrix.setPosition(
      side === 0 ? along : side === 1 ? 2.18 : side === 2 ? along : -2.18,
      -0.85,
      side === 0 ? 1.78 : side === 2 ? -1.78 : along * 0.78,
    );
    pins.setMatrixAt(i, matrix);
  }
  board.add(pins);
  const screwGeometry = keepGeometry(
    new THREE.CylinderGeometry(0.08, 0.08, 0.07, 16),
  );
  for (const x of [-1.96, 1.96])
    for (const z of [-1.5, 1.5]) mesh(screwGeometry, metal, board, x, -0.8, z);
  const circuits: THREE.Line[] = [];
  for (let i = 0; i < 22; i++) {
    const side = i % 2 ? 1 : -1;
    const z = (i / 2 - 5) * 0.25;
    const geo = keepGeometry(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(side * 0.7, -0.815, z * 0.55),
        new THREE.Vector3(side * 1.05, -0.815, z * 0.55),
        new THREE.Vector3(side * 1.35, -0.815, z),
        new THREE.Vector3(side * 2.08, -0.815, z),
      ]),
    );
    const line = new THREE.Line(geo, traceMaterial);
    circuits.push(line);
    board.add(line);
  }
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 1024;
  labelCanvas.height = 256;
  const ctx = labelCanvas.getContext("2d")!;
  ctx.fillStyle = "#a8b9bc";
  ctx.font = "24px monospace";
  ctx.fillText("VISHVA / SYSTEM DESIGN", 40, 70);
  ctx.fillStyle = "#5c797f";
  ctx.font = "18px monospace";
  ctx.fillText("ARCHITECTURE SCHEMATIC", 40, 105);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  textures.push(labelTexture);
  const label = mesh(
    keepGeometry(new THREE.PlaneGeometry(2.7, 0.68)),
    keepMaterial(
      new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        depthWrite: false,
      }),
    ),
    board,
    0,
    -0.806,
    1.05,
  );
  label.rotation.x = -Math.PI / 2;
  const systems = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
  systems.forEach((g) => root.add(g));
  // Optical acquisition: machined barrel, aperture blades, coated lens, focus rails.
  const optic = systems[0];
  const barrel = mesh(
    keepGeometry(new THREE.CylinderGeometry(1.05, 1.17, 0.58, 64)),
    dark,
    optic,
    0,
    -0.42,
    0,
  );
  const ringGeometry = keepGeometry(
    new THREE.TorusGeometry(1.05, 0.075, 12, 80),
  );
  for (let i = 0; i < 4; i++) {
    const ring = mesh(
      ringGeometry,
      i === 1 ? gold : metal,
      optic,
      0,
      -0.18 + i * 0.13,
      0,
    );
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(1 - i * 0.055);
  }
  const frontLens = mesh(
    keepGeometry(
      new THREE.SphereGeometry(0.91, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    ),
    glass,
    optic,
    0,
    0.25,
    0,
  );
  frontLens.scale.y = 0.2;
  mesh(
    keepGeometry(new THREE.CylinderGeometry(0.78, 0.78, 0.035, 64)),
    dark,
    optic,
    0,
    0.29,
    0,
  );
  const aperture = new THREE.Group();
  optic.add(aperture);
  aperture.position.y = 0.34;
  const bladeGeometry = keepGeometry(new THREE.BoxGeometry(0.39, 0.023, 0.54));
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const blade = mesh(
      bladeGeometry,
      metal,
      aperture,
      Math.cos(a) * 0.36,
      0,
      Math.sin(a) * 0.36,
    );
    blade.rotation.y = -a + 0.6;
  }
  mesh(
    keepGeometry(new THREE.CylinderGeometry(0.29, 0.29, 0.025, 40)),
    signal,
    optic,
    0,
    0.355,
    0,
  );
  const wafer = mesh(
    keepGeometry(new RoundedBoxGeometry(2.8, 0.035, 2.35, 3, 0.08)),
    glass,
    optic,
    0,
    0.82,
    0,
  );
  const waferEdge = new THREE.LineSegments(
    keepGeometry(new THREE.EdgesGeometry(wafer.geometry)),
    keepMaterial(
      new THREE.LineBasicMaterial({
        color: 0x7bd2cf,
        transparent: true,
        opacity: 0.55,
      }),
    ),
  );
  wafer.add(waferEdge);
  for (const x of [-1.28, 1.28])
    for (const z of [-1, 1])
      mesh(
        keepGeometry(new THREE.CylinderGeometry(0.026, 0.026, 1.65, 12)),
        metal,
        optic,
        x,
        -0.08,
        z,
      );
  const frameShape = new THREE.Shape();
  frameShape.moveTo(-1.22, -1.02);
  frameShape.lineTo(1.22, -1.02);
  frameShape.lineTo(1.22, 1.02);
  frameShape.lineTo(-1.22, 1.02);
  frameShape.closePath();
  const frameHole = new THREE.Path();
  frameHole.moveTo(-0.99, -0.78);
  frameHole.lineTo(-0.99, 0.78);
  frameHole.lineTo(0.99, 0.78);
  frameHole.lineTo(0.99, -0.78);
  frameHole.closePath();
  frameShape.holes.push(frameHole);
  const scanPlate = mesh(
    keepGeometry(
      new THREE.ExtrudeGeometry(frameShape, {
        depth: 0.045,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.025,
        bevelThickness: 0.02,
        steps: 1,
      }),
    ),
    metal,
    optic,
    0,
    1.34,
    0,
  );
  scanPlate.rotation.x = -Math.PI / 2;
  // CPU/interlock sculpture with physical pin geometry and a die under glass.
  const logic = systems[1];
  mesh(
    keepGeometry(new RoundedBoxGeometry(2.35, 0.38, 2.35, 4, 0.12)),
    dark,
    logic,
    0,
    -0.35,
    0,
  );
  mesh(
    keepGeometry(new RoundedBoxGeometry(1.9, 0.14, 1.9, 4, 0.12)),
    metal,
    logic,
    0,
    -0.05,
    0,
  );
  const die = mesh(
    keepGeometry(new RoundedBoxGeometry(1.27, 0.09, 1.27, 4, 0.07)),
    signal,
    logic,
    0,
    0.28,
    0,
  );
  for (let i = 0; i < 12; i++) {
    for (let s = 0; s < 4; s++) {
      const lead = mesh(
        pinGeometry,
        gold,
        logic,
        s % 2 ? (s === 1 ? 1.28 : -1.28) : (i - 5.5) * 0.17,
        -0.35,
        s % 2 ? (i - 5.5) * 0.17 : s === 0 ? 1.28 : -1.28,
      );
      lead.rotation.y = s % 2 ? Math.PI / 2 : 0;
    }
  }
  mesh(
    keepGeometry(new RoundedBoxGeometry(2.2, 0.08, 2.2, 4, 0.1)),
    glass,
    logic,
    0,
    0.82,
    0,
  );
  const dieLines = keepGeometry(new THREE.BufferGeometry());
  const dieSegments: THREE.Vector3[] = [];
  for (let i = 0; i < 9; i++) {
    const p = (i - 4) * 0.13;
    dieSegments.push(
      new THREE.Vector3(-0.54, 0.331, p),
      new THREE.Vector3(0.54, 0.331, p),
      new THREE.Vector3(p, 0.331, -0.54),
      new THREE.Vector3(p, 0.331, 0.54),
    );
  }
  dieLines.setFromPoints(dieSegments);
  logic.add(
    new THREE.LineSegments(
      dieLines,
      keepMaterial(new THREE.LineBasicMaterial({ color: 0x081821 })),
    ),
  );
  // All wireless edges below are derived from the actual first-timestep fixture.
  const wireless = systems[2];
  const fixture = runPipeline().sequence.graphs[0];
  const points: Record<string, THREE.Vector3> = {
    "gnb-1": new THREE.Vector3(-0.9, 1.3, -0.45),
    "gnb-2": new THREE.Vector3(1.02, 1.05, -0.35),
    "ue-1": new THREE.Vector3(-1.4, -0.2, 0.7),
    "ue-2": new THREE.Vector3(0.05, 0.25, 0.9),
    "ue-3": new THREE.Vector3(1.45, -0.1, 0.65),
  };
  const wirelessNodes: THREE.Mesh[] = [];
  const crystalGeometry = keepGeometry(new THREE.OctahedronGeometry(0.34, 0));
  const receiverGeometry = keepGeometry(
    new RoundedBoxGeometry(0.32, 0.5, 0.22, 3, 0.05),
  );
  for (const node of fixture.nodes) {
    const p = points[node.key.entityId];
    const obj = mesh(
      node.key.nodeType === "gNB" ? crystalGeometry : receiverGeometry,
      node.key.nodeType === "gNB" ? gold : metal,
      wireless,
      p.x,
      p.y,
      p.z,
    );
    wirelessNodes.push(obj);
    const nodeCanvas = document.createElement("canvas");
    nodeCanvas.width = 256;
    nodeCanvas.height = 80;
    const nodeContext = nodeCanvas.getContext("2d")!;
    nodeContext.font = "30px monospace";
    nodeContext.fillStyle = "#d1e5e5";
    nodeContext.textAlign = "center";
    nodeContext.fillText(node.key.entityId, 128, 45);
    const nodeTexture = new THREE.CanvasTexture(nodeCanvas);
    textures.push(nodeTexture);
    const annotation = new THREE.Sprite(
      keepMaterial(
        new THREE.SpriteMaterial({
          map: nodeTexture,
          transparent: true,
          depthWrite: false,
        }),
      ),
    );
    annotation.position.set(p.x, p.y - 0.5, p.z);
    annotation.scale.set(0.95, 0.3, 1);
    wireless.add(annotation);
    const collar = mesh(
      keepGeometry(
        new THREE.TorusGeometry(
          node.key.nodeType === "gNB" ? 0.5 : 0.29,
          0.007,
          4,
          48,
        ),
      ),
      signal,
      wireless,
      p.x,
      p.y - 0.33,
      p.z,
    );
    collar.rotation.x = Math.PI / 2;
  }
  for (const edge of fixture.edges) {
    const geo = keepGeometry(
      new THREE.BufferGeometry().setFromPoints([
        points[edge.source.entityId],
        points[edge.target.entityId],
      ]),
    );
    wireless.add(new THREE.Line(geo, activeTrace));
  }
  const connection = keepGeometry(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.9, -0.78, 0.4),
      new THREE.Vector3(-1.5, -0.78, 0.4),
      new THREE.Vector3(-0.8, -0.78, 0),
      new THREE.Vector3(0.8, -0.78, 0),
      new THREE.Vector3(1.5, -0.78, -0.4),
      new THREE.Vector3(2.8, -0.78, -0.4),
    ]),
  );
  root.add(new THREE.Line(connection, activeTrace));
  const shadowPlane = mesh(
    keepGeometry(new THREE.PlaneGeometry(12, 10)),
    keepMaterial(new THREE.ShadowMaterial({ opacity: 0.4, color: 0x00050a })),
    root,
    0,
    -1.035,
    0,
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.receiveShadow = true;
  root.traverse((object) => {
    if (object instanceof THREE.Mesh && object !== shadowPlane) {
      object.castShadow = object.material !== glass;
      object.receiveShadow = object.material !== glass;
    }
  });
  const pulse = mesh(
    keepGeometry(new THREE.SphereGeometry(0.055, 12, 8)),
    signal,
    root,
  );
  const allNodes = systems;
  let stage = 0,
    paused = false,
    inView = true,
    disposed = false,
    frame = 0,
    elapsed = 0,
    lastTime = 0;
  let yaw = 0,
    pitch = 0,
    targetYaw = 0,
    targetPitch = 0,
    dragging = false,
    dragX = 0,
    dragY = 0;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = media.matches;
  function select(system: number, nextStage: number) {
    stage = nextStage;
    allNodes.forEach((g, i) => {
      g.visible = i === system;
    });
    circuits.forEach((c, i) => {
      c.material = i % 5 === nextStage ? activeTrace : traceMaterial;
    });
    host.dataset.system = String(system);
    host.dataset.stage = String(nextStage);
    const openness = stage * 0.1;
    wafer.position.y = 0.82 + openness;
    scanPlate.position.y = 1.34 + openness * 1.6;
    aperture.rotation.y = -stage * 0.12;
    barrel.material = stage === 0 ? dark : metal;
    frontLens.material = glass;
    die.material = stage >= 3 ? gold : signal;
    cyanLight.intensity = 15 + stage * 2;
    renderOnce();
    schedule();
  }
  function resize() {
    if (disposed) return;
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.position.set(5.2, 4.4, width < 550 ? 9.8 : 7.5);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderOnce();
  }
  function renderOnce() {
    if (disposed || document.hidden) return;
    renderer.render(scene, camera);
  }
  function schedule() {
    if (
      !disposed &&
      !frame &&
      inView &&
      !document.hidden &&
      ((!paused && !reduced) ||
        Math.abs(yaw - targetYaw) > 0.001 ||
        Math.abs(pitch - targetPitch) > 0.001)
    )
      frame = requestAnimationFrame(tick);
  }
  function tick(time: number) {
    frame = 0;
    if (disposed || !inView || document.hidden) {
      lastTime = 0;
      return;
    }
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.06) : 0;
    lastTime = time;
    if (!paused && !reduced) elapsed += delta;
    const lerp = reduced ? 1 : 0.12;
    yaw += (targetYaw - yaw) * lerp;
    pitch += (targetPitch - pitch) * lerp;
    root.rotation.y = -0.1 + yaw;
    root.rotation.x = pitch;
    wirelessNodes.forEach((m, i) => {
      m.rotation.y = i * 0.3;
    });
    const t = (elapsed * 0.27) % 1;
    pulse.position.set(
      -2.9 + t * 5.7,
      -0.76,
      t < 0.4 ? 0.4 : t > 0.6 ? -0.4 : 0.4 - (t - 0.4) * 4,
    );
    renderOnce();
    schedule();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) {
      lastTime = 0;
      schedule();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(host);
  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    schedule();
  };
  const preference = () => {
    reduced = media.matches;
    if (reduced) {
      targetPitch = 0;
      targetYaw = 0;
    }
    renderOnce();
    schedule();
  };
  const down = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || e.pointerType === "pen") {
      dragging = true;
      dragX = e.clientX;
      dragY = e.clientY;
      host.setPointerCapture(e.pointerId);
    }
  };
  const move = (e: PointerEvent) => {
    if (reduced) return;
    if (dragging) {
      targetYaw = THREE.MathUtils.clamp(
        targetYaw + (e.clientX - dragX) * 0.006,
        -1,
        1,
      );
      targetPitch = THREE.MathUtils.clamp(
        targetPitch + (e.clientY - dragY) * 0.003,
        -0.3,
        0.3,
      );
      dragX = e.clientX;
      dragY = e.clientY;
    } else if (e.pointerType === "mouse") {
      const box = host.getBoundingClientRect();
      targetYaw = ((e.clientX - box.left - box.width / 2) / box.width) * 0.22;
      targetPitch =
        ((e.clientY - box.top - box.height / 2) / box.height) * 0.08;
    }
    schedule();
  };
  const up = () => {
    dragging = false;
  };
  const leave = () => {
    if (!dragging) {
      targetYaw = 0;
      targetPitch = 0;
      schedule();
    }
  };
  const key = (e: KeyboardEvent) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        e.key,
      )
    )
      return;
    e.preventDefault();
    if (e.key === "Home") {
      targetYaw = 0;
      targetPitch = 0;
    } else if (e.key === "ArrowLeft") targetYaw -= 0.12;
    else if (e.key === "ArrowRight") targetYaw += 0.12;
    else if (e.key === "ArrowUp") targetPitch -= 0.06;
    else targetPitch += 0.06;
    targetYaw = THREE.MathUtils.clamp(targetYaw, -1, 1);
    targetPitch = THREE.MathUtils.clamp(targetPitch, -0.3, 0.3);
    yaw = targetYaw;
    pitch = targetPitch;
    root.rotation.set(pitch, -0.1 + yaw, 0);
    renderOnce();
  };
  const lost = () => {
    host.dataset.fallback = "true";
    dispose();
    onUnavailable?.();
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersection.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    media.removeEventListener("change", preference);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("pointercancel", up);
    host.removeEventListener("pointerleave", leave);
    host.removeEventListener("keydown", key);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    environment.dispose();
    keyLight.shadow.map?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }
  document.addEventListener("visibilitychange", visibility);
  media.addEventListener("change", preference);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("keydown", key);
  renderer.domElement.addEventListener("webglcontextlost", lost);
  select(0, 0);
  resize();
  schedule();
  return {
    select,
    pause(value) {
      paused = value;
      cancelAnimationFrame(frame);
      frame = 0;
      renderOnce();
      schedule();
    },
    reset() {
      targetPitch = 0;
      targetYaw = 0;
      if (reduced) {
        pitch = 0;
        yaw = 0;
        root.rotation.set(0, -0.1, 0);
        renderOnce();
      } else schedule();
    },
    dispose,
  };
}
