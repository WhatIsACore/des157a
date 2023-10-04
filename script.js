'use strict';
let $ = e => document.querySelector(e);

function Particle(x, y, maxX, maxY, velocityX, velocityY, charset, lifespan) {
  this.x = x;
  this.y = y;
  this.maxX = maxX;
  this.maxY = maxY;
  this.velocityX = velocityX;
  this.velocityY = velocityY;
  this.charset = charset;
  this.char = charset[Math.random() * charset.length >> 0];
  if (lifespan != null) {
    this.lifespan = lifespan;
    this.char = `<hehe>${this.char}</hehe>`;
  }
}
Particle.prototype.step = function() {
  this.x += this.velocityX;
  this.y += this.velocityY;
  if (this.lifespan != null) {
    this.lifespan--;
    if (
      this.x >= this.maxX ||
      this.y >= this.maxY ||
      this.x < 0 ||
      this.y < 0
    ) this.lifespan = -1;
  } else {
    if (this.x >= this.maxX) {
      this.x = 0;
      this.y = Math.random() * this.maxY;
      this.char = this.charset[Math.random() * this.charset.length >> 0];
    }
    if (this.y >= this.maxY) {
      this.x = Math.random() * this.maxX;
      this.y = 0;
      this.char = this.charset[Math.random() * this.charset.length >> 0];
    }
  }
}

function Field(el, width, height) {
  this.el = el;
  this.width = width;
  this.height = height;
  this.canvas = new Array(height);
  for (let i = 0; i < height; i++)
    this.canvas[i] = new Array(width);

  this.particles = [];
  for (let i = 0; i < 60; i++)
    this.randomParticle(0.3, 0, '*.');
  for (let i = 0; i < 30; i++)
    this.randomParticle(0.6, 0.05, '*');
  for (let i = 0; i < 20; i++)
    this.randomParticle(1.2, 0, '-.');
}
Field.prototype.randomParticle = function(velocityX, velocityY, charset) {
  let x = Math.random() * this.width;
  let y = Math.random() * this.height;
  this.particles.push(new Particle(x, y, this.width, this.height, velocityX, velocityY, charset));
}
Field.prototype.step = function() {
  this.particles.forEach(x => x.step());
  // clear dead stars
  for (let i = this.particles.length - 1; i > -1; i--)
    if (this.particles[i].lifespan != null && this.particles[i].lifespan < 0)
      this.particles.splice(i, 1);

  this.generate();
  this.print();

}
Field.prototype.generate = function() {
  this.canvas.map(r => r.fill(' '));
  for (let p of this.particles)
    this.canvas[p.y >> 0][p.x >> 0] = p.char;
}
Field.prototype.cursorStars = function(clientX, clientY) {  // make cool particles when i move the cursor
  if (Math.random() < 0.25) {
    let x = clientX / charWidth >> 0;
    let y = clientY / 18 >> 0;
    let maxVelX = 10 / charWidth;
    let maxVelY = 10 / 18;
    let velocityX = Math.random() * maxVelX - (maxVelX / 2);
    let velocityY = Math.random() * maxVelY - (maxVelY / 2);
    this.particles.push(new Particle(x, y, this.width, this.height, velocityX, velocityY, '*.o', 30));
  }
}
Field.prototype.print = function() {
  let res = ``;
  for (let i of this.canvas) {
    for (let j of i)
      res += j;
    res += '\n';
  }
  this.el.innerHTML = res;
}

let f, width, height, charWidth;
function resizeScreen() {
  // calculate width of one character
  charWidth = $('#charWidth').clientWidth / 10;
  width = (screen.width / charWidth >> 0) + 1;
  height = (screen.height / 18 >> 0) + 1;
  f = new Field($('#starfield'), width, height);
  addEventListener('mousemove', (e) => {
    f.cursorStars(e.clientX, e.clientY);
  });
}
addEventListener('resize', resizeScreen);

function step() {
  f.step();
  requestAnimationFrame(step);
}

document.fonts.ready.then(() => {
  resizeScreen();
  step();
});
