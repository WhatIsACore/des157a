'use strict';
const $ = e => document.querySelector(e);

const process = $('#process');
const starfield = $('#starfield');
let pCtx, fCtx;

const img = new Image();
img.src = 'namya.png';
img.onload = init;

function init() {
  const SCALE = 0.34;
  const PSCALE = 2;

  const width = img.width * SCALE >> 0;
  const height = img.height * SCALE >> 0;
  process.width = width;
  process.height = height;
  starfield.width = width;
  starfield.height = height;

  pCtx = process.getContext('2d', {willReadFrequently: true});
  fCtx = starfield.getContext('2d');

  pCtx.fillStyle = "#ffffff";
  pCtx.fillRect(0, 0, width, height);
  pCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
  let data = pCtx.getImageData(0, 0, width, height).data;

  fCtx.fillStyle = '#fff';
  fCtx.fillRect(0, 0, width, height);
  fCtx.fillStyle = '#000';
  for (let y = 0; y < height; y += PSCALE){
    for (let x = 0; x < width; x += PSCALE){
      const pos = y * width + x;
      const i = pos * 4;

      let filled = false;
      let intensity = (data[i] + data[i+1] + data[i+2]) / 3 >> 0;

      const tpos = pos / PSCALE;
      const ty = y / PSCALE;

      switch ((intensity) / 64 >> 0) {
        case 4:
          break;
        case 3:
          if (ty % 4 === 0)
            filled = tpos % 4 === 0;
          if (ty % 4 === 2)
            filled = tpos % 4 === 2;
          break;
        case 2:
          filled = tpos % 2 === 0 && ty % 2 === 0;
          break;
        case 1:
          filled = tpos % 2 === (ty % 2);
          break;
        case 0:
          filled = true;
      }

      if (filled)
        fCtx.fillRect(x, y, PSCALE, PSCALE);
    }
  }
}
