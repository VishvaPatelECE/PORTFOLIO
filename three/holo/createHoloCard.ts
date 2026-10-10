import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { identityCard } from "@/lib/content/identity";

export interface HoloController {
  setPaused(paused: boolean): void;
  setFlipped(flipped: boolean): void;
  reset(): void;
  dispose(): void;
}

// Original foil card study guided by Ashen One. No protected source or assets.
export function createHoloCard(
  canvas: HTMLCanvasElement,
  onUnavailable: () => void,
): HoloController {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.6),
  );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 8.3);
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.AmbientLight(0xc8dadd, 1.2));
  const key = new THREE.DirectionalLight(0xffd6a0, 4);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x68e5f2, 4);
  rim.position.set(4, 0, 2);
  scene.add(rim);
  const card = new THREE.Group();
  scene.add(card);
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111719,
    metalness: 0.95,
    roughness: 0.19,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [200, 500],
  });
  card.add(
    new THREE.Mesh(
      new RoundedBoxGeometry(3.5, 4.5, 0.12, 4, 0.06),
      bodyMaterial,
    ),
  );
  const border = new THREE.Mesh(
    new RoundedBoxGeometry(3.53, 4.53, 0.075, 3, 0.055),
    new THREE.MeshPhysicalMaterial({
      color: 0xc6a565,
      metalness: 1,
      roughness: 0.23,
    }),
  );
  border.position.z = -0.035;
  card.add(border);
  const paper = document.createElement("canvas");
  paper.width = 1024;
  paper.height = 1320;
  const context = paper.getContext("2d")!;
  const ink = new THREE.CanvasTexture(paper);
  ink.colorSpace = THREE.SRGBColorSpace;
  ink.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const foil = new THREE.ShaderMaterial({
    uniforms: {
      ink: { value: ink },
      time: { value: 0 },
      lightAngle: { value: new THREE.Vector2() },
    },
    vertexShader: `varying vec2 uvCard; void main(){uvCard=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `precision highp float;
      uniform sampler2D ink; uniform float time; uniform vec2 lightAngle; varying vec2 uvCard;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 q=abs(uvCard-.5)-vec2(.476,.482)+.017;
        if(length(max(q,0.))+min(max(q.x,q.y),0.)-.017>0.)discard;
        float rake=uvCard.x*.7+uvCard.y*.55+lightAngle.x*.32-lightAngle.y*.4;
        float bands=pow(.5+.5*sin(rake*42.+time*.3),12.);
        float foilLine=pow(.5+.5*sin((uvCard.x+uvCard.y*.25)*470.+lightAngle.x*11.),26.);
        float shimmer=pow(hash(floor(uvCard*vec2(460.,590.))),48.);
        float sweep=exp(-pow((rake-.49-lightAngle.x*.35)*3.6,2.));
        vec3 diffraction=mix(vec3(.68,.44,.17),vec3(.08,.50,.58),.5+.5*sin(rake*17.+lightAngle.x*5.));
        vec3 color=vec3(.023,.035,.042)+diffraction*(bands*.31+foilLine*.10+sweep*.07)+shimmer*diffraction*.8;
        vec4 print=texture2D(ink,uvCard);
        color=mix(color,print.rgb*(.85+sweep*.6)+diffraction*bands*.2,print.a);
        color+=smoothstep(.475,.495,max(abs(uvCard.x-.5),abs(uvCard.y-.5)))*diffraction*.8;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(3.49, 4.49), foil);
  front.position.z = 0.071;
  card.add(front);
  const backPaper = document.createElement("canvas");
  backPaper.width = 1024;
  backPaper.height = 1320;
  const backInk = new THREE.CanvasTexture(backPaper);
  backInk.colorSpace = THREE.SRGBColorSpace;
  const backMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8ea3a6,
    map: backInk,
    metalness: 0.4,
    roughness: 0.38,
    clearcoat: 1,
  });
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(3.43, 4.43),
    backMaterial,
  );
  back.position.z = -0.08;
  back.rotation.y = Math.PI;
  card.add(back);
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
  const circle = (x: number, y: number, r: number) => {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.stroke();
  };
  const label = (text: string, x: number, y: number, size = 25) => {
    context.font = `400 ${size}px "Recursive Variable", monospace`;
    context.fillText(text, x, y);
  };
  const paint = () => {
    const model = identityCard;
    context.clearRect(0, 0, 1024, 1320);
    context.textAlign = "left";
    context.fillStyle = "#ead9b8";
    context.strokeStyle = "#9c875d";
    context.lineWidth = 2;
    context.strokeRect(55, 55, 914, 1210);
    line(55, 190, 969, 190);
    line(55, 1080, 969, 1080);
    label("VISHVA / PATEL", 95, 118, 26);
    label("ENGINEERING / PORTFOLIO", 95, 159, 18);
    context.font = '470 82px "Anybody Variable", sans-serif';
    context.fillText(model.name, 95, 305);
    context.fillStyle = "#91b9be";
    label(model.field, 95, 350, 23);
    context.strokeStyle = "#629fa3";
    context.lineWidth = 2;
    for (const radius of [100, 150, 208, 255]) circle(512, 650, radius);
    context.save();
    context.setLineDash([7, 20]);
    circle(512, 650, 278);
    context.restore();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      line(512 + Math.cos(angle) * 235, 650 + Math.sin(angle) * 235,
        512 + Math.cos(angle) * 265, 650 + Math.sin(angle) * 265);
    }
    context.fillStyle = "#eee7d9";
    context.textAlign = "center";
    context.font = '460 150px "Anybody Variable", sans-serif';
    context.fillText("VP", 512, 700);
    context.textAlign = "left";
    context.fillStyle = "#d9c9ad";
    label(model.description, 95, 1000, 25);
    context.fillStyle = "#729ca2";
    label("EMBEDDED / INTELLIGENT SYSTEMS", 95, 1142, 22);
    context.fillStyle = "#d2bf97";
    label("ENGINEERING WITH INTENT", 95, 1192, 20);
    label("V / P", 95, 1243, 25);
    context.textAlign = "right";
    label("EXPLORE THE WORK", 925, 1243, 20);
    ink.needsUpdate = true;
    const ctx = backPaper.getContext("2d")!;
    ctx.fillStyle = "#0b151b";
    ctx.fillRect(0, 0, 1024, 1320);
    ctx.strokeStyle = "#8d7953";
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 914, 1210);
    ctx.fillStyle = "#e8e0d2";
    ctx.font = '460 76px "Anybody Variable", sans-serif';
    ctx.fillText(model.name, 95, 190);
    model.stages.forEach((stage, i) => {
      const y = 405 + i * 157;
      ctx.font = '400 32px "Recursive Variable", monospace';
      ctx.fillStyle = "#c8b391";
      ctx.fillText(String(i + 1).padStart(2, "0"), 95, y - 5);
      ctx.font = '500 88px "Recursive Variable", monospace';
      ctx.fillStyle = "#e8e0d2";
      ctx.fillText(stage, 185, y);
      if (i < model.stages.length - 1) {
        ctx.beginPath();
        ctx.moveTo(205, y + 34);
        ctx.lineTo(910, y + 34);
        ctx.stroke();
      }
    });
    ctx.font = '400 24px "Recursive Variable", monospace';
    ctx.fillStyle = "#c8b391";
    ctx.fillText("ENGINEERING WITH INTENT", 95, 1210);
    backInk.needsUpdate = true;
    canvas.dataset.artifact = "identity";
  };
  let disposed = false,
    visible = true,
    paused = false,
    flipped = false,
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0,
    last = 0,
    elapsed = 0,
    yaw = -0.22,
    pitch = 0.08,
    targetYaw = -0.22,
    targetPitch = 0.08,
    flipAngle = 0;
  const render = (now: number) => {
    raf = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    if (!paused && !reduced) elapsed += dt;
    const follow = paused || reduced ? 1 : 1 - Math.exp(-7 * dt);
    yaw += (targetYaw - yaw) * follow;
    pitch += (targetPitch - pitch) * follow;
    flipAngle += ((flipped ? Math.PI : 0) - flipAngle) * follow;
    card.rotation.set(pitch, yaw + flipAngle, 0.015);
    card.position.y = paused || reduced ? 0 : Math.sin(elapsed * 0.65) * 0.045;
    foil.uniforms.time.value = elapsed;
    foil.uniforms.lightAngle.value.set(yaw, pitch);
    renderer.render(scene, camera);
    if (!paused && !reduced) raf = requestAnimationFrame(render);
  };
  const schedule = () => {
    if (!raf && !disposed) {
      last = 0;
      raf = requestAnimationFrame(render);
    }
  };
  const resize = () => {
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    schedule();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    raf = 0;
    schedule();
  });
  intersection.observe(canvas);
  const pointer = (event: PointerEvent) => {
    if (event.pointerType === "touch" || reduced) return;
    const rect = canvas.getBoundingClientRect();
    targetYaw =
      -0.22 + ((event.clientX - rect.left - rect.width / 2) / rect.width) * 0.5;
    targetPitch =
      0.08 + ((event.clientY - rect.top - rect.height / 2) / rect.height) * 0.3;
    schedule();
  };
  const leave = () => {
    targetYaw = -0.22;
    targetPitch = 0.08;
    schedule();
  };
  const keydown = (event: KeyboardEvent) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    if (event.key === "Home") leave();
    else {
      targetYaw = THREE.MathUtils.clamp(
        targetYaw +
          (event.key === "ArrowLeft"
            ? -0.08
            : event.key === "ArrowRight"
              ? 0.08
              : 0),
        -0.5,
        0.5,
      );
      targetPitch = THREE.MathUtils.clamp(
        targetPitch +
          (event.key === "ArrowUp"
            ? -0.05
            : event.key === "ArrowDown"
              ? 0.05
              : 0),
        -0.28,
        0.28,
      );
      schedule();
    }
  };
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const preference = () => {
    reduced = media.matches;
    cancelAnimationFrame(raf);
    raf = 0;
    leave();
  };
  const visibility = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    schedule();
  };
  const lost = (event: Event) => {
    event.preventDefault();
    dispose();
    onUnavailable();
  };
  canvas.addEventListener("pointermove", pointer);
  canvas.addEventListener("pointerleave", leave);
  canvas.addEventListener("keydown", keydown);
  canvas.addEventListener("webglcontextlost", lost);
  media.addEventListener("change", preference);
  document.addEventListener("visibilitychange", visibility);
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    intersection.disconnect();
    canvas.removeEventListener("pointermove", pointer);
    canvas.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("keydown", keydown);
    canvas.removeEventListener("webglcontextlost", lost);
    media.removeEventListener("change", preference);
    document.removeEventListener("visibilitychange", visibility);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    ink.dispose();
    backInk.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }
  paint();
  resize();
  schedule();
  return {
    setPaused: (value) => {
      paused = value;
      cancelAnimationFrame(raf);
      raf = 0;
      schedule();
    },
    setFlipped: (value) => {
      flipped = value;
      schedule();
    },
    reset: leave,
    dispose,
  };
}
