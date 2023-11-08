'use strict';
const $ = e => document.querySelector(e);

const process = $('#process');
const starfield = $('#starfield');
let pCtx, fCtx;

const img = new Image();
img.src = 'tahoe.png';
img.onload = init;

function init() {
  const SCALE = 0.2;
  const PSCALE = 1;

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

      if (translateIntensity(intensity, tpos, ty))
          fCtx.fillRect(x, y, PSCALE, PSCALE);

      /**const r = !translateIntensity(data[i], tpos, ty) ? 255 : 0;
      const g = !translateIntensity(data[i+1], tpos, ty) ? 255 : 0;
      const b = !translateIntensity(data[i+2], tpos, ty) ? 255 : 0;
      if (r + g + b === 0) continue;
      fCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      fCtx.fillRect(x, y, PSCALE, PSCALE);**/

      /**switch ((intensity + 16) / 64 >> 0) {
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
      **/
    }
  }
}

function translateIntensity(intensity, tpos, ty) {
  switch ((intensity + 16) / 64 >> 0) {
    case 4:
      return false;
    case 3:
      if (ty % 4 === 0)
        return tpos % 4 === 0;
      if (ty % 4 === 2)
        return tpos % 4 === 2;
      return false;
    case 2:
      return tpos % 2 === 0 && ty % 2 === 0;
    case 1:
      return tpos % 2 === (ty % 2);
    case 0:
      return true;
  }
}
