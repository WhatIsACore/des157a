'use strict';
const $ = e => document.querySelector(e);

const PSCALE = 3;

const process = $('#process');
const starfield = $('#starfield');
let pCtx, fCtx, width, height, mouseX, mouseY;

const source = document.createElement('video');
source.src = 'tekkons.mp4';
source.loop = true;

function resizeScreen() {
  width = innerWidth;
  height = innerHeight;
  process.width = width;
  process.height = height;
  starfield.width = width;
  starfield.height = height;
}
addEventListener('resize', resizeScreen);

function trackMouse(e) {
  const rect = starfield.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
}
starfield.addEventListener('mousemove', trackMouse);
starfield.addEventListener('click', init);

function init() {
  source.play();
  resizeScreen();
  starfield.className = 'started';
  pCtx = process.getContext('2d', {willReadFrequently: true});
  fCtx = starfield.getContext('2d');

  requestAnimationFrame(step);
}

function step() {
  buildProcess();
  build();
  requestAnimationFrame(step);
}

function buildProcess() {

  pCtx.fillStyle = '#fff';
  pCtx.fillRect(0, 0, width, height);

  pCtx.drawImage(source, 0, 0, width, height);

  const gradient = pCtx.createRadialGradient(mouseX, mouseY, 1, mouseX, mouseY, 60);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(1, 'transparent');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(mouseX - 100, mouseY - 100, mouseX + 100, mouseY + 100);
}

// builds starfield canvas (fCtx) from process canvas (pCtx)
function build() {
  let data = pCtx.getImageData(0, 0, width, height).data;

  fCtx.fillStyle = '#ff0';
  fCtx.fillRect(0, 0, width, height);

  fCtx.fillStyle = '#f00';
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
