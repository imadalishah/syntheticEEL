// p5.js version, inspired by https://github.com/sofienkaabar/misc-files/blob/main/fireeel_animation.py
// Save as sketch.js and run in the p5.js editor

let x = [];
let k = [];
let e = [];
let d = [];
let m = [];

const total = 10000;
const frames = 96;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);

  // Precompute values
  for (let i = 0; i < total; i++) {
    let xv = i;
    let kv = 4 * cos(xv / 21);
    let ev = xv / 1880 - 20;
    let dv = sqrt(kv * kv + ev * ev);

    x.push(xv);
    k.push(kv);
    e.push(ev);
    d.push(dv);

    // Equivalent to UnitStep[k^2 - 15]
    m.push((kv * kv - 15) >= 0);
  }

  background(0);
}

function draw() {
  background(0);

  let t = TWO_PI * (frameCount % frames) / frames;

  // Blend white -> red using sin(t)^2
  let blend = pow(sin(t), 2);

  let mainR = 255;
  let mainG = 255 * (1 - blend);
  let mainB = 255 * (1 - blend);

  noStroke();

  for (let i = 0; i < total; i++) {

    let kv = k[i];

    // Prevent divide-by-zero
    if (abs(kv) < 1e-9) continue;

    let q =
      3 * sin(2 * kv) +
      0.3 / kv +
      kv *
        sin(x[i] / 4465) *
        (
          9 +
          2 * sin(14 * e[i] - 3 * d[i] + 2 * t)
        );

    let px = q + 50 * cos(d[i] - t) + 200;
    let py = 875 - q * sin(d[i] - t) - 39 * d[i];

    // Map matplotlib coordinates to canvas
    let sx = map(px, 100, 300, 0, width);
    let sy = map(py, 75, 320, height, 0);

    if (!isFinite(sx) || !isFinite(sy)) continue;

    if (m[i]) {
      fill(mainR, mainG, mainB, 128);
      circle(sx, sy, 3.5);
    } else {
      fill(255, 190);
      circle(sx, sy, 1.5);
    }
  }
}
