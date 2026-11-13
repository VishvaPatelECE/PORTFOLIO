// Multi-color ThreeUI ignition shader tuned to VishvaProjects palette:
// Laboratory Gold (#b99d73), Warm Amber, Signal Cyan (#00aebd), and Ivory.
export const vertexShader = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
export const fragmentShader = `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_warp;
uniform float u_flash;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.07+vec2(13.1,5.7); a*=0.5; }
  return v;
}
void main(){
  vec2 sc = gl_FragCoord.xy / u_res;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float r = length(uv);
  float rr = max(r, 0.08);
  float a = atan(uv.y, uv.x);
  float t = u_time;
  vec3 col = vec3(0.012, 0.011, 0.015);

  // Dual-tone background haze (gold + cyan ambient depth)
  float hz = fbm(uv * 2.6 + vec2(t * 0.35, 1.7));
  vec3 hazeCol = mix(vec3(0.10, 0.06, 0.028), vec3(0.015, 0.055, 0.075), 0.5 + 0.5 * sin(t * 0.35));
  col += hazeCol * hz * (0.7 + 0.6 * u_warp);

  // Multi-color palette components
  vec3 cIvory = vec3(0.98, 0.95, 0.88);
  vec3 cGold  = vec3(0.85, 0.68, 0.42); // Laboratory Gold #b99d73
  vec3 cCyan  = vec3(0.0, 0.74, 0.82);  // Signal Cyan #00aebd
  vec3 cAmber = vec3(0.96, 0.58, 0.32); // Warm ignition spark

  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float ringN = 26.0 + fi * 9.0;
    vec2 sp = vec2((a / 6.28318 + 0.5) * ringN,
                   (0.3 + fi * 0.22) / rr + t * (2.0 + fi * 1.2));
    vec2 cell = floor(sp);
    vec2 f = fract(sp);
    float h = hash(cell + fi * 17.31);
    float on = step(0.68, h);
    vec2 c = vec2(0.2 + 0.6 * hash(cell + 4.7), 0.5);
    vec2 dlt = f - c;
    float sy = mix(130.0, 8.0, u_warp);
    float star = on * exp(-(dlt.x * dlt.x * 150.0 + dlt.y * dlt.y * sy));
    float tw = 0.7 + 0.3 * sin(h * 81.0 + t * 9.0);
    tw = mix(tw, 1.0, u_warp);

    // Multi-color star ray spectrum matching portfolio scheme
    vec3 sCol;
    if (h < 0.32) {
      sCol = mix(cIvory, cGold, h / 0.32);
    } else if (h < 0.65) {
      sCol = mix(cGold, cCyan, (h - 0.32) / 0.33);
    } else if (h < 0.86) {
      sCol = mix(cCyan, cIvory, (h - 0.65) / 0.21);
    } else {
      sCol = mix(cAmber, cGold, (h - 0.86) / 0.14);
    }

    float fade = smoothstep(0.02, 0.25, r);
    col += sCol * star * tw * fade * (1.1 + 0.7 * u_warp);
  }

  // Core warp glow: radiant warm ivory/gold center fading to signal cyan corona
  vec3 warpCore = mix(vec3(0.98, 0.88, 0.70), cCyan, smoothstep(0.02, 0.28, r));
  col += warpCore * u_warp * 0.36 * exp(-r * 3.8);

  vec2 e = sc * (1.0 - sc);
  col *= 0.3 + 0.7 * pow(e.x * e.y * 16.0, 0.3);
  col = mix(col, vec3(0.98, 0.96, 0.92), clamp(u_flash, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;
