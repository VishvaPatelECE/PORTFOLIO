import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scanFrame } from "@/lib/models/intro";
import { NEUTRAL_FACE, boundFacePose, pointerFacePose, keyFacePose } from "@/lib/models/faceMotion";

export interface FaceController {
  startScan(): void;
  dispose(): void;
}

export async function createFace(
  host: HTMLElement,
  onPhase: (phase: string) => void,
  onDone: () => void,
  onError: () => void,
  signal: AbortSignal,
  onTransition: (morph: number, opening: number) => void,
): Promise<FaceController> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    onError();
    return { startScan: () => {}, dispose: () => {} };
  }
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5),
  );
  renderer.setClearColor(0x08070b, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const subject = new THREE.Group();
  scene.add(subject);
  const camera = new THREE.OrthographicCamera(-4, 4, 3.4, -3.4, 0.1, 50);
  camera.position.z = 12;
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  let frame = 0,
    disposed = false,
    running = false;
  let start = 0;
  let tick: (time: number) => void = () => {};
  let faceHalfWidth = 1.3;
  const fieldWidth = { value: camera.right };
  let target = { ...NEUTRAL_FACE }, pose = { ...NEUTRAL_FACE };
  let previousTime = 0, transitioning = false;
  let drag: { id: number; x: number; y: number; pose: typeof pose; pan: boolean } | null = null;
  function schedule() {
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(tick);
  }
  const move = (event: PointerEvent) => {
    if (transitioning) return;
    const rect = host.getBoundingClientRect();
    if (drag) {
      const dx = (event.clientX - drag.x) / rect.width;
      const dy = (event.clientY - drag.y) / rect.height;
      target = boundFacePose(drag.pan
        ? { ...drag.pose, x: drag.pose.x + dx * 2, y: drag.pose.y - dy * 1.5 }
        : { ...drag.pose, yaw: drag.pose.yaw + dx * 2, pitch: drag.pose.pitch + dy * 1.2 });
    } else if (event.pointerType !== "touch") {
      target = pointerFacePose((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
    }
    schedule();
  };
  const down = (event: PointerEvent) => {
    if (transitioning || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, pose: { ...target }, pan: event.shiftKey };
    host.setPointerCapture(event.pointerId);
    host.dataset.dragging = "true";
  };
  const up = () => {
    if (drag && host.hasPointerCapture(drag.id)) host.releasePointerCapture(drag.id);
    drag = null;
    delete host.dataset.dragging;
  };
  const reset = () => { target = { ...NEUTRAL_FACE }; schedule(); };
  const leave = () => { if (!drag) reset(); };
  const keyboard = (event: KeyboardEvent) => {
    if (transitioning || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    target = keyFacePose(target, event.key, event.shiftKey);
    pose = { ...target }; // Keyboard inspection is immediate.
    schedule();
  };
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("dblclick", reset);
  host.addEventListener("keydown", keyboard);
  const observer = new ResizeObserver(() => resize());
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h || disposed) return;
    const halfY = Math.max(2.3, ((faceHalfWidth + .3) * h) / w);
    camera.left = (-halfY * w) / h;
    camera.right = (halfY * w) / h;
    camera.top = halfY;
    camera.bottom = -halfY;
    camera.updateProjectionMatrix();
    fieldWidth.value = camera.right;
    renderer.setSize(w, h);
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  }
  observer.observe(host);
  resize();
  const lost = (event: Event) => {
    event.preventDefault();
    dispose();
    onError();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    up();
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("pointercancel", up);
    host.removeEventListener("pointerleave", leave);
    host.removeEventListener("dblclick", reset);
    host.removeEventListener("keydown", keyboard);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    signal.removeEventListener("abort", dispose);
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
  signal.addEventListener("abort", dispose, { once: true });
  const controller: FaceController = {
    dispose,
    startScan() {
      if (disposed || running) return;
      running = true;
      start = performance.now();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    },
  };
  function visibility() {
    cancelAnimationFrame(frame);
    if (!document.hidden && !disposed) frame = requestAnimationFrame(tick);
  }
  try {
    const response = await fetch("/face/head.glb", { signal });
    if (!response.ok) throw Error("Face unavailable");
    const gltf = await new GLTFLoader().parseAsync(
      await response.arrayBuffer(),
      "",
    );
    let source: THREE.BufferGeometry | undefined;
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (!source) source = object.geometry.clone();
        object.geometry.dispose();
        const mats = Array.isArray(object.material)
          ? object.material
          : [object.material];
        mats.forEach((m: THREE.Material) => m.dispose());
      }
    });
    if (!source) throw Error("Mesh missing");
    if (disposed || signal.aborted) {
      source.dispose();
      dispose();
      return controller;
    }
    const geometry: THREE.BufferGeometry = source;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const center = box.getCenter(new THREE.Vector3());
    const scale = 5.2 / (box.max.y - box.min.y);
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(scale, scale, scale);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometries.push(geometry);
    const bounds = geometry.boundingBox!;
    // This supplied asset is a bust. Restrict the scan to its face, excluding
    // the neck/shoulders. These asset-specific landmarks use normalized mesh Y.
    const meshHeight = bounds.max.y - bounds.min.y;
    const originalChin = bounds.min.y + meshHeight * 0.43;
    const originalForehead = bounds.min.y + meshHeight * 0.96;
    const faceCenter = (originalChin + originalForehead) / 2;
    // Frame the actual face rather than zooming out to include the bust.
    geometry.translate(0, -faceCenter, 0);
    geometry.computeBoundingBox();
    const chinY = originalChin - faceCenter;
    const foreheadY = originalForehead - faceCenter;
    const positions = geometry.getAttribute("position");
    faceHalfWidth = .9;
    for (let i = 0; i < positions.count; i++) {
      if (positions.getY(i) >= chinY && positions.getY(i) <= foreheadY + .2)
        faceHalfWidth = Math.max(faceHalfWidth, Math.abs(positions.getX(i)));
    }
    resize();
    const uniforms = {
      uScan: { value: chinY },
      uReveal: { value: 0 },
      uMorph: { value: 0 },
      uOpening: { value: 0 },
      uFieldWidth: fieldWidth,
      uScanning: { value: 0 },
      uFaceHalfWidth: { value: faceHalfWidth },
      uScanCurve: { value: (foreheadY - chinY) * .09 },
    };
    // Both face layers share a curved sweep in subject space. Its raised sides
    // remain attached to the mesh while the visitor rotates or pans the face.
    const scanCurve = `uniform float uFaceHalfWidth,uScanCurve;float scanHeight(vec3 p){float x=clamp(p.x/uFaceHalfWidth,-1.,1.);return p.y-uScanCurve*x*x;}`;
    const vertex = `varying vec3 vPos; varying vec3 vNormal; void main(){vPos=position;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: `${scanCurve}varying vec3 vPos;varying vec3 vNormal;uniform float uScan,uReveal,uMorph,uScanning;void main(){float light=max(0.,dot(normalize(vNormal),normalize(vec3(-.5,.45,1.))));float rim=pow(1.-abs(normalize(vNormal).z),2.);float contour=1.-smoothstep(.015,.065,abs(fract(vPos.z*29.)-.5));float scanY=scanHeight(vPos);float band=exp(-abs(scanY-uScan)*24.)*uScanning;float processed=(1.-smoothstep(uScan-.08,uScan+.08,scanY))*uScanning;vec3 col=vec3(.008,.018,.022)+light*vec3(.07,.17,.19)+contour*vec3(.014,.045,.055)+contour*rim*vec3(.12,.5,.57)+rim*vec3(.26,.19,.10)+processed*vec3(.03,.11,.1)+band*vec3(.3,1.1,1.2);gl_FragColor=vec4(col,uReveal*(1.-smoothstep(0.,.6,uMorph)));}`,
    });
    materials.push(material);
    subject.add(new THREE.Mesh(geometry, material));
    // Dedicated, unindexed positions: triangle indices must not duplicate point draws.
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      geometry.getAttribute("position").clone(),
    );
    pointGeometry.setAttribute(
      "normal",
      geometry.getAttribute("normal").clone(),
    );
    geometries.push(pointGeometry);
    const flow = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const seed = Math.sin(i * 127.1 + 17) * 43758.5453;
      const unit = seed - Math.floor(seed);
      flow[i * 3] = unit * 2 - 1;
      flow[i * 3 + 1] = (i % 7 - 3) / 3;
      flow[i * 3 + 2] = (i % 43) / 43;
    }
    pointGeometry.setAttribute("aFlow", new THREE.BufferAttribute(flow, 3));
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `${scanCurve}attribute vec3 aFlow;uniform float uMorph,uOpening,uFieldWidth,uScan,uScanning;varying float vFade,vRim,vBand,vLane;void main(){float seed=fract(sin(dot(position,vec3(12.9898,78.233,37.719)))*43758.5453);vec3 ribbon=vec3(aFlow.x*uFieldWidth*1.4,aFlow.y*.65+sin(aFlow.x*4.+aFlow.y*2.)*.22,aFlow.z*.3);vec3 p=mix(position,ribbon,uMorph);p.y+=sin(seed*6.28+uMorph*4.)*.28*uMorph*(1.-uMorph);vRim=pow(1.-abs(normalize(normal).z),1.7);vBand=exp(-abs(scanHeight(position)-uScan)*25.)*uScanning;vLane=aFlow.y;vFade=(1.-smoothstep(.5,1.,uOpening))*(.35+seed*.65);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);gl_PointSize=1.8+vRim*.85+vBand*1.2+uMorph*1.3;}`,
      fragmentShader: `uniform float uMorph,uReveal;varying float vFade,vRim,vBand,vLane;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 face=mix(vec3(.15,.55,.72),vec3(.75,.95,1.),vRim*.7+vBand*.3);vec3 ribbon=mix(vec3(.72,.57,.35),vec3(.05,.55,.63),.5+.5*sin(vLane*5.));vec3 col=mix(face,ribbon,uMorph);float strength=mix(.15+vRim*.7+vBand*.75,.95,uMorph);gl_FragColor=vec4(col,vFade*uReveal*strength*(1.-d));}`,
    });
    materials.push(pointMaterial);
    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.frustumCulled = false; // Morph ribbons extend past the source face bounds.
    subject.add(points);
    // The scan glow is drawn by the face shaders and follows its silhouette.
    let previous = "";
    tick = (now) => {
      frame = 0;
      if (disposed || document.hidden) return;
      const state = scanFrame(running ? now - start : null);
      if (state.phase !== previous) {
        previous = state.phase;
        onPhase(state.phase);
      }
      uniforms.uScan.value = chinY + state.scan * (foreheadY - chinY);
      uniforms.uReveal.value = state.reveal;
      uniforms.uMorph.value = state.morph;
      uniforms.uOpening.value = state.opening;
      material.depthWrite = state.morph < .025;
      transitioning = state.morph > 0;
      if (transitioning) target = { ...NEUTRAL_FACE };
      const dt = previousTime ? Math.min(.05, (now - previousTime) / 1000) : 1 / 60;
      previousTime = now;
      const follow = 1 - Math.exp(-10 * dt);
      let unsettled = false;
      for (const key of ["yaw", "pitch", "x", "y"] as const) {
        pose[key] += (target[key] - pose[key]) * follow;
        unsettled ||= Math.abs(target[key] - pose[key]) > .0002;
      }
      subject.rotation.set(pose.pitch, pose.yaw, 0);
      subject.position.set(pose.x, pose.y - .38, 0);
      host.dataset.pose = `${pose.yaw.toFixed(3)},${pose.pitch.toFixed(3)},${pose.x.toFixed(3)},${pose.y.toFixed(3)}`;
      if (transitioning) onTransition(state.morph, state.opening);
      uniforms.uScanning.value =
        state.phase === "up" || state.phase === "down" ? 1 : 0;
      host.dataset.phase = state.phase;
      host.dataset.scan = state.scan.toFixed(3);
      renderer.render(scene, camera);
      if (state.done) {
        dispose();
        onDone();
        return;
      }
      if (running || unsettled) schedule();
    };
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(tick);
  } catch {
    dispose();
    if (!signal.aborted) onError();
  }
  return controller;
}
