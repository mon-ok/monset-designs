// ---------------------------------------------------------------------------
// Every "feel" knob lives here. Because the exact framing depends on the model,
// most values are MULTIPLIERS applied to measured bounding boxes at runtime
// (see rig.js), not hard-coded world coordinates. Tweak, save, hot-reload.
// ---------------------------------------------------------------------------
export const CONFIG = {
  // Turn on to see the monitor screen rect + panel rects as wireframes, plus
  // axes. Use this to dial in the screen/panel `scale` + offsets by eye.
  DEBUG: false,

  scrollLengthVh: 320, // how much page scroll drives the intro zoom (bigger = slower)

  camera: { fov: 38, near: 0.01, far: 100 },

  // Fraction of the viewport HEIGHT the monitor should fill at the docked pose.
  // Brief asked for ~70%.
  screenFill: 0.7,

  // Wide/back "hero" shot of the whole desk at scroll = 0.
  hero: {
    distMul: 2.4, // dolly back, in units of scene depth
    heightMul: 0.55, // camera height above scene centre, in units of scene height
    lookHeightMul: 0.12,
  },

  // The monitor node reports its full bounding box (screen + bezel + stand).
  // These trim it down to just the glowing panel so framing + the HTML overlay
  // line up with the actual screen.
  screen: {
    widthFactor: 0.92,
    heightFactor: 0.6,
    yLift: 0.055, // raise the screen centre off the bbox centre (stand sits low)
    forward: 0.02, // push the HTML this far in front of the glass (units)
    htmlPx: [960, 600], // internal resolution of the on-screen UI div (px)
    scale: 1.0, // fine-tune overlay size vs the 3D screen (DEBUG to align)
  },

  // Glass "tech blocks" that fly out to the left of the monitor.
  panel: {
    side: -1, // -1 = left of monitor, +1 = right (flip if it lands wrong)
    offsetMul: 1.15, // how far out, in units of monitor width
    forward: 0.1, // pull slightly toward the viewer so it floats in front
    heightMul: 1.35, // panel height in units of monitor height
    aspect: 0.82, // width / height of the panel
    htmlPx: [720, 880],
    scale: 1.0,
    fill: 0.82, // fraction of viewport height the panel fills when framed
  },

  // Chair slides + turns out of the way as you zoom in. Vector is in units of
  // the chair's own size; applied in the model's local space.
  chair: {
    slide: [1.25, 0.0, 0.35], // +x = toward one side, +z = back
    turnY: 0.7, // radians of yaw at full zoom
  },

  // Damping (maath easing smoothTime, seconds). Lower = snappier.
  smooth: { camera: 0.55, look: 0.55, scroll: 0.12, chair: 0.25 },
};

// drei's <Html transform> renders content at worldSize = cssPx * groupScale / 40
// (the 400/10 constant inside drei). Use this to map a div's pixels onto a
// measured world rectangle: groupScale = worldWidth / cssPx * HTML_TRANSFORM_FACTOR.
export const HTML_TRANSFORM_FACTOR = 40;

// smootherstep — gives the intro dolly ease-in/ease-out without a lib.
export const ease = (x) => {
  x = Math.min(1, Math.max(0, x));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
