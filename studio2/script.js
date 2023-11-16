'use strict';
const $ = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);

// make sure canvas always fills screen
function resizeWindow() {
  width = innerWidth;
  height = innerHeight;
  if (width % 2 === 1) width--;
  process.width = width;
  process.height = height;
  final.width = width;
  final.height = height;
}
addEventListener('resize', resizeWindow);

const process = $('#process');
const final = $('#final');
let pCtx, fCtx, width, height, mouseX, mouseY, started;
let currentScreen;

// preload all images before starting!
const sources = ['me.png', 'fairy1.png', 'fairy2.png', 'fairy3.png'];
let resources = {};
async function loadResource(source) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = `assets/${source}`;
    resources[source] = img;
    img.onload = resolve;
    setTimeout(reject, 1000 * 5);
  });
}
Promise.all(sources.map(x => loadResource(x))).then(init);

function init() {
  if (started) return;
  started = true;

  resizeWindow();
  final.className = 'started';
  pCtx = process.getContext('2d', {willReadFrequently: true});
  fCtx = final.getContext('2d');

  setScreen(screens.load);
  final.addEventListener('click', e => {
    currentScreen.processClick();
  });
  requestAnimationFrame(step);
}

function setScreen(screen) {
  screen.init();
  currentScreen = screen;
}

function step() {
  currentScreen.step();
  buildCursor();
  build();
  requestAnimationFrame(step);
}

// add cursor effect
function trackMouse(e) {
  const rect = final.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
}
final.addEventListener('mousemove', trackMouse);

// create a gradient bubble for the cursor
function buildCursor() {
  if (mouseX == null || mouseY == null) return;
  const gradient = pCtx.createRadialGradient(mouseX, mouseY, 1, mouseX, mouseY, 50);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(1, 'transparent');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(mouseX - 100, mouseY - 100, mouseX + 100, mouseY + 100);
}


// builds final canvas (fCtx) from process canvas (pCtx) using some cool math :P
const PSCALE = 3;
function build() {
  let data = pCtx.getImageData(0, 0, width, height).data;

  fCtx.fillStyle = '#fff8f8';
  fCtx.fillRect(0, 0, width, height);

  fCtx.fillStyle = '#004';
  for (let y = 0; y < height; y += PSCALE)
    for (let x = 0; x < width; x += PSCALE) {
      const pIndex = (y * width + x) / PSCALE;
      const pY = y / PSCALE;
      const i = (y * width + x) * 4;

      let filled = false;
      const intensity = (data[i] + data[i+1] + data[i+2]) / 3;  // range: 0-255
      switch ((intensity + 16) / 64 >> 0) {

        case 3:  // sparse grid
          if (pY % 2 === 0)
            filled = pIndex % 4 === pY % 4;
          break;

        case 2:  // grid
          if (pY % 2 === 0)
            filled = pIndex % 2 === 0;
          break;

        case 1:  // checkerboard
          filled = pIndex % 2 === (pY % 2);
          break;

        case 0:  // solid
          filled = true;
      }

      if (filled)
        fCtx.fillRect(x, y, PSCALE, PSCALE);
    }
}

// show process canvas to debug
function debug() {
  process.style.display = 'block';
  final.style.opacity = 0;
}
