// Licence CC BY-NC-SA 4.0
// Attribution — You must give appropriate credit.
// Non Commercial — You may not use the material for commercial purposes.
import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"

// Tubes locked to constant portfolio color scheme: Laboratory Gold, Signal Cyan, Ivory
const app = TubesCursor(document.getElementById('canvas'), {
  tubes: {
    colors: ["#b99d73", "#00aebd", "#e8e0d2"],
    lights: {
      intensity: 200,
      colors: ["#b99d73", "#00aebd", "#d5c6a9", "#60aed5"]
    }
  }
})

if (app?.three?.renderer) {
  app.three.renderer.setClearColor(0x08070b, 1);
}
