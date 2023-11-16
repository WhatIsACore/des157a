'use strict';

// in order to keep the code organized I set up each screen and its behaviors as an object.
const screens = {};

// returns true if the mouse is within a cicular area
function mouseNear(x, y, range) {
  const dx = mouseX - x;
  const dy = mouseY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);  // pythagoran theorem :P
  return dist < range;
}
// returns true if the mouse is within a box
function mouseInBox(x, y, width, height) {
  return mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;
}


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

    // self portrait
    pCtx.drawImage(resources['me.png'], width / 2 + 50, height / 2 - 280, 355, 560);

    // load bar outer frame
    pCtx.save();
    pCtx.translate(120 + translateX, 240 + translateY);

    pCtx.lineJoin = 'round';
    pCtx.lineWidth = 9;
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.5';
    pCtx.fillRect(-20, 0, loadBarWidth + 40, 84);
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
    pCtx.font = '96px Times New Roman';
    pCtx.fillStyle = '#888';
    pCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    pCtx.shadowBlur = 0;
    pCtx.shadowOffsetX = -6;
    pCtx.shadowOffsetY = -6;
    pCtx.fillText('loading...', 100 + translateX, 220 + translateY);
    pCtx.restore();

    // background flashes
    if (this.progress < 25) {
      pCtx.fillStyle = `rgba(0, 0, 0, ${(25 - this.progress) / 50})`;
      pCtx.fillRect(0, 0, width, height);
    }
    if (this.progress > 50 && this.progress < 60) {
      pCtx.fillStyle = `rgba(255, 255, 0, ${(60 - this.progress) / 10})`;
      pCtx.fillRect(0, 0, width, height);
    }
    if (this.progress > 70 && this.progress < 80) {
      pCtx.fillStyle = `rgba(255, 0, 255, ${(80 - this.progress) / 10})`;
      pCtx.fillRect(0, 0, width, height);
    }

    this.progress++;
    if (this.progress >= 120) setScreen(screens.home);
  },
  processClick: () => {},
}

screens.home = {
  init: () => {
    this.timer = 0;
  },
  step: () => {
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    pCtx.fillRect(0, 0, width, height);

    // // gradient
    // const gradient = pCtx.createRadialGradient(width / 2, height / 2, 1, width / 2, height / 2, width / 2);
    // gradient.addColorStop(0, 'transparent');
    // gradient.addColorStop(1, `rgba(60, 60, 60, 0.01)`);
    // pCtx.fillStyle = gradient;
    // pCtx.fillRect(0, 0, width, height);

    // text
    pCtx.save();
    pCtx.font = '63px Times New Roman';
    pCtx.fillStyle = '#222';
    pCtx.fillText('hi <3 click to learn more!', 141, 219);
    pCtx.restore();

    // characters
    const dy = Math.sin(this.timer / 40);
    const d2y = Math.cos(this.timer / 40);
    pCtx.drawImage(resources['fairy1.png'], width / 2 - 560, height / 2 - 150 + dy * 20, 387 * 0.8, 406 * 0.8);
    pCtx.drawImage(resources['fairy2.png'], width / 2 - 144, height / 2 - 180 + d2y * 20, 368 * 0.8, 434 * 0.8);
    pCtx.drawImage(resources['fairy3.png'], width / 2 + 240, height / 2 - 150 + dy * -20, 325 * 0.8, 417 * 0.8);

    this.timer++;
  },
  processClick: () => {
    if(mouseNear(width / 2 - 407, height / 2 + 63, 150)) setScreen(screens.fairy1);
    if(mouseNear(width / 2, height / 2 + 47, 150)) setScreen(screens.fairy2);
    if(mouseNear(width / 2 + 363, height / 2 + 49, 150)) setScreen(screens.fairy3);
  }
}

screens.fairy1 = {
  init: () => {
    this.timer = 0;
  },
  step: () => {
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    pCtx.fillRect(0, 0, width, height);

    // character
    const dy = Math.sin(this.timer / 40) - 0.5;
    pCtx.drawImage(resources['fairy1.png'], width / 2 - 494, height / 2 - 203 + dy * 20, 387, 406);

    // description
    let text = 'this fairy comes from a distant\nstar and invades your dreams\nlooking for images of the\nnight sky.\n\nin return, it leaves behind\ngifts of stardust that bring\ngood luck :3'.split('\n');
    pCtx.save();
    pCtx.font = '46px Times New Roman';
    pCtx.fillStyle = '#222';
    for (let i in text)
      pCtx.fillText(text[i], width / 2 - 80, height / 2 - 200 + (i * 50));
    pCtx.restore();

    this.timer++;
  },
  processClick: () => {
    setScreen(screens.home)
  }
}

screens.fairy2 = {
  init: () => {
    this.timer = 0;
  },
  step: () => {
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    pCtx.fillRect(0, 0, width, height);

    // character
    const dy = Math.sin(this.timer / 40) - 0.5;
    pCtx.drawImage(resources['fairy2.png'], width / 2 - 484, height / 2 - 217 + dy * 20, 368, 434);

    // description
    let text = 'this fairy spent too much time\non tiktok and forgot to take\nmore souls.\n\nit has decided to become an\ninfluencer instead; but it doesn\'t\nknow how the algorithm works!'.split('\n');
    pCtx.save();
    pCtx.font = '46px Times New Roman';
    pCtx.fillStyle = '#222';
    for (let i in text)
      pCtx.fillText(text[i], width / 2 - 80, height / 2 - 200 + (i * 50));
    pCtx.restore();

    this.timer++;
  },
  processClick: () => {
    setScreen(screens.home)
  }
}

screens.fairy3 = {
  init: () => {
    this.timer = 0;
  },
  step: () => {
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    pCtx.fillRect(0, 0, width, height);

    // character
    const dy = Math.sin(this.timer / 40) - 0.5;
    pCtx.drawImage(resources['fairy3.png'], width / 2 - 462, height / 2 - 208 + dy * 20, 325, 417);

    // description
    let text = 'this fairy watches over\nnightmares, keeping you safe.\nsome say it\'s an angel, demon,\nor both.\n\nit may paralyze you when\nyou wake up; don\'t be scared!'.split('\n');
    pCtx.save();
    pCtx.font = '46px Times New Roman';
    pCtx.fillStyle = '#222';
    for (let i in text)
      pCtx.fillText(text[i], width / 2 - 80, height / 2 - 200 + (i * 50));
    pCtx.restore();

    this.timer++;
  },
  processClick: () => {
    setScreen(screens.home)
  }
}
