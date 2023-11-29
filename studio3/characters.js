'use strict';

const Character = function(src, el, isPC) {
  this.el = el;
  this.isPC = isPC;
  this.name = src.name;
  this.sprite = src.sprite;
  this.maxHealth = src.health;
  this.health = src.health;
  this.speed = src.speed;
  this.energy = 0;
  this.skills = [...src.skills];
}

Character.prototype.buildHTML = function() {
  this.el.innerHTML = `
    <div class="picture">
      <img src="images/${this.sprite}">
    </div>
    <div class="info">
      <div class="left">
        <div class="name">${this.name}</div>
      </div>
      <div class="right">
        <div class="healthbar">
          <div class="remaining-health"></div>
        </div>
        <div class="actionbar"></div>
      </div>
    </div>
  `;
}

Character.prototype.updateHTML = function() {
  const healthiness = this.health / this.maxHealth * 100;
  this.el.querySelector('.remaining-health').style.width = `${healthiness}%`;
  let actionProgress = this.energy / this.actionEnergy() * 100;
  if (actionProgress > 100) actionProgress = 100;
  this.el.querySelector('.actionbar').style.width = `${actionProgress}%`;
}

Character.prototype.actionEnergy = function() {
  return 1000 / this.speed;
}

const characters = {
  cat: {
    name: 'cat',
    sprite: 'cat.png',
    health: 100,
    speed: 20,
    skills: ['pounce', 'hiss', 'lickself']
  },
  martina: {
    name: 'martina',
    sprite: 'martina.png',
    health: 100,
    speed: 15,
    skills: []
  },
  ashwin: {
    name: 'ashwin',
    sprite: 'ashwin.png',
    health: 150,
    speed: 18,
    skills: []
  },
  sabrina: {
    name: 'sabrina',
    sprite: 'sabrina.png',
    health: 150,
    speed: 19,
    skills: []
  },
  max: {
    name: 'max',
    sprite: 'max.png',
    health: 150,
    speed: 16,
    skills: []
  }
}
