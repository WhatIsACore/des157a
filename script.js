'use strict';
let $ = e => document.querySelector(e);
let $$ = e => document.querySelectorAll(e);

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

function Field(el, width, height, left, top, empty) {
  this.el = el;
  this.width = width;
  this.height = height;
  this.left = left;
  this.top = top;
  this.canvas = new Array(height);
  for (let i = 0; i < height; i++)
    this.canvas[i] = new Array(width);

  this.particles = [];
  if (empty) return;

  const density = width * height / 600 >> 0;

  for (let i = 0; i < 6 * density; i++)
    this.randomParticle(0.3, 0, '*.');
  for (let i = 0; i < 3 * density; i++)
    this.randomParticle(0.6, 0.05, '*');
  for (let i = 0; i < 2 * density; i++)
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
  if (Math.random() < 0.4) {
    let x = (clientX - this.left) / charWidth >> 0;
    let y = (clientY - this.top) / 18 >> 0;
    let maxVelX = 5 / charWidth;
    let maxVelY = 5 / 18;
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

let f, f2, width, height, charWidth;
function resizeScreen() {
  // calculate width of one character
  charWidth = $('#charWidth').clientWidth / 10;
  width = ($('#banner').offsetWidth / charWidth >> 0) + 1;
  height = ($('#banner').offsetHeight / 18 >> 0) + 1;
  let rect = $('#banner').getBoundingClientRect();
  f = new Field($('#starfield'), width, height, rect.left, rect.top);
  f2 = new Field($('#cursorstars'), width, height, rect.left, rect.top, true);
}
addEventListener('resize', resizeScreen);
function step() {
  f.step();
  f2.step();
  requestAnimationFrame(step);
}

document.fonts.ready.then(() => {
  resizeScreen();
  addEventListener('mousemove', e => {
    f2.cursorStars(e.clientX, e.clientY);
  });
  step();
});

$$('.box .toolbar').forEach(x => {
  x.addEventListener('mousedown', dragStart);
  x.addEventListener('mouseup', dragEnd);
});
$$('.box-open').forEach(x => x.addEventListener('click', openBox));
$$('.box .exit-box').forEach(x => x.addEventListener('click', closeBox))
$$('.box').forEach(x => x.addEventListener('mousedown', focus));

let dragOrigin = [];
let activeBox;
function dragStart(e) {
  e.preventDefault();
  activeBox = e.currentTarget.parentNode;
  const rect = activeBox.getBoundingClientRect();
  dragOrigin = [e.clientX - rect.left, e.clientY - rect.top];
  document.addEventListener('mousemove', drag);
}
function dragEnd(e) {
  document.removeEventListener('mousemove', drag);
}
function drag(e) {
  e.preventDefault();
  activeBox.style.left = `${e.clientX - dragOrigin[0]}px`;
  activeBox.style.top = `${e.clientY - dragOrigin[1]}px`;
}

let i = 6;  // increment z-index to put the windows on top of each other
function openBox(e) {
  const target = $(e.currentTarget.dataset.target);
  target.style.zIndex = i++;
  if (target.className === 'box open') return;

  const rect = e.currentTarget.getBoundingClientRect();
  if (rect.top > screen.height - 500) {
    target.style.left = `${rect.left + 100}px`;
    target.style.top = `${screen.height - 400}px`;
  } else {
    target.style.left = `${rect.left + 50}px`;
    target.style.top = `${rect.top + 50}px`;
  }

  target.className = 'box open';
}
function closeBox(e) {
  const target = e.currentTarget.parentNode.parentNode;
  target.className = 'box';
}
function focus(e) {
  e.currentTarget.style.zIndex = i++;
}
