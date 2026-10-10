import * as THREE from "three";
import { writeSignalTube } from "@/lib/models/signalTube";

export type SignalTubesController = { dispose: () => void };

/** Original signal-tube field. No imported cursor component, postprocessing or autonomous loop. */
export function createSignalTubes(canvas: HTMLCanvasElement, onUnavailable: () => void): SignalTubesController {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(.85);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 1500);
  camera.position.z = 700;
  const count = 65, sides = 8;
  const indices = new Uint16Array((count - 1) * sides * 6);
  for (let i = 0, n = 0; i < count - 1; i++) for (let j = 0; j < sides; j++) {
    const a = i * (sides + 1) + j, b = a + sides + 1;
    indices.set([a, a + 1, b, b, a + 1, b + 1], n); n += 6;
  }
  const materials: THREE.ShaderMaterial[] = [];
  const strands = [0xb99d73, 0x00aebd, 0xd5c6a9].map((color, strand) => {
    const points = new Float32Array(count * 3), positions = new Float32Array(count * (sides + 1) * 3), normals = new Float32Array(positions.length);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    for (const halo of [true, false]) {
      const material = new THREE.ShaderMaterial({
        transparent: true, depthWrite: !halo, blending: halo ? THREE.AdditiveBlending : THREE.NormalBlending,
        uniforms: { tint: { value: new THREE.Color(color) }, expansion: { value: halo ? 8 : 0 }, halo: { value: halo ? 1 : 0 } },
        vertexShader: "uniform float expansion; varying vec3 n; void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*expansion,1.);}",
        fragmentShader: `uniform vec3 tint; uniform float halo; varying vec3 n;
          void main(){vec3 normal=normalize(n);float front=abs(normal.z);float light=pow(max(0.,dot(normal,normalize(vec3(-.5,.8,1.)))),18.);
          vec3 color=tint*(.45+front*.9)+vec3(.65)*light;float alpha=mix(.9,.07*pow(front,2.),halo);gl_FragColor=vec4(color,alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          }`,
      });
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material); mesh.frustumCulled = false; mesh.renderOrder = halo ? 0 : 1; scene.add(mesh);
    }
    return { geometry, points, positions, normals, strand };
  });
  let width = 1, height = 1, raf = 0, disposed = false, lastFrame = 0, lastInput = 0;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, targetScroll = 0, currentScroll = 0;
  const update = () => {
    strands.forEach(({ geometry, points, positions, normals, strand }) => {
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1), arc = Math.sin(t * Math.PI), phase = strand * .22 + currentScroll;
        points[i * 3] = (t - .5) * width * 1.34 + currentX * width * .24 * arc;
        points[i * 3 + 1] = Math.sin(t * Math.PI * 2 + phase) * height * .28 + currentY * height * .32 * arc + (strand - 1) * 17;
        points[i * 3 + 2] = Math.cos(t * Math.PI * 3 + phase) * 48 + strand * 12;
      }
      writeSignalTube(points, strand === 1 ? 3.6 : 2.5, positions, normals, sides);
      geometry.attributes.position.needsUpdate = true; geometry.attributes.normal.needsUpdate = true;
    });
  };
  const render = (now: number) => {
    raf = 0;
    if (disposed || document.hidden) return;
    if (now - lastFrame < 1000 / 30) { raf = requestAnimationFrame(render); return; }
    const dt = Math.min(.06, (now - lastFrame) / 1000); lastFrame = now;
    const follow = 1 - Math.exp(-6 * dt);
    currentX += (targetX - currentX) * follow; currentY += (targetY - currentY) * follow; currentScroll += (targetScroll - currentScroll) * follow;
    update(); renderer.render(scene, camera);
    if (now - lastInput < 1600) raf = requestAnimationFrame(render);
  };
  const wake = () => { if (!disposed && !raf && !document.hidden) { lastFrame = performance.now() - 34; raf = requestAnimationFrame(render); } };
  const input = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (event.clientY < rect.top || event.clientY > rect.bottom) return;
    targetX = (event.clientX - rect.left) / rect.width * 2 - 1;
    targetY = 1 - (event.clientY - rect.top) / rect.height * 2;
    lastInput = performance.now(); wake();
  };
  const scroll = () => { targetScroll = window.scrollY / height; lastInput = performance.now(); wake(); };
  const resize = () => {
    width = canvas.clientWidth; height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(Math.min(width, 1700), height, false);
    camera.left = -width / 2; camera.right = width / 2; camera.top = height / 2; camera.bottom = -height / 2; camera.updateProjectionMatrix();
    lastInput = performance.now(); wake();
  };
  const lost = (event: Event) => { event.preventDefault(); dispose(); onUnavailable(); };
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  canvas.addEventListener("webglcontextlost", lost);
  window.addEventListener("pointermove", input, { passive: true });
  window.addEventListener("scroll", scroll, { passive: true });
  function dispose() {
    if (disposed) return; disposed = true; cancelAnimationFrame(raf); observer.disconnect();
    window.removeEventListener("pointermove", input); window.removeEventListener("scroll", scroll); canvas.removeEventListener("webglcontextlost", lost);
    strands.forEach(strand => strand.geometry.dispose()); materials.forEach(material => material.dispose());
    // This canvas is reused after pause/visibility changes. Release the renderer
    // resources without explicitly losing its context; removal releases the canvas.
    renderer.dispose();
  }
  resize();
  return { dispose };
}
