'use strict';

const screens = {};

screens.load = {
  init: () => {
    this.progress = 0;
  },
  step: () => {
    pCtx.fillStyle = '#fff';
    pCtx.fillRect(0, 0, width, height);

    const loadBarWidth = width - 240;
    const loadWidth = (this.progress / 120) * loadBarWidth;
    const translateX = Math.random() * 3 >> 0;
    const translateY = Math.random() * 3 >> 0;

    // load bar outer frame
    pCtx.save();
    pCtx.translate(120 + translateX, 240 + translateY);

    pCtx.lineJoin = 'round';
    pCtx.lineWidth = 9;
    pCtx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    pCtx.strokeRect(-20, 0, loadBarWidth + 40, 84);

    pCtx.restore();

    // load bar inner segment
    pCtx.save();
    pCtx.translate(120 + translateX, 252 + translateY);

    pCtx.lineJoin = 'round';
    pCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    pCtx.fillRect(0, 0, loadWidth, 60);

    pCtx.restore();

    // text
    pCtx.save();
    pCtx.font = '96px Bungee';
    pCtx.fillStyle = '#888';
    pCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    pCtx.shadowBlur = 0;
    pCtx.shadowOffsetX = -6;
    pCtx.shadowOffsetY = -6;
    pCtx.fillText('LOADING...', 100 + translateX, 220 + translateY);
    pCtx.restore();

    this.progress++;
    if (this.progress >= 120) setScreen(screens.home);
  }
}

screens.home = {
  init: () => {

  },
  step: () => {
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    pCtx.fillRect(0, 0, width, height);
  }
}
