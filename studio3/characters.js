'use strict';

const characterMap = {};
const Character = function(src, el, isPC) {
  this.el = el;
  characterMap[el.id] = this;
  this.isPC = isPC;
  this.name = src.name;
  this.isCat = src.name === 'cat';
  this.sprite = src.sprite;
  this.maxHealth = src.health;
  this.health = src.health;
  this.speed = src.speed;
  this.energy = 0;
  this.skills = [...src.skills];
}

Character.prototype.damage = async function(amount) {
  if (this.isCat) amount /= 2;
  this.health -= amount;
  this.updateHTML();

  if (this.health <= 0) await this.die();
}
Character.prototype.heal = function(amount) {
  this.health += amount;
  if (this.health > this.maxHealth) this.health = this.maxHealth;
  this.updateHTML();
}
Character.prototype.die = async function() {
  await timeout(500);
  dialogue(`<span>${this.name} is defeated!</span>`);
  this.el.classList.add('_die');
  await timeout(750);
  this.el.innerHTML = '';
  delete characterMap[this.el.id];
}

Character.prototype.buildHTML = function() {
  this.el.innerHTML = `
    <div class="picture">
      <img src="images/${this.sprite}">
    </div>
    <div class='target-selector'></div>
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
  this.el.querySelector('.target-selector').addEventListener('click', e => resolveTarget(e.currentTarget.parentNode.id));
}

Character.prototype.updateHTML = function() {
  let healthiness = this.health / this.maxHealth * 100;
  if (healthiness < 0) healthiness = 0;
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
    skills: ['punch']
  },
  ashwin: {
    name: 'ashwin',
    sprite: 'ashwin.png',
    health: 120,
    speed: 18,
    skills: ['punch']
  },
  sabrina: {
    name: 'sabrina',
    sprite: 'sabrina.png',
    health: 120,
    speed: 19,
    skills: ['punch']
  },
  max: {
    name: 'max',
    sprite: 'max.png',
    health: 120,
    speed: 16,
    skills: ['punch']
  }
}
