// p5.js version, inspired by https://github.com/sofienkaabar/misc-files/blob/main/fireeel_animation.py
// Save as sketch.js and run in the p5.js editor

// Interactive Control Panel
// 30% LEFT CONTROL PANEL
// 70% RIGHT ANIMATION

let x = [];
let k = [];
let e = [];
let d = [];
let m = [];

const total = 10000;
const frames = 96;

let controls = {};

let panelWidth;

function setup() {

  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);

  panelWidth = width * 0.30;

  createControls();

  buildData();
}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  panelWidth = width * 0.30;
}

function buildData() {

  x = [];
  k = [];
  e = [];
  d = [];
  m = [];

  for (let i = 0; i < total; i++) {

    let xv = i;

    let kv =
      controls.kAmp.value() *
      cos(xv / controls.kFreq.value());

    let ev =
      xv / controls.eDiv.value() -
      controls.eOffset.value();

    let dv = sqrt(kv * kv + ev * ev);

    x.push(xv);
    k.push(kv);
    e.push(ev);
    d.push(dv);

    m.push(
      (kv * kv - controls.threshold.value()) >= 0
    );
  }
}

function createControls() {

  let panel = createDiv();

  panel.position(0, 0);

  panel.style("width", "30vw");
  panel.style("height", "100vh");

  panel.style("overflow-y", "scroll");

  panel.style("background", "#0a0a0a");

  panel.style("padding", "20px");

  panel.style("box-sizing", "border-box");

  panel.style("border-right", "1px solid #333");

  panel.style("font-family", "monospace");

  panel.style("color", "white");

  let title = createElement(
    "h2",
    "CREATURE CONTROLS"
  );

  title.parent(panel);

  title.style("margin-bottom", "20px");

  function addSlider(name, min, max, val, step) {

    let wrapper = createDiv();

    wrapper.parent(panel);

    wrapper.style("margin-bottom", "18px");

    let label = createDiv();

    label.parent(wrapper);

    label.style("margin-bottom", "6px");

    let slider =
      createSlider(min, max, val, step);

    slider.parent(wrapper);

    slider.style("width", "100%");

    controls[name] = slider;

    slider.input(() => {
      label.html(
        `${name}: ${slider.value()}`
      );
    });

    label.html(
      `${name}: ${slider.value()}`
    );
  }

  addSlider("kAmp", 0.1, 10, 4, 0.1);
  addSlider("kFreq", 1, 100, 21, 1);

  addSlider("eDiv", 100, 5000, 1880, 10);
  addSlider("eOffset", 0, 40, 20, 0.1);

  addSlider("threshold", 0, 30, 15, 0.1);

  addSlider("orbitRadius", 0, 150, 50, 1);

  addSlider("wave1", 0, 20, 9, 0.1);
  addSlider("wave2", 0, 10, 2, 0.1);

  addSlider("sinSpeed", 0, 40, 14, 0.1);

  addSlider("dFactor", 0, 10, 3, 0.1);

  addSlider("rotationSpeed", 0, 10, 2, 0.1);

  addSlider("ghostAlpha", 0, 255, 190, 1);

  addSlider("mainAlpha", 0, 255, 128, 1);

  addSlider("pointSize", 1, 10, 3.5, 0.1);

  addSlider("ghostSize", 1, 5, 1.5, 0.1);
}

function draw() {

  background(0);

  buildData();

  let t =
    TWO_PI *
    (frameCount % frames) /
    frames;

  let blendFactor =
    pow(sin(t), 2);

  let mainR = 255;

  let mainG =
    255 * (1 - blendFactor);

  let mainB =
    255 * (1 - blendFactor);

  noStroke();

  // Animation area boundaries
  let animX = panelWidth;
  let animW = width - panelWidth;

  for (let i = 0; i < total; i++) {

    let kv = k[i];

    if (abs(kv) < 1e-9) continue;

    let q =
      3 * sin(2 * kv) +
      0.3 / kv +
      kv *
      sin(x[i] / 4465) *
      (
        controls.wave1.value() +
        controls.wave2.value() *
        sin(
          controls.sinSpeed.value() *
          e[i]
          -
          controls.dFactor.value() *
          d[i]
          +
          controls.rotationSpeed.value() *
          t
        )
      );

    let px =
      q +
      controls.orbitRadius.value() *
      cos(d[i] - t) +
      200;

    let py =
      875 -
      q *
      sin(d[i] - t) -
      39 * d[i];

    // Map ONLY into right-side area
    let sx =
      map(
        px,
        100,
        300,
        animX,
        width
      );

    let sy =
      map(
        py,
        75,
        320,
        height,
        0
      );

    if (!isFinite(sx) || !isFinite(sy))
      continue;

    if (m[i]) {

      fill(
        mainR,
        mainG,
        mainB,
        controls.mainAlpha.value()
      );

      circle(
        sx,
        sy,
        controls.pointSize.value()
      );

    } else {

      fill(
        255,
        controls.ghostAlpha.value()
      );

      circle(
        sx,
        sy,
        controls.ghostSize.value()
      );
    }
  }
}
