'use strict';
let $ = e => document.querySelector(e);

function Particle(maxX, maxY, velocityX, velocityY, charset) {
  this.maxX = maxX;
  this.maxY = maxY;
  this.x = Math.random() * maxX;
  this.y = Math.random() * maxY;
  this.velocityX = velocityX;
  this.velocityY = velocityY;
  this.charset = charset;
  this.char = charset[Math.random() * charset.length >> 0];
}
Particle.prototype.step = function() {
  this.x += this.velocityX;
  this.y += this.velocityY;
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

function Field(el, width, height) {
  this.el = el;
  this.width = width;
  this.height = height;
  this.canvas = new Array(height);
  for (let i = 0; i < height; i++)
    this.canvas[i] = new Array(width);

  this.particles = [];
  for (let i = 0; i < 60; i++)
    this.particles.push(new Particle(width, height, 0.3, 0, '*.'));
  for (let i = 0; i < 30; i++)
    this.particles.push(new Particle(width, height, 0.6, 0.05, '*'));
  for (let i = 0; i < 20; i++)
    this.particles.push(new Particle(width, height, 1.2, 0, '-.'));
}
Field.prototype.step = function() {
  this.particles.forEach(x => x.step());
  this.generate();
  this.print();
}
Field.prototype.generate = function() {
  this.canvas.map(r => r.fill(' '));
  for (let p of this.particles)
    this.canvas[p.y >> 0][p.x >> 0] = p.char;
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

let width = 300;
let height = 50;
let f = new Field($('#starfield'), 200, 40);
function step() {
  f.step();
  requestAnimationFrame(step);
}
step();
