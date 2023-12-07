'use strict';

let characters = {
  cat: null,
  minion1: null,
  minion2: null,
  enemy1: null,
  enemy2: null,
  enemy3: null
}

const Character = function(src, id, isPC) {
  this.isPC = isPC;
  this.name = src.name;
  this.sprite = src.sprite;
  this.maxHealth = src.health;
  this.health = src.health;
  this.speed = src.speed;
  this.energy = 0;
  this.skills = [...src.skills];
  this.assignId(id);
}

// assign id: on creation and on position change (such as on capture)
Character.prototype.assignId = function(id) {
  if (this.id != null) {
    this.el.innerHTML = null;
    delete characters[this.id];
  }
  this.id = id;
  this.el = $('#' + id);
  this.buildHTML();
  characters[id] = this;
  this.updateHTML();
}
Character.prototype.animate = async function(effect, ms) {  // play a css animation on this character
  this.el.classList.remove(effect);
  await timeout(1);
  this.el.classList.add(effect);
  setTimeout(() => {this.el.classList.remove(effect)}, ms);
}
Character.prototype.damage = function(amount) {  // hurt this character
  sounds['hit.mp3'].play();
  this.animate('_damage', 500);
  this.health -= amount;
  this.updateHTML();
}
Character.prototype.heal = function(amount) {  // heal this character
  this.animate('_heal', 500);
  this.health += amount;
  if (this.health > this.maxHealth) this.health = this.maxHealth;
  this.updateHTML();
}
Character.prototype.changeEnergy = function(amount) {  // energy change
  this.animate('_energy-change', 300);
  this.energy += amount;
  if (this.energy < 0) this.energy = 0;
  if (this.energy > this.actionEnergy()) this.energy = this.actionEnergy();
  this.updateHTML();
}
Character.prototype.die = async function() {  // dead this character :O
  await timeout(500);
  dialogue(`<span class='death'>${this.name} is defeated!</span>`);
  this.el.classList.add('_die');
  await timeout(750);
  this.el.innerHTML = '';
  this.el.classList.remove('_die');
  delete characters[this.id];
}

Character.prototype.getAllies = function(includeSelf) {  // return a list of characters considered "allies" of this caracter
    let res = this.isPC ? [characters.cat, characters.minion1, characters.minion2] : [characters.enemy1, characters.enemy2, characters.enemy3];
    res = res.filter(x => x != null);
    if (!includeSelf) res = res.filter(x => x.id !== this.id);
    return res;
}
Character.prototype.getEnemies = function() {  // return a list of characters considered "enemies" of this character
  let res = this.isPC ? [characters.enemy1, characters.enemy2, characters.enemy3] : [characters.cat, characters.minion1, characters.minion2];
  res = res.filter(x => x != null);
  return res;
}

// build this character's html
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

// update this character's health, energy, and other displays
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

// defines what characters appear each wave
const waves = {
  1: {
    intro: 'it\'s a smelly hallway...',
    enemies: ['martina', 'rat'],
    backdrop: 'backdrop'
  },
  2: {
    intro: 'a group of rats attacks you!',
    enemies: ['sadrat', 'rat', 'rat'],
    backdrop: 'backdrop'
  },
  3: {
    intro: 'two hoodlums appear in front of you!',
    enemies: ['max', 'sabrina'],
    backdrop: 'backdrop2'
  },
  4: {
    intro: 'this one looks particularly nasty!',
    enemies: ['rat', 'gnarlyrat', 'rat'],
    backdrop: 'backdrop'
  },
  5: {
    intro: 'you stumble across a weird person!',
    enemies: ['sadrat', 'ashwin'],
    backdrop: 'backdrop'
  },
  6: {
    intro: 'you\'re close to the end!',
    enemies: ['peacerat', 'peacerat'],
    backdrop: 'backdrop'
  },
  7: {
    intro: 'it\'s the rat king! get him!',
    enemies: ['gnarlyrat', 'ratking', 'gnarlyrat'],
    backdrop: 'backdrop2'
  }
}

// list of characters and their data
const characterData = {
  cat: {
    name: 'cat',
    sprite: 'cat.png',
    health: 200,
    speed: 20,
    skills: ['pounce', 'hiss', 'lickself', 'capture']
  },
  rat: {
    name: 'rat',
    sprite: 'rat.png',
    health: 60,
    speed: 19,
    skills: ['bite']
  },
  gnarlyrat: {
    name: 'gnarly rat',
    sprite: 'gnarlyrat.png',
    health: 100,
    speed: 18,
    skills: ['chomp', 'ratquake']
  },
  sadrat: {
    name: 'sad rat',
    sprite: 'sadrat.png',
    health: 70,
    speed: 14,
    skills: ['bite']
  },
  peacerat: {
    name: 'peace rat',
    sprite: 'peacerat.png',
    health: 40,
    speed: 21,
    skills: ['yap', 'rally']
  },
  ratking: {
    name: 'rat king!',
    sprite: 'ratking.png',
    health: 300,
    speed: 15,
    skills: ['bigchomp', 'ratquake', 'spinattack']
  },
  martina: {
    name: 'martina',
    sprite: 'martina.png',
    health: 120,
    speed: 15,
    skills: ['punch', 'heal', 'rally']
  },
  sabrina: {
    name: 'sabrina',
    sprite: 'sabrina.png',
    health: 130,
    speed: 18,
    skills: ['punch', 'doublepunch']
  },
  max: {
    name: 'max',
    sprite: 'max.png',
    health: 130,
    speed: 16,
    skills: ['punch', 'rave', 'yap']
  },
  ashwin: {
    name: 'ashwin',
    sprite: 'ashwin.png',
    health: 190,
    speed: 14,
    skills: ['drainpunch', 'drainwave']
  }
}
