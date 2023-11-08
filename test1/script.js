'use strict';
const $ = e => document.querySelector(e);

const PSCALE = 4;

const process = $('#process');
const starfield = $('#starfield');
let pCtx, fCtx, width, height;

function resizeScreen() {
  width = innerWidth;
  height = innerHeight;
  process.width = width;
  process.height = height;
  starfield.width = width;
  starfield.height = height;
}
addEventListener('resize', resizeScreen);

const source = document.createElement('video');
source.src = 'tekkons.mp4';
source.loop = true;
starfield.addEventListener('click', init);

function init() {
  source.play();
  resizeScreen();
  pCtx = process.getContext('2d', {willReadFrequently: true});
  fCtx = starfield.getContext('2d');

  requestAnimationFrame(step);
}

function step() {
  pCtx.drawImage(source, 0, 0, width, height);
  build();
  requestAnimationFrame(step);
}

// builds starfield canvas (fCtx) from process canvas (pCtx)
function build() {
  let data = pCtx.getImageData(0, 0, width, height).data;

  fCtx.fillStyle = '#fff';
  fCtx.fillRect(0, 0, width, height);

  fCtx.fillStyle = '#000';
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
